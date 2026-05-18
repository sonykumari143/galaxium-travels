import { motion } from 'framer-motion';
import { Plane, Crown, Rocket, Check, X } from 'lucide-react';
import type { Flight, SeatClass } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common';

interface ComparisonFeature {
  name: string;
  economy: string | boolean;
  business: string | boolean;
  galaxium: string | boolean;
  highlight?: boolean;
}

interface SeatClassComparisonProps {
  flight: Flight;
  onSelect: (seatClass: SeatClass) => void;
  onClose: () => void;
}

export const SeatClassComparison = ({ flight, onSelect, onClose }: SeatClassComparisonProps) => {
  const features: ComparisonFeature[] = [
    { name: 'Price', economy: formatCurrency(flight.economy_price), business: formatCurrency(flight.business_price), galaxium: formatCurrency(flight.galaxium_price), highlight: true },
    { name: 'Seating', economy: 'Standard', business: 'Premium Reclining', galaxium: 'Luxury Pod', highlight: true },
    { name: 'Legroom', economy: '32"', business: '42"', galaxium: '72" Lie-flat', highlight: true },
    { name: 'In-flight Entertainment', economy: true, business: true, galaxium: true },
    { name: 'Meals', economy: 'Snacks', business: 'Gourmet', galaxium: 'Chef-prepared' },
    { name: 'Priority Boarding', economy: false, business: true, galaxium: true },
    { name: 'Extra Baggage', economy: false, business: true, galaxium: true },
    { name: 'Lounge Access', economy: false, business: false, galaxium: 'VIP Spa' },
    { name: 'Personal Concierge', economy: false, business: false, galaxium: true },
    { name: 'Zero-G Experience', economy: false, business: false, galaxium: true },
    { name: 'Ground Transportation', economy: false, business: false, galaxium: true },
  ];

  const classes = [
    {
      name: 'Economy',
      class: 'economy' as SeatClass,
      icon: Plane,
      color: 'text-economy-blue',
      bgGradient: 'bg-economy-gradient',
      borderColor: 'border-economy-blue',
      seats: flight.economy_seats_available,
    },
    {
      name: 'Business',
      class: 'business' as SeatClass,
      icon: Crown,
      color: 'text-business-purple',
      bgGradient: 'bg-business-gradient',
      borderColor: 'border-business-purple',
      seats: flight.business_seats_available,
    },
    {
      name: 'Galaxium',
      class: 'galaxium' as SeatClass,
      icon: Rocket,
      color: 'text-galaxium-green',
      bgGradient: 'bg-galaxium-gradient',
      borderColor: 'border-galaxium-green',
      seats: flight.galaxium_seats_available,
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} className="text-alien-green mx-auto" />
      ) : (
        <X size={18} className="text-red-400 mx-auto opacity-30" />
      );
    }
    return <span className="text-star-white text-sm">{value}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-star-white">Compare Seat Classes</h3>
        <button
          onClick={onClose}
          className="text-star-white/60 hover:text-star-white transition-colors"
        >
          Back to Selection
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-star-white/60 text-sm font-semibold">Feature</th>
              {classes.map((cls) => {
                const Icon = cls.icon;
                return (
                  <th key={cls.class} className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Icon size={20} className={cls.color} />
                      <span className={`text-sm font-semibold ${cls.color}`}>{cls.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <motion.tr
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-white/5 ${feature.highlight ? 'bg-white/5' : ''}`}
              >
                <td className="py-3 px-4 text-star-white text-sm font-medium">{feature.name}</td>
                <td className="py-3 px-4 text-center">{renderValue(feature.economy)}</td>
                <td className="py-3 px-4 text-center">{renderValue(feature.business)}</td>
                <td className="py-3 px-4 text-center">{renderValue(feature.galaxium)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {classes.map((cls, index) => {
          const Icon = cls.icon;
          const isSoldOut = cls.seats === 0;
          
          return (
            <motion.div
              key={cls.class}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 border-2 ${cls.borderColor} ${isSoldOut ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon size={24} className={cls.color} />
                <h4 className={`text-lg font-bold ${cls.color}`}>{cls.name}</h4>
              </div>
              
              <div className="space-y-2">
                {features.map((feature) => {
                  const value = feature[cls.class as keyof typeof feature];
                  return (
                    <div key={feature.name} className="flex items-center justify-between py-1">
                      <span className="text-xs text-star-white/70">{feature.name}</span>
                      <div className="text-right">{renderValue(value as string | boolean)}</div>
                    </div>
                  );
                })}
              </div>
              
              <Button
                onClick={() => onSelect(cls.class)}
                disabled={isSoldOut}
                className="w-full mt-4"
              >
                {isSoldOut ? 'Sold Out' : `Select ${cls.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Selection Buttons */}
      <div className="hidden md:flex gap-3">
        {classes.map((cls) => {
          const Icon = cls.icon;
          const isSoldOut = cls.seats === 0;
          
          return (
            <Button
              key={cls.class}
              onClick={() => onSelect(cls.class)}
              disabled={isSoldOut}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Icon size={16} />
              {isSoldOut ? 'Sold Out' : `Select ${cls.name}`}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

// Made with Bob