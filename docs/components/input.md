# 输入框 mori-input

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

受控字符串字段，标签和错误可由 FormItem 接管。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-input v-model="name" label="称呼" placeholder="请输入称呼" clearable :maxlength="30" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const name = ref('')
</script>
```

## 状态与进阶使用

使用 type="password" 开启图标显隐；clearable 清空图标可同时存在。三种尺寸保持单一边框，聚焦不改变宽度。change 和 confirm 返回字符串；blur 用于业务失焦校验。不要给组件额外叠加焦点边框。

## 完整 API

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
- `blur(value: string)`：失焦时的最终文本，可用于失焦校验。
- `confirm(value: string)`：键盘确认时的最终文本。底层输入可能节流，blur/confirm 直接读取宿主事件值，避免快速编辑时返回上一次草稿。
- `clear`：用户执行清空操作。

密码类型使用眼睛图标切换显隐；clearable 使用关闭图标清空。图标保留可访问名称与键盘操作，显隐与清空可同时使用。输入组件呈现错误信息，校验规则留给业务。组合表单展示了必填、邮箱格式、同意选项与错误恢复。

H5 将 required/invalid 与描述文本关联到实际可聚焦的 HTML input；控件始终只有一条闭合边框，聚焦变为主题色且宽度不变；错误信息与 aria-invalid 在聚焦时继续保留，失焦后恢复错误边框。DOM 适配集中在 WEB 条件编译的 platform/accessibility.uts，原生与小程序不包含该段代码。

放入 FormItem 时隐藏自身标题和消息，错误与描述由 FormItem 接管；非空的本地 label 可覆盖输入无障碍名称，required 为本地与父级的逻辑或。建议将 label、required、hint、error 统一设置在 FormItem，避免信息不一致。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
