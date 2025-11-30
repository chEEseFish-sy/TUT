
import React, { useState, useRef, useEffect } from 'react';
import { Note, NOTE_SIZE } from '../types';
import { Map, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { TRASH_CONFIG } from '../constants';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onTrashHover?: (isHovering: boolean) => void;
  onEditDate: (id: string) => void;
  onFocus: (id: string) => void;
  isFocused: boolean;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  onBringToFront,
  onTrashHover,
  onEditDate,
  onFocus,
  isFocused,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCrumpling, setIsCrumpling] = useState(false);
  const [willDelete, setWillDelete] = useState(false);

  // Focus tracking to prevent closing edit mode when switching inputs
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-edit new empty notes
  useEffect(() => {
    if (note.text === '' && note.location === '' && Date.now() - note.createdAt < 1000) {
      setIsEditing(true);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging if editing, crumpling, or FOCUSED (Interface 2)
    if (isEditing || isCrumpling || isFocused) return;
    
    e.stopPropagation();
    onBringToFront(note.id);
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isCrumpling) return;
    // Allow editing even if focused
    e.stopPropagation();
    setIsEditing(true);
  };

  // Global mouse listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isCrumpling) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      onUpdate(note.id, {
        position: { x: newX, y: newY },
      });

      const trashRect = {
        x: window.innerWidth - TRASH_CONFIG.right - TRASH_CONFIG.width,
        y: window.innerHeight - TRASH_CONFIG.bottom - TRASH_CONFIG.height,
        w: TRASH_CONFIG.width,
        h: TRASH_CONFIG.height
      };

      const isOverTrash = 
        e.clientX >= trashRect.x && 
        e.clientX <= trashRect.x + trashRect.w &&
        e.clientY >= trashRect.y && 
        e.clientY <= trashRect.y + trashRect.h;

      if (isOverTrash !== willDelete) {
        setWillDelete(isOverTrash);
        onTrashHover?.(isOverTrash);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        
        if (willDelete) {
          setIsCrumpling(true);
          onTrashHover?.(false);
          setTimeout(() => {
            onDelete(note.id);
          }, 500);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note.id, onUpdate, willDelete, onDelete, isCrumpling, onTrashHover]);

  // Handle outside click to close edit mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isEditing && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Always use Dark Ink on Light Paper style
  const inkColor = 'text-blue-900'; 
  const subInkColor = 'text-gray-500';
  const placeholderColor = 'placeholder-gray-400';

  const trashCenterX = window.innerWidth - TRASH_CONFIG.right - TRASH_CONFIG.width / 2 - NOTE_SIZE / 2;
  const trashCenterY = window.innerHeight - TRASH_CONFIG.bottom - TRASH_CONFIG.height / 2 - NOTE_SIZE / 2;

  // Position Logic:
  // If Focused: Top Left (24px, 80px)
  // If Crumpling: Trash Center
  // Default: Note Position
  const displayX = isFocused ? 24 : (isCrumpling ? trashCenterX : note.position.x);
  const displayY = isFocused ? 80 : (isCrumpling ? trashCenterY : note.position.y);
  
  // Format dates
  const formatDate = (ts: number | null) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const dateText = (note.startDate || note.endDate) 
    ? `${formatDate(note.startDate) || '?'} - ${formatDate(note.endDate) || '?'}`
    : null;

  return (
    <div
      ref={containerRef}
      className={`absolute flex flex-col shadow-lg select-none transition-all ease-in-out ${
        isDragging && !willDelete ? 'cursor-grabbing shadow-2xl scale-[1.02]' : (isFocused ? 'cursor-default' : 'cursor-grab')
      } ${
        willDelete && !isCrumpling ? 'bg-red-50 rotate-12 scale-90 opacity-80' : ''
      }`}
      style={{
        width: isFocused ? 'calc(25vw - 3rem)' : `${NOTE_SIZE}px`,
        // Focused height is smaller (150px) to give more room to bottom panel
        height: isFocused ? '150px' : `${NOTE_SIZE}px`,
        left: `${displayX}px`,
        top: `${displayY}px`,
        backgroundColor: willDelete && !isCrumpling ? '#fee2e2' : note.color,
        zIndex: isFocused ? 99999 : note.zIndex,
        // Override rotation to 0 if focused
        transform: isCrumpling 
          ? 'scale(0.1) rotate(720deg) translateZ(0)' 
          : `rotate(${isFocused ? 0 : (willDelete ? 15 : note.rotation)}deg) translateZ(0)`,
        opacity: isCrumpling ? 0 : 1,
        borderRadius: isCrumpling ? '50%' : '0px',
        boxShadow: isDragging || isFocused
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          : '2px 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        // Solid color background
        backgroundImage: 'none',
        // Slower transition for Focus move (0.8s), faster for drag/hover
        transitionDuration: isFocused ? '800ms' : (isCrumpling ? '500ms' : (isDragging ? '0ms' : '300ms')),
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease
        WebkitFontSmoothing: 'antialiased',
        backfaceVisibility: 'hidden',
        willChange: isDragging ? 'transform, left, top' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual Pin (Only in View Mode, allow in Focus mode too) */}
      {!isEditing && !isDragging && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none drop-shadow-md">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-inner relative">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50"></div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className={`flex-1 flex flex-col p-3 overflow-hidden relative group transition-opacity ${isCrumpling ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* --- SECTION 1: LOCATION --- */}
        <div className="flex items-center gap-1 mb-1 relative shrink-0">
          <MapPin size={isFocused ? 24 : 20} className={`shrink-0 ${subInkColor}`} />
          {isEditing ? (
            <input 
              type="text"
              value={note.location}
              onChange={(e) => onUpdate(note.id, { location: e.target.value })}
              className={`w-full bg-transparent border-b border-dashed border-gray-400/30 outline-none font-['Caveat','Zhi_Mang_Xing'] leading-tight ${inkColor} ${placeholderColor} ${isFocused ? 'text-3xl' : 'text-2xl'}`}
              placeholder="Location..."
              autoFocus
            />
          ) : (
            <div className="relative inline-block max-w-full">
              {/* Highlighter effect behind text */}
              {note.location && (
                <div 
                  className="absolute inset-0 -skew-y-2 scale-105 rounded-sm pointer-events-none mix-blend-multiply"
                  style={{ backgroundColor: note.highlighterColor }}
                ></div>
              )}
              <div className={`relative font-['Caveat','Zhi_Mang_Xing'] font-bold leading-tight ${inkColor} truncate pr-1 ${isFocused ? 'text-3xl' : 'text-2xl'}`}>
                {note.location || "Unknown Place"}
              </div>
            </div>
          )}
        </div>

        {/* --- SECTION 2: DATE RANGE (Click to Open Modal) --- */}
        <div className="flex items-center gap-1 mb-2 shrink-0 border-b border-gray-400/10 pb-1">
          <CalendarIcon size={isFocused ? 20 : 16} className={`shrink-0 ${subInkColor}`} />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) onEditDate(note.id);
            }}
            className={`text-left flex-1 font-['Caveat'] ${inkColor} ${isEditing ? 'hover:bg-black/5 rounded px-1 cursor-pointer' : ''} ${isFocused ? 'text-2xl' : 'text-lg'}`}
          >
            {dateText || (isEditing ? <span className={`italic opacity-50 ${inkColor}`}>Select dates...</span> : "No dates")}
          </button>
        </div>

        {/* --- SECTION 3: REMARKS --- */}
        <div className="flex-1 min-h-0 flex flex-col relative">
          {/* Line grid background for remarks */}
          <div className={`absolute inset-0 pointer-events-none opacity-10`}
               style={{ 
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)`, 
                 // Match background size to line-height below
                 backgroundSize: isFocused ? '100% 32px' : '100% 28px', 
                 marginTop: '4px' 
               }}>
          </div>
          
          {isEditing ? (
            <textarea
              value={note.text}
              onChange={(e) => onUpdate(note.id, { text: e.target.value })}
              className={`w-full h-full bg-transparent resize-none outline-none border-none font-['Caveat','Zhi_Mang_Xing'] ${inkColor} ${placeholderColor} p-0 pr-5 ${isFocused ? 'text-2xl leading-[32px]' : 'text-xl leading-[28px]'}`}
              placeholder="Trip notes..."
            />
          ) : (
            <div 
              className={`w-full h-full whitespace-pre-wrap break-words font-['Caveat','Zhi_Mang_Xing'] ${inkColor} pr-5 ${isFocused ? 'text-2xl leading-[32px]' : 'text-xl leading-[28px]'}`}
            >
              {note.text || ""}
            </div>
          )}
        </div>

        {/* Map / Plan Button (Hover) - Replaces Edit Icon */}
        {!isDragging && !isEditing && !willDelete && !isFocused && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onFocus(note.id); 
            }}
            onMouseDown={(e) => e.stopPropagation()} // Critical: prevents drag start on container
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 transform hover:scale-110"
            title="Plan Trip (Open Map)"
          >
            <Map size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
