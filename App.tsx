
import React, { useState, useEffect } from 'react';
import { StickyNote } from './components/StickyNote';
import { Dispenser } from './components/Dispenser';
import { BoardControls } from './components/BoardControls';
import { TrashCan } from './components/TrashCan';
import { HandwrittenCalendar } from './components/HandwrittenCalendar';
import { TripMap } from './components/TripMap';
import { LeftSidePanel } from './components/LeftSidePanel';
import { Note, NOTE_COLORS, NOTE_SIZE } from './types';
import { LIGHT_BOARD_COLORS, DARK_BOARD_COLORS, HIGHLIGHTER_COLORS } from './constants';
import { ChevronLeft, Moon, Sun } from 'lucide-react';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to determine grid color based on background brightness
const getGridDotColor = (bgHex: string) => {
  if (!bgHex || !bgHex.startsWith('#') || bgHex.length !== 7) return '#334155';
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128 ? '#334155' : 'rgba(255, 255, 255, 0.5)';
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [bgColor, setBgColor] = useState(LIGHT_BOARD_COLORS[2].value); // Default Warm Paper
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [lastDeletedNote, setLastDeletedNote] = useState<Note | null>(null);
  const [editingDateNoteId, setEditingDateNoteId] = useState<string | null>(null);
  
  // New state for "Interface 2" (Focus/Map Mode)
  const [focusedNoteId, setFocusedNoteId] = useState<string | null>(null);

  // Day (false) vs Night (true) Mode
  // Day: Light BG
  // Night: Dark BG
  // Note colors stay the same (Light paper style)
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    const screenCenter = {
      x: window.innerWidth / 2 - NOTE_SIZE / 2,
      y: window.innerHeight / 2 - NOTE_SIZE / 2,
    };
    
    const now = Date.now();
    const threeDaysLater = now + (3 * 24 * 60 * 60 * 1000);

    // Initial Note - Use the first standard color
    const initialColor = NOTE_COLORS[0];

    addNote({
      x: screenCenter.x,
      y: screenCenter.y,
      location: "Paris, France",
      startDate: now,
      endDate: threeDaysLater,
      text: "Welcome!\n1. Hover note & click Map icon to plan.\n2. Click dates to edit.\n3. Drag to trash to delete.",
      color: initialColor,
      rotation: -2
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNote = (overrides?: Partial<Note> & { x?: number, y?: number }) => {
    const startX = overrides?.x ?? 200;
    const startY = overrides?.y ?? window.innerHeight - 300;
    
    const randomHighlighter = HIGHLIGHTER_COLORS[Math.floor(Math.random() * HIGHLIGHTER_COLORS.length)];

    // Always pick from standard light colors
    const pickedColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

    const newNote: Note = {
      id: generateId(),
      text: overrides?.text ?? "",
      location: overrides?.location ?? "",
      startDate: overrides?.startDate ?? null,
      endDate: overrides?.endDate ?? null,
      highlighterColor: overrides?.highlighterColor ?? randomHighlighter,
      position: { x: startX, y: startY },
      color: overrides?.color ?? pickedColor,
      zIndex: maxZIndex + 1,
      rotation: overrides?.rotation ?? (Math.random() * 6 - 3),
      createdAt: Date.now(),
      width: NOTE_SIZE,
      height: NOTE_SIZE,
    };

    setNotes((prev) => [...prev, newNote]);
    setMaxZIndex((prev) => prev + 1);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(n => n.id === id);
    if (noteToDelete) {
      setLastDeletedNote(noteToDelete);
      setTimeout(() => setLastDeletedNote(null), 4000);
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const restoreNote = () => {
    if (lastDeletedNote) {
      setNotes(prev => [...prev, lastDeletedNote]);
      setLastDeletedNote(null);
    }
  };

  const bringToFront = (id: string) => {
    if (focusedNoteId) return;
    setMaxZIndex((prev) => {
      const newMax = prev + 1;
      setNotes((notes) =>
        notes.map((note) =>
          note.id === id ? { ...note, zIndex: newMax } : note
        )
      );
      return newMax;
    });
  };

  const handleDispenserClick = () => {
    const randomOffset = Math.random() * 50;
    addNote({
      x: 200 + randomOffset,
      y: window.innerHeight - 450 - randomOffset,
    });
  };

  const toggleThemeMode = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    
    // Only switch background, keep note colors as they are
    if (newMode) {
      // Switching to Night -> Dark BG
      setBgColor(DARK_BOARD_COLORS[0].value);
    } else {
      // Switching to Day -> Light BG
      setBgColor(LIGHT_BOARD_COLORS[2].value); // Default to Warm Paper
    }
  };

  const gridDotColor = getGridDotColor(bgColor);
  const activeDateNote = notes.find(n => n.id === editingDateNoteId);
  const focusedNote = notes.find(n => n.id === focusedNoteId);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Pattern (Dot Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-500"
        style={{
          backgroundImage: `radial-gradient(circle, ${gridDotColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Board Controls (Theme Palette) - ONLY SHOW IN INTERFACE 1 (Not focused) */}
      {!focusedNoteId && (
        <BoardControls 
          currentBg={bgColor}
          onBgChange={setBgColor}
          className="fixed top-6 right-20 z-[100001]"
          isNightMode={isNightMode}
        />
      )}

      {/* Day/Night Toggle Button */}
      {/* Interface 1: Top Right (right-6) */}
      {/* Interface 2: Left side next to Back button */}
      <button
        onClick={toggleThemeMode}
        className={`fixed top-6 z-[100000] bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-all hover:scale-110 group ${
          focusedNoteId ? "left-[120px]" : "right-6" // 120px is approx width of Back button + spacing
        }`}
        title={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
      >
        {isNightMode ? (
          <Sun size={20} className="text-amber-500 group-hover:rotate-90 transition-transform" />
        ) : (
          <Moon size={20} className="text-indigo-600 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      {/* --- Main Board Components (Hidden when focused) --- */}
      <div className={`transition-opacity duration-500 ${focusedNoteId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Dispenser onTakeNote={handleDispenserClick} />
        <TrashCan isHovered={isTrashHovered} />
      </div>

      {/* --- Notes Layer --- */}
      {notes.map((note) => {
        const isFocused = note.id === focusedNoteId;
        const isHidden = focusedNoteId && !isFocused;

        return (
          <div 
            key={note.id} 
            className={`transition-opacity duration-500 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <StickyNote
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onBringToFront={bringToFront}
              onTrashHover={setIsTrashHovered}
              onEditDate={setEditingDateNoteId}
              onFocus={setFocusedNoteId}
              isFocused={isFocused}
            />
          </div>
        );
      })}

      {/* --- Interface 2: Map & Left Side Panel (Only when focused) --- */}
      {focusedNoteId && focusedNote && (
        <>
          <button 
            onClick={() => setFocusedNoteId(null)}
            className="fixed top-6 left-6 z-[100000] bg-white/90 px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-white hover:scale-105 transition-all text-gray-700 font-bold"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <TripMap location={focusedNote.location} />
          <LeftSidePanel 
            location={focusedNote.location} 
            startDate={focusedNote.startDate}
            endDate={focusedNote.endDate}
          />
        </>
      )}

      {/* --- Overlays --- */}

      {/* Undo Toast */}
      {lastDeletedNote && !focusedNoteId && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-[100000] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <span>Note deleted</span>
          <button 
            onClick={restoreNote}
            className="text-yellow-400 font-bold hover:text-yellow-300 hover:underline"
          >
            Undo
          </button>
        </div>
      )}

      {/* Calendar Modal */}
      {editingDateNoteId && activeDateNote && (
        <div 
          className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEditingDateNoteId(null)}
        >
          <div 
            className="bg-[#fffbeb] p-8 rounded-lg shadow-2xl border border-gray-200 transform -rotate-1 scale-100 transition-all"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '320px',
              backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(0,0,0,0.02))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <HandwrittenCalendar 
              startDate={activeDateNote.startDate}
              endDate={activeDateNote.endDate}
              onDateSelect={(start, end) => updateNote(editingDateNoteId, { startDate: start, endDate: end })}
              isEditing={true}
              onClose={() => setEditingDateNoteId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
