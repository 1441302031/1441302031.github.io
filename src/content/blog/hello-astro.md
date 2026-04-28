---
title: "从 Astro 开始搭建个人博客"
description: "记录这个博客的初始结构、页面规划和 Markdown 内容系统。"
pubDate: "2026-04-28"
tags: ["Astro", "博客", "Markdown"]
column: "ai-workflow"
columnName: "AI Workflow"
---

这是博客的第一篇示例文章。它来自 `src/content/blog` 目录，并通过 Astro 的内容集合读取、校验和渲染。

## 为什么选择 Astro

Astro 很适合个人博客这类以内容为中心的静态站点。页面默认输出静态 HTML，访问速度快，部署到 GitHub Pages 也足够直接。

这个项目当前包含：

- 首页
- 文章列表页
- 文章详情页
- 关于页
- 404 页面

## 写作方式

以后新增文章时，只需要在 `src/content/blog` 下创建 Markdown 文件，并补充 frontmatter：

```md
---
title: "文章标题"
description: "文章摘要"
pubDate: "2026-04-28"
tags: ["标签"]
---
```

文件名会成为文章访问路径的一部分，例如 `hello-astro.md` 对应 `/blog/hello-astro/`。
