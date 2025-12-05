
export interface Position {
  x: number;
  y: number;
}

export interface GeoLocation {
  lng: number; // 经度
  lat: number; // 纬度
}

export interface Note {
  id: string;
  text: string; // Used for remarks now
  location: string;
  geoLocation?: GeoLocation; // 可选的地理坐标（通过MCP获取）
  startDate: number | null; // Timestamp
  endDate: number | null; // Timestamp
  highlighterColor: string;
  position: Position;
  color: string;
  zIndex: number;
  rotation: number;
  createdAt: number;
  width: number;
  height: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

// Standard pastel colors for sticky notes (Always light, paper-like)
export const NOTE_COLORS = [
  '#fef3c7', // Amber-100
  '#d1fae5', // Emerald-100
  '#cffafe', // Cyan-100
  '#fce7f3', // Pink-100
  '#e0e7ff', // Indigo-100
];

export const NOTE_SIZE = 240;
