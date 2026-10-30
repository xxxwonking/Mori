# 兼容性与验证记录

更新日期：2026-10-30。下方原四组件记录使用 HBuilderX 5.34；最新表单扩展复核使用本机编译器 5.26.2026091411.1611，具体见新增记录。

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
