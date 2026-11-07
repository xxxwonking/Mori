# 开源与分发

Mori UI 使用 [MIT 许可证](../LICENSE)。允许商业使用、修改与分发，需保留版权和许可声明；第三方资源继续遵守 [第三方声明](../uni_modules/mori-ui/THIRD_PARTY_NOTICES.md)。

当前本机检查结论、已修复问题和证据边界见 [开源准备复核](open-source-readiness.md)。

## 当前接入形式

组件采用 uni-app x 的 `uni_modules` 目录分发，同时复制：

```text
uni_modules/mori-ui/
uni_modules/mori-upload-ios/
```

两个目录各自包含 LICENSE 与 package.json。不要把私有的工作台根项目发布到 npm，也不要只复制单个 `.uvue` 文件：组件依赖同包主题、逻辑、样式、静态图标和 iOS 模块。安装与主题步骤见 [使用手册](user-guide.md)。

## 生成与核对分发目录

```sh
npm run package:prepare
npm run package:verify -- dist/mori-ui-0.1.0-实际目录后缀
```

第一条命令会输出本次创建的实际目录。每次使用新目录，保留已有候选；第二条命令请传入真实输出路径。目录包含两个完整 uni_modules、许可、独立接入说明和 `mori-distribution.json` 的 SHA-256 文件清单。

生成前检查根项目、manifest、两个模块及锁文件的版本一致性，核对 88 个 easycom 目录、源码相对依赖和静态资源。分发模块内的隐藏文件、额外依赖、符号链接或未声明文件类型会被拒绝。核对命令检查文件内容、大小、清单及依赖；哈希用于发现文件变化，不是发行者身份签名。

分发目录不包含工作台、源码根的微信个人配置、构建缓存或 node_modules；模块 README 和第三方许可保留。当前生成的是本地开发候选，并不自动创建标签、GitHub Release、npm 包或插件市场版本。

## 独立工程接入检查

```sh
npm run test:distribution
npm run test:weixin-styles
npm run test:consumer
```

前两项不需要 HBuilderX，覆盖依赖闭合、文件被改动／漏包／混入私有文件的拒绝，以及微信组件选择器与禁用样式契约。最后一项需要已安装的 HBuilderX Vue3 编译器与 Playwright Chromium；可设置 `HBUILDERX_HOME` 和 `MORI_BROWSER_EXECUTABLE`。

`test:consumer` 从实际候选复制两个模块，新建只有单页的 uni-app x 工程，不链接本仓库工作台或 node_modules。编译器和 Sass 仍来自维护者已安装的工具链。它编译 H5／微信、核对 88 个 easycom 注册与组件 WXSS，再在浏览器检查输入、Switch、Popup、禁用状态、主题、内置提示及全部组件挂载。相机、网络上传、原生系统权限和真机不在此检查范围。

编译日志、测试截图、报告和工程路径写入 `.impeccable/review/consumer-*` 及 `mori-consumer-*`。`consumer-latest.json` 指向最近一次尝试，`consumer-report.json` 只在成功时写入；判断结果时应确认报告工程与最近尝试相同。原始目录被 Git 忽略，关键结论需记录在进度与兼容文档中。

只调整浏览器检查时可用 `npm run test:consumer -- --reuse`，复用最近工程。它会检查分发清单、当前模块与验证工程的完整运行时文件集合及内容，以及工程输入是否晚于构建产物；新增、删除或修改代码／资源均拒绝复用。当前仓库仅更新 Markdown 或 LICENSE 不改变运行时文件集合，仍可复用。新接入验收和组件源码变化使用不带参数的完整命令。

## 正式发布前检查

1. 更新两个模块与工作台版本、锁文件及 CHANGELOG，将已验证平台和限制写入 [兼容记录](compatibility.md)。不能把未验证平台写成支持通过。
2. 在干净检出中运行 `npm ci`、`npm run check`、`npm run check:docs`、`npm run test:unit`。
3. 运行 H5／微信构建以及对应浏览器检查；移动端至少检查 320／390px、横屏、长内容、触控和浅深主题。原生／微信真机／Safari 按 [移动端接入](mobile-adaptation.md) 单独验收。
4. 在新建 uni-app x 工程中复制完整两个模块，使用 easycom 挂载 Button、Input、Popup、导航与 Upload，确认资源路径及模块依赖。复制接入验收与本仓库示例构建是不同检查。
5. 分发物只含两个模块、许可与必要说明，不包含 node_modules、签名、个人图片、测试令牌或构建缓存。
6. 检查版本、变更说明和实际分发文件后，再由维护者创建标签与 Release／插件市场版本。发布地址和最低系统版本以该版本说明为准。

仓库 CI 只运行不需要私有工具链的源码检查，HBuilderX 构建与设备验收仍需提供独立结果。本次补齐发布基础，不执行推送、标签、发布或官网部署。
