# 1441302031 的个人博客

这是一个使用 Astro、TypeScript 和 Markdown 内容集合搭建的个人博客项目，目标部署地址是：

https://1441302031.github.io

## 本地启动

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认会在终端输出本地访问地址，通常是 `http://localhost:4321`。

## 写文章

文章放在 `src/content/blog` 目录下，使用 Markdown 编写。新建一个 `.md` 文件，并在顶部添加 frontmatter：

```md
---
title: "文章标题"
description: "文章摘要"
pubDate: "2026-04-28"
tags: ["Astro", "博客"]
---

这里开始写正文。
```

文件名会成为文章路径。例如：

- `src/content/blog/hello-astro.md`
- 访问路径：`/blog/hello-astro/`

如果暂时不想发布某篇文章，可以添加：

```md
draft: true
```

## 检查与构建

运行类型和内容检查：

```bash
npm run check
```

构建静态站点：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 部署方式

项目已配置 GitHub Actions：`.github/workflows/deploy.yml`。

当代码推送到 `main` 分支后，GitHub Actions 会自动安装依赖、构建 Astro 项目，并部署到 GitHub Pages。

首次使用时，请在 GitHub 仓库页面进入：

`Settings` -> `Pages` -> `Build and deployment` -> `Source`

然后选择 `GitHub Actions`。

仓库名为 `1441302031.github.io` 时，不需要配置 Astro 的 `base`，最终访问地址是：

https://1441302031.github.io
