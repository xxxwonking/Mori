# 参与 Mori UI

感谢帮助改进 Mori UI。项目采用 [MIT 许可证](LICENSE)；提交贡献时，请确保有权按此许可证提供代码，保留第三方来源与许可。

## 开始前

- 先查已有 Issue，提供目标平台、系统／浏览器、HBuilderX 版本、最小 `.uvue` 示例、预期与实际行为。
- 缺陷修复可直接提交 PR；新组件、大型 API 变更先在 Issue 说明使用场景与兼容策略。
- 阅读 [工程说明](docs/architecture.md)、[设计规范](DESIGN.md)、[组件 API](docs/components.md) 与相关组件源码。工程是 uni-app x / UTS，不是普通 Vue 组件包。

## 本地开发

使用 Node.js 24 与 npm，运行 `npm ci`。基础检查不依赖 HBuilderX：

```sh
npm run check
npm run check:docs
npm run test:unit
npm run test:distribution
npm run test:weixin-styles
```

UI 改动需要安装带 Vue3 编译器的 HBuilderX；非默认安装位置设置 `HBUILDERX_HOME`。执行 `npm run site:build`，再在独立终端运行 `npm run site:preview`。浏览器检查前执行 `npx playwright install chromium`，随后按改动选择 `npm run test:mobile`、`npm run test:theme` 或其他 [定向检查](docs/testing.md)。`npm run build:weixin` 验证微信编译；构建与 Chromium 模拟均不等于真机通过。

## 改动约定

- 核心组件在 `uni_modules/mori-ui`；浏览器 API 只放在 `platform/` 的 `WEB` 分支。
- 保留 36px 默认按钮／输入、13px 控件文字、12px 标签、黑白中性主色和自动主题。优先复用公共逻辑。
- 修复缺陷时增加能复现原问题的检查；不要为了通过而删断言，也不要只修示例。
- API 变更同步逐组件指南、总 API 和使用手册；视觉变更同步 DESIGN.md 与 `.impeccable/design.json`。
- 新组件同步 manifest、easycom 目录、真实示例和独立指南。生成的示例、构建文件和原始测试截图不提交。
- PR 描述写清问题、行为变化、验证范围和仍缺少的设备证据。请勿提交签名、AppID 密钥、个人图片或业务令牌。

## 合并与发布

PR 的自动检查执行目录、文档和单元测试；HBuilderX 构建及设备验收由维护者另外执行。发布流程见 [分发说明](docs/releasing.md)。当前 0.1.0 为开发版本，尚未正式发布；公开 API 的调整需在 CHANGELOG 说明迁移方式。

CI 同时检查分发目录的依赖与完整性，并保留 7 天的源码候选产物；产物上传不是正式发布。跨组件或分发改动请在本机补做 `npm run test:consumer`。微信开发工具个人配置被忽略；首次导入可复制 `project.config.example.json` 为 `project.config.json`，再使用自己的 AppID。
