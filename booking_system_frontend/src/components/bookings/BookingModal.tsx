import { useState, useEffect } from 'react';
import type { Flight, SeatClass, Quote, Hold } from '../../types';
import { Modal, Button } from '../common';
import {
  Plane,
  DollarSign,
  Crown,
  Rocket,
  Check,
  ArrowLeft,
  Tag,
  Timer,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, calculateDuration } from '../../utils/formatters';
import { createQuote, createHold, confirmHold, releaseHold } from '../../services/api';
import { storeHold, removeHold } from '../../utils/holdStorage';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';
import { SeatClassComparison } from './SeatClassComparison';

type Step = 'select' | 'quote' | 'hold';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  onSuccess: () => void;
}

export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
  const { user } = useUser();
  const [step, setStep] = useState<Step>('select');
  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedClass('economy');
      setQuote(null);
      setHold(null);
      setTimeLeft(0);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!hold || step !== 'hold') return;

    const update = () => {
      const remaining = new Date(hold.reservedUntil).getTime() - Date.now();
      setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [hold, step]);

  if (!flight) return null;

  const seatClasses = [
    {
      name: 'Economy',
      class: 'economy' as SeatClass,
      price: flight.economy_price,
      seats: flight.economy_seats_available,
      icon: Plane,
      color: 'text-economy-blue',
      bgColor: 'bg-economy-blue/10',
      bgGradient: 'bg-economy-gradient',
      borderColor: 'border-economy-blue',
      glowClass: 'economy-glow',
      features: [
        'Standard seating with adjustable headrest',
        'In-flight entertainment system',
        'Complimentary snacks and beverages',
        'Personal reading light',
        'USB charging port'
      ],
    },
    {
      name: 'Business',
      class: 'business' as SeatClass,
      price: flight.business_price,
      seats: flight.business_seats_available,
      icon: Crown,
      color: 'text-business-purple',
      bgColor: 'bg-business-purple/10',
      bgGradient: 'bg-business-gradient',
      borderColor: 'border-business-purple',
      glowClass: 'business-glow',
      features: [
        'Premium reclining seats with extra legroom',
        'Priority boarding and baggage handling',
        'Gourmet meal service with wine selection',
        'Noise-canceling headphones',
        'Premium entertainment system',
        'Dedicated overhead storage',
        'Power outlets and USB-C ports'
      ],
    },
    {
      name: 'Galaxium Class',
      class: 'galaxium' as SeatClass,
      price: flight.galaxium_price,
      seats: flight.galaxium_seats_available,
      icon: Rocket,
      color: 'text-galaxium-green',
      bgColor: 'bg-galaxium-green/10',
      bgGradient: 'bg-galaxium-gradient',
      borderColor: 'border-galaxium-green',
      glowClass: 'galaxium-glow',
      features: [
        'Luxury private pods with lie-flat beds',
        'VIP lounge access with spa services',
        'Personal concierge service',
        'Chef-prepared multi-course dining',
        'Premium champagne and spirits',
        'Zero-gravity experience chamber access',
        'Virtual reality entertainment suite',
        'Priority everything (boarding, baggage, customs)',
        'Complimentary ground transportation'
      ],
    },
  ];

  const selectedClassData = seatClasses.find((sc) => sc.class === selectedClass);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = hold !== null && timeLeft === 0;

  const flightSummary = (
    <div className="glass-card p-4 bg-white/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-cosmic-gradient">
          <Plane className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-star-white">
            {flight.origin} → {flight.destination}
          </h3>
          <p className="text-xs text-star-white/60">Flight #{flight.flight_id}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-star-white/60 mb-1">Departure</p>
          <p className="text-star-white font-medium">
            {formatDate(flight.departure_time, 'MMM dd')}
          </p>
        </div>
        <div>
          <p className="text-xs text-star-white/60 mb-1">Arrival</p>
          <p className="text-star-white font-medium">
            {formatDate(flight.arrival_time, 'MMM dd')}
          </p>
        </div>
        <div>
          <p className="text-xs text-star-white/60 mb-1">Duration</p>
          <p className="text-star-white font-medium">
            {calculateDuration(flight.departure_time, flight.arrival_time)}
          </p>
        </div>
      </div>
    </div>
  );

  const handleGetQuote = async () => {
    if (!user) {
      toast.error('Please sign in to get a quote');
      return;
    }

    setIsLoading(true);
    try {
      const newQuote = await createQuote({
        flightId: flight.flight_id,
        seatClass: selectedClass,
        quantity: 1,
        travelerId: user.user_id,
        travelerName: user.name,
      });
      setQuote(newQuote);
      setStep('quote');
    } catch {
      toast.error('Failed to get quote. Make sure the inventory service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceHold = async () => {
    if (!quote) return;

    setIsLoading(true);
    try {
      const newHold = await createHold(quote.quoteId);
      setHold(newHold);
      setStep('hold');

      if (user) {
        storeHold(user.user_id, {
          holdId: newHold.holdId,
          quoteId: quote.quoteId,
          flightId: flight.flight_id,
          seatClass: selectedClass,
          pricePerSeat: quote.pricePerSeat,
          totalPrice: quote.totalPrice,
          reservedUntil: newHold.reservedUntil,
        });
      }

      toast.success('Seat held! You have 15 minutes to confirm.');
    } catch {
      toast.error('Failed to place hold');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmHold = async () => {
    if (!hold || !user) return;

    setIsLoading(true);
    try {
      const confirmed = await confirmHold(hold.holdId);
      removeHold(user.user_id, hold.holdId);
      toast.success(
        `Booking confirmed! Reference: #${confirmed.externalBookingReference}`
      );
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to confirm booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleaseHold = async () => {
    if (!hold || !user) return;

    setIsLoading(true);
    try {
      await releaseHold(hold.holdId);
      removeHold(user.user_id, hold.holdId);
      toast.success('Hold released');
      onClose();
    } catch {
      toast.error('Failed to release hold');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (step) {
      case 'select':
        return 'Book Your Flight';
      case 'quote':
        return 'Your Price Quote';
      case 'hold':
        return 'Seat Reserved';
    }
  };

  // Step 1: Seat class selection
  const renderSelectStep = () => {
    // Icon-specific animations
    const getIconAnimation = (seatClass: SeatClass) => {
      if (seatClass === 'economy') {
        return {
          whileHover: {
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }
        };
      } else if (seatClass === 'business') {
        return {
          whileHover: {
            y: [-2, -6, -2],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        };
      } else if (seatClass === 'galaxium') {
        return {
          whileHover: {
            y: [0, -10],
            scale: [1, 1.1],
            transition: { duration: 0.3 }
          }
        };
      }
      return {};
    };

    return (
      <AnimatePresence mode="wait">
        {showComparison ? (
          <SeatClassComparison
            flight={flight}
            onSelect={(seatClass) => {
              setSelectedClass(seatClass);
              setShowComparison(false);
            }}
            onClose={() => setShowComparison(false)}
          />
        ) : (
          <div className="space-y-6">
            {flightSummary}

            <div>
          <h4 className="text-sm font-semibold text-star-white mb-3">Select Seat Class</h4>
          <div className="space-y-3">
            {seatClasses.map((sc, index) => {
              const Icon = sc.icon;
              const isSelected = selectedClass === sc.class;
              const isSoldOut = sc.seats === 0;
              const isLowSeats = sc.seats <= 2 && sc.seats > 0;

              return (
                <motion.button
                  key={sc.class}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={!isSoldOut ? { scale: 1.01 } : {}}
                  whileTap={!isSoldOut ? { scale: 0.99 } : {}}
                  onClick={() => !isSoldOut && setSelectedClass(sc.class)}
                  disabled={isSoldOut}
                  className={`relative w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? `${sc.borderColor} ${sc.bgColor} ${sc.glowClass}`
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  } ${isSoldOut ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                >
                  {/* Premium badge for Galaxium */}
                  {sc.class === 'galaxium' && !isSoldOut && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-galaxium-gradient text-[10px] font-bold text-white shadow-lg animate-glow-pulse">
                      PREMIUM
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div {...getIconAnimation(sc.class)}>
                        <Icon size={20} className={sc.color} />
                      </motion.div>
                      <span className="font-semibold text-star-white">{sc.name}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15
                            }}
                          >
                            <Check size={18} className={sc.color} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${sc.color}`}>
                        {formatCurrency(sc.price)}
                      </div>
                      <div className={`text-xs ${isLowSeats ? 'text-solar-orange font-semibold' : 'text-star-white/60'}`}>
                        {isSoldOut ? 'Sold Out' : `${sc.seats} left`}
                      </div>
                    </div>
                  </div>
                  
                  <ul className="text-xs text-star-white/70 space-y-1">
                    {sc.features.slice(0, 3).map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                    {sc.features.length > 3 && (
                      <li className="text-star-white/50 italic">+ {sc.features.length - 3} more features</li>
                    )}
                  </ul>
                </motion.button>
              );
            })}
          </div>
          
          {/* Compare Classes Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowComparison(true)}
            className="w-full py-2 px-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-star-white text-sm font-medium transition-all duration-200"
          >
            Compare All Classes →
          </motion.button>
        </div>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 bg-white/5"
          >
            <h4 className="text-sm font-semibold text-star-white mb-2">Passenger</h4>
            <p className="text-star-white">{user.name}</p>
            <p className="text-star-white/60 text-sm">{user.email}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleGetQuote} isLoading={isLoading} className="flex-1">
            Get Quote →
          </Button>
        </motion.div>
            </div>
          )}
        </AnimatePresence>
      );
    };

  // Step 2: Quote review
  const renderQuoteStep = () => {
    const Icon = selectedClassData?.icon || Plane;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/30">
          <Tag size={16} className="text-cosmic-purple" />
          <span className="text-xs text-star-white/60">Quote ID</span>
          <span className="font-mono font-bold text-cosmic-purple ml-auto">{quote?.quoteId}</span>
        </div>

        {flightSummary}

        <div className="glass-card p-4 bg-white/5 space-y-3">
          <h4 className="text-sm font-semibold text-star-white">Price Breakdown</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={16} className={selectedClassData?.color} />
              <span className="text-sm text-star-white/70">{selectedClassData?.name} × 1</span>
            </div>
            <span className="text-star-white font-medium">
              {formatCurrency(quote?.pricePerSeat || 0)}
            </span>
          </div>
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="font-semibold text-star-white">Total</span>
            <span className="text-xl font-bold text-alien-green">
              {formatCurrency(quote?.totalPrice || 0)}
            </span>
          </div>
          <p className="text-xs text-star-white/50">
            Quote valid for 24 hours · Price calculated by inventory service
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep('select')}
            disabled={isLoading}
            className="flex-1"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <Button onClick={handlePlaceHold} isLoading={isLoading} className="flex-1">
            <Timer size={16} /> Place Hold →
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: Hold active with countdown
  const renderHoldStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-alien-green/10 border border-alien-green/30">
        <Zap size={16} className="text-alien-green" />
        <span className="text-xs text-star-white/60">Hold ID</span>
        <span className="font-mono font-bold text-alien-green ml-auto">{hold?.holdId}</span>
      </div>

      {/* Countdown timer */}
      <div
        className={`p-6 text-center rounded-xl border-2 ${
          isExpired
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-solar-orange/50 bg-solar-orange/5'
        }`}
      >
        <p className="text-xs text-star-white/60 mb-2 uppercase tracking-widest">
          {isExpired ? 'Hold Expired' : 'Time to Confirm'}
        </p>
        <div
          className={`text-5xl font-mono font-bold tabular-nums ${
            isExpired ? 'text-red-500' : 'text-solar-orange'
          }`}
        >
          {isExpired ? 'EXPIRED' : timerDisplay}
        </div>
        {!isExpired && (
          <p className="text-xs text-star-white/50 mt-2">
            Seat is reserved — confirm before time runs out
          </p>
        )}
      </div>

      {flightSummary}

      <div className="flex items-center justify-between p-4 rounded-xl bg-cosmic-gradient">
        <div className="flex items-center gap-2">
          <DollarSign className="text-white" size={20} />
          <span className="text-white font-semibold">Total</span>
        </div>
        <span className="text-xl font-bold text-white">
          {formatCurrency(quote?.totalPrice || 0)}
        </span>
      </div>

      {isExpired ? (
        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      ) : (
        <>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleReleaseHold}
              isLoading={isLoading}
              className="flex-1"
            >
              Release Hold
            </Button>
            <Button onClick={handleConfirmHold} isLoading={isLoading} className="flex-1">
              Confirm Booking
            </Button>
          </div>
          <p className="text-xs text-star-white/50 text-center">
            Closing keeps your hold active — find it in My Bookings
          </p>
        </>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
      {step === 'select' && renderSelectStep()}
      {step === 'quote' && renderQuoteStep()}
      {step === 'hold' && renderHoldStep()}
    </Modal>
  );
};

// Made with Bob
