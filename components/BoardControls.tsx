
import React, { useState } from 'react';
import { LIGHT_BOARD_COLORS, DARK_BOARD_COLORS } from '../constants';
import { Palette, X } from 'lucide-react';

interface BoardControlsProps {
  currentBg: string;
  onBgChange: (color: string) => void;
  className?: string;
  isNightMode: boolean;
}

export const BoardControls: React.FC<BoardControlsProps> = ({ currentBg, onBgChange, className, isNightMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerClass = className || "fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center";

  // Day Mode (Light Notes) -> Show Light Themes
  // Night Mode (Dark Notes) -> Show Dark Themes
  const colors = isNightMode ? DARK_BOARD_COLORS : LIGHT_BOARD_COLORS;

  return (
    <div className={containerClass}>
      
      {/* Toggle Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all hover:scale-110 group"
          title="Change Theme"
        >
          <Palette size={20} className="text-gray-600 group-hover:text-blue-500" />
        </button>
      )}

      {/* Expanded Panel */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Board Color</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Color Grid */}
          <div className="grid grid-cols-5 gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => onBgChange(c.value)}
                className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 focus:outline-none relative group/color hover:z-50`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              >
                {/* Selected Indicator */}
                {currentBg === c.value && (
                  <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-offset-2" />
                )}
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
