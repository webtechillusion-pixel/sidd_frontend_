import React from 'react';
import { Plane, Car, Clock } from 'lucide-react';

const TopInfoBar = () => {
  return (
    <div className="bg-[#8ecae6] py-2 md:py-3 border-b border-[#219ebc]/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-sm md:flex-row md:gap-6 lg:gap-10">
          {/* Airport Pickup */}
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/30 px-3 py-1.5 backdrop-blur-sm md:w-auto">
            <div className="rounded-full bg-[#219ebc]/20 p-1">
              <Plane className="h-4 w-4 text-[#023047]" />
            </div>
            <span className="font-medium text-[#023047]">Airport Pickup</span>
            <span className="font-bold text-[#fb8500]">₹1000/-</span>
          </div>

          {/* Outstation Rates */}
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/30 px-3 py-1.5 backdrop-blur-sm md:w-auto">
            <div className="rounded-full bg-[#219ebc]/20 p-1">
              <Car className="h-4 w-4 text-[#023047]" />
            </div>
            <span className="font-medium text-[#023047]">Outstation</span>
            <span className="text-[#023047]">Sedan</span>
            <span className="font-bold text-[#fb8500]">₹11/km</span>
            <span className="mx-1 text-[#023047]">•</span>
            <span className="text-[#023047]">SUV</span>
            <span className="font-bold text-[#fb8500]">₹13/km</span>
          </div>

          {/* 24/7 Support */}
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/30 px-3 py-1.5 backdrop-blur-sm md:w-auto">
            <div className="rounded-full bg-[#219ebc]/20 p-1">
              <Clock className="h-4 w-4 text-[#023047]" />
            </div>
            <span className="font-medium text-[#023047]">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;