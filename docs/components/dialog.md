# 弹框 mori-dialog

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

用于明确确认；异步成功后由业务关闭。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-dialog v-model="show" title="保存修改？" message="请确认当前内容。" :confirm-loading="saving" @confirm="save" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const show = ref(true)
const saving = ref(false)
async function save() { if (saving.value) return; saving.value = true; try { /* await 业务请求 */ show.value = false } finally { saving.value = false } }
</script>
```

## 状态与进阶使用

confirm 不自动关闭，失败时保持 show=true 并显示业务错误。confirmLoading 禁止重复确认、取消和 Escape。默认 slot 可替换 message；仅提示场景可将 showCancelButton=false。

## 完整 API

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

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
