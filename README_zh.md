# Attila-Opt
### 这是一个针对移动设备优化的 Ghost 主题，基于 [*Attila*](https://github.com/zutrinken/attila)，风格灵感来源于 [*Moegi*](https://github.com/moegi-design/ghost-theme-Moegi)。

---

## 功能
 - 字体大小比 Attila 更小，可以在移动设备上显示更多内容。
 - 比 Attila 更纤细、简洁的设计，注重可读性，采用更现代的字体系列。
 - 支持 **深色模式**，提供更舒适的背景和字体颜色。
 - **（可选）** 隐藏不必要的页面元素以简化页面（例如：`.post-comments`、`.nav-credits` 或 `.nav-copy` 等）。
 - 并且支持 Attila 的所有功能，详情请参阅原始 [README.md](https://github.com/zutrinken/attila/blob/main/README.md)。

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