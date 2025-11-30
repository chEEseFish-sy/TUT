
import React, { useState, useMemo, useEffect } from 'react';
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
  startDate: number | null;
  endDate: number | null;
}

// Data Structure
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

// Sample templates to populate empty days so UI looks good
const TEMPLATE_EVENTS = [
  { time: '10:00 AM', title: 'City Walking Tour', transportToNext: { type: 'walk' as const, duration: '20 min' } },
  { time: '01:00 PM', title: 'Local Cuisine Lunch', transportToNext: { type: 'car' as const, duration: '15 min' } },
  { time: '03:00 PM', title: 'Museum Visit' },
  { time: '07:00 PM', title: 'Dinner at Panorama' }
];

export const ItineraryPanel: React.FC<ItineraryPanelProps> = ({ location, startDate, endDate }) => {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);

  // Dynamically generate the itinerary days
  const dayPlans = useMemo(() => {
    const days: DayPlan[] = [];
    
    // Default to today if no start date, or ensure sensible defaults
    const start = startDate ? new Date(startDate) : new Date();
    // Default to 3 days length if no end date
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Ensure we process correctly even if dates are inverted
    const startTs = Math.min(start.getTime(), end.getTime());
    const endTs = Math.max(start.getTime(), end.getTime());
    
    const oneDayMs = 24 * 60 * 60 * 1000;
    let currentTs = startTs;
    let dayCount = 1;

    // Loop through days
    while (currentTs <= endTs) {
      const dateObj = new Date(currentTs);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekdayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      days.push({
        day: dayCount,
        date: dateStr,
        weekday: weekdayStr,
        weather: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'][dayCount % 4], // Mock rotation
        temp: `${20 + (dayCount % 5)}°C`, // Mock temp
        summary: `Day ${dayCount} in ${location || 'Paradise'}. Exploring key landmarks and enjoying the atmosphere.`,
        hotel: 'Grand Hotel Central',
        // Cycle through mock events just so every day has content
        events: TEMPLATE_EVENTS.map((ev, i) => ({
          ...ev, 
          id: `d${dayCount}-e${i}`,
          // Vary the title slightly just to show difference
          title: dayCount === 1 && i === 0 ? 'Arrival at Airport' : ev.title
        }))
      });

      currentTs += oneDayMs;
      dayCount++;
      
      // Safety break for very long ranges
      if (dayCount > 30) break;
    }

    return days;
  }, [startDate, endDate, location]);

  // Reset index if out of bounds (e.g. date range shrank)
  useEffect(() => {
    if (currentDayIdx >= dayPlans.length) {
      setCurrentDayIdx(0);
    }
  }, [dayPlans.length, currentDayIdx]);

  const day = dayPlans[currentDayIdx] || dayPlans[0];

  const handleNext = () => {
    if (currentDayIdx < dayPlans.length - 1) setCurrentDayIdx(prev => prev + 1);
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

  if (!day) return <div className="p-4 text-center font-['Caveat'] text-2xl">Select dates to plan trip</div>;

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
          disabled={currentDayIdx === dayPlans.length - 1}
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
