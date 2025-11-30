import React from 'react';
import { Trash2 } from 'lucide-react';
import { TRASH_CONFIG } from '../constants';

interface TrashCanProps {
  isHovered: boolean;
}

export const TrashCan: React.FC<TrashCanProps> = ({ isHovered }) => {
  return (
    <div
      className="fixed z-[9999] flex items-center justify-center transition-all duration-300 ease-out"
      style={{
        right: `${TRASH_CONFIG.right}px`,
        bottom: `${TRASH_CONFIG.bottom}px`,
        width: `${TRASH_CONFIG.width}px`,
        height: `${TRASH_CONFIG.height}px`,
      }}
    >
      {/* Interaction Zone Indicator (Subtle glow when hovering) */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-red-500/10 scale-125' : 'bg-transparent scale-100'
        }`}
      />

      {/* The Trash Can Visuals - Scaled down */}
      <div className={`relative flex flex-col items-center transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}>
        
        {/* Lid (Animate slightly when hovering) */}
        <div 
          className={`w-20 h-3 bg-gray-600 rounded-t-sm mb-0.5 shadow-sm transition-transform duration-300 origin-bottom-right ${
            isHovered ? '-rotate-12 translate-y-[-6px]' : 'rotate-0'
          }`} 
        />
        
        {/* Bin Body */}
        <div className="w-16 h-20 bg-gray-700/90 rounded-b-lg shadow-inner border-t border-gray-600 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* Mesh effect */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} 
          />
          
          <Trash2 className={`text-gray-400 z-10 transition-colors duration-300 ${isHovered ? 'text-red-400' : ''}`} size={24} />
        </div>

        {/* Label */}
        <div className={`absolute -bottom-6 text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isHovered ? 'text-red-800' : 'text-gray-400/50'}`}>
          Trash
        </div>
      </div>
    </div>
  );
};