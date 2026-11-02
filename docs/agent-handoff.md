# 下次接手说明

记录日期：2026-11-01（Asia/Shanghai）。这是接手入口；持续变化的完成情况统一记录在 [当前进度](progress.md)。当前本地补强为 88 组件，最新增加 16 个通用组件并完善已有复杂交互；当前验证与复核状态以 progress.md 最后记录为准。详细用法见 [逐组件指南](component-guides.md)，iOS 上传与跨端差异见 [平台适配跟踪](platform-adaptation.md)。

## 项目是什么

Mori UI 是个人通用移动组件库，服务多个不同业务项目，名称暂定。已初始化为 uni-app x 工程，当前共有88个基础、展示、导航、反馈与录入组件，以及工作台和组合示例。准确清单见 [逐组件指南](component-guides.md)。源码远程为 [GitHub 仓库](https://github.com/xxxwonking/Mori)，本地与远端同步状态以 git status 和 origin/master 为准；尚未发布组件包。

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

- 上一轮 Windows 扩展从远程 `e08185e` 增加 27 个组件，总计 40 个，尚未提交／推送。H5／微信构建、基础／表单／反馈／分类回归及 40 份指南检查通过；最新自检结论为 ship-with-caveats，详见 [扩展自检记录](expansion-review.md)。下列早期视觉／README 结论保留各自历史范围。
- 功能首版与最近一轮紧凑样式、图标、选择态、动画修改已实现。
- 最近一次 H5 功能检查为 9 组通过，动画检查为 5 项通过；H5 与微信发行构建通过。
- iOS／Android 原生编译与真机、微信运行、Safari 和鸿蒙验证尚未完成。
- 原始验证资料保存在 `.impeccable/review/`，该目录被 Git 忽略；缺失时按测试脚本重新生成。
- 最后五项视觉修复的独立续审因服务限流未完成，改由原线程逐项复核；`ship` 仅指那五项修复。用户尚未明确对最后一版视觉作正式验收。
- README 的完整独立复核已在 2026-10-30 收尾，结论为 `ship`、无实质修复项；独立设计文档核对为 No changes。范围仅限 README 和文档资产，详见 [README 收尾记录](readme-review.md)，不替代上一项的组件视觉验收。
- 已建立 Git 首次提交 `0b1e6bb`，源码、配置、测试与文档纳入版本管理；远程 `origin` 为 `https://github.com/xxxwonking/Mori.git`，本地 `master` 跟踪 `origin/master`。接手时用 `git log -1 --oneline` 查看最新提交，并用 `git status --short --branch` 核实工作区与分支状态；需确认远程最新进度时先执行 `git fetch origin`。

## 如果用户下次只说“继续”

先查看 [当前进度的下一步](progress.md)，判断当前环境能推进哪一项。建议先补基础组件在微信运行、iOS／Android 和 Safari 的实际证据，再扩充组件清单。缺少设备、AppID 或工具链时，先完成能做的检查并指出缺项；后续组件候选还没有被用户逐一确认。

可以把下面这段作为下次启动任务的说明：

```text
请继续维护 Mori UI。先读取项目根 AGENTS.md、docs/agent-handoff.md、
docs/progress.md 和 DESIGN.md，核对当前源码与运行环境，然后执行我本次指定的任务。
保留中性灰蓝、系统字体、36px 默认控件、图标输入操作、可配置且平滑过渡的选择控件。
完成后按改动范围验证，并更新进度、API、设计或兼容文档；不要重复初始化项目。
```

历史表单／反馈工作曾在 macOS `/Users/others/Desktop/Mori-form-foundation` 的 `feat/form-foundation` 工作区完成，随后已整合远程 master；当前工作位于上文 Windows 目录，基线 `e08185e`。不要把历史工作区当作当前执行路径。

反馈入口 `pages/feedback/feedback`，新增分类入口 `pages/catalog/catalog`；当前预览使用 5174，验证、平台限制和待办见 progress.md 最后记录。Input 的 blur／confirm 现在携带宿主最终文本，Stepper 重建结束编辑的输入以规避宿主缓存，修改时保留快速编辑回归。


2026-10-31 第二轮新增 32 个组件，用户随后要求将两轮扩展一起提交并推送到 origin/master。用户明确选择「通用组件全面补齐」；优先扩充覆盖范围，不能继续照旧建议只做设备检查。新清单见 component-coverage.md，源码含 content.uts／extended-input.uts 和四组 demo。历史记录中的“未提交／未推送”对应当时状态，最新状态见 progress.md 与 Git；后续开始前检查 git status。

2026-11-01 已按用户批准执行 88 组件补强，包含官网新预览、异步表单、多列／树选择、定高虚拟列表与 Canvas 等。工作区仍包含未提交的官网及本轮改动，开始前核对 git status；不得覆盖。详细范围、证据、独立复核状态与平台边界以 progress.md 最后一节为准。

88 组件收尾已完成：最终 17 组新增 H5 交互、完整单元、官网/H5/微信构建通过；独立复核五项均 resolved，设计记录已同步。详见 expansion-review-88.md 与 progress.md。

2026-11-02 已继续完成 iOS 相册上传的源码与本机收尾：复制接入须同时包含 uni_modules/mori-ui 和 uni_modules/mori-upload-ios，后者提供 PHPicker／临时副本／URLSession，配置与自定义基座要求见其 README。最新完整单元、H5／官网／微信构建与浏览器上传选图回归通过；Swift 编译、iCloud／相机／原生上传仍待 iOS 设备验证。源码未提交／推送，下一步按 progress.md 最后一节及用户当前指令处理。
