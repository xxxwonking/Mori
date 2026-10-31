# 下拉刷新 mori-pull-refresh

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-pull-refresh v-model="refreshing" @refresh="reload"><mori-text text="下拉或使用刷新按钮更新内容" /></mori-pull-refresh>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const refreshing = ref(false)
function reload() { setTimeout(() => { refreshing.value = false }, 400) }
</script>
```

## 状态与进阶使用

使用宿主 scroll-view refresher；保留显式刷新按钮供键盘与不支持手势的平台。v-model=true 表示进行中，业务成功或失败后都需置 false；连续触发锁定为一次请求。refresh() 实例方法遵守 disabled／进行中约束。height 为独立滚动区高度；REFRESH-01 跟踪原生手势，不声称所有端已运行通过。

## 属性

refresh 可同步或异步完成。组件会在 Vue 更新后核对 modelValue，确保同一批次内完成刷新后仍能再次触发；业务需明确将最终状态设为 false。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | boolean | false | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| height | string | '320px' | 容器高度；字符串为 CSS 长度，数值为 px。 |
| threshold | number | 60 | 宿主下拉触发阈值，单位 px。 |
| text | string | '刷新内容' | 展示的纯文本内容。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'refresh'。参数、触发条件和提交语义见上文。

公开实例方法：refresh。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
