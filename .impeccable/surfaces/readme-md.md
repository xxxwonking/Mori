---
version: 1
slug: "readme-md"
primary_target: "README.md"
related_targets: ["docs/assets/readme/cover-light.svg","docs/assets/readme/cover-dark.svg"]
---

# README 项目门面

目标：README.md 与 docs/assets/readme/。模式：Read。读者是想了解、试用或维护 Mori UI 的开发者；主要任务是认识组件能力、启动工作台、复制模块并理解真实兼容边界。

## Direction contract

THESIS: 将现有朴素说明扩展为有辨识度的 GitHub 项目入口；视觉由品牌封面和真实截图承担，正文保持标准 Markdown 的阅读与导航习惯。

OWN-WORLD: 沿用 DESIGN.md 的中性灰、清晰蓝、系统字体和现有三枚斜胶囊标识。浅深封面通过 picture 跟随阅读环境，正文交给 GitHub 的原生排版，不改变组件设计系统。

STORY: 第一屏认识项目与技术栈；随后看到真实界面，确认四组件范围；通过可复制命令启动，按完整主题初始化示例接入，最后了解验证与下一步。

FIRST VIEWPORT: 顶部 1200×400 横幅，左侧品牌文字和短句，右侧放大几何标识；下面是简短介绍、三个事实徽章和一行导航。窄屏切换 720×320 专用封面，预览自适应宽度。折叠区收纳移动截图、环境配置与目录树。

FORM: 已有 README 的扩展，使用用户已确认的 Apple 式紧凑灰蓝视觉；本次为代码与 SVG 实现，未进行新品牌或概念抽签。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

约束：不宣称未验证平台可用，不添加许可／性能／构建状态虚假徽章。截图来自现有 H5 验证资料，源版本与裁切记入资产来源。只修改 README、文档资产、本 brief 和进度，保留核心源码与全局设计文件。

## Finish record — 2026-10-30

既有 Read 表面的收尾复核，不引入新视觉世界或 comp 流程。独立 finish reviewer 检查本地四档宽度各自浅深主题、手机图库及 GitHub 桌面／手机的 21 张展示截图，完整结论为 `ship`，无实质修复项。独立 documenter 核对 README／封面、主题与尺寸源码和既有设计系统，结论为 No changes；保留 DESIGN.md 与 `.impeccable/design.json`。

可分发的范围与验证结论记录在 [README 收尾复核](../../docs/readme-review.md)。此记录只覆盖 README 与文档资产，不声明原生设备验证、组件包发布或用户最终视觉验收完成。
