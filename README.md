# Visual Atlas · AI 影像灵感库

可扩展的图像 / 视频生成案例索引。原生 HTML、CSS、JavaScript，无构建依赖。

## 当前资料状态
资料包含 18 条来源线索。当前已核实的原帖通过 X 官方嵌入显示图片/动图/视频；未核实项不展示到前台。提示词为短摘录或作者原帖链接，不臆造缺失内容。

## 运行
用任意静态服务器托管 `dist/`，例如 `python -m http.server 8080 --directory dist`。

## 功能
模型 / 媒介 / 场景筛选、全文检索、提示词过滤、详情弹窗、复制提示词、浏览器本地收藏、响应式布局。

## 添加案例
编辑 `dist/cases.json` 后运行 `python scripts/sync-data.py`。字段保留作者、模型、原帖、核验状态、提示词状态、素材授权。视频案例使用 `type: "video"`，GIF 归为图像。只有核实后才设 `publish_ready: true`。图片必须同时具备 `image_url` 和 `media_authorized: true` 才展示。默认仅链接原帖，不搬运作者作品。

## 权利与隐私
作品和提示词归原作者；本库不授予第三方作品使用权。收藏仅保存在当前浏览器，不上传。网页可加载 Google Fonts；不配置统计脚本，不使用 API 密钥。

## 公网访问
GitHub Pages: https://biletian.github.io/ai-visual-atlas/ 。无需 GitHub 或 ChatGPT 账户。

## UI 与媒体实现
已实际调用官方 `@heroui/react-mcp@1.1.4` 的 `list_components`、`get_theme_variables`、`get_component_docs`、`get_component_source_styles`。本项目采用 MCP 文档允许的 CSS-only 路径，集成 `@heroui/styles@3.2.7` Card、Button、Chip 样式；原生控件和 dialog 保留键盘行为。第三方授权文件见 HEROUI-LICENSE。
已核实案例以 X 官方 widgets 嵌入显示媒体，未核实线索保留在数据中、不显示为完成案例。原帖内容属于作者，本站不承诺生成结果或商用权限。第三方 X 嵌入会向 X 请求资源（dnt=true），可能受地区网络限制。
