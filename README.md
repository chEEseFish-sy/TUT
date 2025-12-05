<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1WkBVf0WPB6VUK--fZP5hvacdvRMzLv_c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. 高德地图 API Key 已配置在 `.env.local` 文件中
3. Run the app:
   `npm run dev`
4. **重要**：如果修改了环境变量，需要重启开发服务器

## 高德地图功能

本项目已集成高德地图显示功能，支持：

- ✅ 直接使用高德地图 API 进行地理编码
- ✅ 在地图上显示位置标记
- ✅ 自动将地址转换为坐标
- ✅ 快速加载和显示地图

详细配置说明请参考：
- [API 配置说明](docs/API配置说明.md)
