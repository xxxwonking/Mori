# Mori UI：agent 接手入口

本文件适用于整个项目。优先处理用户当前明确提出的任务；文档里的后续计划是建议，不等于本次全部需要执行。

## 开始工作

1. 先读 [交接说明](docs/agent-handoff.md) 和 [当前进度](docs/progress.md)。
2. 改 UI 前读 [设计规范](DESIGN.md)；改 API 前读 [组件 API](docs/components.md) 与实际源码。
3. 根据任务查 [架构](docs/architecture.md)、[使用手册](docs/user-guide.md)、[验证与排障](docs/testing.md)。
4. 检查 `git status`、当前文件和运行环境。不要假定上次预览进程仍在运行，也不要覆盖已有未提交工作。

## 必须保留的用户选择

- 当前工程是 **uni-app x / .uvue / UTS**，不是普通 uni-app `.vue` 工程。
- 面向 H5、微信小程序、iOS、Android；鸿蒙尽力支持。编译通过不代表真机通过。
- Apple 风格、系统字体、中性灰和清晰蓝；默认按钮／输入 **36px**、文字 **13px**、标签 **12px**。
- 输入只画一条闭合边框，聚焦不改变边框宽度；显隐和清空使用图标。
- Checkbox 使用组件自己的小圆角方框与勾；Switch 支持开关独立颜色和轨道内文字。
- 选中状态平滑过渡且不改变外部尺寸；H5 尊重 `prefers-reduced-motion`。
- 主题默认 `auto`，可全局固定 `light` / `dark`，再切回 `auto` 恢复跟随。

## 实现与验证

- 核心代码在 `uni_modules/mori-ui/`，工作台和示例表单不是可发布组件。
- 运行时主题以 `theme.uts` 为准，尺寸基础在 `styles/tokens.scss`；不要只改演示页制造已修复的表象。
- 浏览器 DOM 适配集中到 `platform/`，使用 `WEB` 条件编译；不要在通用组件中引入浏览器全局对象。
- 新组件要同步 easycom 目录、示例、API 和适用检查。`scripts/component-manifest.mjs` 明确列出七十二个组件；`scripts/check.mjs` 校验目录和独立用法文档，需要有意更新清单。
- 按 [验证与排障](docs/testing.md) 选择与改动有关的检查。通过后不无故重复整套流程。
- 文档或注释修改验证路径、命令、参数与来源即可，不为此重跑整套 UI 构建。
- 依赖外部环境的检查无法完成时，记录具体缺项和已完成的部分，不把目标平台标成通过。

## 完成任务时

- 更新 `docs/progress.md`：本次做了什么、验证了什么、还剩什么、下一步是什么。
- API 变化同步使用手册与组件 API；设计变化同步 `DESIGN.md` 和 `.impeccable/design.json`；平台证据变化同步兼容记录。
- 原始截图／测试产物在被忽略的 `.impeccable/review/`，需把关键结论写入可随项目保存的文档。
- 不用早期绿色配色、40px 默认尺寸或旧 `ship` 结论覆盖用户后续的明确反馈。
