import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface DispenserProps {
  onTakeNote: () => void;
}

export const Dispenser: React.FC<DispenserProps> = ({ onTakeNote }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onTakeNote();
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="fixed bottom-12 left-12 z-[9999] select-none group">
      <div className="relative w-40 h-40">
        
        {/* Helper text */}
        <div className="absolute -top-8 left-0 w-full text-center text-gray-400 text-xs font-medium animate-bounce opacity-0 group-hover:opacity-100 transition-opacity">
          Click to take a note
        </div>

        {/* The Base/Container of the dispenser */}
        <div className="absolute inset-0 bg-gray-800 rounded-lg transform translate-y-2 translate-x-2 shadow-2xl"></div>

        {/* The Stack of Notes (Visualizing depth) */}
        {/* We stack a few divs to create the 3D 'pages' look on the side */}
        <div className="absolute inset-0 bg-[#fde68a] rounded-lg border-b-4 border-r-4 border-[#d97706] transform translate-y-1 translate-x-1"></div>
        <div className="absolute inset-0 bg-[#fde68a] rounded-lg border-b-4 border-r-4 border-[#d97706] transform translate-y-0.5 translate-x-0.5"></div>

        {/* The Top Note (Interactive Button) */}
        <button
          onClick={handleClick}
          className={`absolute inset-0 w-full h-full bg-amber-100 rounded-lg shadow-inner flex items-center justify-center transition-all duration-100 ease-out
            ${isPressed ? 'translate-y-1 translate-x-1' : '-translate-y-1 -translate-x-1 hover:-translate-y-2 hover:-translate-x-2'}
          `}
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          }}
        >
          {/* Paper texture noise */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          
          <div className="text-amber-800/20 transform rotate-12">
            <Plus size={32} strokeWidth={3} />
          </div>
          
          {/* Branding / Realistic markings */}
          <div className="absolute bottom-2 right-2 text-[8px] font-bold text-amber-800/30 uppercase tracking-widest font-sans">
            Stickies
          </div>
        </button>

      </div>
    </div>
  );
};