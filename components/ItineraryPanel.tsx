
import React, { useState } from 'react';
import { 
  CloudSun, 
  ChevronLeft, 
  ChevronRight, 
  BedDouble, 
  MapPin, 
  Car, 
  Train, 
  Footprints, 
  Clock, 
  Bus 
} from 'lucide-react';

interface ItineraryPanelProps {
  location: string;
}

// Mock Data Structure
interface DayPlan {
  day: number;
  date: string;
  weekday: string;
  weather: string;
  temp: string;
  summary: string;
  hotel: string;
  events: {
    id: string;
    time: string;
    title: string;
    transportToNext?: {
      type: 'car' | 'walk' | 'train' | 'bus';
      duration: string;
    }
  }[];
}

const MOCK_DAYS: DayPlan[] = [
  {
    day: 1,
    date: 'Oct 12',
    weekday: 'Saturday',
    weather: 'Sunny',
    temp: '22°C',
    summary: 'Arrival and Old Town exploration. Enjoying the local cuisine and sunset views.',
    hotel: 'Grand Hotel Central',
    events: [
      { id: 'e1', time: '10:00 AM', title: 'Arrival at Airport', transportToNext: { type: 'car', duration: '45 min' } },
      { id: 'e2', time: '12:00 PM', title: 'Check-in & Lunch', transportToNext: { type: 'walk', duration: '15 min' } },
      { id: 'e3', time: '02:00 PM', title: 'Historic Market Tour', transportToNext: { type: 'walk', duration: '10 min' } },
      { id: 'e4', time: '05:00 PM', title: 'Sunset at Cathedral' }
    ]
  },
  {
    day: 2,
    date: 'Oct 13',
    weekday: 'Sunday',
    weather: 'Cloudy',
    temp: '19°C',
    summary: 'Museum day and river cruise. Visiting the famous art gallery in the morning.',
    hotel: 'Grand Hotel Central',
    events: [
      { id: 'e5', time: '09:00 AM', title: 'Modern Art Museum', transportToNext: { type: 'bus', duration: '20 min' } },
      { id: 'e6', time: '01:00 PM', title: 'Riverside Lunch', transportToNext: { type: 'walk', duration: '5 min' } },
      { id: 'e7', time: '03:00 PM', title: 'Boat Tour' }
    ]
  }
];

export const ItineraryPanel: React.FC<ItineraryPanelProps> = ({ location }) => {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const day = MOCK_DAYS[currentDayIdx];

  const handleNext = () => {
    if (currentDayIdx < MOCK_DAYS.length - 1) setCurrentDayIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentDayIdx > 0) setCurrentDayIdx(prev => prev - 1);
  };

  const getTransportIcon = (type?: string) => {
    switch(type) {
      case 'car': return <Car size={14} />;
      case 'train': return <Train size={14} />;
      case 'walk': return <Footprints size={14} />;
      case 'bus': return <Bus size={14} />;
      default: return <Car size={14} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fffbeb] overflow-hidden border-x border-b border-amber-200 text-gray-800">
      
      {/* Header: Date & Nav */}
      <div className="bg-amber-100 p-3 flex items-center justify-between border-b border-amber-200/50 shrink-0">
        <button 
          onClick={handlePrev} 
          disabled={currentDayIdx === 0}
          className="p-1 rounded-full hover:bg-amber-200 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={20} className="text-amber-800" />
        </button>

        <div className="flex flex-col items-center">
          <div className="font-['Caveat'] font-bold text-2xl leading-none text-amber-900">
            {day.date}, {day.weekday}
          </div>
          <div className="flex items-center gap-1 text-amber-700/70 text-sm mt-1">
            <CloudSun size={14} />
            <span>{day.weather}, {day.temp}</span>
          </div>
        </div>

        <button 
          onClick={handleNext} 
          disabled={currentDayIdx === MOCK_DAYS.length - 1}
          className="p-1 rounded-full hover:bg-amber-200 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={20} className="text-amber-800" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto thin-scrollbar-light p-4 space-y-4 bg-pattern-dots">
        
        {/* Daily Summary */}
        <div className="bg-white/60 p-3 rounded-lg border border-amber-200/50">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800/50 mb-1">Daily Summary</div>
          <div className="font-['Caveat'] text-xl leading-6 text-gray-800">
            {day.summary}
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-white/60 p-3 rounded-lg border border-amber-200/50 flex items-center gap-3">
          <div className="bg-amber-200 p-2 rounded-full text-amber-800">
            <BedDouble size={18} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800/50">Accommodation</div>
            <div className="font-['Caveat'] text-xl leading-none text-gray-800">{day.hotel}</div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="relative pt-2 pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-amber-200"></div>

          {day.events.map((event, idx) => (
            <div key={event.id} className="relative mb-6 last:mb-0 group">
              
              {/* Event Node */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center shrink-0 shadow-sm text-amber-600 font-bold text-xs">
                  {idx + 1}
                </div>
                <div className="flex-1 bg-white/80 rounded-lg p-2 shadow-sm border border-amber-100 hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-start">
                    <span className="font-['Caveat'] text-xl font-bold text-gray-800">{event.title}</span>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1 rounded">{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Transport Connector (if next exists) */}
              {event.transportToNext && (
                <div className="ml-12 mt-2 mb-2 flex items-center gap-2">
                  <div className="bg-amber-100/80 px-2 py-1 rounded-full border border-amber-200 flex items-center gap-2 text-xs text-amber-900 cursor-pointer hover:bg-amber-200 transition-colors shadow-sm">
                     {getTransportIcon(event.transportToNext.type)}
                     <span className="font-medium">{event.transportToNext.duration}</span>
                     {/* In a real app, this would be a select/dropdown */}
                     <ChevronRight size={10} className="opacity-50 rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
