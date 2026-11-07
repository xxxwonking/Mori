# 主题与组件定制

Mori UI 默认使用黑白中性配色。运行时颜色统一由 `uni_modules/mori-ui/theme.uts` 提供；尺寸与圆角基础在 `styles/tokens.scss`。全局颜色不需要改源码或覆盖组件内部选择器。Button／Input 默认仍为 36px、正文 13px、标签 12px。

## 全局配置

在 App.uvue 的 onLaunch 调用一次 `initMoriTheme()`。随后可在应用的主题设置中调用：

```ts
import { setMoriConfig, resetMoriConfig } from '@/uni_modules/mori-ui/theme.uts'

setMoriConfig({
  theme: 'auto',
  light: {
    primary: '#4338ca', soft: '#eef2ff',
    surface: '#ffffff', ground: '#f5f7ff',
    text: '#172554', muted: '#4b5c85',
    border: '#c7d2fe', input: '#94a3cc',
    ring: '#6366f1', accent: '#e0e7ff'
  },
  dark: {
    primary: '#a5b4fc', soft: '#263456',
    surface: '#17213b', ground: '#0b1228',
    text: '#e0e7ff', muted: '#a5b4d8',
    border: '#33436a', input: '#52638b',
    ring: '#a5b4fc', accent: '#33436a'
  }
})

// 只更新这一项，其余配置保持。
setMoriConfig({ dark: { primary: '#c7d2fe' } })
setMoriConfig({ theme: 'dark' })
setMoriConfig({ theme: 'auto' })

// 清除自定义颜色与内置提示，恢复中性默认，并立即跟随当前宿主。
resetMoriConfig()
```

`MoriConfig` 和 `MoriThemeColors` 均从 theme.uts 导出。light／dark 是可选的颜色对象，下面列出的字段均为可选 string。`setMoriConfig` 按字段合并；省略、null 或空白字符串不清除已有值。恢复全部默认使用 resetMoriConfig；恢复单个颜色需显式传入该颜色值。theme 仅接受 auto／light／dark，非法值会抛错且不应用本次颜色修改。

旧的 color／darkColor／softColor／darkSoftColor 保持有效，分别对应 light.primary／dark.primary／light.soft／dark.soft。同一次调用先应用旧字段，再应用 light／dark；后续调用按实际传入值更新，不存在隐藏的永久优先层。

配置为应用级共享状态，没有自动保存到本地存储，也没有嵌套主题 Provider。业务页面应由统一入口管理主题，避免每个组件挂载时重置。resetMoriConfig 不重复注册系统监听。

## 内置操作提示

`MoriConfig.messages` 按字段覆盖内置操作名称，类型 `MoriMessages` 与只读计算值 `moriMessages` 从 theme.uts 导出。修改会响应到已挂载的组件；省略、null 或空白值保留当前文案，防止误清空可访问名称。`resetMoriConfig()` 同时恢复中文默认提示。

```ts
setMoriConfig({
  messages: {
    required: 'Required', clearInput: 'Clear input',
    showPassword: 'Show password', hidePassword: 'Hide password',
    closePopup: 'Close panel'
  }
})
```

| 字段 | 中文默认 | 使用位置 |
|---|---|---|
| required | 必填 | Input、Textarea、FormItem |
| clearInput | 清空输入 | Input 的清空图标 |
| showPassword / hidePassword | 显示密码 / 隐藏密码 | Input 的密码显隐图标 |
| closePopup | 关闭弹出层 | Popup 的关闭图标 |
| checkbox / checkboxGroup | 复选框 / 多选组 | 没有业务标签时的后备名称 |
| radioGroup / switchControl | 单选组 / 开关 | 没有业务标签时的后备名称 |
| previousMonth / nextMonth | 上个月 / 下个月 | Calendar |
| previousPage / nextPage | 上一页 / 下一页 | Pagination |
| increase / decrease | 增加 / 减少 | Stepper |
| closeNotice / closeNotification | 关闭公告 / 关闭通知 | NoticeBar、Notify |

已有 `label`、`confirmText`、`cancelText`、`placeholder` 等组件参数仍由调用方传入，业务字段标签优先于后备名称。这项能力用于统一内置操作提示，不是完整语言包：日期格式、校验消息、其他组件的默认文案及业务内容仍需要分别配置。

## 语义颜色

| 字段 | 用途 | 浅色默认 | 深色默认 |
|---|---|---|---|
| primary | 主操作与选中态 | #171717 | #e5e5e5 |
| soft | 次级操作、分组底色 | #f5f5f5 | #262626 |
| surface | 内容、输入和弹层表面 | #ffffff | #171717 |
| ground | 页面与禁用输入底色 | #fafafa | #0a0a0a |
| text | 正文、标签 | #0a0a0a | #fafafa |
| muted | 辅助文字、占位提示 | #666666 | #a3a3a3 |
| border | 分隔与面板边界 | #e5e5e5 | #333333 |
| input | 表单、未选中控件边界 | #d4d4d4 | #404040 |
| ring | H5 焦点及输入聚焦边框 | #737373 | #a3a3a3 |
| accent | 次级按钮悬停表面 | #f5f5f5 | #333333 |
| danger | 错误文字与边框 | #c62828 | #f87171 |
| dangerSoft | 错误背景 | #fef2f2 | #3f161b |
| overlay | Popup／Dialog 遮罩 | rgba(0, 0, 0, 0.5) | rgba(0, 0, 0, 0.5) |

`moriPalette` 是随主题响应的只读计算值，额外提供自动推导的 onPrimary。消费时使用 `moriPalette.value`（模板中自动解包）。不要保存一次解包的结果作为永不更新的页面颜色。

全局配置影响使用相应运行时颜色的组件。宿主导航栏、键盘、第三方控件和业务页面需要各自接入；它不会把所有硬编码的业务颜色自动替换。H5 焦点辅助变量由组件内部生成，不作为跨端公开 CSS API。

Toast 的成功／错误图标按实际 surface 选择深浅资源，已显示的提示也会响应更新；即使浅色模式使用深色表面，或深色模式使用浅色表面，也不再按模式固定选择图标。

## 实例参数的统一规则

显式组件颜色优先于当前全局主题；参数为空时回到主题。实例值在切换深浅模式时保持原值，需要自适应时传计算值，例如 `:background-color="moriIsDark ? '#17213b' : '#eef2ff'"`。

| 组件 | 定制入口 | 含义 |
|---|---|---|
| Button | color、softColor、backgroundColor、borderColor、textColor | 保留变体配色；backgroundColor 最后覆盖背景，borderColor 最后覆盖边框，textColor 最后覆盖文字 |
| Input／Textarea | color、backgroundColor、borderColor、textColor、placeholderColor | color 仍是焦点边框；新增参数分别控制输入区域背景、普通边框、输入文字、占位文字 |
| Switch | activeColor、inactiveColor、activeThumbColor、inactiveThumbColor、textColor | 开关轨道和滑块各自定制；color 为 activeColor 的后备；textColor 为外部标签颜色 |
| Checkbox／CheckboxGroup | color、backgroundColor、borderColor、textColor | color 控制选中／半选；背景与边框参数控制未选中方框；textColor 为选项文字 |
| Radio／RadioGroup | color、backgroundColor、borderColor、textColor | color 控制选中边框和圆点；backgroundColor 为圆形底色，borderColor 为未选中边框 |
| Tabs | color、textColor、backgroundColor、activeBackgroundColor、borderColor | 选中文字、未选中文字、分组背景、选中背景、选中边框 |
| Popup | backgroundColor、textColor、borderColor、overlayColor | 面板背景、标题文字、面板边框、遮罩 |
| Dialog | Popup 的四项 + confirmColor、confirmTextColor、cancelColor | 面板与标题／消息文字；确认按钮主色／文字、取消按钮描边与文字 |

Button 的 solid／soft 背景被覆盖时，边框默认随新背景；outline 保留原描边逻辑，text 保留透明边框。显式 borderColor 最后覆盖。solid 文字与内收焦点线按实际背景推导黑白；显式 textColor 不干扰焦点线。自定义 outline／text 背景在悬停时保持，不被默认 accent 覆盖。Tabs 的内收焦点线跟随该项文字色，保持自定义背景上的可见性；请成对选择文字与背景。

Input／Textarea 的边框顺序为：**错误 danger → 聚焦 color／ring → 普通 borderColor／input**。任何定制都不改变 1px 闭合边框。标签、必填说明和错误消息仍使用语义主题；textColor 仅控制输入值。FormItem 接管标题、错误及无障碍描述的行为不变。

Switch 的轨道文字与 Checkbox 的勾按实际选中色自动选黑白；Switch 滑块未覆盖时保留现有浅／深默认策略。选择状态保持原尺寸与过渡。颜色不会解除 disabled 或 loading；禁用仍降低透明度并阻止操作。Dialog 确认等待时仍阻止确认、取消、Escape 和遮罩关闭，成功后由业务关闭。

Popup／Dialog 的参数不递归覆盖插槽里的组件。插槽需要自己的颜色或共享全局主题。Dialog 的取消按钮跟随显式面板背景，文字／描边按 cancelColor → textColor → 当前主题取值，避免深色主题下的浅色面板出现不可读按钮。对于特殊面板和整套业务表单，优先配套设置全局语义颜色。

## 使用示例

```vue
<template>
  <mori-button label="保存" background-color="#4338ca" border-color="#312e81" />
  <mori-input v-model="name" label="称呼" background-color="#eef2ff"
    text-color="#312e81" placeholder-color="#4b5c85"
    border-color="#a5b4fc" color="#4338ca" clearable />
  <mori-switch v-model="enabled" label="消息通知"
    active-color="#4338ca" inactive-color="#c7d2fe"
    active-thumb-color="#ffffff" inactive-thumb-color="#312e81"
    active-text="开" inactive-text="关" />
</template>
<script setup lang="uts">
import { ref } from 'vue'
const name = ref('')
const enabled = ref(true)
</script>
```

自动对比色只解析不透明 #RGB、#RRGGBB、逗号格式 rgb(r,g,b)。跨端推荐这些格式；遮罩可使用 rgba。其他格式的支持取决于目标端，透明色需要考虑实际合成背景。Button 可显式设置 textColor；Switch 轨道文字与 Checkbox 勾没有任意文字色入口，因此它们的状态填充请使用上述不透明格式。

官网每个真实 H5 示例底部提供「品牌配色／默认配色」以及「浅色／深色／跟随系统」。示例中的固定实例颜色可以与全局配色切换比较。「重置」恢复中性配色与示例状态，保留当前模式。Button、Input、Switch、Checkbox、Radio、Tabs、Popup、Dialog 页面另有独立定制示例。该示例设置只作用于当前预览运行实例。

## 验证边界

配色单元检查覆盖全局合并／重置、旧参数兼容和真实组件状态；浏览器检查覆盖实际渲染与交互。H5／微信构建不替代微信、iOS、Android、Safari、鸿蒙设备验收。当前证据见 [兼容记录](compatibility.md)，后续设备检查见 [移动端接入](mobile-adaptation.md)。
