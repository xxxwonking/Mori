# 表单项 mori-form-item

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

统一显示字段标签、必填标记、提示和错误。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-form-item name="nickname" label="昵称" required hint="至少 2 个字符"><mori-input v-model="nickname" /></mori-form-item>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const nickname = ref('')
</script>
```

## 状态与进阶使用

与 Form 配合时 name 对应模型顶层键。一个 FormItem 建议放一个实际输入或选择组；内部 Input/Textarea 不重复显示自己的标签。required 是视觉/语义标记，校验仍需配置 Form.rules。显式 error 优先级以本页完整 API 为准。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| name | string | 空 | 对应 Form model 和规则的顶层字段名 |
| label | string | 空 | 字段标题与子控件的无障碍名称 |
| required | boolean | false | 显示必填提示并提供必填语义；实际校验仍需 rules |
| hint | string | 空 | 无错误时显示的辅助说明 |
| error | string | 空 | 非空时优先于 Form 中该字段的错误 |

默认 slot 放置一个输入控件或一个选择组。错误优先于 hint；`error=""` 恢复使用 Form 的错误，不能用它屏蔽上下文错误。独立使用时也可通过 error 显示业务错误。

FormItem 负责统一标题、必填态和消息。Input／Textarea 嵌入其中时隐藏自己的标题与消息，并从上下文获得无障碍名称、必填态、错误态和描述 ID；选择组也关联这些字段信息。组合时把 label、required、hint、error 配在 FormItem 上，避免两个层级表达不同内容。H5 适配将 Input／Textarea 的属性同步到实际可聚焦输入元素。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
