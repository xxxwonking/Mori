# 基础组件 API

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
- `focus` / `blur`：不携带参数。
- `confirm(value)`：键盘确认。
- `clear`：用户执行清空操作。

密码类型使用眼睛图标切换显隐；clearable 使用关闭图标清空。图标保留可访问名称与键盘操作，显隐与清空可同时使用。输入组件呈现错误信息，校验规则留给业务。组合表单展示了必填、邮箱格式、同意选项与错误恢复。

H5 将 required/invalid 与描述文本关联到实际可聚焦的 HTML input；控件始终只有一条闭合边框，聚焦变为主题色且宽度不变；错误信息与 aria-invalid 在聚焦时继续保留，失焦后恢复错误边框。DOM 适配集中在 WEB 条件编译的 platform/accessibility.uts，原生与小程序不包含该段代码。

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

事件：`update:modelValue(boolean)`、`change(boolean)`。方框为 16px、5px 圆角，选中填充主题色，Lucide 勾图标自动选择黑白；整行可点击，H5 支持 Enter / Space，禁用时退出 Tab 顺序。勾通过 opacity / transform 过渡 160ms，尺寸与行布局保持稳定。首版是单项布尔复选框，数组多选与 CheckboxGroup 留待后续扩展。

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
