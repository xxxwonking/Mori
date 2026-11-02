# 兼容性与验证记录

更新日期：2026-10-31。当前 72 组件扩展在 Windows / HBuilderX 5.34 完成构建与 H5 检查，见文末记录。原四组件及 macOS 表单／反馈记录保留各自历史版本，不能混作本轮环境。

此表记录已经取得的证据，不把平台目标等同于完成验证。

| 平台 | 构建 | 运行验证 | 状态 |
|---|---|---|---|
| H5 | 通过发行构建 | Chromium 145，360/390/768/1024/1280/1440px | 首版已验证，Safari 尚待测试 |
| 微信小程序 | 通过发行构建 | 未连接微信开发者工具 / 真机 | 已编译，待运行验证 |
| Android App | 已配置 uni-app x 蒸汽模式 | 未打包 / 未连接设备 | 待原生编译与真机验证 |
| iOS App | 已配置 uni-app x 蒸汽模式 | 未打包 / 未连接设备 | 待原生编译与真机验证 |
| HarmonyOS NEXT | 按组件兼容目标组织源码 | 未配置鸿蒙工具链 / 未连接设备 | 尽力支持，尚未验证 |

| 组件 | H5 交互 | 微信编译 | iOS / Android / 鸿蒙 |
|---|---|---|---|
| Button | 尺寸、变体、点击、键盘、加载、禁用 | 通过 | 待验证 |
| Input | 输入同步、图标清空/显隐、单边框焦点、禁用、错误恢复 | 通过 | 待验证 |
| Switch | 自定义轨道、双色/状态文字、键盘、全局主题、过渡 | 通过 | 待验证 |
| Checkbox | 自绘选中态、整行点选、禁用、全局主题、过渡 | 通过 | 待验证 |
| 全局主题 | 自动跟随、固定浅/深色、恢复自动、品牌色传播 | 通过 | 原生事件接入完成，待设备验证 |

## 验证方式

- `npm run check`：JSON 配置、easycom 目录、组件不依赖浏览器全局对象。
- `npm run build:h5`、`npm run build:weixin`：使用本机 HBuilderX 官方编译器，输出到 unpackage/dist/build。
- `npm test`：Playwright 驱动实际 H5 产物，记录到 `.impeccable/review/verification.json`。自动化模拟浏览器明暗偏好验证全局主题。
- `npm run test:motion`：实际采样 Switch 的 transform 和 Checkbox 的 opacity，检查中间帧、尺寸稳定、快速反向切换与 H5 减少动态效果设置；不代表所有设备的帧率。
- 亮/暗、桌面/移动端、输入与错误状态的截图保存在 `.impeccable/review/`。

运行步骤见 [验证与排障](testing.md)，最新接力状态见 [当前进度](progress.md)。`review/` 被 Git 忽略，迁移项目后可能需要重新生成证据。

构建可能提示 Sass legacy API 弃用（来自编译器）、H5 键盘修饰符类型提示；这些不是原生兼容性通过的证据。DCloud / 微信 AppID 留空产生的提示，需在实际应用中填写自己的 ID。

## 主题与平台边界

- App 使用 `getDeviceInfo().osTheme` 与 `onOsThemeChange`；全局显式设置同步调用 `setAppTheme`。
- H5 / 微信使用 `getAppBaseInfo().hostTheme` 与 `onHostThemeChange`；需要 manifest 开启 darkmode。
- 手动主题控制本库组件。系统键盘、系统选择器、微信原生弹窗的主题由平台管理。
- H5 的布局、字体与键盘辅助样式放在 WEB 条件编译区。App 使用原生滚动容器；H5 与微信使用页面滚动。
- iOS / Android / 鸿蒙发布前，需要使用真实项目 AppID、签名配置并分别验收系统返回、安全区、软键盘、字体缩放及系统主题切换。

## 官方参考

- [uni-app x 项目结构](https://doc.dcloud.net.cn/uni-app-x/project.html)
- [亮暗主题与主题 API](https://doc.dcloud.net.cn/uni-app-x/api/theme-change.html)
- [manifest 配置](https://doc.dcloud.net.cn/uni-app-x/collocation/manifest.html)


## 表单基础扩展：本轮新增证据

Form／FormItem、Radio／RadioGroup、CheckboxGroup、Textarea 已通过 H5 与微信发行构建。H5 采用系统 Chrome 156.0.8078.74 验证：同步校验、错误与 ARIA 关联、单选键盘／禁用、多选上限、字数限制、重置清错、深色及 360／390px 无横向溢出。原四组件功能 9 组与动效 5 项回归通过。

微信只验证构建，未验证开发者工具与真机；Android／iOS／鸿蒙／Safari 仍无新增运行证据。Node 单元测试会剥离 UTS 类型，不等同于原生编译。

本机旧编译器通过临时插件目录读取项目 Sass；微信使用配套 Node 22.22.2 避免 cachedDataRejected，H5 使用 Node 26.6.0。临时目录结束后清理；Windows junction 分支有代码与布局测试，但未在 Windows 实机执行。此处版本记录是复现环境，不是推荐安全版本；更新事项见 progress.md。


## 反馈组件：本轮新增证据

Toast／Popup／Dialog 已通过 H5 和微信发行构建。Chrome 156.0.8078.74 验证 Toast 生命周期、模态／非模态弹层、嵌套 Escape、焦点和滚动恢复、Dialog 防重复、390px 深色布局、真实过渡中间帧与减少动态效果。原功能 9 组及表单套件回归通过。结果见 `.impeccable/review/feedback-verification.json`。

微信运行、Safari、App 编译与设备未新增证据。Popup 根级挂载、App 安全区／页面滚动适配及读屏背景隔离限制见组件 API 与 progress.md；不可将 Chrome 键盘测试外推为完整读屏或原生验收。

底部弹层动效调整后再次通过 H5／微信构建与 Chrome 反馈回归。按用户澄清恢复面板淡入后，Chrome 实测 transform 连续、首帧透明、淡入／淡出有连续中间态、尺寸稳定，快速退出后重开和减少动态效果正常；不外推为其他平台帧率或手感结论。

最新 H5 方向回归补充实际屏幕坐标与外壳 scrollTop：修正聚焦滚动抵消位移的问题，面板从视口下沿向上进入。已验证 Chrome；overflow: clip 和焦点 preventScroll 在 Safari／其他 WebView 尚未实际验证。微信构建通过，WEB 适配不进入微信产物。

## 2026-10-31：40 组件扩展与最终自检

基线 `e08185e`，新增 27 个组件并保留原 13 个组件。环境：Windows、HBuilderX 编译器 `5.34.2026102821.2458`、Node `24.21.0`、Playwright Chromium `145.0.7632.6`。预览使用 5174，避免干扰已有 5173 进程。

| 检查范围 | 本轮结果 |
|---|---|
| 40 个组件的 H5／微信发行构建 | 最终源码均构建成功；仍有 Sass 弃用、H5 withKeys／NodeListOf 类型提示 |
| 原基础、表单、反馈 | 基础 9 组、表单套件、反馈套件通过；Input 结束编辑参数修正后再次通过基础与表单回归 |
| 新增组件 H5 | 分类套件通过：内容状态、导航键盘／禁用、分页边界、气泡关闭、通知／折叠、数值、Picker 取消／确认、日历范围／禁用日期、日期时间、图片选择／删除 |
| 快速编辑 | Stepper 超限／空值、负号／小数草稿、连续失焦、键盘确认、直接点增加、逐字符输入均通过；Input 的 blur/confirm 返回宿主最终值；Search 连续输入后立即 Enter／点击搜索使用完整文本 |
| 动画和主题 | Transition 实测连续中间帧、快速反向与减少动态效果；Slider 实际 range 的名称／禁用与深色轨道／拇指通过 |
| 布局与截图 | 分类页 1280px 浅色、390px 深色及 360px 宽度检查通过；最终 5 张分类截图人工及独立复核已查看 |
| 文档与逻辑 | 40 份组件指南、42 段 Vue/UTS 示例结构和本地链接检查通过；单元测试含真实 Vue setup 和可控上传传输回调 |
| 独立复核 | 原 6 项发现全部修复并复核通过，结论 ship-with-caveats；完整范围见 [扩展自检记录](expansion-review.md) |

上传的真实浏览器文件选择已运行；请求形状、状态码、进度、重试、取消、迟到回调通过测试替身验证。**没有真实业务后端接收、原生 iOS／Android 编译与设备、微信开发者工具／真机、Safari 或鸿蒙运行证据。** 本机无 iOS 工具链／签名及设备，adb 不在 PATH，项目 AppID 留空。iOS 权限、HEIC、沙盒路径、后台任务和 ATS 等按 [编号清单](platform-adaptation.md) 跟进；默认上传仅图片及前台传输。

原始证据：`.impeccable/review/expansion-build-h5.log`、`expansion-build-weixin.log`、`catalog-verification.json`、`verification.json`、`forms-verification.json`、`feedback-verification.json` 及 `catalog-*.png`。目录被忽略，本节保存可随仓库分发的结论；复现命令见 [验证与排障](testing.md)。

## 2026-10-31：72 组件扩展

本轮沿用 Windows HBuilderX `5.34.2026102821.2458`，调用者 Node `24.21.0`，浏览器 Chromium `145.0.7632.6`。新增加的 32 个组件与原 40 个共同构建。

| 检查范围 | 结果与边界 |
|---|---|
| H5／微信发行构建 | 当前源码两端成功；Sass legacy/import、H5 withKeys／NodeListOf 提示仍存在 |
| 新增真实 H5 交互 | 图片失败／恢复、受控轮播、图片翻页／Escape、宫格、分段键盘、侧栏、筛选取消／确认、步骤、悬浮操作、级联／树选择、密码格／键盘、加载失败／重试、刷新、滑动操作、索引、倒计时与数字完成均通过 |
| 回归 | 原基础 9 组与原 test:catalog 通过，无 pageerror；没有改动的表单／反馈专用套件未无故重复执行 |
| 主题／布局 | 四个新增分类的 1280px 浅色、390px 深色截图已查看，360px 级联弹层检查通过；无文档级横向溢出 |
| 单元／文档 | 完整 test:unit 通过，新增真实 Vue setup 与模拟时钟；72 份指南、74 段 Vue/UTS 示例结构与本地链接检查通过 |

图片示例使用本地几何 SVG，未依赖外部图片服务。浏览器加载／刷新通过本地延时模拟，不代表真实后端。手势单元测试与 H5 操作不等于 iOS／Android／微信触摸验收。Sticky 的 APP 默认模式为普通流，自动 CSS 吸顶只用于 WEB／MP；SafeArea 的设备转向由使用方更新 size。新增平台编号见 [适配清单](platform-adaptation.md)，原 iOS 上传编号继续保留。

本轮没有新增 Xcode／签名、Android 设备、微信 AppID／开发者工具、Safari 或 HarmonyOS 工具链运行证据，不扩大上轮的平台声明。原始日志为 `.impeccable/review/expansion-h5.log`、`expansion-weixin.log`、`expanded-verification.json`、`expanded-*.png`。独立复核结果另见 progress.md 本轮最终记录。

## 2026-10-31：官网与 72 个独立 H5 预览

官网采用 VitePress，示例由现有 uni-app x 编译器构建到 `/demo/`。本机 HBuilderX 5.34、Node 24.21.0：新增预览页及示例的 H5／微信发行构建成功。Chromium 145.0.7632.6 下全部 72 个示例在 360px 视口挂载成功，无页面级横向溢出；官网的 72 个组件文档地址返回正常，浏览器没有 pageerror 或 HTTP 资源失败。

官网首页按钮／输入／模拟保存、站内全文搜索与分类搜索、二维码、独立打开、预览主题与重置、弹层展开、1440／1280／768／390px 布局和窄屏内联预览通过。补充验证浅色宿主下强制深色预览的文字颜色与弹层完成进入后的实际几何位置；原工作台基础 9 组和分类回归通过。证据位于 `.impeccable/review/site-verification.json`、`site-layout-verification.json`、`site-*.png` 和 `site-*-build.log`。

这些是官网与 H5 示例的新增证据，不表示全部 72 个组件每一种状态、所有平台或触摸交互都已完成验收。保留 Sass、H5 withKeys／NodeListOf 等编译器提示；新 BackTop 示例的 onPageScroll 导入有编译器类型提示，H5 构建成功。微信真机、iOS／Android、Safari、鸿蒙及真实业务服务的待办不变。

## 2026-11-01：88 组件补强

沿用 Windows HBuilderX 5.34.2026102821.2458、Node 24.21.0。最终 H5（含官网示例）、VitePress 与微信发行构建成功；既有 Sass legacy/import、H5 withKeys／NodeListOf／onPageScroll 提示保留，新 Canvas 图片类型／指针提示已处理。

Chromium 145.0.7632.6 下 16 组新增交互通过：真实签名像素与 PNG、裁剪采样变化及 400×400 输出、实际显示二维码解码、定高列表第 500 项定位与有限挂载、标签键盘输入、自动补全、数字排序、异步嵌套表单和重置、多列选择、级联异步加载、树半选、双侧操作、图片缩放重置、排序按钮、面板高度及本地视频帧播放。完整单元套件与 88 份指南检查通过。

官网五组测试与全部 88 个示例在 360px 巡检通过；1440／1280／768／390px 浅深布局、搜索、二维码及窄屏内联预览通过，无 pageerror／HTTP 资源错误或页面级横向溢出。截图经主线程查看。主要报告为 .impeccable/review/strengthened-verification.json、site-verification.json、strengthen-site-build-final.log、strengthen-weixin.log。

鼠标／键盘自动化与单元合成触摸不等于真实设备手感。没有新增原生 iOS／Android 编译、微信运行、Safari、鸿蒙或真实上传后端证据；编译器输出“未检测出鸿蒙兼容性问题”不是鸿蒙编译或设备通过。Canvas 图像导出、SVG data URI 显示、媒体编码及原生容器 resize 按 CANVAS-01/02、QR-01、VIDEO-01、VIRTUAL-01、GESTURE-02、FORM-ASYNC-01 跟进。

独立复核后完成五项定向修复：签名显示和 PNG 同为 5:3（等长笔迹像素对比）、虚拟列表 overscan=0 半行及近尾部、异步 reject 空文案兜底、输入最终值与迟到回写、非 280px 图片视口的双向键盘边界及 resize 收敛。最终 test:strengthened 为 17 组通过；完整 test:unit、H5／VitePress／微信构建再次通过。原基础 9 组、表单、分类和第二轮扩展套件在本轮 H5 产物上通过。独立 verdict 为五项 resolved / ship，仅覆盖修复清单。原始最终记录为 strengthen-review-site-build.log、strengthen-review-weixin.log、strengthen-review-browser.log 与 strengthen-independent-verdict.md。


## 2026-11-02：四项审查修复

非 WEB 的图片预览和 Canvas 尺寸查询统一改为 getBoundingClientRectAsync，窗口变化后更新缓存；签名排队处理异步查询期间的触点，并在处理完成前禁止导出。接口替身测试覆盖仅有异步查询的微信 UniElement、查询失败／竞态／卸载、连续快速笔迹、清空与导出时序。此测试不等于微信真机通过。

Windows HBuilderX 5.34 的干净源码 H5 编译通过：只复制 Git 可见文件、不带 catalog.uts 和 site-preview-content，直接调用编译器，不执行 site-prepare。默认 IDE 构建为四个工作台页面；npm 构建显式开启 MORI_PREVIEW，继续编译五个页面及全部 88 示例。构建与浏览器的最终结果见 progress.md 本日记录；iOS／Android、微信真机、Safari 与鸿蒙设备证据仍未增加。

## 2026-11-02：iOS 相册上传独立适配

APP-IOS 新增 mori-upload-ios（PHPicker／临时副本／URLSession），公开 Upload 参数保持不变，复制时需包含两个 uni_modules 模块。原生最低 iOS 14，宿主框架可能要求更高版本；配置、权限及自定义基座步骤见 [模块说明](../uni_modules/mori-upload-ios/README.md)。

本次 Windows HBuilderX 5.34、Node 24.21.0 完成官网 H5／VitePress 和微信发行构建。完整单元、配置与文档检查通过；Chromium 145.0.7632.6 的分类回归、Upload 文档与 390px 深色真实选图／中文文件名／删除通过，无页面错误。微信上传产物继续调用 uni.chooseImage／uni.uploadFile，无 iOS 桥接依赖。原始资料为 `.impeccable/review/ios-upload-*`。

iOS 路由、参数、取消、迟到文件清理使用桥接替身；组件文件所有权与重试隔离运行真实 Vue setup。它们不执行 Swift。**没有新增 iOS 原生编译／真机／iCloud／相机／真实上传服务证据**，也没有新增 Android、微信真机、Safari 或鸿蒙运行证据。仍需按 MORI-UP-IOS-01 至 06 实测，不能沿用 H5／微信构建结果给 iOS 标绿。
