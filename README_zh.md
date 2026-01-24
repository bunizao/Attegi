<div align="center">

# Attegi

[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://attegi.tutuis.me)

一款现代、优雅的 Ghost 主题，专注于清晰排版、移动端可读性和对 [Ghost](https://ghost.org) 的深度支持。

**[查看在线演示 →](https://attegi.tutuis.me)**

[English](README.md)

<img src="screenshots/homepage-dark.png" alt="Attegi 主题预览" width="700">

</div>

---

## 特性

### 核心功能

- **双主题系统** - 明暗模式，支持系统自动检测
- **移动优先设计** - 完全响应式，原生 WebKit 平滑滚动
- **现代图片支持** - AVIF/WebP 格式自动转换
- **代码语法高亮** - 精美代码块，一键复制
- **自动目录生成** - 智能导航，带滚动监听
- **32 种语言** - 完整国际化支持

### 内容功能

- **诗歌卡片** - 优雅的诗歌展示，支持 Markdown 语法
- **标签页面模板** - 浏览所有标签的自定义页面，显示文章数
- **友链页面模板** - 友情链接展示，带莫比乌斯符号动画
- **增强脚注** - 改进的导航和样式
- **非 AI 创作徽章** - 人工创作内容的可选透明度徽章
- **竖版图片检测** - 自动布局优化

### 性能与体验

- **快速加载** - 资源优化，延迟加载
- **玻璃拟态 UI** - 现代设计，优雅动画
- **智能导航** - 文章导航，智能回退
- **移动端增强** - 自动隐藏面板，触摸优化交互
- **自定义 OG 图片** - 可选 Open Graph 图片服务集成

---

## 性能表现

Attegi 在 [Google PageSpeed Insights](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/jhk5dugrrn) 获得优秀评分：

| 指标 | 移动端 | 桌面端 |
|------|--------|--------|
| 性能 | 97 | 97 |
| 无障碍 | 96 | **100** |
| 最佳实践 | **100** | **100** |
| SEO | **100** | **100** |

---

## 功能详情

### 诗歌卡片

> 精美展示诗歌，支持 Markdown 自动解析或自定义 HTML

```markdown
> [!poem] 未选择的路
> 黄色的树林里分出两条路，
> 可惜我不能同时去涉足，
> 我在那路口久久伫立，
>
> — 罗伯特·弗罗斯特
```

**功能特性：**
- 支持 Markdown 语法，使用 `[!poem]` 触发
- 自动适配明暗主题
- 完全响应式设计
- 支持居中布局和纯文本样式
- 优雅的悬停效果

**[查看教程 →](https://attegi.tutuis.me/poem-card-tutorial/)**

### 现代图片支持

> 新一代图片格式，自动转换

- AVIF & WebP 自动格式检测
- 完全可配置
- 延迟加载
- 增强移动端触摸交互
- 使用 GLightbox 的灯箱画廊

### 目录导航

> 智能导航，带滚动监听

- 从文章标题自动生成（H2-H6）
- 滚动监听，高亮当前章节
- 桌面端：固定侧边栏，移动端：可折叠抽屉
- 使用 `#no-toc` 内部标签可禁用单篇文章的目录

<details>
<summary>查看截图</summary>

<p align="center">
<img src="screenshots/desktop-toc.png" alt="桌面端目录" width="700">
</p>
<p align="center">
<img src="screenshots/mobile-toc.png" alt="移动端目录" width="350">
</p>
</details>

### 标签页面模板

> 精美的玻璃拟态设计，浏览所有标签和文章预览

- 可滚动的标签列表自定义页面模板
- 玻璃效果卡片，优雅动画
- 显示每个标签的文章数量
- 完全响应式设计

**设置方法：** 在 Ghost 后台 → 页面中创建新页面，将 slug 设置为 `tags`。

**[查看演示 →](https://attegi.tutuis.me/tags/)**

### 友链页面模板

> 展示友情链接，带莫比乌斯无限符号动画

- 自定义页面模板，优雅的动画标题
- 支持 Ghost 原生书签卡片
- 自定义 HTML 链接卡片，丰富元数据
- 精美网格布局，悬停效果

**设置方法：** 在 Ghost 后台 → 页面中创建新页面，将 slug 设置为 `links`。

### 代码块与移动端设计

> 语法高亮，一键复制

- 通过 highlight.js 实现语法高亮
- 代码片段复制按钮
- 语言检测和显示
- 优化的移动端查看体验

<details>
<summary>查看截图</summary>

<p align="center">
<img src="screenshots/iphone.png" alt="移动端视图" width="400">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/code-block.png" alt="代码块" width="450">
</p>
</details>

### 非 AI 创作徽章

> 为非 AI 创作的文章提供可选徽章

- 使用内部标签 `#not-by-ai` 为单篇文章启用
- 可配置徽章链接
- 无缝集成到文章布局中

### 其他增强功能

- **脚注导航** - 增强样式和平滑滚动
- **Open Graph 图片** - 可选的自定义 OG 图片服务支持
- **竖版图片检测** - 自动优化竖版图片布局
- **自动隐藏面板** - 移动端浮动面板在交互时自动隐藏
- **玻璃按钮** - 优雅的液态玻璃效果按钮

<details>
<summary>查看玻璃按钮示例</summary>

<p align="center">
<img src="screenshots/liquid-glass-button.png" alt="玻璃按钮" width="500">
</p>
</details>

---

## 快速开始

1. 从 [GitHub Releases](https://github.com/bunizao/Attegi/releases) 下载
2. Ghost 后台 → 设置 → 设计 → 上传主题
3. 激活 Attegi

---

## 自定义

| 设置 | 位置 |
|------|------|
| 强调色 | Ghost 后台 → 设计与品牌 |
| 隐藏元素 | 代码注入（见下方） |
| 样式/脚本 | 编辑 `src/sass` 或 `src/js`，然后重新构建 |

<details>
<summary><strong>通过代码注入隐藏元素</strong></summary>

```html
<style>
section.post-comments,
.post-share,
.nav-footer ul,
span.nav-credits,
span.nav-copy { display: none !important; }
</style>
```

</details>

---

## 开发

<details>
<summary><strong>前置要求</strong></summary>

- Node.js 16+ 和 npm/yarn
- Docker（可选）
- Git

</details>

<details>
<summary><strong>使用 Docker 本地开发</strong></summary>

```bash
docker-compose up -d
# 访问 http://localhost:2368/ghost
# 在 设置 → 设计 中激活主题
```

</details>

<details>
<summary><strong>构建命令</strong></summary>

```bash
yarn dev        # 监听模式
yarn build      # 生产构建
yarn compress   # 创建 zip
npx gscan .     # 验证主题
```

</details>

<details>
<summary><strong>项目结构</strong></summary>

```text
Attegi/
├── assets/        # 编译产物（勿直接编辑）
├── locales/       # 32 种语言文件
├── partials/      # 模板组件
├── src/
│   ├── sass/      # 源样式
│   └── js/        # 源脚本
├── *.hbs          # 模板
└── package.json
```

</details>

---

## 支持

- **文档**：[Ghost 主题文档](https://ghost.org/docs/themes/)
- **问题**：[GitHub Issues](https://github.com/bunizao/Attegi/issues)
- **讨论**：[GitHub Discussions](https://github.com/bunizao/Attegi/discussions)
- **付费支持与定制**：可提供付费技术支持与主题定制，请向我发送[**邮件**](mailto:me@tutuis.me)沟通需求。

---

## 许可证

MIT（继承自 [Attila](https://github.com/zutrinken/attila)）。见 [LICENSE](LICENSE)。
