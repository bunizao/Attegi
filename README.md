# Attila-Opt
### Here is a Ghost theme optimized for mobile devices based on [*Attila*](https://github.com/zutrinken/attila), with a style inspired by [*Moegi*](https://github.com/moegi-design/ghost-theme-Moegi).

---

## Features
 - **Smaller** font size than Attila's, allowing more content to be displayed on mobile devices.
 - **Slimmer** and **cleaner** design than Attila's, with a focus on readability with a more modern font family.
 - **Dark Mode** support and a more comfortable background and font color.
 - *( Optional )* Hide unnecessary page elements to simplify the pages. (e.g. `.post-comments`、.`nav-credits` or `.nav-copy` etc.)
 - And we also support all functions of Attila, see its original [README.md](https://github.com/zutrinken/attila/blob/main/README.md) for more details.
  
---

## Demo
You can see the demo at **https://attila-opt.tutuis.me**.

---

## Installation
1. Download the theme directly from the [link](https://github.com/bunizao/attila-opt/archive/refs/heads/master.zip), it will automatically download the latest theme under the master branch.
2. Upload the ZIP file to your Ghost Admin Portal.
---
## Customization
All the following operations should be performed in the **Ghost Admin Portal** -> **Advanced** -> **Code Injection**.
### Hide something

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

- **Explanation:**

| Selector               | Scope  | Description                                                                       |
|------------------------|--------|-----------------------------------------------------------------------------------|
| `section.post-comments`| Post   | Hide the comment section.                                                         |
| `post-share`           | Post   | Hide the post sharing options.                                                    |
| `nav-footer ul`        | Global | Hide the `Sign up` button in the footer.                                          |
| `span.nav-credits`     | Global | Hide the credits including `Published with Ghost`, `Theme Attila-Opt`, and the theme change button in the footer. |
| `span.nav-copy`        | Global | Hide the copyright information and social media links in the footer.              |

### Change something
- `Accent color` can be changed in `Site` —> `Design & Branding` —> `Brand` _> `Accent color`.
  - you can also select another color for dark mode.
- `Code Injection` can almost change anything, if you are familiar with CSS.

---

## License
Since this theme is a modification of [*Attila*](https://github.com/zutrinken/attila) and [*Moegi*](https://github.com/moegi-design/ghost-theme-Moegi), the license of this theme is also based on the MIT License of Attila.