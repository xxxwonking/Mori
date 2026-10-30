# 兼容性与验证记录

更新日期：2026-10-30。使用 HBuilderX 5.34.2026102909，Vue3 编译器 5.34.2026102821.2458。

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
