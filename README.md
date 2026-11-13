# Atlas · AI 影像灵感库

公开网站：https://biletian.github.io/ai-visual-atlas/

原生 HTML / CSS / JavaScript，无构建依赖。当前公开资料为 85 条：72 个作者声明 GPT Image 2.6 的 CC BY 4.0 GIF 案例，以及 13 条经原帖核查的 X 案例。多模型对比和工作流明确分别标注，不把推荐模型当原始模型。

## 运行与检查

```sh
python -m http.server 8080 --directory dist
node --check dist/app.js
node --check dist/ui.js
```

直接在浏览器打开本机 8080 端口。上线由 `.github/workflows/pages.yml`（具体文件名以目录为准）的 GitHub Pages workflow 在 main 更新后执行。

## 交互

- JS 最短列瀑布流，图片先锁定比例；增量加载，不重建已有媒体。
- 搜索、单选主题、模型导航、收藏和提示词过滤。
- 桌面窄信息栏＋大媒体详情，手机上图下文；深链、前后作品、返回位置恢复。
- 本站 GIF 转 MP4 并提取 WebP 封面，近视口预载、可见媒体有限并发播放，切后台暂停，尊重 reduced-motion 和 save-data。
- X 原作使用官方嵌入。详情始终提供原帖入口，加载失败可重试。

## 数据与许可

编辑 `dist/cases.json` 后运行 `python scripts/sync-data.py` 更新 data.js。保留作者、真实模型、来源、核验时间与素材许可。只有核验后设 `publish_ready: true`。

CC BY 4.0 媒体保留署名、来源、许可及转码说明。原始 GIF 继续保留；转码不改变作品内容。X 作品与提示词没有自动获得转载授权，仅官方嵌入、链接或允许的摘录。未公开的提示词不臆造。

作者 ailingqu 的头像来自其 GitHub；没有确认头像的作者使用首字母占位。图标许可见 LUCIDE-LICENSE。历史 HeroUI 集成许可保留于 HEROUI-LICENSE；本版布局为项目自身原生实现。

收藏仅保存在当前浏览器，不上传；第三方媒体请求可能受网络限制。没有追踪脚本或 API 密钥。
