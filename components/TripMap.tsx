
import React from 'react';
import { Map } from 'lucide-react';

interface TripMapProps {
  location: string;
}

export const TripMap: React.FC<TripMapProps> = ({ location }) => {
  // NOTE: In a real implementation, you would load the AMap script here.
  // Example: useScript('https://webapi.amap.com/maps?v=2.0&key=YOUR_KEY');
  
  return (
    <div className="absolute right-0 top-0 bottom-0 w-3/4 h-full p-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 bg-[#f0f9ff]">
        
        {/* Placeholder for Map Visuals */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #e0f2fe 0, #e0f2fe 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <Map size={64} className="mb-4 text-gray-300" />
          <div className="font-['Caveat'] text-2xl text-gray-500">Map View: {location || "Select a location"}</div>
          <div className="text-sm font-sans mt-2 opacity-60">AMap Integration Ready</div>
        </div>

        {/* Decorative Compass / Map Elements */}
        <div className="absolute top-4 right-4 w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center">
          <div className="text-xs font-bold text-gray-400">N</div>
        </div>

        {/* Zoom Controls Mockup */}
        <div className="absolute bottom-8 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded shadow text-gray-600 font-bold">+</button>
          <button className="w-8 h-8 bg-white rounded shadow text-gray-600 font-bold">-</button>
        </div>
      </div>
    </div>
  );
};
