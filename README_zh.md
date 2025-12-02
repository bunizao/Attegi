# Attegi
[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://Attegi.tutuis.me)

一款现代、优雅的 Ghost 主题，专注于清晰的排版、移动端可读性和流畅的深浅色模式切换。基于 [Attila](https://github.com/zutrinken/attila) 构建，并进行了大量增强以提升用户体验和性能。

**[查看在线演示 →](https://attegi.tutuis.me)**

[English](README.md)

---

## 核心特性

- ✨ **双主题支持** - 精心打磨的深浅色模式，支持系统偏好检测
- 📱 **移动端优化** - 响应式设计，针对所有设备优化字体和间距
- 🎨 **液态玻璃效果** - 现代 UI，优雅的悬停动画和玻璃拟态
- 💻 **增强代码块** - 语法高亮，带语言标签和一键复制功能
- 🧭 **智能导航** - 智能文章导航，带主页回退功能
- 🎯 **SEO 优化** - 清晰的标记、结构化数据和出色的性能评分
- 🌍 **国际化就绪** - 包含 32 种语言翻译
- ♿ **无障碍访问** - 符合 WCAG 标准，具有适当的 ARIA 标签和键盘导航
- 🚀 **快速性能** - 优化的资源和延迟加载，实现快速页面加载

## 特性与截图

### 深色模式与优雅悬停
重新设计并创建了主页，添加了优雅的动画和悬停效果，以及全新的标签系统。
![主页深色模式](screenshots/homepage-dark.png)

### 移动端友好
更紧凑的字体、间距和卡片布局，在手机上保持清晰易读。
![移动端友好](screenshots/iphone.png)

### 带语法高亮的代码块
精美的代码块样式，带语言标签和一键复制功能。

![代码块](screenshots/code-block.png)

### 智能文章导航
优雅的文章导航，在第一篇或最后一篇文章时提供主页回退。

![文章导航](screenshots/post-navigation.png)

### 优雅的 404 页面
创意 404 错误页面，带动画太空主题和文章推荐。
![优雅的 404 页面](screenshots/404-Page.png)

### 液态玻璃质感按钮
交互元素上的现代玻璃拟态效果，带来高级感。
![液态玻璃质感按钮](screenshots/liquid-glass-button.png)

### 卓越性能

Attegi 在 Google PageSpeed Insights 的移动端和桌面端都获得了高分，确保快速加载和流畅的用户体验。

**[查看 PageSpeed 报告 →](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/hzaz7busnt)**

---

## 快速开始

1. **下载** 最新版本：[GitHub Releases](https://github.com/bunizao/Attegi/releases)
2. **上传** 在 Ghost 后台 → 设置 → 设计 → 上传主题
3. **激活** Attegi 主题

本地开发请见下方 **开发** 部分。

---

## 自定义
- **强调色**：Ghost 后台 → 设计与品牌 → 强调色（可单独设置深色模式强调色）。
- **隐藏区块**（代码注入）：
```html
<style>
section.post-comments,
.post-share,
.nav-footer ul,
span.nav-credits,
span.nav-copy { display: none !important; }
</style>
```
- **修改样式/脚本**：只改 `src/sass`、`src/js`，再构建；不要直接改 `assets/`。

---

## 演示

**[查看在线演示 →](https://attegi.tutuis.me)**

---

## 开发

### 前置要求

- Node.js 16+ 和 npm
- Docker（可选，用于本地 Ghost 实例）
- Git

### 设置

**1. 克隆和安装**

```bash
git clone https://github.com/bunizao/Attegi.git
cd Attegi
npm install
```

**2. 开发工作流**

选择以下方法之一：

#### 方案 A：使用 Docker 的本地 Ghost（推荐）

```bash
# 启动挂载主题的 Ghost
docker-compose up -d

# 访问 Ghost 管理后台 http://localhost:2368/ghost
# 在 设置 → 设计 中激活 Attegi 主题
```

#### 方案 B：上传到现有 Ghost 实例

```bash
# 构建并打包主题
npx grunt build && npx grunt compress

# 通过 Ghost 管理后台 → 设计 → 上传主题 上传 dist/attegi.zip
```

**3. 实时开发**

监听更改并自动重新构建资源：

```bash
npx grunt watch
```

这会监听 `src/sass` 和 `src/js`，并在保存时编译到 `assets/`。

**4. 生产构建**

```bash
# 清理构建
npx grunt build

# 创建分发包
npx grunt compress

# 输出：dist/attegi.zip
```

**5. 主题验证**

```bash
# 验证主题兼容性
npx gscan .

# 提交前检查错误
```

### 项目结构

```
Attegi/
├── assets/           # 编译后的 CSS/JS（不要直接编辑）
├── locales/          # i18n 翻译文件（32 种语言）
├── partials/         # 可复用的模板组件
├── src/
│   ├── sass/        # 源 SCSS 文件
│   └── js/          # 源 JavaScript 文件
├── *.hbs            # Handlebars 模板
├── package.json     # 主题元数据和依赖
└── Gruntfile.js     # 构建配置
```

### 进行修改

- **样式**：编辑 `src/sass/` 中的文件，运行 `npx grunt` 编译
- **脚本**：编辑 `src/js/` 中的文件，运行 `npx grunt` 编译
- **模板**：直接编辑 `.hbs` 文件
- **翻译**：编辑 `locales/` 中的文件

### 提示

- 开发时使用 `npx grunt watch` 进行自动编译
- 在深浅色模式下都要测试
- 验证移动端响应性
- 提交更改前运行 `npx gscan .`
- 检查浏览器控制台是否有 JavaScript 错误

---

## 支持

需要 Attegi 的帮助？以下是获取支持的方式：

- **文档**：查看本 README 和 [Ghost 主题文档](https://ghost.org/docs/themes/)
- **问题反馈**：在 [GitHub Issues](https://github.com/bunizao/Attegi/issues) 报告错误或请求功能
- **问题讨论**：在 [GitHub Discussions](https://github.com/bunizao/Attegi/discussions) 提问
- **联系方式**：通过邮件联系 [me@tutuis.me](mailto:me@tutuis.me)

提交问题前，请：
1. 检查现有问题以避免重复
2. 包含您的 Ghost 版本和主题版本
3. 提供重现错误的步骤
4. 如适用，分享相关截图

---

## 许可证

MIT（继承自 `Attila`）。见 `LICENSE`。
