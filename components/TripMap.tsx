
import React, { useEffect, useRef, useState } from 'react';
import { Map, Loader2 } from 'lucide-react';
import { getCachedLocation } from '../services/locationCache';

interface TripMapProps {
  location: string;
  center?: { lng: number; lat: number }; // 可选：直接传入坐标，避免地理编码
}

// 声明全局AMap类型
declare global {
  interface Window {
    AMap: any;
    initAMap: () => void;
  }
}

/**
 * 加载高德地图脚本（带超时处理）
 */
const loadAMapScript = (timeout = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if (window.AMap) {
      resolve();
      return;
    }

    // 检查是否正在加载
    if (window.initAMap) {
      const checkInterval = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // 设置超时
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('加载高德地图脚本超时'));
      }, timeout);
      
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    
    // 使用高德地图JS API，需要配置API Key
    // 如果没有API Key，使用测试key（可能有限制，但至少能加载）
    const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
    
    // 如果没有API Key，使用默认的测试key或者提示使用MCP
    if (!AMAP_KEY) {
      console.warn('未配置高德地图API Key (VITE_AMAP_KEY)，地图可能无法正常显示');
      // 不使用key的URL（可能会失败，但我们有错误处理）
      const scriptUrl = `https://webapi.amap.com/maps?v=2.0&callback=initAMap`;
      script.src = scriptUrl;
    } else {
      const scriptUrl = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&callback=initAMap`;
      script.src = scriptUrl;
    }
    
    let resolved = false;
    
    window.initAMap = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };
    
    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        reject(new Error('加载高德地图脚本失败。请检查网络连接和API Key配置。'));
      }
    };
    
    // 设置超时
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        script.remove();
        reject(new Error(`加载高德地图脚本超时（${timeout}ms）。请检查网络连接或配置API Key。`));
      }
    }, timeout);
    
    // 成功加载后清除超时
    const originalInit = window.initAMap;
    window.initAMap = () => {
      clearTimeout(timeoutId);
      if (originalInit) originalInit();
    };
    
    document.head.appendChild(script);
  });
};


export const TripMap: React.FC<TripMapProps> = ({ location, center }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lng: number; lat: number } | null>(center || null);

  // 加载地图脚本并初始化
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 检查API Key配置
        const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
        if (!AMAP_KEY) {
          console.warn('未配置高德地图API Key (VITE_AMAP_KEY)，地图功能可能受限');
        }

        // 加载高德地图脚本（带超时）
        try {
          await Promise.race([
            loadAMapScript(8000),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('加载超时')), 8000)
            )
          ]);
        } catch (loadError) {
          console.error('地图脚本加载失败:', loadError);
          if (mounted) {
            setError('地图加载失败。请检查网络连接和API Key配置 (VITE_AMAP_KEY)。');
            setIsLoading(false);
          }
          return;
        }

        if (!mounted || !mapContainer.current) return;

        // 如果已经初始化，先销毁
        if (mapInstance.current) {
          mapInstance.current.destroy();
          mapInstance.current = null;
        }

        // 确定地图中心坐标
        let finalCenter: { lng: number; lat: number };
        
        if (mapCenter) {
          // 如果已传入坐标，直接使用
          finalCenter = mapCenter;
        } else if (location) {
          // 有地址信息，尝试地理编码
          // 先检查缓存
          const cachedCoords = getCachedLocation(location);
          if (cachedCoords) {
            finalCenter = cachedCoords;
            setMapCenter(cachedCoords);
          } else if (AMAP_KEY) {
            // 有API Key，使用地理编码API
            try {
              const geocodeUrl = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(location)}&key=${AMAP_KEY}`;
              const response = await fetch(geocodeUrl);
              const data = await response.json();
              
              if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
                const locationStr = data.geocodes[0].location;
                const [lng, lat] = locationStr.split(',').map(Number);
                finalCenter = { lng, lat };
                setMapCenter(finalCenter);
              } else {
                // 地理编码失败，使用缓存或默认位置
                finalCenter = cachedCoords || { lng: 116.397428, lat: 39.90923 };
              }
            } catch (err) {
              console.warn('地理编码失败，使用默认位置:', err);
              finalCenter = cachedCoords || { lng: 116.397428, lat: 39.90923 };
            }
          } else {
            // 没有API Key，使用缓存或默认位置
            finalCenter = cachedCoords || { lng: 116.397428, lat: 39.90923 };
          }
        } else {
          // 没有位置信息，使用默认位置（北京）
          finalCenter = { lng: 116.397428, lat: 39.90923 };
        }

        // 创建地图实例
        const map = new window.AMap.Map(mapContainer.current, {
          zoom: 13,
          center: [finalCenter.lng, finalCenter.lat],
          viewMode: '3D',
          mapStyle: 'amap://styles/normal',
        });

        // 添加标记
        if (markerInstance.current) {
          markerInstance.current.setMap(null);
        }
        
        const marker = new window.AMap.Marker({
          position: [finalCenter.lng, finalCenter.lat],
          title: location || '位置',
        });
        
        marker.setMap(map);
        markerInstance.current = marker;

        mapInstance.current = map;

        // 地图加载完成 - 设置超时，避免一直等待
        let loadingTimeout: NodeJS.Timeout;
        
        const onComplete = () => {
          if (mounted) {
            clearTimeout(loadingTimeout);
            setIsLoading(false);
          }
        };
        
        map.on('complete', onComplete);
        
        // 设置3秒超时，即使地图未完全加载也显示
        loadingTimeout = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn('地图加载超时，强制显示');
            setIsLoading(false);
          }
        }, 3000);

      } catch (err) {
        console.error('地图初始化失败:', err);
        if (mounted) {
          setError('地图加载失败，请检查网络连接或API配置');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
    };
  }, [location, mapCenter]);

  // 当地图中心坐标更新时，更新地图位置
  useEffect(() => {
    if (center && mapInstance.current) {
      const { lng, lat } = center;
      mapInstance.current.setCenter([lng, lat]);
      if (markerInstance.current) {
        markerInstance.current.setPosition([lng, lat]);
      }
    }
  }, [center]);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-3/4 h-full p-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 bg-[#f0f9ff]">
        {/* 地图容器 */}
        <div 
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />

        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0f9ff]/90 backdrop-blur-sm">
            <Loader2 size={48} className="mb-4 text-gray-400 animate-spin" />
            <div className="font-['Caveat'] text-2xl text-gray-500">加载地图中...</div>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0f9ff]/90 backdrop-blur-sm">
            <Map size={64} className="mb-4 text-gray-300" />
            <div className="font-['Caveat'] text-2xl text-gray-500">Map View: {location || "Select a location"}</div>
            <div className="text-sm font-sans mt-2 opacity-60 text-red-500">{error}</div>
            <div className="text-xs font-sans mt-4 opacity-60 px-4 text-center">
              提示：请配置VITE_AMAP_KEY环境变量或直接传入坐标
            </div>
          </div>
        )}

        {/* 位置标签 */}
        {!isLoading && !error && location && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="font-['Caveat'] text-xl text-gray-700">{location}</div>
          </div>
        )}

        {/* 缩放控件 */}
        {!isLoading && !error && (
          <div className="absolute bottom-8 right-4 flex flex-col gap-2">
            <button 
              onClick={() => mapInstance.current?.zoomIn()}
              className="w-10 h-10 bg-white rounded shadow-md text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              +
            </button>
            <button 
              onClick={() => mapInstance.current?.zoomOut()}
              className="w-10 h-10 bg-white rounded shadow-md text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              −
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
