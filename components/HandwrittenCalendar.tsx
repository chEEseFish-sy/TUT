
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface HandwrittenCalendarProps {
  startDate: number | null;
  endDate: number | null;
  onDateSelect: (start: number | null, end: number | null) => void;
  isEditing: boolean;
  onClose?: () => void;
}

export const HandwrittenCalendar: React.FC<HandwrittenCalendarProps> = ({
  startDate,
  endDate,
  onDateSelect,
  isEditing,
  onClose,
}) => {
  // Simple state for current month view
  const [currentDate, setCurrentDate] = useState(new Date(startDate || Date.now()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleDayClick = (day: number) => {
    if (!isEditing) return;

    const clickedDate = new Date(year, month, day).getTime();

    if (!startDate) {
      onDateSelect(clickedDate, null);
    } else if (!endDate && clickedDate > startDate) {
      onDateSelect(startDate, clickedDate);
    } else {
      // Reset if clicking again or clicking backwards
      onDateSelect(clickedDate, null);
    }
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Generate calendar grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateTs = new Date(year, month, day).getTime();
    
    // Determine visual state
    const isStart = startDate && new Date(startDate).toDateString() === new Date(dateTs).toDateString();
    const isEnd = endDate && new Date(endDate).toDateString() === new Date(dateTs).toDateString();
    const isInRange = startDate && endDate && dateTs > startDate && dateTs < endDate;

    days.push(
      <div
        key={day}
        onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}
        className={`relative h-8 w-8 flex items-center justify-center text-lg font-['Caveat'] font-bold z-10 transition-transform text-gray-900
          ${isEditing ? 'cursor-pointer hover:scale-110' : ''}
        `}
      >
        <span className="relative z-10">{day}</span>
        
        {/* Visuals for selected dates */}
        {(isStart || isEnd) && (
          <div className="absolute inset-0 border-2 border-red-600 rounded-full w-full h-full opacity-80 transform rotate-[-10deg] scale-110 pointer-events-none" 
               style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
        )}
        
        {/* Visual for range (strikethrough/line) */}
        {isInRange && (
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-400 opacity-50 transform -translate-y-1/2 rotate-[-5deg] pointer-events-none"></div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full select-none flex flex-col items-center" onMouseDown={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4 px-2">
        {isEditing && (
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-black/5 rounded-full transition-colors text-gray-600">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="font-['Caveat'] font-bold text-2xl text-gray-900">
          {monthNames[month]} {year}
        </div>
        {isEditing && (
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-black/5 rounded-full transition-colors text-gray-600">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 justify-items-center mb-4">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-sm font-['Caveat'] font-bold text-gray-500 w-8 text-center">{d}</div>
        ))}
        {days}
      </div>

      {/* Done Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="mt-2 flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-full font-['Caveat'] text-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Check size={18} />
          <span>Done</span>
        </button>
      )}
    </div>
  );
};
