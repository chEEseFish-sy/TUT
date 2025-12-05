# 高德地图 MCP 使用说明

## 概述

本项目已集成高德地图显示功能，支持通过高德地图 MCP 工具获取地理信息并在地图上显示。

## 使用方式

### 方式一：通过 AI 助手调用 MCP 工具

高德地图 MCP 工具可以在 AI 助手端直接调用。当用户询问某个地点时，AI 助手可以：

1. **调用地理编码工具** (`mcp_amap-amap-sse_maps_geo`)
   - 将地址转换为经纬度坐标
   - 示例：询问"北京天安门在哪里"，AI 助手调用 MCP 工具获取坐标

2. **调用逆地理编码工具** (`mcp_amap-amap-sse_maps_regeocode`)
   - 将经纬度转换为地址信息

3. **调用路径规划工具**
   - 步行路径：`mcp_amap-amap-sse_maps_direction_walking`
   - 驾车路径：`mcp_amap-amap-sse_maps_direction_driving`
   - 公交路径：`mcp_amap-amap-sse_maps_direction_transit_integrated`

### 方式二：在前端直接使用高德地图 Web API

如果需要在前端直接使用，可以配置高德地图 API Key：

1. 创建 `.env.local` 文件
2. 添加配置：
   ```
   VITE_AMAP_KEY=你的高德地图API_Key
   ```
3. 重启开发服务器

## 地图组件使用

`TripMap` 组件支持两种方式传入位置信息：

### 方式一：传入地址字符串（自动地理编码）

```tsx
<TripMap location="北京市天安门广场" />
```

组件会自动尝试进行地理编码（如果有 API Key），或显示默认位置。

### 方式二：传入坐标（通过 MCP 获取）

```tsx
// 如果已经通过 MCP 获取了坐标
<TripMap 
  location="北京市天安门广场" 
  center={{ lng: 116.397428, lat: 39.90923 }}
/>
```

## MCP 工具调用示例

### 地理编码示例

当用户输入地址时，AI 助手可以调用：

```
mcp_amap-amap-sse_maps_geo({
  address: "北京市天安门广场",
  city: "北京"
})
```

返回结果示例：
```json
{
  "geocodes": [{
    "location": "116.397428,39.90923",
    "formatted_address": "北京市东城区天安门广场"
  }]
}
```

然后可以将坐标传递给 `TripMap` 组件：

```tsx
const coordinates = { lng: 116.397428, lat: 39.90923 };
<TripMap location="北京市天安门广场" center={coordinates} />
```

### 周边搜索示例

```tsx
mcp_amap-amap-sse_maps_around_search({
  keywords: "餐厅",
  location: "116.397428,39.90923",
  radius: "1000"
})
```

### 路径规划示例

```tsx
mcp_amap-amap-sse_maps_direction_walking({
  origin: "116.397428,39.90923",
  destination: "116.407526,39.90403"
})
```

## 实现流程

1. **用户输入地点** → 笔记中的 location 字段
2. **点击地图图标** → 触发显示地图界面
3. **AI 助手（可选）** → 调用 MCP 工具获取详细地理信息
4. **地图组件** → 显示地图并标注位置

## 注意事项

1. 如果没有配置 API Key，地图会显示默认位置（北京天安门）
2. MCP 工具需要在 AI 助手端调用，不能直接在前端代码中使用
3. 如果已通过 MCP 获取坐标，建议直接传入 `center` prop 以提高性能
4. 地图脚本是动态加载的，首次加载可能需要一些时间

## 相关文件

- `components/TripMap.tsx` - 地图组件
- `services/amapService.ts` - 地图服务（包含 MCP 使用说明）

