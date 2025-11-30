
import React, { useState } from 'react';
import { AIChatPanel } from './AIChatPanel';
import { ItineraryPanel } from './ItineraryPanel';
import { MessageCircle, Map as MapIcon } from 'lucide-react';

interface LeftSidePanelProps {
  location: string;
}

type Tab = 'chat' | 'plan';

export const LeftSidePanel: React.FC<LeftSidePanelProps> = ({ location }) => {
  const [activeTab, setActiveTab] = useState<Tab>('plan');

  return (
    <div className="absolute left-6 bottom-6 w-[calc(25vw-3rem)] top-[250px] flex flex-col animate-in fade-in slide-in-from-bottom duration-700 delay-200 z-[99999]">
      
      {/* Tabs Container - Flex items-end to align tabs to bottom of header area */}
      <div className="flex items-end pl-4 pr-2 shrink-0 relative z-20">
        
        {/* Daily Plan Tab */}
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-t-2xl font-['Caveat'] text-xl font-bold transition-all duration-300 relative ${
            activeTab === 'plan' 
              ? 'bg-[#fffbeb] text-amber-900 h-12 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]' // Active: Taller, matches panel color
              : 'bg-[#e7e5e4] text-gray-400 h-10 z-10 hover:bg-[#d6d3d1] cursor-pointer' // Inactive: Shorter, darker (grayish paper)
          }`}
          style={{ 
            marginRight: '-16px', // Overlap with right tab
            clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)' // Subtle taper for folder look
          }}
        >
          <MapIcon size={18} className={activeTab === 'plan' ? 'text-amber-700' : 'text-gray-400'} />
          Daily Plan
        </button>

        {/* AI Chat Tab */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-t-2xl font-['Caveat'] text-xl font-bold transition-all duration-300 relative ${
            activeTab === 'chat' 
              ? 'bg-gray-900 text-green-400 h-12 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]' // Active: Taller, matches chat panel
              : 'bg-gray-700 text-gray-500 h-10 z-10 hover:bg-gray-600 cursor-pointer' // Inactive: Shorter, lighter gray
          }`}
          style={{ 
            marginLeft: '-16px', // Overlap with left tab
            clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%)' // Subtle taper
          }}
        >
          <MessageCircle size={18} className={activeTab === 'chat' ? 'text-green-400' : 'text-gray-500'} />
          AI Chat
        </button>
      </div>

      {/* Content Area - Rounded all corners */}
      <div className="flex-1 min-h-0 relative z-10 shadow-xl rounded-xl overflow-hidden">
        {activeTab === 'plan' ? (
          <ItineraryPanel location={location} />
        ) : (
          <AIChatPanel location={location} />
        )}
      </div>
    </div>
  );
};
