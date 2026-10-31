# 基础组件 API

所有 **72 个组件**的独立详细用法、参数、事件、方法和边界见 [逐组件使用指南](component-guides.md)。本页保留原 13 个组件的 API；新增组件以对应独立页面为准。平台差异与 iOS 上传后续工作见 [适配跟踪](platform-adaptation.md)。

组件按 `uni_modules` / easycom 规则使用。全局主题由 `theme.uts` 管理，初始化方式见 README。

## mori-button

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| label | string | 空 | 按钮文字，默认 slot 可覆盖 |
| variant | string | solid | solid / soft / outline / text |
| size | string | md | sm 28px / md 36px / lg 40px |
| color | string | 空 | 为空继承全局当前主题品牌色 |
| softColor | string | 空 | 为空继承全局柔和背景 |
| textColor | string | 自动 | 实心按钮根据背景选择黑/白；可以显式覆盖 |
| loading | boolean | false | 显示加载图标，同时阻止交互 |
| disabled | boolean | false | 禁用，降低视觉强调 |
| block | boolean | false | 占满可用宽度 |
| round | boolean | false | 胶囊圆角 |

事件：`click`，仅在未禁用、未加载时触发，不携带业务参数。默认 slot 用于文字内容；图标组件尚未包含在首版中。

H5 支持 Enter / Space 激活。使用 `loading` 处理提交等待；接口成功失败逻辑由业务提供。

实心按钮会为不透明 `#RGB`、`#RRGGBB` 和逗号格式 `rgb(r,g,b)` 选择对比度更高的黑/白文字，不受当前深浅模式干扰。其他颜色格式（含透明色）请提供 `textColor`，并自行确认实际合成背景的可读性。柔和/描边按钮请成对选择 color 与背景，实例覆盖同样需要考虑对比度。

## mori-input

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前输入值 |
| label | string | 空 | 字段名称；同时用作无障碍名称 |
| placeholder | string | 请输入 | 未填写时的提示 |
| type | string | text | password / number 等类型以目标端原生 input 能力为准 |
| prefix | string | 空 | 文本前缀，例如 +86 |
| hint | string | 空 | 辅助说明 |
| error | string | 空 | 非空时显示错误；优先于 hint |
| color | string | 空 | 焦点边框；为空继承主题 |
| size | string | md | sm 30px / md 36px / lg 40px |
| required | boolean | false | 展示必填提示，不自动执行业务校验 |
| disabled | boolean | false | 禁止输入、清空和密码切换 |
| clearable | boolean | false | 有内容时显示清空操作 |
| maxlength | number | 140 | 最大输入长度，遵循 uni-app input 规范 |
| confirmType | string | done | 键盘确认按钮文案类型 |

事件：

- `update:modelValue(value)`：用于 v-model。
- `change(value)`：每次输入或清空时返回当前字符串；不是仅在失焦时触发。
- `focus`：不携带参数。
- `blur(value: string)`：失焦时的最终文本。
- `confirm(value: string)`：键盘确认时的最终文本；与 blur 一样直接读取宿主事件，避免输入事件节流导致旧值。
- `clear`：用户执行清空操作。

密码类型使用眼睛图标切换显隐；clearable 使用关闭图标清空。图标保留可访问名称与键盘操作，显隐与清空可同时使用。输入组件呈现错误信息，校验规则留给业务。组合表单展示了必填、邮箱格式、同意选项与错误恢复。

H5 将 required/invalid 与描述文本关联到实际可聚焦的 HTML input；控件始终只有一条闭合边框，聚焦变为主题色且宽度不变；错误信息与 aria-invalid 在聚焦时继续保留，失焦后恢复错误边框。DOM 适配集中在 WEB 条件编译的 platform/accessibility.uts，原生与小程序不包含该段代码。

放入 FormItem 时隐藏自身标题和消息，错误与描述由 FormItem 接管；非空的本地 label 可覆盖输入无障碍名称，required 为本地与父级的逻辑或。建议将 label、required、hint、error 统一设置在 FormItem，避免信息不一致。

## mori-switch

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 是否开启 |
| label | string | 空 | 选项名称，建议始终提供 |
| description | string | 空 | 次级说明 |
| color | string | 空 | 开启色后备值；为空继承主题品牌色 |
| activeColor | string | 空 | 开启背景色，优先于 color |
| inactiveColor | string | 空 | 关闭背景色，默认随主题使用灰色 |
| activeText | string | 空 | 开启时轨道内文字 |
| inactiveText | string | 空 | 关闭时轨道内文字 |
| size | string | md | sm / md / lg 轨道高 20 / 22 / 26px |
| disabled | boolean | false | 禁止切换 |

事件：`update:modelValue(boolean)`、`change(boolean)`。由组件绘制轨道、滑块与文字，保持跨端视觉一致；单次点按仅更新一次，H5 支持 Enter / Space。无字默认轨道 38×22px，滑块 18px；文字轨道按开关两种文字中较长者预留宽度，切换不改变宽度。状态文字建议 1–3 个字，前景色按不透明 #RGB / #RRGGBB / rgb() 自动选择黑白。颜色可分别传入深浅主题值。滑块以 transform 过渡 180ms，颜色同步变化，H5 减少动态效果偏好下关闭过渡。

```vue
<mori-switch v-model="enabled" label="消息通知"
  active-color="#238653" inactive-color="#dce9e1"
  active-text="开启" inactive-text="关闭" />
```

## mori-checkbox

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 是否选中 |
| label | string | 空 | 可点击的说明文字，建议始终提供 |
| color | string | 空 | 选中填充色；为空继承主题品牌色 |
| disabled | boolean | false | 禁止切换 |

事件：`update:modelValue(boolean)`、`change(boolean)`。方框为 16px、5px 圆角，选中填充主题色，Lucide 勾图标自动选择黑白；整行可点击，H5 支持 Enter / Space，禁用时退出 Tab 顺序。勾通过 opacity / transform 过渡 160ms，尺寸与行布局保持稳定。此组件保持单项 boolean 模型；数组多选使用 `mori-checkbox-group`。

## mori-form

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| model | UTSJSONObject | 必填 | 顶层字段及其当前值；表单不修改业务数据 |
| rules | MoriFormRule[] | [] | 按数组顺序执行，同一字段只保留第一个错误 |

默认 slot 放置 FormItem、控件和业务按钮。`validate(result)` 事件在调用 `validate()` 或 `validateField()` 后触发；不会自动提交或调用接口。

通过模板 ref 调用以下同步方法；`MoriFormInstance`、规则和结果类型从 `@/uni_modules/mori-ui/validation.uts` 导入。

| 方法 | 返回值 | 行为 |
|---|---|---|
| validate() | MoriValidationResult | 校验全部规则并替换全部错误 |
| validateField(name: string) | MoriValidationResult | 只校验指定字段，保留其他字段的错误；空 name 等同于 validate |
| clearValidate(name?: string) | void | 指定非空 name 清除该字段错误；省略或空字符串清除全部错误；不修改 model |

`MoriValidationResult` 为 `{ valid: boolean, errors: MoriFieldError[] }`；每项错误为 `{ name: string, message: string }`。`validateField` 返回的 valid/errors 只表示本次指定字段，不能据此判断整个表单通过。

```ts
export type MoriFormRule = {
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  validator?: (value: any | null) => string;
}
```

规则语义：

- `name` 是 model 顶层键，同时与 FormItem 的 name 对应。不解析 `profile.name`、数组路径或嵌套对象。
- `required` 将 null／缺失值、空白字符串、空数组、false 视为空；数字 0 有效。同意协议可以用 boolean 的 required 规则。
- 非必填空值跳过该条规则的长度、正则和自定义校验。需要验证空值时显式使用 required。
- minLength/maxLength 作用于字符串长度或数组项数；字符串使用 JavaScript／UTS 的 UTF-16 长度。其他非空类型不能通过长度限制。
- pattern 是传给 `new RegExp(pattern)` 的字符串，不是带 `/` 分隔符的表达式。规则由开发者提供，应使用有效正则。
- validator 同步返回错误文字；空字符串表示通过。内置约束先执行，失败后不再执行该条自定义校验。内置约束使用 message，未设置时为“请检查此项内容”。

当前不支持 Promise／异步校验、自动输入／失焦校验、嵌套字段或 `resetFields`。由业务在提交、change 或 blur 时主动调用方法；修改值后不会隐式清除旧错误。完整组合示例见 [使用手册](user-guide.md#8-使用表单基础组件)。

## mori-form-item

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| name | string | 空 | 对应 Form model 和规则的顶层字段名 |
| label | string | 空 | 字段标题与子控件的无障碍名称 |
| required | boolean | false | 显示必填提示并提供必填语义；实际校验仍需 rules |
| hint | string | 空 | 无错误时显示的辅助说明 |
| error | string | 空 | 非空时优先于 Form 中该字段的错误 |

默认 slot 放置一个输入控件或一个选择组。错误优先于 hint；`error=""` 恢复使用 Form 的错误，不能用它屏蔽上下文错误。独立使用时也可通过 error 显示业务错误。

FormItem 负责统一标题、必填态和消息。Input／Textarea 嵌入其中时隐藏自己的标题与消息，并从上下文获得无障碍名称、必填态、错误态和描述 ID；选择组也关联这些字段信息。组合时把 label、required、hint、error 配在 FormItem 上，避免两个层级表达不同内容。H5 适配将 Input／Textarea 的属性同步到实际可聚焦输入元素。

## mori-radio

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前选中值 |
| value | string | 必填 | 本项值；与 v-model 相等时选中 |
| label | string | 空 | 显示文字与无障碍名称；空时名称回退到 value |
| color | string | 空 | 选中色；空时使用全局 primary |
| disabled | boolean | false | 禁止选择并退出 Tab 顺序 |
| controlId | string | 空 | 控件 ID；通常由 RadioGroup 管理 |
| tabIndex | number | 0 | H5 键盘 Tab 顺序；通常由 RadioGroup 管理 |

事件：`update:modelValue(value: string)`、`change(value: string)`。再次点击已选项不会取消选中或重复发出更新；禁用时不更新。多个选项推荐使用 RadioGroup，以获得组语义和方向键操作。

## mori-radio-group

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前选项值 |
| options | MoriChoiceOption[] | [] | 选项列表；value 必须是唯一字符串 |
| label | string | 空 | 独立使用时的标题；FormItem 中优先用父级标题 |
| color | string | 空 | 所有选项的选中色 |
| disabled | boolean | false | 禁用整组 |
| direction | string | vertical | vertical / horizontal；横向可换行 |

事件：`update:modelValue(value: string)`、`change(value: string)`。选项禁用时不能选择；模型由使用方更新。组内 H5 采用一个 Tab 入口，方向键选择下一／上一可用项并循环，跳过禁用项，Enter／Space 激活当前项。

RadioGroup 与 CheckboxGroup 共用的类型从 `@/uni_modules/mori-ui/selection.uts` 导入：

```ts
export type MoriChoiceOption = {
  label: string;
  value: string;
  disabled?: boolean;
}
```

## mori-checkbox-group

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string[] | [] | 已选 value 数组 |
| options | MoriChoiceOption[] | [] | value 唯一的字符串选项列表 |
| label | string | 空 | 独立使用时的标题；FormItem 中优先用父级标题 |
| color | string | 空 | 选中色 |
| disabled | boolean | false | 禁用整组 |
| direction | string | vertical | vertical / horizontal |
| min | number | 0 | 到达最小数量后阻止继续取消；不自动补选 |
| max | number | 0 | 最大数量；0 表示不限制 |

事件：`update:modelValue(values: string[])`、`change(values: string[])`。有效操作发出新的、去重的数组，不直接修改传入数组。禁用项及受 min/max 阻止的操作不发出更新；达到 max 后仍可取消已选项。预置值超过 max 时允许逐项减少，不会自动截断业务传入值。请传入非负整数边界，max 非零时应不小于 min；模型值应对应 options。

选择数量限制用于控制操作，提交必选仍应在 Form rules 中配置 required／minLength。FormItem 的 required 标记不自动设置组的 min。

## mori-textarea

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前文本 |
| label | string | 空 | 独立字段标题及无障碍名称 |
| placeholder | string | 请输入 | 占位提示 |
| hint | string | 空 | 独立使用时的辅助文字 |
| error | string | 空 | 独立使用时的错误文字 |
| color | string | 空 | 焦点边框颜色 |
| required | boolean | false | 必填语义；不自动执行校验 |
| disabled | boolean | false | 禁止输入 |
| maxlength | number | 200 | 用户输入上限；-1 表示不限制 |
| showWordLimit | boolean | false | 显示当前长度／上限；不限长时只显示长度 |
| height | number | 96 | 内部编辑区域高度，单位 px，最小 36；不含边框、内边距和计数 |
| autoHeight | boolean | false | 使用原生自适应高度能力；height 作为最小编辑高度 |

事件：`update:modelValue(value)`、`change(value)` 在用户输入时发出字符串；`focus`／`blur` 无参数；`confirm(value)` 返回当前字符串。控件支持多行输入，不提供 clear、readonly 或自动保存功能。

长度和计数按 UTF-16 code unit 计算，部分字符会计为两个单位。组件限制用户输入，业务代码传入超过 maxlength 的值不会被自动截断，提交时可用 Form 的 maxLength 再校验。FormItem 内使用父级错误与描述关联，并隐藏本地标题／消息；label 非空时仍可覆盖输入的无障碍名称，required 为本地与父级的逻辑或。通常应统一在 FormItem 配置这些字段信息。

## mori-toast

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 受控显示状态；也可使用实例 show／close |
| message | string | 空 | 提示文字 |
| type | string | text | text / success / error / loading |
| duration | number | 2000 | 显示时长，单位 ms；0 持续显示直到主动关闭 |
| position | string | middle | middle / top / bottom |

通过模板 ref 调用 `show(options: MoriToastOptions)` 和 `close()`；类型从 `@/uni_modules/mori-ui/feedback.uts` 导入。show 的 message、type、duration、position 选项控制本次内容；省略项使用组件 prop 默认配置，重复 show 替换当前提示并从头计时，不排队。

```ts
export type MoriToastOptions = {
  message?: string;
  type?: string;
  duration?: number;
  position?: string;
}
export type MoriToastInstance = {
  show: (options: MoriToastOptions) => void;
  close: () => void;
}
```

事件：`update:modelValue(boolean)`、`close`。show 立即显示并请求模型为 true；close／自动超时请求 false 并发出一次 close，重复关闭不重复通知。loading 仍遵循 duration，持续等待需显式设为 0。卸载清理计时任务。

同时使用 v-model 与 show 时，父级 false→true 的显示确认不会覆盖刚传入的临时 options。父级后续修改 message／type／duration／position 会替换对应临时值，并在可见时重新计时；父级可见性变化仍然生效。未绑定 v-model 时可以只用 ref；此时关闭请调用 close，不能依赖一个始终为 false 的静态 prop 再次触发更新。

Toast 不阻止背景操作，适合简短结果提示；需要用户确认或等待期间禁止操作时使用 Dialog。每页推荐挂载一个实例，不提供全局 showToast／Promise API。普通提示使用 status 实时播报，错误提示使用 alert。

当前 Toast 使用固定 z-index 2000；自定义高层级的 Popup 可能遮住它，提示宜在弹层关闭后显示。加载转动动画在 H5 实现并尊重减少动态效果偏好，其他端以实际运行记录为准。

## mori-popup

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 控制显隐，关闭时保留退出过渡 |
| position | string | bottom | center / bottom / top / left / right |
| title | string | 空 | 标题及弹层无障碍名称，建议提供 |
| closable | boolean | true | 显示关闭图标 |
| overlay | boolean | true | 显示背景遮罩 |
| closeOnOverlayClick | boolean | true | 点击遮罩请求关闭 |
| closeOnEscape | boolean | true | H5 按 Escape 请求关闭 |
| duration | number | 280 | 过渡时长，单位 ms；H5 减少动态效果时为 0 |
| zIndex | number | 1000 | 层级下限，新打开层始终在已有层之上 |
| safeAreaInsetBottom | boolean | true | H5／微信通过 env 预留底部安全区；App 需使用方结合页面适配 |

默认 slot 放置内容；点击内容不触发遮罩关闭。

overlay=false 为非模态模式：隐藏遮罩，aria-modal=false，该层不锁定背景滚动或限制焦点，H5 可继续操作背景；若它位于最上层，仍可按 Escape 关闭。其他仍打开的模态层继续持有自己的滚动锁。

| 事件 | 参数 | 时机 |
|---|---|---|
| update:modelValue | false | 用户通过允许的关闭入口请求关闭 |
| open | 无 | 开始打开 |
| opened | 无 | 打开过渡结束 |
| close | overlay / escape / close | 遮罩、Escape 或关闭按钮产生的用户关闭请求 |
| closed | 无 | 退出过渡结束 |

父级直接设为 false 不产生用户 close 请求，但仍经历退出生命周期。快速反向开关取消过期计时，避免旧 closed 回调关闭新实例。最上层之外的弹层不响应关闭入口；退出期间保留栈所有权，结束后才恢复下层。

实际层级按每次打开的 `max(zIndex, 当前顶层层级 + 2)` 分配。zIndex 是下限，不用于把新弹层放到旧弹层之下。H5 的焦点限制、Escape、视觉顺序使用同一打开顺序；背景滚动在最后一个模态层释放后恢复。

请将 Popup 放在页面顶层，避开 transform、裁切或限制定位的祖先容器。当前不提供 teleport／全局门户；原生／小程序的页面滚动应结合目标平台 page-meta／页面配置处理。H5 焦点与滚动适配不等于原生或小程序设备验证。

## mori-dialog

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 是否显示 |
| title | string | 空 | 标题与无障碍名称 |
| message | string | 空 | 正文；默认 slot 可替换 |
| confirmText | string | 确认 | 确认按钮文字 |
| cancelText | string | 取消 | 取消按钮文字 |
| showCancelButton | boolean | true | 是否显示取消按钮 |
| confirmLoading | boolean | false | 等待状态，阻止重复确认及取消关闭 |
| closeOnOverlayClick | boolean | false | 是否允许点击遮罩取消 |

Dialog 组合居中的 Popup，默认 slot 可自定义正文。`confirm` 只通知业务，**不会自动关闭**；业务成功后将模型设为 false，失败则保留弹窗并展示业务反馈。异步工作开始时设 confirmLoading=true，结束后恢复。

取消按钮和允许的 Popup 关闭入口触发一次 `cancel`，随后请求 `update:modelValue(false)`。confirmLoading 时禁止重复 confirm、取消、Escape 和遮罩关闭；父级仍可主动修改模型。没有全局函数、Promise 调用或自动提交行为。

## 主题接口

从 `@/uni_modules/mori-ui/theme.uts` 导入：

| 接口 | 说明 |
|---|---|
| initMoriTheme() | App onLaunch 调用一次，重复调用不会重复绑定监听 |
| setMoriConfig(options) | 局部更新全局配置，非法 theme 值会抛出明确错误 |
| moriThemeMode | 只读 computed，当前 auto / light / dark 配置 |
| moriIsDark | 只读 computed，最终解析出的深浅主题 |
| moriPalette | 只读 computed，当前语义颜色集合 |

`options`：theme、color、darkColor、softColor、darkSoftColor。所有字段可选。默认 auto；light / dark 为停止跟随系统的方式。

反馈无障碍范围：当前 H5 已实现模态键盘焦点限制与恢复；尚未将页面背景及下层弹窗设为 inert／aria-hidden，未完成真实读屏验收。
