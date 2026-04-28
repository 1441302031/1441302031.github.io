---
title: "Unity 各个平台的纹理压缩详解"
description: "从显存、包体、GPU 原生支持和画质取舍出发，整理 Unity 在桌面、移动端、WebGL 等平台的纹理压缩选择。"
pubDate: "2026-05-03"
updatedDate: "2026-05-03"
tags: ["Unity", "纹理压缩", "资源优化", "平台适配"]
column: "unity-engine"
columnName: "Unity / 团结引擎"
cover: "/images/unity-texture-compression-map.svg"
---

纹理压缩是 Unity 项目里最容易被低估的资源优化项。它同时影响包体、显存、加载耗时、GPU 采样带宽和最终画质。

很多纹理问题看起来像“美术图不清楚”或“移动端画面脏”，实际原因可能是导入设置、平台覆盖格式、Mipmap、Alpha 处理或设备不支持导致的运行时解压。

## 一张图先建立选择地图

![Unity 纹理压缩平台选择地图](/images/unity-texture-compression-map.svg)

这张图可以作为第一层判断：先按目标平台选择 GPU 原生支持的压缩格式，再根据纹理用途调整质量和 Alpha 策略。

核心原则很简单：

- GPU 原生支持的压缩格式，通常能减少显存和采样带宽。
- 平台不支持的格式，可能在运行时被解压成未压缩格式，反而占更多内存。
- 同一张源图，在不同平台应该使用不同导入覆盖。
- UI、法线、Mask、渐变图、像素图不能只用同一套压缩规则。

## 动态流程：从源图到运行时采样

![纹理导入到平台压缩的流程动图](/images/texture-compression-flow.gif)

这个流程可以拆成三步：

1. 源图进入 Unity Texture Importer。
2. 按平台 Override 输出目标压缩格式。
3. 运行时 GPU 直接采样压缩纹理，或在不支持时走解压兜底。

如果你只看项目里的 PNG/JPG 源文件大小，很容易误判运行时成本。真正要关心的是构建后格式、显存占用和设备支持情况。

## 常见平台格式怎么选

### Windows / macOS / 主机

桌面平台通常优先考虑 BCn 系列，也就是常说的 DXT / BC 压缩。

常见选择：

- BC1 / DXT1：无 Alpha 或 1-bit Alpha，适合普通漫反射贴图。
- BC3 / DXT5：带 Alpha 的颜色贴图，质量一般但兼容面广。
- BC5：法线贴图常用，两个通道保存法线 XY。
- BC7：质量更好，适合高质量颜色贴图，但压缩和兼容成本更高。

桌面端显存相对宽裕，但不要因此忽略纹理。大型场景、开放世界、长时间运行的编辑器工具，都可能因为纹理常驻导致内存压力。

### Android

Android 的关键问题是设备碎片化。不同 GPU、系统版本和图形 API 对压缩格式的支持并不完全一致。

常见选择：

- ETC2：OpenGL ES 3.0 时代的通用选择，兼容性较好。
- ASTC：质量和压缩率可调，现代移动端非常常用。
- ETC1：老设备常见，但不支持 Alpha，需要拆分 Alpha 或使用其他方案。

如果项目面向较新的 Android 设备，ASTC 往往是优先选项。它可以通过不同 block size 在画质和体积之间做细分，比如 4x4 质量高、6x6 或 8x8 更省。

### iOS

iOS 设备代际相对集中，压缩格式选择比 Android 更容易控制。

常见选择：

- ASTC：新设备优先。
- PVRTC：老 iOS 设备曾经常用，但画质特性和限制需要单独评估。

如果项目已经不支持很老的设备，可以优先建立 ASTC 策略。对于 UI、角色主贴图和大面积渐变，建议单独做画质检查，不要只按默认设置批量压缩。

### WebGL

WebGL 的纹理压缩要考虑浏览器、图形后端和设备能力。

常见策略：

- WebGL 2 环境下可考虑 ETC2。
- 面向广泛浏览器时，Basis Universal / KTX2 这类超压缩方案值得评估。
- 如果兼容范围复杂，需要准备 fallback。

WebGL 的问题通常不是单一“能不能显示”，而是加载时间、下载体积、转码成本和运行时内存之间的平衡。

## Alpha 纹理的取舍

Alpha 是纹理压缩里很容易把成本放大的因素。

常见处理方式：

1. 使用支持 Alpha 的格式，例如 BC3、ASTC RGBA、ETC2 RGBA。
2. 拆分 RGB 和 Alpha，把 Alpha 放到单独通道或单独贴图。
3. 对只需要硬边透明的纹理，改成 Alpha Test 或 Mask。
4. 对 UI 图集单独配置，不和普通场景贴图混用规则。

如果一张贴图只是为了一个小范围透明区域，却让整张纹理升级到更贵的 RGBA 压缩格式，就需要重新评估资源设计。

## Mipmap 不是默认开关

Mipmap 可以减少远距离闪烁，也能降低远处采样成本，但会增加约三分之一的额外纹理内存。

建议：

- 3D 场景贴图通常开启 Mipmap。
- UI、图标、字体、像素风 Sprite 通常关闭 Mipmap。
- 地表、建筑、远景大贴图要重点检查 Mipmap 质量。
- 像素风项目要同时检查 Filter Mode，通常会更偏向 Point。

纹理压缩和 Mipmap 是一起工作的。只调压缩格式，不看 Mipmap，经常会留下远景闪烁或 UI 发糊的问题。

## Crunch Compression 要谨慎

Crunch 更像“磁盘/包体层面的再压缩”，它可以减少发布包体，但运行时通常需要解压到 GPU 可用格式。

适合：

- 对包体非常敏感。
- 纹理加载时机可控。
- 可以接受额外导入或加载成本。

不适合：

- 高频动态加载。
- 流式加载场景。
- 对卡顿敏感的战斗、跑酷、开放世界移动过程。

如果启用 Crunch 后出现加载尖峰或首帧卡顿，应该优先做对比测试，而不是只看包体下降。

## Unity 导入设置检查清单

每张关键纹理至少检查这些项：

```txt
Texture Type      是否符合用途：Default / Sprite / Normal map / Editor GUI
sRGB              颜色贴图开，数据贴图关
Alpha Source      是否真的需要 Alpha
Max Size          是否超过实际显示需求
Resize Algorithm  缩放质量是否影响 UI 或像素图
Compression       Normal / High / Low / None 的画质差异
Format Override   每个平台是否单独设置
Mip Maps          3D 场景与 UI 分开处理
Filter Mode       像素风、UI、3D 贴图分别检查
```

这份清单最好进入资源检查工具，而不是只靠人工记忆。

## 推荐工作流

1. 按平台建立默认导入 Preset。
2. 为 UI、角色、场景、法线、Mask、特效建立不同规则。
3. 在构建后统计纹理格式和显存占用。
4. 用目标机型检查画质，而不是只在编辑器里看。
5. 对低端机、高端机和 WebGL 分别保存测试结论。
6. 把例外资源写入白名单，并说明为什么例外。

## 视频与参考资料

视频学习入口：

- [Unity Learn：Texture Size, Color Space, and Compression](https://learn.unity.com/course/3d-art-optimization-for-mobile-gaming-5474/unit/textures-5559/tutorial/texture-size-color-space-and-compression-6266?version=2019.4)

官方文档：

- [Unity Manual：Texture compression formats](https://docs.unity.cn/2021.1/Documentation/Manual/texture-compression-formats.html)
- [Unity Manual：Texture compression formats for platform-specific overrides](https://docs.unity.cn/2019.3/Documentation/Manual/class-TextureImporterOverride.html)

## 结论

纹理压缩不是一个“选 High Quality 就结束”的设置项。它是平台策略、内容分类、显存预算、包体目标和画质验收共同决定的工程方案。

在 Unity 项目里，最稳的做法是：用平台 Override 建立基线，用工具统计实际结果，用目标设备验证画质，再把例外规则沉淀进自动化检查。
