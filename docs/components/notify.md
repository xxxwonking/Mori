# 顶部通知 mori-notify

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

顶部短通知，适合需要持续可见的状态变化。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="显示通知" @click="notify?.show({ message: '网络暂不可用，请重试。', type: 'danger', duration: 0 })" />
  <mori-notify ref="notify" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriNotifyInstance } from '@/uni_modules/mori-ui/actions.uts'
const notify = ref<MoriNotifyInstance | null>(null)
</script>
```

## 状态与进阶使用

show({message,type?,duration?}) 显示通知；type=danger 使用错误色，其他值使用主色。duration=0 持续显示，close() 主动关闭；closable 控制关闭按钮。重复 show 替换且重新计时，close 事件无参数且每次显示最多触发一次。此组件采用 ref API，没有 v-model。固定 z-index=2200，更高自定义层可能覆盖它。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| duration | number | 3000 | 持续或动画时长，单位 ms；0 的含义见本页。 |
| closable | boolean | true | 显示关闭入口；行为见组件生命周期。 |

## 事件、插槽与方法

公开事件：`close`。事件载荷和触发时机见本页状态说明。

模板 ref 暴露：`show, close`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
