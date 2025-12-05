# 高德地图 MCP 集成示例

本文档展示如何通过 AI 助手调用高德地图 MCP 工具，并将结果传递给前端地图组件。

## 工作流程

1. **用户输入地点** → 笔记中的 `location` 字段（例如："北京市天安门广场"）
2. **AI 助手调用 MCP** → 获取该地点的经纬度坐标
3. **更新笔记数据** → 将坐标存储到 `note.geoLocation`
4. **地图组件显示** → `TripMap` 组件使用坐标精确定位

## MCP 工具调用示例

### 示例 1: 地理编码（地址转坐标）

当用户输入地点时，AI 助手可以调用：

```javascript
// AI 助手调用的 MCP 工具
mcp_amap-amap-sse_maps_geo({
  address: "北京市天安门广场",
  city: "北京"
})
```

**返回结果：**
```json
{
  "status": "1",
  "count": "1",
  "info": "OK",
  "geocodes": [{
    "formatted_address": "北京市东城区天安门广场",
    "location": "116.397428,39.90923",
    "level": "广场"
  }]
}
```

**更新笔记数据：**
```typescript
// 在前端代码中更新笔记
updateNote(noteId, {
  geoLocation: {
    lng: 116.397428,
    lat: 39.90923
  }
});
```

### 示例 2: 通过 AI 助手自动获取坐标

当用户与 AI 助手对话时，可以这样操作：

**用户：** "帮我查一下北京天安门的位置"

**AI 助手：**
1. 调用 MCP 工具 `mcp_amap-amap-sse_maps_geo`
2. 获取坐标：`{ lng: 116.397428, lat: 39.90923 }`
3. 更新当前笔记的 `geoLocation` 字段

**前端代码示例：**
```typescript
// 在 AI 聊天面板或相关组件中
const handleMCPGeocodeResult = (location: string, coordinates: { lng: number, lat: number }) => {
  const currentNote = notes.find(n => n.location === location);
  if (currentNote) {
    updateNote(currentNote.id, {
      geoLocation: coordinates
    });
  }
};
```

## 完整集成示例

### 在 LeftSidePanel 或 AIChatPanel 中集成

```typescript
// 示例：在 AI 聊天面板中，当 AI 助手返回地理信息时
const handleAIResponse = async (response: string) => {
  // 解析 AI 响应，提取坐标信息
  // AI 助手可以通过 MCP 获取坐标并返回
  
  // 示例响应格式：
  // "我已经为你查询了北京天安门的位置，坐标是：116.397428, 39.90923"
  
  const coordinateMatch = response.match(/(\d+\.\d+),\s*(\d+\.\d+)/);
  if (coordinateMatch && focusedNoteId) {
    const [, lng, lat] = coordinateMatch;
    updateNote(focusedNoteId, {
      geoLocation: {
        lng: parseFloat(lng),
        lat: parseFloat(lat)
      }
    });
  }
};
```

### 在 TripMap 组件中使用坐标

```typescript
// TripMap 组件已经支持接收 center prop
<TripMap 
  location={note.location}  // 地址字符串
  center={note.geoLocation} // 通过 MCP 获取的坐标（可选）
/>
```

如果提供了 `center` prop，地图会：
1. 直接使用该坐标定位，无需再次地理编码
2. 提高加载速度
3. 保证定位精度

## 其他有用的 MCP 工具

### 周边搜索

```typescript
// 搜索附近的餐厅
mcp_amap-amap-sse_maps_around_search({
  keywords: "餐厅",
  location: "116.397428,39.90923",
  radius: "1000"  // 1公里范围内
})
```

### 路径规划

```typescript
// 步行路径
mcp_amap-amap-sse_maps_direction_walking({
  origin: "116.397428,39.90923",
  destination: "116.407526,39.90403"
})

// 驾车路径
mcp_amap-amap-sse_maps_direction_driving({
  origin: "116.397428,39.90923",
  destination: "116.407526,39.90403"
})
```

### 天气查询

```typescript
// 查询城市天气
mcp_amap-amap-sse_maps_weather({
  city: "北京"
})
```

## 最佳实践

1. **缓存坐标**：一旦通过 MCP 获取了坐标，将其存储在 `note.geoLocation` 中，避免重复调用
2. **错误处理**：如果 MCP 调用失败，地图组件会回退到使用地址字符串进行地理编码
3. **用户体验**：在加载坐标时显示加载状态，坐标获取成功后自动更新地图

## 相关文件

- `components/TripMap.tsx` - 地图组件，支持接收坐标
- `types.ts` - Note 类型定义，包含 `geoLocation` 字段
- `services/amapService.ts` - 地图服务，包含 MCP 使用说明
- `docs/AMAP_MCP_USAGE.md` - 详细的 MCP 使用文档

