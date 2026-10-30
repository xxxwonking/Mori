# 下次接手说明

记录日期：2026-10-30（Asia/Shanghai）。这是接手入口；持续变化的完成情况统一记录在 [当前进度](progress.md)。

## 项目是什么

Mori UI 是个人通用移动组件库，服务多个不同业务项目，名称暂定。已初始化为 uni-app x 工程，首版包含 Button、Input、Switch、Checkbox、组件工作台和组合表单。代码尚未发布。

本机目录为 `C:\Users\Administrator\Desktop\mori-ui`，HBuilderX 在 `D:\HBuilderX`。迁移机器时重新定位项目与 HBuilderX，不照搬本机路径。当前技术路线是 `.uvue` + UTS，通过 `uni_modules` 整包复制复用。

## 先读哪些文件

| 需要知道什么 | 文件 |
|---|---|
| 做到哪里、下一步建议 | [progress.md](progress.md) |
| 用户已确认的视觉规则 | [DESIGN.md](../DESIGN.md) |
| 安装、接入、主题与组件组合 | [user-guide.md](user-guide.md) |
| 属性和事件的准确名称 | [components.md](components.md) |
| 文件归属、数据流与实现陷阱 | [architecture.md](architecture.md) |
| 怎么验证、失败如何定位 | [testing.md](testing.md) |
| 哪个平台实际验证过 | [compatibility.md](compatibility.md) |
| 开源参考与图标来源 | [design-references.md](design-references.md) |

用户当前指令决定接下来要做什么。文档描述设计意图，源码描述实际行为；发现二者不一致应指出差异并核实，不能用文档掩盖代码缺陷。

## 不要重走的设计过程

用户最初要求移动组件库，随后补充 App 与鸿蒙目标、系统主题跟随。之后明确选择中性灰 + 蓝色、偏 Apple 风格，反复要求缩小文字、padding 和控件高度。

40px 是已被替换的旧默认值。目前按钮与输入默认 36px，lg 为 40px。用户还用截图否定了输入框上下断裂的双层蓝线、宿主复选框的黑底蓝勾，以及“显示／清空”文字操作。最新实现改为单边框、组件自绘选择态和 Lucide 图标。

Switch 的“支持文字”指 `activeText` / `inactiveText` 在轨道内显示状态，不是已有的外部 `label`。多色指可分别设置开启和关闭颜色。动画要求是选择顺畅、快速反向切换正确、布局不跳动。

## 十分钟恢复工作环境

在项目根目录打开终端：

```powershell
git status --short
node --version
npm --version
```

依赖缺失时执行 `npm ci`。要编辑并热更新，执行 `npm run dev`，打开终端实际报告的地址，默认请求 `http://127.0.0.1:5173`。

要复核发行构建，先 `npm run build:h5`，再单独启动 `npm run preview`。预览是静态文件服务，修改源码后必须重新构建。它与开发服务器默认共用 5173 端口，启动前确认已有进程属于什么服务；不要直接结束未知进程。

随后按当前任务选择检查，完整步骤见 [testing.md](testing.md)。不依赖聊天里的旧终端 session ID 或“上次已经打开”的浏览器。

## 当前交接状态

- 功能首版与最近一轮紧凑样式、图标、选择态、动画修改已实现。
- 最近一次 H5 功能检查为 9 组通过，动画检查为 5 项通过；H5 与微信发行构建通过。
- iOS／Android 原生编译与真机、微信运行、Safari 和鸿蒙验证尚未完成。
- 原始验证资料保存在 `.impeccable/review/`，该目录被 Git 忽略；缺失时按测试脚本重新生成。
- 最后五项视觉修复的独立续审因服务限流未完成，改由原线程逐项复核；`ship` 仅指那五项修复。用户尚未明确对最后一版视觉作正式验收。
- 已建立本地 Git 首次提交，分支为 `master`，源码、配置、测试与文档纳入版本管理，未配置远程仓库。接手时用 `git log -1 --oneline` 查看最新提交，并用 `git status --short` 核实工作区状态。

## 如果用户下次只说“继续”

先查看 [当前进度的下一步](progress.md)，判断当前环境能推进哪一项。建议先补基础组件在微信运行、iOS／Android 和 Safari 的实际证据，再扩充组件清单。缺少设备、AppID 或工具链时，先完成能做的检查并指出缺项；后续组件候选还没有被用户逐一确认。

可以把下面这段作为下次启动任务的说明：

```text
请继续维护 Mori UI。先读取项目根 AGENTS.md、docs/agent-handoff.md、
docs/progress.md 和 DESIGN.md，核对当前源码与运行环境，然后执行我本次指定的任务。
保留中性灰蓝、系统字体、36px 默认控件、图标输入操作、可配置且平滑过渡的选择控件。
完成后按改动范围验证，并更新进度、API、设计或兼容文档；不要重复初始化项目。
```
