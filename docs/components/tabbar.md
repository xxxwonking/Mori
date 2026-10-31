# 底部导航 mori-tabbar

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

页面底部的业务导航；默认处于正常文档流。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-tabbar v-model="active" :items="items" @change="navigate" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriNavItem } from '@/uni_modules/mori-ui/navigation.uts'
const active = ref('home')
const items: MoriNavItem[] = [{ label: '首页', value: 'home', icon: 'home' }, { label: '消息', value: 'messages', icon: 'bell', badge: '3' }]
function navigate(value: string) { /* 根据 value 调用 uni.switchTab 或业务路由 */ }
</script>
```

## 状态与进阶使用

change(value:string) 只在新值不同且条目可用时触发。fixed=true 时页面须预留底部高度；safeAreaInsetBottom 默认为 true。只负责状态与外观，不读取当前路由；需要业务在导航成功后同步 active。不要同时显示系统 tabBar 和固定 MoriTabbar。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | "" | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| items | Array（见用法） | [] | 条目数组，value 必须唯一；结构见示例。 |
| label | string | "主导航" | 字段、操作或内容的名称；同时用于可访问性。 |
| fixed | boolean | false | 固定定位；业务须预留内容空间。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| safeAreaInsetBottom | boolean | true | 按支持端的 CSS 安全区增加底部内边距。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
