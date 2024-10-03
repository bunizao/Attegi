# Attila-Opt
### 这是一个基于 [*Attila*](https://github.com/zutrinken/attila) 并参考了 [*Moegi*](https://github.com/moegi-design/ghost-theme-Moegi) 风格的移动设备优化 Ghost 主题。

### [**English Doc**](https://github.com/bunizao/attila-opt/blob/master/README.md)

---

## 特点
- 比原版 Attila 字体更小，可以在移动设备上显示更多内容。
  - 不同屏幕尺寸自适应字体大小。
- 比原版 Attila 更加精简和整洁，注重可读性并采用更现代的字体。
- 支持**暗黑模式**，并提供更舒适的背景和字体颜色。
- 更改了**图片描述**的样式。（可能还修复了一个错误）
- *(可选)* 隐藏不必要的页面元素以简化页面显示。（例如：`.post-comments`、`.nav-credits` 或 `.nav-copy` 等）
- 此外，主题还支持 Attila 的所有功能，详细信息请参见其原始 [README.md](https://github.com/zutrinken/attila/blob/main/README.md)。

---

## 示例
你可以在 **https://attila-opt.tutuis.me** 查看示例。

---

## 安装
1. 直接从[链接](https://github.com/bunizao/attila-opt/archive/refs/heads/master.zip)下载主题，将自动下载 master 分支下的最新主题。
2. 将 ZIP 文件上传到你的 Ghost 管理后台。
---

## 自定义
以下所有操作都应在 **Ghost 管理后台** -> **高级** -> **代码注入** 中进行。

### 隐藏某些元素

```
<style>
section.post-comments, 
post-share,
.nav-footer ul,
span.nav-credits, 
span.nav-copy {
    display: none !important;
}
</style>
```
- **解释：**

| 选择器                 | 范围  | 描述                                                                           |
|------------------------|--------|---------------------------------------------------------------------------------|
| `section.post-comments`| 文章   | 隐藏评论部分。                                                                  |
| `post-share`           | 文章   | 隐藏文章分享选项。                                                              |
| `nav-footer ul`        | 全局   | 隐藏页脚中的 `注册` 按钮。                                                      |
| `span.nav-credits`     | 全局   | 隐藏页脚中的版权信息，包括 `Published with Ghost`、`Theme Attila-Opt` 及主题切换按钮。|
| `span.nav-copy`        | 全局   | 隐藏页脚中的版权信息和社交媒体链接。                                            |

### 修改某些元素
- 可以在 `站点` —> `设计与品牌` —> `品牌` _> `强调色` 中更改 `强调色`。
  - 你还可以为深色模式选择其他颜色。
- 如果熟悉 CSS，可以通过 `代码注入` 几乎更改任何内容。

---

## 许可证
由于此主题是对 [*Attila*](https://github.com/zutrinken/attila) 和 [*Moegi*](https://github.com/moegi-design/ghost-theme-Moegi) 的修改，因此该主题的许可证基于 Attila 的 MIT 许可证。