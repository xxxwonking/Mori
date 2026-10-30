# 架构与维护位置

## 代码分层

| 路径 | 职责 |
|---|---|
| `App.uvue` / `main.uts` | 应用入口；启动时初始化一次主题监听 |
| `manifest.json` / `pages.json` / `theme.json` | 平台开关、页面与导航主题配置 |
| `uni_modules/mori-ui/components/` | 十三个可复用组件，目录和文件同名，供 easycom 发现 |
| `uni_modules/mori-ui/theme.uts` | 全局响应式配置、主题来源、语义颜色 |
| `uni_modules/mori-ui/styles/tokens.scss` | 浅色基础 token 和公共尺寸；不是全部动态主题来源 |
| `uni_modules/mori-ui/contrast.uts` | 不透明 hex／rgb 的黑白前景选择 |
| `uni_modules/mori-ui/validation.uts` | 顶层字段同步校验、错误集合操作、Form 公开类型 |
| `uni_modules/mori-ui/form-context.uts` | Form 的错误状态及 FormItem 的标签／必填／错误／描述上下文 |
| `uni_modules/mori-ui/selection.uts` | 字符串单选、不可变多选数组、方向键索引和输入长度限制 |
| `uni_modules/mori-ui/feedback.uts` | Toast 选项／实例类型和可取消的提示计时逻辑 |
| `uni_modules/mori-ui/overlay.uts` | Popup 栈次序和过渡生命周期辅助逻辑 |
| `uni_modules/mori-ui/platform/accessibility.uts` | H5 实际输入元素的 ARIA 适配；DOM 部分有 WEB 条件编译 |
| `uni_modules/mori-ui/platform/textarea-accessibility.uts` | H5 实际 textarea 的无障碍属性同步 |
| `uni_modules/mori-ui/platform/selection-accessibility.uts` | H5 RadioGroup 方向键选择后的焦点移动 |
| `uni_modules/mori-ui/platform/overlay-accessibility.uts` | H5 弹层焦点限制／恢复、Escape 与背景滚动管理 |
| `uni_modules/mori-ui/static/icons/` | Lucide SVG 亮暗版本，随模块复制 |
| `pages/index/index.uvue` / `workbench.scss` | 展示工作台和样例状态 |
| `pages/index/catalogue.uts` | 工作台中的 API 表格；需要与公开文档同步 |
| `components/demo-form/demo-form.uvue` | 本地模拟业务表单，不属于核心包 |
| `pages/forms/forms.uvue` / `components/demo-foundation/demo-foundation.uvue` | 表单基础页和组合示例，不属于核心包 |
| `pages/feedback/feedback.uvue` | Toast、Popup、Dialog 的可操作示例，不属于核心包 |
| `scripts/` / `tests/` | HBuilderX 编译入口、静态预览、浏览器与对比度验证 |
| `scripts/uni.mjs` / `scripts/hbuilder-env.mjs` | 检测 HBuilderX，创建临时插件布局并启动编译器；不改 IDE 安装 |
| `DESIGN.md` / `.impeccable/design.json` | 设计 token／说明，以及文档面板的静态 HTML/CSS 样例 |

`unpackage/`、`node_modules/` 和测试截图是产物或依赖，不应成为手工修复源文件。`.impeccable/design.json` 的组件样例用于文档预览，不是运行组件实现。

构建脚本将实际编译插件链接到系统临时目录，并将 `compile-dart-sass` 链接到工程根目录，使用项目锁定的 Sass。启动时设置 `HX_APP_ROOT` 及插件路径，使旧编译器能识别 IDE 环境；子进程退出或启动失败后清理临时目录。`tests/uni-environment.mjs` 检查环境映射与退出清理，不能替代真实 HBuilderX 构建。浏览器验证脚本可通过 `MORI_BROWSER_EXECUTABLE` 指定现有 Chrome，地址由 `MORI_BASE_URL` 指定。

## 主题如何流动

1. `App.uvue` 在 `onLaunch` 调用幂等的 `initMoriTheme()`。
2. H5／微信读取 `hostTheme` 并监听 `onHostThemeChange`；App 读取 `osTheme` 并监听 `onOsThemeChange`。
3. `setMoriConfig` 局部更新配置。`auto` 采用宿主／系统状态；`light`／`dark` 固定模式。App 分支调用 `setAppTheme`。
4. `moriIsDark` 和 `moriPalette` 计算最终结果，组件读取 computed；实例属性可以覆盖颜色。

不要直接写只读导出，也不要在每个组件各注册一次主题监听。`tokens.scss` 的颜色是样式基础，修改它不一定改变运行时内联配色；更改主题要一起查看 `theme.uts` 和组件中的暗色样式。

## 组件与业务的边界

Input／Textarea 接收字符串 `modelValue`，发出 `update:modelValue` / `change`；独立使用时错误字符串由业务提供，FormItem 内使用统一字段错误。Switch 和 Checkbox 只处理 boolean 状态及一次切换事件，不持有另一份内部业务状态。Radio／RadioGroup 使用 string，CheckboxGroup 使用 string[]，多选更新返回新数组。Button 处理展示和是否允许点击，不执行网络提交。

组合表单负责必填、邮箱和同意选项校验，通过短计时器模拟保存；无后端、无云函数、无资料持久化。新增业务功能应留在使用方，不直接混进核心组件。

## 表单数据与错误如何流动

1. 使用方持有字段 ref，通过 computed 组合成 `UTSJSONObject` model；Form 不修改 model。
2. 使用方明确调用 `validate()` 或 `validateField(name)`；`validation.uts` 按规则顺序同步校验，返回每个字段的第一项错误。没有深层监听或隐式校验触发。
3. Form 保存错误数组并提供 `MoriFormContext`。全量校验替换全部错误，字段校验只替换该字段错误，`clearValidate` 只清消息。
4. FormItem 用 name 查找错误；自身非空 error 优先。FormItem 绘制标题／提示／错误并提供 `MoriFieldContext`，通过 `useMoriField()` 读取。
5. Input／Textarea 在 FormItem 内隐藏本地标题和消息，读取上下文错误及描述 ID；H5 适配把名称与错误关联到实际输入。RadioGroup／CheckboxGroup 读取字段名称、错误与描述，并保留各选项自身名称。

FormItem 的 required 是明确的展示／无障碍属性，不从规则自动推导。业务需要同时配置规则才能阻止无效提交。控件本地 label 非空可覆盖其无障碍名称，因此示例统一把字段标签放在 FormItem 上。每个 FormItem 应承载一个输入控件或一个选择组，避免多个输入共用一个字段名。

校验范围仅限顶层键及同步规则；不实现 Promise validator、嵌套字段解析或 resetFields。若以后扩展异步规则，需要先解决过期结果覆盖、取消及提交等待，再修改公开返回类型，不能把当前同步接口悄悄换成 Promise。

## 反馈组件的生命周期与平台边界

Toast 的临时显示配置与组件 props 分开管理。show 使用传入 options 和当前 props 默认值生成本次内容，再请求显示；父级的显示确认不能覆盖刚设置的内容。计时任务在替换、主动关闭和卸载时取消，防止旧超时关闭新提示。Toast 不维护跨页面全局单例或排队服务。

Popup 负责渲染遮罩／面板、过渡生命周期与弹层栈；Dialog 复用 Popup，负责确认／取消按钮及等待状态。每次 Popup 打开将有效层级分配为请求下限与当前顶层加 2 的较大值，视图、Escape 和焦点均以该次栈顺序为准。退出动画期间保持栈项，结束或卸载才释放；重新打开使旧退出回调失效。

`platform/overlay-accessibility.uts` 集中处理 H5 的活动元素、Tab／Escape、焦点恢复及滚动锁计数，组件本身不直接依赖 document/window。页面应在顶层挂载弹层；没有跨端 teleport，原生或小程序的背景滚动需结合该端页面能力处理。Dialog 不执行业务请求，confirm 后由使用方根据实际结果设置模型；confirmLoading 只控制交互等待状态。

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

`scripts/check.mjs` 当前对十三个导出组件做精确断言，新组件需要有意更新列表。浏览器脚本依赖示例结构；新增有意义的行为覆盖，避免为简单样式常量堆叠重复测试。`scripts/verify-forms.mjs` 覆盖表单基础示例；校验和选择逻辑分别由 `tests/validation.mjs`、`tests/selection.mjs` 检查。反馈组件使用 `scripts/verify-feedback.mjs`、`tests/feedback.mjs` 和 `tests/overlay.mjs` 检查。Node 逻辑测试不替代 UTS 编译或平台运行验证。
