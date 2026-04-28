---
title: "用 GitHub Actions 自动部署到 GitHub Pages"
description: "梳理从 main 分支推送到 GitHub Pages 自动发布的流程。"
pubDate: "2026-04-27"
tags: ["GitHub Pages", "CI/CD", "部署"]
---

这个博客通过 GitHub Actions 自动构建并部署到 GitHub Pages。每次把代码推送到 `main` 分支后，工作流会安装依赖、构建 Astro 站点，并把静态产物发布到 Pages。

## 部署流程

项目中的 `.github/workflows/deploy.yml` 定义了部署流程：

1. 检出仓库代码。
2. 使用 Astro 官方 GitHub Action 安装依赖并构建站点。
3. 使用 GitHub Pages 官方部署 Action 发布构建产物。

## 仓库设置

仓库名是 `1441302031.github.io`，因此访问地址可以直接使用：

```txt
https://1441302031.github.io
```

如果 GitHub Pages 页面还没有启用，需要在仓库设置里把 Pages 的 Source 选择为 GitHub Actions。完成后，后续推送到 `main` 就会自动发布。
