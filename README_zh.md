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

| 核心功能 | 高级功能 |
|----------|----------|
| ✨ **双主题** - 深浅色模式，支持系统偏好检测 | 📑 **自动目录** - 带滚动监听的目录导航 |
| 📱 **移动优先** - 针对所有屏幕尺寸优化 | 🧭 **智能导航** - 文章导航，带主页回退 |
| 🎨 **玻璃效果** - 现代 UI，优雅动画 | 🌍 **32 种语言** - 完整国际化支持 |
| 💻 **代码块** - 语法高亮 + 一键复制 | 🚀 **高性能** - 资源优化 & 延迟加载 |

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

## 截图

### 目录导航

> 使用 `#no-toc` 内部标签可禁用单篇文章的目录。

<details>
<summary>查看截图</summary>
<p align="center">
<img src="screenshots/desktop-toc.png" alt="桌面端目录" width="700">
</p>
<p align="center">
<img src="screenshots/mobile-toc.png" alt="移动端目录" width="350">
</p>
</details>

### 移动端 & 代码块

<details>
<summary>查看截图</summary>
<p align="center">
<img src="screenshots/iphone.png" alt="移动端视图" width="400">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/code-block.png" alt="代码块" width="450">
</p>
</details>

### 导航 & 404 页面

<details>
<summary>查看截图</summary>
<p align="center">
<img src="screenshots/post-navigation.png" alt="文章导航" width="450">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/404-Page.png" alt="404 页面" width="450">
</p>
</details>

### 液态玻璃风格按钮

<details>
<summary>查看截图</summary>
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

---

## 许可证

MIT（继承自 [Attila](https://github.com/zutrinken/attila)）。见 [LICENSE](LICENSE)。
