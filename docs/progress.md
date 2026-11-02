# 当前进度与下一步

更新日期：2026-11-01（Asia/Shanghai）。阶段：**0.1.0 通用组件补强到 88 个，88 份指南与官网真实预览；本轮构建、单元和 H5 交互检查通过，独立复核五项修复均解决；跨端真机验证未完成，尚未发布**。

本文件是接力状态记录。更新任务后修改这里，不用把聊天历史当作唯一进度来源。

## 已完成

| 工作项 | 当前结果 |
|---|---|
| 工程 | 桌面 uni-app x 工程、UTS / uvue、uni_modules 目录、开发／构建命令 |
| Button | 四变体、三尺寸、加载、禁用、整行宽度、圆角、实例颜色与文字色 |
| Input | v-model、标签、必填语义、提示／错误、前缀、禁用、图标清空／密码显隐、三尺寸 |
| Switch | boolean 受控状态、开启／关闭独立颜色、轨道文字、三尺寸、禁用、平移与颜色过渡 |
| Checkbox | 小圆角方框、统一填充和勾、整行选择、禁用、淡入与缩放过渡 |
| 全局主题 | 默认 auto，light／dark 覆盖与恢复跟随，浅深品牌色，实例覆盖 |
| 展示页 | 桌面／移动布局、组件预览、API、主题切换、代码复制、组合表单 |
| 设计修正 | 灰蓝与系统字体；默认 36px；单一输入边框；Lucide 操作图标；平滑选择态 |
| 文档 | 带浅深封面与真实截图的 README；agent 入口、交接、设计规范、使用手册、API、架构、进度、验证与兼容记录 |
| 版本管理 | 首次提交 `0b1e6bb`；源码／配置／测试／文档已同步到 [GitHub](https://github.com/xxxwonking/Mori)，`master` 跟踪 `origin/master` |

## 最近验证证据

下表是原基础版与README阶段的历史证据。本轮40组件扩展的当前验证与独立复核记录在文件末尾，不能将历史检查范围当作全部新增组件的验证结果。

| 检查 | 结果与范围 |
|---|---|
| H5 发行构建 | 通过，本机 HBuilderX 5.34 编译器 |
| 微信发行构建 | 通过；不等于微信运行或真机通过 |
| `npm test` | Chromium 145.0.7632.6，9 组通过，errors 为空；最后记录为 2026-10-30 11:25:10（北京时间） |
| `npm run test:motion` | 5 项通过：中间帧、固定尺寸、快速反向切换、减少动态效果；不是全设备帧率保证 |
| `npm run test:unit` | 固定色、浅深色、简写 hex、rgb 的按钮前景对比度通过 |
| `npm run check` | 配置与四个组件打包目录检查通过；不替代完整 UTS 类型／原生检查 |
| 视觉证据 | 13 张浅深色／桌面／手机／输入／选择态截图，原线程逐一查看 |
| 最后复核 | 独立 reviewer 提出五项修复后，续审及重试因限流失败；原线程完成替代复核，`ship` 仅覆盖这五项 |
| README 收尾复核 | 独立完整复核为 `ship`，无实质修复项；8 种本地浅深／宽度组合、GitHub 桌面与手机、21 张展示截图已核对；设计文档复核为 No changes，详见 [收尾记录](readme-review.md) |

原始报告、截图和最后复核文件位于 `.impeccable/review/`。此目录被 Git 忽略，克隆后可能不存在；复现方式见 [testing.md](testing.md)。

## 未完成与明确限制

- 微信开发者工具及微信真机的运行验收。
- Android／iOS 原生编译、真机运行、键盘、安全区、系统字体缩放、系统主题和选择动画验收。
- Safari，尤其 iOS 上小字号输入的聚焦缩放、显隐后光标和键盘遮挡检查。
- HarmonyOS NEXT 工具链与设备验证；不要求第一版所有组件全部支持鸿蒙。
- 原生系统“减少动态效果”偏好的接入／验证；目前已验证的是 H5 媒体查询。
- 最新视觉的用户正式验收；整理交接文档与提交代码的要求并非明确验收声明。
- Form／FormItem、Radio／RadioGroup、CheckboxGroup、Textarea 已实现；异步校验、嵌套字段、包发布和最低系统版本仍未完成或未定。
- 尚未发布组件包或 Release；源码已有本地与 GitHub 版本基线。

## 下一步建议

按当前用户指定任务调整顺序；下表不是必须一次做完的范围。

| 优先级 | 建议任务 | 可以开始做什么 | 完成标准 |
|---|---|---|---|
| P0 | 微信运行验证 | 构建后导入 `unpackage/dist/build/mp-weixin`，核对 AppID／工具环境 | 四组件、主题、图标、事件和动画有实际运行记录 |
| P0 | 原生最小闭环 | 在 HBuilderX 核对 Android／iOS 编译插件和运行目标，记录缺少的设备／配置 | 至少分别记录构建结果；有设备时完成四组件与键盘／主题验收 |
| P1 | Safari / iOS H5 | 用实际 Safari 检查输入聚焦、清空、显隐、禁用和选择过渡 | 记录设备／系统／浏览器、复现步骤、截图和结论 |
| P1 | 视觉回访 | 请用户在最新预览中操作 Input、Switch、Checkbox，处理具体反馈 | 用户确认或形成清楚的下一轮修改清单 |
| P2 | 按业务继续扩展 | 当前40组件清单见逐组件指南；级联选择、异步校验、虚拟列表等按后续需求评估 | 明确契约后同步实现、独立用法与行为测试 |
| P2 | 鸿蒙与分发 | 明确工具链、最低版本与分发方式；保留可用平台降级策略 | 按组件记录支持程度；发布单独处理 |

## 已知实现边界

- 当前40个组件包含同步表单容器／校验引擎与有限内置图标集；未提供异步表单校验或嵌套字段。上传为图片选择与前台传输，原生差异见平台跟踪。
- `setMoriConfig` 不持久化选择，也没有全局 density／字号配置；尺寸通过现有实例参数或样式基础控制。
- 非 hex／rgb 的自定义颜色不具备完整自动前景推导；具体限制见 [使用手册](user-guide.md)。
- 当前测试依赖工作台 DOM 与示例顺序；增减样例时应同步测试，不能只删除失败断言。
- 构建有 Sass legacy／import 弃用与 H5 `withKeys` 类型提示。下一次升级编译器需重新判断，不把历史成功当作新版本保证。

## 本次交接整理

新增项目 `AGENTS.md` 和交接、使用、架构、测试、进度说明；连接已有设计规范、API 与兼容记录。仅改文档，按实际目录、脚本、组件参数和已有报告核对。

本轮核验：检查 13 个 Markdown 文件，43 个本地链接均存在，35 处 npm 脚本引用与 `package.json` 一致；2 段 Vue 使用示例通过结构解析，组件属性与源码匹配。示例未单独上机运行，未重新执行 UI 构建和交互测试。整理文档时 Git 提交数为 0，随后已建立下述版本基线。

## 2026-10-30：建立本地版本基线

按用户要求完成本地 Git 首次提交，沿用已初始化的仓库与 `master` 分支。纳入组件、工作台、工程配置、依赖锁定、测试脚本、图标许可和交接文档；补充 `.gitignore`，排除构建日志和本地设计探索记录，依赖、构建产物与验证截图继续忽略。

本次仅调整忽略规则和 Git 交接状态，未修改组件代码。核对待提交清单与忽略规则，通过 `git diff --cached --check` 检查，并在提交后确认提交记录与工作区状态；未重复运行 UI 构建和交互测试。用 `git log -1 --oneline` 查询最新提交。当时仅建立本地基线，随后按用户提供的地址完成下述远程同步。

## 2026-10-30：同步 GitHub 仓库

将用户提供的 `https://github.com/xxxwonking/Mori.git` 配置为远程 `origin`。检查远程起初没有分支，将首版代码与交接文档推送到 `master`，并设置上游 `origin/master`。

本次更新 `docs/agent-handoff.md` 与本进度记录中的仓库信息；通过 `git diff --cached --check`，推送后核对远程 `refs/heads/master` 与本地 `HEAD` 一致、工作区干净。未改组件代码，未重复运行 UI 测试。源码已同步，组件包与 Release 尚未发布；下一步按用户任务推进跨端验证或后续组件。

## 2026-10-30：完善 README 项目门面

重写 README 的开场、组件概览、快速启动、主题示例、兼容表、路线图和文档导航。新增桌面／手机各两套浅深色 SVG 封面，沿用既有灰蓝配色与品牌标识；从原有 H5 验证截图中选出两张完整工作台截图及两张移动端局部截图，保存到可随 Git 分发的 `docs/assets/readme/`。截图源文件、校验值与裁切范围记录于 `provenance.json`，图片内也嵌入来源说明。原始验证产物仍在被忽略的 `.impeccable/review/`。

使用 GFM 与 GitHub Markdown 样式进行本地渲染，检查 1440／390／360px 各自浅深主题：图片加载、主题资源选择、页内导航、折叠图库和页面宽度均通过。37 处本地资源／链接及文档锚点存在，3 个 Vue 示例通过 SFC 结构与组件属性检查；示例未单独上机运行。静态设计检测无发现，4 张分发 PNG 均含来源记录。未修改组件源码，也未重复执行组件构建或交互回归。

README 的表现范围仍以现有证据为准：H5 已有浏览器记录，微信已编译，其余平台继续按兼容文档验证。下一步仍由用户当前任务决定。

## 2026-10-30：完成 README 收尾复核

按用户要求完成此前因服务限流未收尾的 README 独立复核。重新生成 1440／768／390／360px 各自浅深主题的 GFM 展示证据，核对 37 处资源／链接与 3 个 Vue 示例；图片、主题资源、页内导航和展开图库的页面宽度检查通过。GitHub 桌面加载正常；390px 浅深主题的手机封面、三个折叠区的 Enter 操作及主题导航检查通过。一次设计检测返回空列表，4 张 PNG 的来源信息完整且原始截图 SHA-256 与来源记录相符。

独立 finish reviewer 检查 21 张截图与当前 README／资产，完整复核结论为 `ship`，无实质修复项。独立 documenter 核对既有设计系统与实现，结论为 No changes。此前已推送的 README 提交 `0d9ea1f` 保持原样；本次新增 [README 收尾记录](readme-review.md)，同步本进度、交接说明与表面说明，完成文档收尾。

本次没有修改组件源码，没有重复组件构建、功能或动画回归。README 完成不改变微信、Android／iOS、Safari、鸿蒙的待验证状态，也不替代用户对最新组件视觉的正式验收。核对文档链接与 Git diff；提交同步后检查本地与远程提交一致、工作区干净。后续继续按用户指定任务推进跨端验证或下一批组件。

## 后续更新格式

每次完成任务，更新以上相应条目，并追加简短记录：日期／任务、改动文件、验证命令与实际结果、未完成事项、下一步。不要把未运行的检查写成通过；存在未解决问题时保留复现入口。


## 2026-10-30：参考开源库扩展表单基础

用户选择表单校验、单选、分组多选、多行输入。参考 Vant Form／RadioGroup 与 Wot Form／Textarea 的交互与 API 组织，新增 Form、FormItem、Radio、RadioGroup、CheckboxGroup、Textarea；原四组件契约保留。同步顶层规则支持 required、长度、pattern、自定义 validator；提供 validate／validateField／clearValidate，分字段更新保留其他错误。FormItem 通过上下文统一标签、必填、错误和描述，Input／Textarea 的实际 H5 输入元素显式监听状态并同步 ARIA。

工作目录 `/Users/others/Desktop/Mori-form-foundation`，分支 `feat/form-foundation`。添加表单页及入口、可提交／重置的本地示例、API 文档、选择／校验／工具链测试。代码保留在本地工作区，未推送或发布。

本轮验证：

- `npm run check`：十个 easycom 导出、配置和浏览器边界检查通过。
- `npm run test:unit`：颜色、校验、选择／文本限制和构建环境测试通过。
- H5 构建通过，使用本机 HBuilderX 编译器 5.26.2026091411.1611、Node 26.6.0。该结果只覆盖 H5，不降低原生的工具链要求。
- 微信构建通过，编译器同上，自动采用其 bundled Node 22.22.2；Node 24／26 执行该编译器的微信缓存会报 cachedDataRejected。
- 系统 Chrome 156.0.8078.74：原功能 9 组通过；Switch／Checkbox 动效 5 项通过；新表单套件通过（错误关联、单字段修正、单选键盘循环与禁用、多选上限、多行输入长度、成功提交、清错重置、360／390px 深色布局）。
- 已查看桌面浅色、手机深色及提交区域截图。截图和 JSON 位于 `.impeccable/review/`；全页移动截图在当前 Chrome 出现重复拼接，改用真实视口顶部／提交区两张截图核对。
- 本轮无微信开发者工具、原生编译／设备、Safari 证据；不能将构建或 Chrome 结果外推到这些平台。仍有 Sass legacy/import 和 H5 withKeys 编译提示。

构建修复：显式设置 HX_APP_ROOT，并创建可清理的临时插件链接目录，让旧编译器使用项目锁定 Sass；不修改 IDE 安装。微信选择同安装的 bundled Node，H5 保持调用者 Node。浏览器脚本可用 MORI_BROWSER_EXECUTABLE 指向已安装 Chrome，默认继续使用 Playwright Chromium。新增浏览器导航后，将旧测试的指南定位限定到“开始使用”。

运行时核查（2026-10-30）：查询 Node 官方 2026-10-21 安全公告；本机 Node 26.6.0、编译器 bundled 22.22.2 低于公告修复版本 26.12.1／22.23.4。此次未修改全局 Node 或 IDE；正式分发前应升级匹配的官方工具链并复核构建，不能直接替换加密编译器的配套运行时。来源：https://nodejs.org/en/blog/vulnerability/october-2026-security-releases 。


## 2026-10-30：反馈组件扩展

按用户要求优先补反馈组件，新增 Toast、Popup、Dialog，总数十三。参考 Vant Toast／Popup／Dialog 与 Wot Popup 的交互约定，以原有 UTS／uvue 和 Mori 主题实现，没有增加运行依赖。

- Toast：文字／成功／失败／加载、三种位置、ref show／close 与受控可见性、重复调用替换并重启计时、duration=0 持续、卸载取消回调。实际 Vue setup 测试覆盖 model acknowledgement、属性更新、幂等关闭与卸载。
- Popup：五方向、遮罩与无遮罩、关闭按钮、打开／退出事件、反向切换取消旧回调。有效 z-index、焦点和 Escape 同步归属最上层；退出结束才释放。H5 锁定／恢复滚动、Tab 焦点限制与回到触发点；无罩模式不锁滚动或焦点。
- Dialog：组合 Popup，确认仅发事件，由业务控制关闭。confirmLoading 禁止重复确认、取消、遮罩与 Escape；示例模拟一次保存。
- 工作台增加反馈入口与 `pages/feedback/feedback`。新增 `test:feedback`，单元脚本纳入 overlay、feedback、真实 Toast setup 测试；文档、设计和导出清单同步。

本轮检查与证据：

- `npm run check`、`npm run test:unit`、`git diff --check` 通过。
- H5 与微信发行构建通过，沿用上轮同一官方编译器／匹配 Node 运行方式。仍有 Sass legacy/import 弃用和 H5 withKeys 类型提示。
- Chrome 156.0.8078.74：反馈套件通过，涵盖 Toast 计时替换／持续／关闭／错误语义、Popup 遮罩与面板点击、嵌套层级、滚动锁恢复、Tab／Escape／Enter、无遮罩点击穿透、Dialog 等待防重复、消息框、手机深色布局、动画真实中间帧与减弱动态效果。
- 原交互 9 组和表单套件再次通过，无 pageerror。原 Switch／Checkbox 动效未改，未无故重跑其专用套件。
- 已查看反馈页桌面侧边弹层、手机深色底部弹层截图。原始结果 `.impeccable/review/feedback-verification.json`，截图 `feedback-desktop-popup.png`、`feedback-mobile-dark.png`。

限制：微信仍只有编译证据；Safari／原生设备未验证。Popup 应挂在页面根级，未提供跨端 portal；原生安全区和滚动穿透需按页面适配。H5 实现键盘焦点隔离但未对背景／下层弹窗做 inert／aria-hidden 隔离，未验证读屏完整模态行为。Toast 固定 z-index=2000，自定义更高层弹窗可能覆盖它。无全局单例 Toast、队列或 Dialog Promise API。

本地工作区继续保留上一批表单成果，未提交、推送或发布。下一步可按用户需求补 ActionSheet／Notify／Loading，或优先进行微信与原生实际运行验收。


## 2026-10-30：底部弹层动效调整

用户反馈底部弹出不够顺滑。先在 390×844 Chrome 实际采样三次：面板高 313px，原默认 180ms ease 同时滑动与淡入；帧间隔基本稳定，未出现页面滚动变化。问题主要表现为前半程位移急、内容半透明，未据此认定设备掉帧。

Popup 默认 duration 调整为 280ms，进入使用 cubic-bezier(0.22, 0.61, 0.36, 1) 渐减速，退出使用 cubic-bezier(0.4, 0, 1, 1)。四边滑入面板保持不透明，遮罩仍独立淡入淡出；居中 Popup／Dialog 保留缩放淡入，也使用新的默认时长。显式 duration 仍可覆盖。未改首帧定时与焦点／滚动管理，因为本轮没有观察到相应故障。

新增真实浏览器回归先在旧实现因滑动面板半透明而失败，修复后通过。覆盖实际 transform 中间帧、单向连续到达终点、尺寸稳定、全程不透明，以及退出中重新打开后仍保持面板和滚动锁。新采样中面板约在触发后 316ms 到位（含启动等待），无 pageerror。减少动态效果、嵌套／非模态弹层、Dialog 和 Toast 既有反馈测试一并通过。已查看手机深色截图。

验证：npm run check、npm run test:unit、npm run test:feedback、H5／微信发行构建、git diff --check 均通过。设计规范、设计数据与 API 默认值同步更新。证据仍为 .impeccable/review/feedback-verification.json；测量来自本机 Chrome 156，不代表微信真机／Safari／原生性能，这些平台仍待运行验证。预览页可继续体验并按用户手感微调；未提交或推送。


## 2026-10-30：按用户澄清恢复弹层淡入

用户指出真正期望的是弹出时柔和淡入，上一轮取消面板透明度过渡的判断不符合需求；本记录取代上一轮“面板保持不透明”的设计结论。所有 Popup 面板恢复 opacity 0→1，与滑入／缩放同步；退出 1→0。保留 280ms 时长与 transform 减速曲线，opacity 独立使用 ease-in-out，避免进入初段就完全显现。未改 API 或焦点、滚动逻辑。

回归测试先在上一版复现失败（首帧 opacity 为 1，期望 0），修复后通过。真实 Chrome 采样首帧为 0，随后依次出现 0.065、0.184、0.359、0.562、0.751、0.895 等中间态，最终为 1；退出也采到中间透明度。快速退出重开、减少动态效果以及整个反馈套件通过，无 pageerror。npm run check、git diff --check、H5 与微信发行构建通过。设计规范与设计数据已同步。

预览已更新，仍需由用户确认手感；微信真机／Safari／原生运行未验证，不能把编译结果当作这些端的动效验收。未提交或推送。


## 2026-10-30：修正底部进入方向被自动滚动抵消

用户再次指出需要从底部慢慢浮现。本次增加真实 getBoundingClientRect 坐标检查后，在上一版复现首帧 top=531（期望屏幕下沿 844），虽然 computed transform 显示 translateY(313px)。检查祖先发现自动聚焦关闭按钮导致弹层外壳 scrollTop=313，视觉位移被滚动抵消。此前只采样 transform／opacity 的测试不足以验证实际进入方向，上一轮“从底部进入”的结论由本次坐标证据修正。

H5 首次焦点使用 preventScroll，弹层外壳 overflow: clip 禁止因聚焦变成滚动容器，内部内容继续 overflow-y: auto。位移与透明度统一 ease-in-out、保持 280ms，使向上进入与显现同步。没有增加依赖或修改 API。

新增回归先在旧实现首帧坐标断言失败，修复后通过：390×844 视口面板 top 从 844→824→732→609→538→531，透明度从 0 单调到 1，外壳 scrollTop 全程为 0。逐帧检查实际向上位移、最终底边对齐、透明度与位移同步；完整反馈套件（快速重开、嵌套、焦点恢复、非模态、减少动态效果、Toast、Dialog）通过，无 pageerror。H5 与微信构建、npm run check、git diff --check 通过。已检查真实动画中点截图 popup-bottom-midpoint.png，原始帧位于 feedback-verification.json。微信真机／Safari／原生仍无新增运行验证；未提交或推送。


## 2026-10-30：提交与主分支整合

按用户要求提交表单基础、反馈组件和底部弹层修复，并整合远程 master 的两次 README／交接更新。README 保留远程封面、截图和介绍结构，同步十三组件、示例入口、验证命令与当前路线。历史记录中的“未提交／未推送”描述对应当时状态；最新提交与远程状态以 Git 记录为准。


## 2026-10-30：拉取最新代码并扩展至40组件（阶段记录）

先确认工作区干净，git pull --ff-only origin master从e972ae0快进至e08185e，保留远端新增表单/反馈13组件及底部弹层修复。参考Vant、Wot和uview-plus官方源码文档，自行增加27组件，未引入上述库运行依赖。完整目录见 [逐组件指南](component-guides.md)。

已增加基础展示/动画、四种导航、动作面板/气泡菜单/顶部通知、数值录入/搜索、选项/日历/日期时间、上传和折叠面板；新增工作台分类体验页。每个组件有独立使用文档，上传另有iOS编号适配入口与待验步骤。

当前已通过check、test:unit、H5/微信构建、test:catalog、原基础9组及表单/反馈回归。已修复自检发现的uni宿主按钮语义/禁用皮肤、工作台宽度、部分徽标外溢及Windows截图路径。独立finish reviewer正在复核，最终结果将在本节之后更新。

没有iOS/Android原生、微信真机、Safari和鸿蒙设备证据。上传网络状态由可控测试替身验证，默认浏览器文件选择实测；没有真实业务后端。未提交/推送/发布本轮成果，工作区保留变更。下一步完成独立复核修正、设计记录同步和最终验证。

## 2026-10-31：完成扩展、自检与详细使用文档

本轮新增 27 个组件，总计 40 个，覆盖基础／展示／动画、导航、反馈、表单与数值、选项／日期时间、图片上传。保留原有 13 个组件及已确认样式，模块源码在 `uni_modules/mori-ui/`，新增分类体验入口为 `pages/catalog/catalog`。每个组件均有 [独立详细指南](component-guides.md)，包含示例、属性默认值、事件、插槽／实例方法与适用边界；安装、API、架构、测试说明和设计规范同步完成。

独立复核提出的六项全部修复并复核通过：Stepper 最终文本与宿主缓存、Upload 迟到拒绝、Slider 深色拇指／轨道、实际 range 可访问名称、Badge 裁切、Collapse 插槽文档。最终结论 ship-with-caveats、定向修复评分 6/6，范围内无剩余 P1/P2，详见 [自检记录](expansion-review.md)。Input 的 blur(value) 与 confirm(value) 现直接返回结束编辑时的宿主文本，避免快速输入节流丢失最终值；Stepper 支持负数／小数草稿，失焦和确认后规范显示。

主线程补充修复 Search 快速输入后立即确认／点击提交旧文本的问题，新增失败回归再验证通过；Search 接收结束编辑最终文本补齐模型。该项另记自检证据，不扩大独立 reviewer 的六项评分范围。

验证完成：

- `npm run check`、`npm run test:unit`、`npm run check:docs` 通过；40 份指南和 42 段 Vue/UTS 示例结构、源码参数／事件及本地链接已检查。
- 最终 H5／微信发行构建通过，Windows HBuilderX `5.34.2026102821.2458`；Sass 弃用与 H5 类型提示仍有记录。
- Chromium `145.0.7632.6`：原基础 9 组、表单、反馈及新增分类套件通过；Input 最后修正后重跑基础／表单／分类回归。包含真实图片选择、快速数值编辑、日期禁用范围、动画中间帧／反向切换、浅深主题及移动宽度，无 pageerror。
- 最终 5 张分类页截图已逐一查看并由独立 reviewer 复核；设计文档与 JSON 同步核验完成。原始产物在 `.impeccable/review/`，持久结论见自检和兼容记录。

仍需跟进：没有原生 iOS／Android、微信设备、Safari、鸿蒙或真实业务上传后端验证。iOS 上传 `MORI-UP-IOS-01` 至 `06` 已在 [适配清单](platform-adaptation.md) 记录入口、处理、缺项及验收步骤；HEIC 转码、文档选择、后台任务等不伪装为已实现能力。下一步按这些编号接入真实 AppID／签名、设备及业务服务验证。

本轮未提交、推送或发布，工作区保留完整修改。当前本地预览为 `http://127.0.0.1:5174/#/pages/catalog/catalog`；下次接手先确认进程，不依赖旧 session。最新实现以本节及 git status 为准，上述历史阶段中的未完成描述不覆盖本次结论。

## 2026-10-31：通用覆盖扩充到 72 个组件

用户明确指出 40 个组件仍严重不足，并选择“通用组件全面补齐”。本轮保留现有未提交工作，新增 32 个独立 easycom 组件，总计 72 个；没有把演示页或同一组件变体重复计数。新增覆盖媒体、内容组织、列表、索引导航、级联／树选择、数字键盘、密码格、倒计时和滑动操作，详见 [覆盖范围](component-coverage.md) 与 [全部指南](component-guides.md)。

源码新增 content.uts、extended-input.uts、platform/swiper.uts 及对应组件；组件全览新增媒体内容、组织导航、选择录入、列表交互四类演示。72 份独立指南含示例、参数默认值、事件／插槽／实例方法与平台边界；README、API、使用手册、架构、测试、设计规范和设计 JSON 已同步。PRODUCT.md 已将“小基础首版”改为历史阶段，保留用户当前全面扩充方向。

验证结果：

- `npm run check`、`npm run check:docs` 通过：72 个目录、72 份指南、74 段示例结构及本地链接。
- 完整 `npm run test:unit` 通过；后续复核修复后再次通过 `node tests/extended-catalog.mjs`。新测试实际运行 Vue setup，包含级联草稿／提交、禁用祖先、树选择上限、连续按键、同步／异步加载、刷新、滑动方向、异步索引与重排、定时时间差、重启及卸载清理。
- 最终 `npm run build:h5` 与 `npm run build:weixin` 成功；保留已知 Sass 弃用和 H5 类型提示。编译器为 Windows HBuilderX 5.34，调用者 Node 24.21.0。
- Chromium 145：`npm run test:expanded` 的五组新检查通过，无 pageerror；原 `npm test` 九组及 `npm run test:catalog` 回归通过。32 个组件均有实际演示，四分类 1280px 浅色、390px 深色与 360px 弹层截图已查看。
- 首轮浏览器修正非固定 Fab／BackTop 定位偏移、演示样式作用域、标签字号和浅色步骤勾。独立复核另提出四项：同步加载／刷新锁、Swiper 隐藏页焦点、IndexBar 异步数据定位、PRODUCT 过期范围；已修复并通过定向回归，独立评分 4/4 resolved，disposition 为 ship，范围仅为这四项修复。详见 [72 组件复核记录](expansion-review-72.md)。
- 一次设计检测无发现；独立 documenter 已核对新增源码并同步 DESIGN.md／design.json。旧 sidecar 的 kind／refersTo 和预览数量漂移原样保留，未扩大本轮范围去清理。

限制与后续：原生 iOS／Android、微信设备、Safari、HarmonyOS 和真实业务后端仍无新增运行验收。项目 AppID 留空、adb 未在 PATH，本机无 Xcode／iOS 签名和设备。新平台差异有 MEDIA／LIST／REFRESH／TIMER／GESTURE／STICKY／SAFE／SCROLL／INDEX 编号，旧 iOS 上传 MORI-UP-IOS-01 至 06 继续保留。Sticky 的 App 自动吸顶、虚拟列表、完整多列 Picker、签名／裁剪等仍是明确缺口，不把 72 个组件等同主流库全部能力。

下一步可结合实际业务选择复杂录入或长列表能力继续补齐，并接入真实设备及服务完成对应编号验收。本轮未提交、推送或发布，预览仍为 `http://127.0.0.1:5174/#/pages/catalog/catalog`；四个新增分类位于组件全览顶部标签中。所有原始检查产物在被忽略的 `.impeccable/review/expanded-*`，本节与兼容记录保存关键结论。

## 2026-10-31：提交与推送两轮组件扩展

按用户要求，将此前 13→40 和本轮 40→72 的源码、示例、独立指南、平台适配记录、设计规范及测试作为同一版本提交，推送目标为 `origin/master`。提交前 fetch 核对远端基线仍为 `e08185e`；四个一次性生成脚本归档至被忽略的 `.impeccable/review/generation-scripts/`，截图、日志和构建产物继续保留在本地。

本次只整理版本记录与提交范围，沿用上文已经完成的 H5／微信构建、单元与浏览器回归证据；提交前核对目录、文档链接及暂存差异。提交／远端最终状态以 Git 记录为准，历史“未提交／未推送”不代表当前状态。尚未发布组件包或 Release，原生真机及真实业务后端的缺项不变；下一步继续按覆盖清单与平台编号推进。

## 2026-10-31：检查并拉取最新代码

按用户要求在 `master` 执行 `git pull --ff-only origin master`，返回 `Already up to date.`。拉取前工作区干净；本地与 `origin/master` 均为 `59f2cdd`（扩充通用组件至72个），`git rev-list --left-right --count HEAD...origin/master` 为 `0 0`。本次没有新的远端代码变更，仅追加本进度记录并检查文档差异，未重跑构建或 UI 测试。平台验收等既有缺项不变，下一步按用户指定任务继续。

## 2026-10-31：宣传官网、组件文档与手机效果预览

按用户要求核查组件并实现类似 Wot UI 的官网结构。查阅线上 generator 与 Wot 仓库，确认其使用 VitePress，手机效果区是实际 H5 示例的 iframe，附有二维码和独立打开入口。Mori 新增 `site/` 官网，沿用已有灰蓝、系统字体和紧凑组件；首页提供真实组件体验、分类检索和平台进度，文档提供左侧目录、中间正文、右侧手机预览，窄屏可在正文前展开。

72 份文档继续以 `docs/components/` 为来源，预览默认由其示例生成；`site/demos/` 为按钮、输入、上传等提供完整可操作示例。所有预览运行现有 `.uvue` / UTS 组件，核心模块没有替换为普通 Vue。新增 `pages/preview/preview.uvue`，提供组件目录、主题与重置；工具栏支持浅深主题、刷新、二维码与独立窗口。官网 H5 输出独立到 `unpackage/dist/site/h5`，普通工作台输出路径保持原样。

新增 `site:dev`、`site:build`、`site:preview`、`site:refresh`、`test:site`。开发与构建流程、生成文件边界、局域网二维码及根路径静态部署见 [官网指南](website.md)。VitePress 使用 1.6.4，旧 Vite 链通过 override 固定到 6.4.5；开发服务与静态构建均实测，npm audit 为 0。修正 Upload 文档泛型被识别为 HTML 的写法及 Button 指南旧图标说明。

本次验证：目录与打包检查、72 份指南／74 段示例结构和链接检查、完整单元测试通过；官网 H5、VitePress 与微信构建通过。Chromium 145 下全部 72 个真实示例完成 360px 挂载与溢出巡检；官网五组交互检查、1440／1280／768／390px 浅深布局、独立强制深色与弹层最终位置检查通过，无 pageerror／HTTP 资源错误。原基础 9 组和分类回归通过。修复文档右栏 flex 收缩造成的裁切、独立预览文本主题字段和开发服务器 demo 入口；弹层截图等待进入完成后重新采集。

原始产物在被忽略的 `.impeccable/review/site-*`，兼容范围同步记录。官网本地地址为 `http://127.0.0.1:5180`，构建产物在 `dist/site`。没有提交、推送、发布组件包或部署公网；后续按用户反馈调整页面或接入域名与托管。现有原生／微信真机／Safari／鸿蒙／真实上传后端缺项不变，72 个挂载示例不等于全平台全状态验收。

官网独立复核最终为 `ship`，范围为本次官网、文档和真实预览；十张指定截图有效，无剩余实质修复项，不替代用户视觉验收或目标设备验证。首轮要求重拍弹层，已等待透明度与实际位置到达终点后复核。独立 documenter 已同步 DESIGN.md 与 design.json 的官网字号、圆角、断点和行为，核对既有核心 token 与组件条目完整保留；旧 sidecar 的 kind／refersTo 漂移没有顺带改动。详细原始报告为 `.impeccable/review/site-independent-review.md`，本段保存最终结论。

## 2026-11-01：核对开源准备与下一轮组件缺口

用户询问开源组件库还需哪些工作，并再次指出 72 个组件不足。核对当前导出清单、能力边界、包元信息和仓库根目录，整理 16 个通用组件与 5 个可选业务组件候选，同时列出 Picker／Form／Cascader／TreeSelect 等现有组件的能力补强，见 [组件覆盖规划](component-coverage.md)。清单是建议，未新增组件，未将候选数写入官网或 manifest。

根目录尚无项目自身 LICENSE、CONTRIBUTING、SECURITY、CHANGELOG 或 .github CI 配置，组件包也未声明 license 等发布元信息；已有测试脚本不等于自动 CI。开源许可、贡献流程、版本分发、官网部署和实际平台验收仍需补齐。本次仅核对并补充规划文档，检查差异，无组件代码改动，未重跑构建或 UI 回归。下一步优先推进通用复杂组件，并同步已有组件深度；许可证选择与正式发布另行明确。

## 2026-11-01：88 组件通用能力补强

用户批准继续补强后，在现有未提交官网工作上新增 16 个独立 easycom 组件：Autocomplete、TagInput、ColorPicker、DateRangePicker、Table、Descriptions、TextEllipsis、RichText、VirtualList、Waterfall、ImageCropper、Signature、QRCode、Video、Draggable、FloatingPanel。每个有独立指南和真实 .uvue 示例，manifest／官网目录与计数同步到 88；没有把组件模式和演示重复计数。

同时补强 Form 异步校验、嵌套路径、JSON 初始值重置与过期结果保护；Picker 多列联动；Cascader 懒加载／失败重试；TreeSelect 父子联动／半选；SwipeCell 双侧多操作；ImagePreview 有界缩放／平移。Checkbox 新增 indeterminate。既有同步 Form、单列 Picker、单侧 SwipeCell 的默认接口保留。

新增 advanced.uts 的数据与几何逻辑、platform/canvas.uts 的跨端 Canvas／H5 指针边界，以及保留 MIT 许可的 Nayuki QR 算法。签名与裁剪能导出真实 PNG；二维码以独立 jsQR 解码器验内容，jsqr 仅为开发测试依赖。static/mori-demo.webm 为本地 Canvas 生成的两秒 VP8 演示短片，无第三方素材。浏览器检查修复了裁剪预览比例和签名画布边框。文档检查现在兼容 CRLF，避免 Windows 示例被漏检。

本轮已完成的验证：

- check 与 check:docs：88 个精确目录、88 份指南、94 段 Vue/UTS 示例及 612 个本地链接通过。
- 完整 test:unit 通过；新增真实 Vue setup 覆盖异步过期／清除／重置／异常、级联取消／失败、半选与上限、不可变排序、标签去重、日期取消、虚拟窗口、裁剪几何、拖拽／面板和双侧操作。二维码包含 ASCII、网址、中文／Emoji 与长数字解码回环。
- H5、官网 VitePress、微信发行构建成功，Windows HBuilderX 5.34、Node 24.21.0。保留既有 Sass legacy/import、H5 withKeys／NodeListOf／onPageScroll 提示；最终构建未新增上述 Canvas 类型警告。
- Chromium 145.0.7632.6：test:strengthened 16 组真实浏览器交互通过，包括 Canvas 像素／PNG、裁剪取样、显示二维码解码、千条列表第 500 行跳转且挂载行数受限、异步表单／选择、树半选、双侧动作、缩放重置与实际视频帧播放。
- test:site 五组通过，全部 88 个文档和真实示例在 360px 挂载，无 pageerror／HTTP 错误／页面级横向溢出；1440／1280／768／390px 浅深主题与窄屏文档预览通过。一次设计检测为空列表。

当前证据在被忽略的 .impeccable/review/strengthen-*、strengthened-verification.json 和 site-verification.json。独立复核与设计文档同步的最终结论见下段。未提交、推送、发布或公网部署；本地官网为 http://127.0.0.1:5180。

边界：VirtualList 固定行高；Waterfall 依赖给定高度；RichText 为结构化展示；ColorPicker 为色板／hex；裁剪通过滑块定位，不含旋转；拖拽不含跨列表或边缘自动滚动；FloatingPanel 的屏幕定位由宿主负责。原生自动 Sticky、业务组件、地区包和文档上传未纳入本轮。原生 iOS／Android、微信真机、Safari、鸿蒙和真实业务服务仍待验收，Canvas/SVG/媒体格式的设备差异按新平台编号跟进。下一步按实际平台接入与开源发布要求推进。

补充回归：在本轮官网 H5 产物上，原基础 9 组、表单、分类与第二轮扩展套件全部通过；扩展套件对操作区定位改为按具体动作识别，保留旧默认单侧模式的断言，不再假定 DOM 永远只有一侧。

独立复核首轮提出五项：签名显示／导出比例、无缓冲虚拟列表半行窗口、空错误文案导致异步拒绝被误判通过、标签／颜色输入最终值、图片预览键盘边界。全部按失败回归修正，最终 reviewer 将五项均评分 resolved，remaining=clear、disposition=ship；该 verdict 只覆盖这五项修复。详见 [88 组件复核记录](expansion-review-88.md)。签名截图使用等长直角笔迹，导出像素宽高差不超过 2px；树半选重拍等待动画稳定。最终浏览器套件为 17 组通过，完整单元、H5／官网／微信构建及目录／指南检查均通过。

独立 documenter 已同步 DESIGN.md 和 design.json：新增组件尺度、半选、多列／树联动、双侧操作、Canvas 图像比例及媒体／面板边界。对象级核验确认既有核心和官网 token、20 个预览条目及旧扩展字段保留。最后更新只补充 TagInput/ColorPicker 成功提交后重建编辑器、丢弃迟到输入的行为，无新 token 变化。

本轮收尾完成；源码、官网和文档仍在当前工作区，未提交／推送。下一步按用户指定任务继续真机验收或开源发布准备，不把这些交付外事项当作本轮已完成。


## 2026-11-02：修复未提交代码审查的四项问题

按用户要求修复本轮审查发现的四项问题，保留已有官网与 88 组件扩展工作：

- 非 WEB 尺寸查询统一使用 getBoundingClientRectAsync；Canvas 与图片预览共用几何适配，窗口变化更新缓存，卸载清理监听和迟到结果。签名按笔测量当前位置，查询期间的触点／结束事件按顺序处理，清空／禁用／卸载丢弃待处理触点；等待绘制时禁止导出，避免遗漏刚写下的笔迹。
- Autocomplete 选择建议或键盘确认后重建 Input，丢弃宿主节流产生的旧回写，保持选中文本与收起状态。
- Cascader 点击当前层级路径不取消加载／清除错误；返回祖先仍使迟到结果失效。
- pages.json 的 MORI_PREVIEW 条件由 scripts/uni.mjs 显式开启并保留调用方其他自定义条件。HBuilderX 直接运行四个工作台页面，无需官网生成文件；npm 构建继续生成并编译第五个预览页面和 88 个示例。

验证：check、check:docs（88 指南／94 示例／616 链接）与完整 test:unit 通过。补充的 platform-geometry 测试使用仅有异步查询的微信 UniElement 接口替身，并运行真实 Signature setup，覆盖测量失败／窗口竞态／取消监听、快速连续笔迹、清空、导出等待；最终补充测试通过。H5／VitePress／微信发行构建通过，最终微信产物中 geometry、canvas、image-preview 已无同步 getBoundingClientRect 调用。Chromium 145.0.7632.6 最终 17 组浏览器回归通过，包含快速输入后立即选中与加载中点击当前路径；官网五组／88 个示例巡检通过，签名导出保护补充后重新构建并执行了 17 组回归。

另以 Git 可见源码创建干净副本，确认没有 catalog.uts／site-preview-content，直接调用 HBuilderX 5.34 编译器（不执行 site-prepare、不设置 UNI_CUSTOM_CONTEXT）完成 H5 构建，产物没有预览页面。这验证了直接 IDE 构建路径，不冒充原生 App 或真机验收。既有 Sass 弃用和 H5 withKeys 等提示保留；没有新增设备运行证据。

文档已同步组件指南、API 说明、使用手册、官网／架构／验证说明、设计规范及兼容记录。日志与干净副本验证结果位于被忽略的 .impeccable/review/fix-review-* 和 ide-clean-verification.json。官网静态预览仍为 http://127.0.0.1:5180。未提交、推送或发布。下一步按用户指示继续，微信／iOS／Android／Safari／鸿蒙实际设备验收仍待完成。

## 2026-11-02：任务进度核对与 iOS 上传未完成项

按用户要求查看「拉取一下最新的代码吧」聊天（01a19216-a0d8-7621-b230-2d2d21f231a6）。该聊天在 09:14:51（Asia/Shanghai）因模型 token rate limit 中断，状态为 systemError；最新工作是 iOS 系统相册与上传适配，尚未收尾。

本地已有 mori-upload-ios 原生模块、PHPicker 相册读取与临时文件复制、URLSession 上传、UTS 桥接及取消／文件释放逻辑。原聊天记录显示 upload-transport、upload-ios、extension-components 定向测试通过；iOS 测试使用桥接替身，不能证明 Swift 编译或真机运行通过。本次只核对聊天记录和当前文件，没有重跑测试或构建。

待办：继续复核原生实现，补充模块接入与平台说明，将 upload-ios 测试接入常规测试脚本，验证改动后的跨端构建，并在具备 iOS 工具链与设备时完成原生编译、相册／iCloud 与真实上传验收。上一节四项修复的构建证据早于本次上传修改，不能直接覆盖新代码。当前仍有未提交源码；HEAD 与本地 origin/master 引用均为 59f2cdd，本次未 fetch、提交或推送。下一步由用户指定是否继续此未完成工作。

## 2026-11-02：继续完成 iOS 相册上传源码与本机验证

按用户要求接续此前中断的工作。APP-IOS 的默认选择与上传接入同级 `mori-upload-ios` 模块：PHPicker 读取所选照片（等待 iCloud），在系统回调 URL 失效前复制至应用临时目录；拍照使用 UIImagePickerController 并实际编码 JPEG；URLSession 执行可取消的前台 multipart 上传。原生模块最低 iOS 14，宿主框架更高的最低版本要求仍适用；新增相机用途 Info.plist 和随模块分发的 README。其他平台继续使用 uni 媒体与网络 API，预览仍用 uni.previewImage。

复核时新增回归，实际复现旧上传失败回调会中断同文件新重试；已改为按请求实例检查回调。补齐默认文件在拒绝、异常、清空、禁用、外部移除、远端 URL 替换和卸载时的所有权测试；自定义 chooseFiles 文件仍由调用方管理。Swift 复制失败路径补上部分目标文件清理，但此分支未在原生环境执行。upload-ios 桥接测试已纳入 test:unit，打包检查要求两个模块与原生配置完整。

本次验证：check、check:docs、完整 test:unit 通过；HBuilderX 5.34 的官网 H5／VitePress 与微信发行构建通过（调用者 Node 24.21.0）。保留已有 Sass 弃用、H5 withKeys／onPageScroll 等提示。Chromium 145.0.7632.6 的 test:catalog 通过，另验证 Upload 文档、390px 深色真实选图／中文文件名／等待态／删除，无 pageerror，截图已查看；微信上传产物核对没有 iOS 桥接依赖。日志与截图为 `.impeccable/review/ios-upload-*`，汇总为 ios-upload-verification.json。

接入、生命周期、平台编号、设计行为与兼容记录已同步；官网预览为 http://127.0.0.1:5180/components/upload。源码与本机可执行的收尾已完成，未提交、推送或发布。仍缺 Xcode／iOS SDK／签名／设备与真实业务服务，因此没有 Swift 编译、相册／iCloud 实际读取、HEIC／相机编码、原生上传或后台行为通过的结论。下一步在 iOS 环境制作含本模块的自定义基座，按 MORI-UP-IOS-01 至 06 验收；没有实现后台续传、默认文档选择、HEIC 转码或跨进程持久恢复。

## 2026-11-02：补齐插件使用指南并整理提交与推送

按用户要求，将当前积累的官网、72→88 组件扩展、审查修复、iOS 上传模块及文档统一纳入本次提交，推送目标为 origin/master。提交前 fetch 确认远端仍为 59f2cdd，与本地提交基线一致，无分叉。截图、日志、生成示例、构建输出与依赖目录继续按 .gitignore 排除；源码中保留可复现的生成脚本和关键验证结论。

新增 [iOS 上传插件使用指南](ios-upload.md)：两个模块的复制安装、权限／自定义基座、完整 .uvue 页面示例、服务端协议、临时文件生命周期、插件 API、常见问题与验证边界。README、使用手册、Upload 文档及插件 README 增加入口，官网左侧「开始使用」增加插件导航。

本次 check、check:docs、指南示例结构与真实属性／事件核对通过；VitePress 文档构建成功，Chromium 实际检查 /ios-upload 的标题、内容及侧栏入口，无 pageerror。暂存检查清理了 vendor/qrcodegen.uts 的行尾空格，核对非空白内容完全相同，许可保留。组件行为没有变化，沿用上一节已完成的完整单元、H5／微信构建与上传浏览器回归证据，没有为文档重复整套 UI 构建。提交／远端最终状态以 Git 记录为准，前文“未提交／未推送”对应当时状态。未发布组件包或部署公网，下一步仍是 iOS 原生编译、设备与真实服务验收。
