# 架构与维护位置

## 代码分层

| 路径 | 职责 |
|---|---|
| `App.uvue` / `main.uts` | 应用入口；启动时初始化一次主题监听 |
| `manifest.json` / `pages.json` / `theme.json` | 平台开关、页面与导航主题配置 |
| `uni_modules/mori-ui/components/` | 四个可复用组件，目录和文件同名，供 easycom 发现 |
| `uni_modules/mori-ui/theme.uts` | 全局响应式配置、主题来源、语义颜色 |
| `uni_modules/mori-ui/styles/tokens.scss` | 浅色基础 token 和公共尺寸；不是全部动态主题来源 |
| `uni_modules/mori-ui/contrast.uts` | 不透明 hex／rgb 的黑白前景选择 |
| `uni_modules/mori-ui/platform/accessibility.uts` | H5 实际输入元素的 ARIA 适配；DOM 部分有 WEB 条件编译 |
| `uni_modules/mori-ui/static/icons/` | Lucide SVG 亮暗版本，随模块复制 |
| `pages/index/index.uvue` / `workbench.scss` | 展示工作台和样例状态 |
| `pages/index/catalogue.uts` | 工作台中的 API 表格；需要与公开文档同步 |
| `components/demo-form/demo-form.uvue` | 本地模拟业务表单，不属于核心包 |
| `scripts/` / `tests/` | HBuilderX 编译入口、静态预览、浏览器与对比度验证 |
| `DESIGN.md` / `.impeccable/design.json` | 设计 token／说明，以及文档面板的静态 HTML/CSS 样例 |

`unpackage/`、`node_modules/` 和测试截图是产物或依赖，不应成为手工修复源文件。`.impeccable/design.json` 的组件样例用于文档预览，不是运行组件实现。

## 主题如何流动

1. `App.uvue` 在 `onLaunch` 调用幂等的 `initMoriTheme()`。
2. H5／微信读取 `hostTheme` 并监听 `onHostThemeChange`；App 读取 `osTheme` 并监听 `onOsThemeChange`。
3. `setMoriConfig` 局部更新配置。`auto` 采用宿主／系统状态；`light`／`dark` 固定模式。App 分支调用 `setAppTheme`。
4. `moriIsDark` 和 `moriPalette` 计算最终结果，组件读取 computed；实例属性可以覆盖颜色。

不要直接写只读导出，也不要在每个组件各注册一次主题监听。`tokens.scss` 的颜色是样式基础，修改它不一定改变运行时内联配色；更改主题要一起查看 `theme.uts` 和组件中的暗色样式。

## 组件与业务的边界

Input 接收字符串 `modelValue`，发出 `update:modelValue` / `change`；错误字符串由业务提供。Switch 和 Checkbox 只处理 boolean 状态及一次切换事件，不持有另一份内部业务状态。Button 处理展示和是否允许点击，不执行网络提交。

组合表单负责必填、邮箱和同意选项校验，通过短计时器模拟保存；无后端、无云函数、无资料持久化。新增业务功能应留在使用方，不直接混进核心组件。

## 必须知道的坑

### 实际 input 与 uni-input 外壳

H5 的 `uni-input` 报告的标准化 `tagName` 可能也是 `INPUT`，但它并不是实际可聚焦的 HTML input。现有适配用 `instanceof HTMLInputElement` 区分，再通过原生 `Element.prototype.querySelector` 查找内部输入，并在 `nextTick` 后同步名称、必填、错误和描述关系。不要退回只检查 `tagName`，也不要只把 ARIA 写在外壳上。

### 焦点不是选中数据

输入的状态边界由外框独占：1px，聚焦换色，不加粗、不挂外圈。错误聚焦继续保留错误消息和 `aria-invalid`。Checkbox／Switch 的选中状态来自 `v-model`；键盘焦点另行可见，不能把鼠标选中永久画成焦点框。

跨端容器可能裁切外置轮廓。Switch 把键盘轮廓放在轨道上，在操作容器内预留 4px 水平空间；调整时检查轮廓完整，而不是只断言 CSS 存在。

### 图标与动画

使用独立 SVG 加 `<image>`，不要把 Web 内联 SVG 当作各端都能使用的实现。保持浅深版本和来源许可。Checkbox 的勾始终挂载，用 opacity／scale 过渡；Switch 滑块用 transform，避免切换时插入节点或修改外部宽度造成跳动。

动画源码使用跨端样式；H5 有减少动态效果媒体查询。编译通过不能证明原生渲染器上的动画或系统偏好已验证。

### 工作台不是修复终点

不要靠展示页 `transform: scale()` 把实际过大的组件缩小；尺寸应在组件和 token 内控制。工作台有自己的断点、字体继承和演示配色，复制核心包时不会自动复制这些页面规则。

## 新增一个组件时

沿用 `uni_modules/mori-ui/components/mori-名称/mori-名称.uvue`，先明确 props、事件与状态。复用主题与必要的基础样式，处理平台差异，再添加工作台示例、`catalogue.uts` 说明、组件 API 和进度条目。

`scripts/check.mjs` 当前对四个导出组件做精确断言，新组件需要有意更新列表。浏览器脚本依赖示例结构；新增有意义的行为覆盖，避免为简单样式常量堆叠重复测试。
