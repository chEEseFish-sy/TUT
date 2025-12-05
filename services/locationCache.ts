/**
 * 常见城市坐标缓存
 * 用于快速显示地图，无需等待地理编码
 */

export interface GeoLocation {
  lng: number;
  lat: number;
}

// 常见城市坐标映射
const LOCATION_CACHE: Record<string, GeoLocation> = {
  'paris': { lng: 2.3522, lat: 48.8566 },
  'paris, france': { lng: 2.3522, lat: 48.8566 },
  'france': { lng: 2.3522, lat: 48.8566 },
  'beijing': { lng: 116.3974, lat: 39.9093 },
  'beijing, china': { lng: 116.3974, lat: 39.9093 },
  '北京': { lng: 116.3974, lat: 39.9093 },
  '北京天安门': { lng: 116.397428, lat: 39.90923 },
  'shanghai': { lng: 121.4737, lat: 31.2304 },
  'shanghai, china': { lng: 121.4737, lat: 31.2304 },
  '上海': { lng: 121.4737, lat: 31.2304 },
  'london': { lng: -0.1276, lat: 51.5074 },
  'london, uk': { lng: -0.1276, lat: 51.5074 },
  'new york': { lng: -74.006, lat: 40.7128 },
  'new york, usa': { lng: -74.006, lat: 40.7128 },
  'tokyo': { lng: 139.6503, lat: 35.6762 },
  'tokyo, japan': { lng: 139.6503, lat: 35.6762 },
};

/**
 * 根据地址字符串获取缓存的坐标
 */
export const getCachedLocation = (location: string): GeoLocation | null => {
  if (!location) return null;
  
  const normalized = location.toLowerCase().trim();
  
  // 直接匹配
  if (LOCATION_CACHE[normalized]) {
    return LOCATION_CACHE[normalized];
  }
  
  // 部分匹配（检查是否包含城市名）
  for (const [key, coords] of Object.entries(LOCATION_CACHE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  
  return null;
};

/**
 * 添加坐标到缓存
 */
export const cacheLocation = (location: string, coords: GeoLocation): void => {
  const normalized = location.toLowerCase().trim();
  LOCATION_CACHE[normalized] = coords;
};

