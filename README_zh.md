<div align="center">

# Attegi

[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://attegi.tutuis.me)

一款现代、优雅的 Ghost 主题，专注于清晰排版、移动端可读性和流畅的深浅色模式切换。

**[查看在线演示 →](https://attegi.tutuis.me)**

[English](README.md)

<img src="screenshots/homepage-dark.png" alt="Attegi 主题预览" width="700">

</div>

---

## 特性

<table>
<tr>
<td width="50%">

### 核心功能

- ✨ **双主题** - 深浅色模式，支持系统偏好检测
- 📱 **移动优先** - 针对所有屏幕尺寸优化
- 🎨 **玻璃效果** - 现代 UI，优雅动画
- 💻 **代码块** - 语法高亮 + 一键复制

</td>
<td width="50%">

### 高级功能

- 📑 **自动目录** - 带滚动监听的目录导航
- 🧭 **智能导航** - 文章导航，带主页回退
- 🌍 **32 种语言** - 完整国际化支持
- 🚀 **高性能** - 资源优化 & 延迟加载

</td>
</tr>
</table>

---

## 截图

<table>
<tr>
<td width="50%" align="center">
<strong>移动端优化</strong><br><br>
<img src="screenshots/iphone.png" alt="移动端视图" width="280">
</td>
<td width="50%" align="center">
<strong>代码块</strong><br><br>
<img src="screenshots/code-block.png" alt="代码块" width="400">
</td>
</tr>
<tr>
<td width="50%" align="center">
<strong>文章导航</strong><br><br>
<img src="screenshots/post-navigation.png" alt="文章导航" width="400">
</td>
<td width="50%" align="center">
<strong>404 页面</strong><br><br>
<img src="screenshots/404-Page.png" alt="404 页面" width="400">
</td>
</tr>
<tr>
<td colspan="2" align="center">
<strong>玻璃按钮</strong><br><br>
<img src="screenshots/liquid-glass-button.png" alt="玻璃按钮" width="500">
</td>
</tr>
</table>

### 目录导航

长文章自动生成目录：
- 桌面端：固定侧边栏，带滚动监听
- 移动端：浮动面板，带阅读进度
- 单篇禁用：添加 `#no-toc` 标签

### 性能表现

在 [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/hzaz7busnt) 移动端和桌面端均获得优秀评分。

---

## 快速开始

```bash
# 1. 从 GitHub Releases 下载
# 2. Ghost 后台 → 设置 → 设计 → 上传主题
# 3. 激活 Attegi
```

或从源码构建：

```bash
git clone https://github.com/bunizao/Attegi.git
cd Attegi && yarn install
yarn build && yarn compress
# 上传 dist/attegi.zip
```

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

```
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
- **邮箱**：[me@tutuis.me](mailto:me@tutuis.me)

---

## 许可证

MIT（继承自 [Attila](https://github.com/zutrinken/attila)）。见 [LICENSE](LICENSE)。
