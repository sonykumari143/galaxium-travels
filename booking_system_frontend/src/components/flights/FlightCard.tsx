import type { Flight, SeatClass } from '../../types';
import { Card, Button } from '../common';
import { Plane, Clock, Users, Crown, Rocket } from 'lucide-react';
import { formatCurrency, formatDate, formatTime, calculateDuration } from '../../utils/formatters';
import { motion } from 'framer-motion';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

export const FlightCard = ({ flight, onBook }: FlightCardProps) => {
  const totalSeats = flight.economy_seats_available + flight.business_seats_available + flight.galaxium_seats_available;
  const isSoldOut = totalSeats === 0;

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
      borderColor: 'border-economy-blue/30',
      glowClass: 'economy-glow-hover',
      badge: null,
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
      borderColor: 'border-business-purple/30',
      glowClass: 'business-glow-hover',
      badge: null,
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
      borderColor: 'border-galaxium-green/30',
      glowClass: 'galaxium-glow-hover',
      badge: 'PREMIUM',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        {/* Route Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cosmic-gradient">
              <Plane className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-star-white">
                {flight.origin} → {flight.destination}
              </h3>
              <p className="text-sm text-star-white/60">
                Flight #{flight.flight_id}
              </p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="space-y-4 mb-6 flex-1">
          {/* Departure & Arrival */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-star-white/60 mb-1">Departure</p>
              <p className="text-sm font-medium text-star-white">
                {formatDate(flight.departure_time, 'MMM dd, yyyy')}
              </p>
              <p className="text-lg font-bold text-cosmic-purple">
                {formatTime(flight.departure_time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-star-white/60 mb-1">Arrival</p>
              <p className="text-sm font-medium text-star-white">
                {formatDate(flight.arrival_time, 'MMM dd, yyyy')}
              </p>
              <p className="text-lg font-bold text-cosmic-purple">
                {formatTime(flight.arrival_time)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-star-white/70">
            <Clock size={16} />
            <span className="text-sm">
              Duration: {calculateDuration(flight.departure_time, flight.arrival_time)}
            </span>
          </div>

          {/* Seat Classes */}
          <div className="space-y-2">
            <p className="text-xs text-star-white/60 mb-2">Available Seat Classes</p>
            {seatClasses.map((seatClass, index) => {
              const Icon = seatClass.icon;
              const isClassSoldOut = seatClass.seats === 0;
              const isLowSeats = seatClass.seats <= 2 && seatClass.seats > 0;
              
              // Icon-specific animations
              const getIconAnimation = () => {
                if (seatClass.class === 'economy') {
                  return {
                    whileHover: {
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }
                  };
                } else if (seatClass.class === 'business') {
                  return {
                    whileHover: {
                      y: [-2, -6, -2],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity
                      }
                    }
                  };
                } else if (seatClass.class === 'galaxium') {
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
                <motion.div
                  key={seatClass.class}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={!isClassSoldOut ? {
                    y: -2,
                    scale: 1.01,
                    transition: { duration: 0.2 }
                  } : {}}
                  className={`relative p-3 rounded-lg border ${seatClass.borderColor} ${seatClass.bgColor} ${
                    isClassSoldOut ? 'opacity-50 grayscale' : seatClass.glowClass
                  } transition-all duration-300`}
                >
                  {/* Badge for premium class */}
                  {seatClass.badge && !isClassSoldOut && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-galaxium-gradient text-[10px] font-bold text-white shadow-lg">
                      {seatClass.badge}
                    </div>
                  )}
                  
                  {/* Sold Out Overlay */}
                  {isClassSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-space-dark/80 rounded-lg">
                      <span className="text-sm font-bold text-red-400">SOLD OUT</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div {...getIconAnimation()}>
                        <Icon size={18} className={seatClass.color} />
                      </motion.div>
                      <span className="font-medium text-star-white">{seatClass.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${seatClass.color}`}>
                        {formatCurrency(seatClass.price)}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Users size={12} className={isLowSeats ? 'text-solar-orange' : 'text-star-white/60'} />
                        <span className={isLowSeats ? 'text-solar-orange font-semibold animate-bounce-subtle' : 'text-star-white/60'}>
                          {isClassSoldOut ? 'Sold Out' : `${seatClass.seats} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={() => onBook(flight)}
          disabled={isSoldOut}
          className="w-full"
        >
          {isSoldOut ? 'All Classes Sold Out' : 'Select Seat Class'}
        </Button>
      </Card>
    </motion.div>
  );
};

// Made with Bob
