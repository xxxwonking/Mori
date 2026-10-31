# 气泡菜单 mori-popover

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

在触发按钮旁显示简短菜单；定位空间不足时翻转。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-popover v-model="show" text="更多操作" :actions="actions" @select="select" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriAction } from '@/uni_modules/mori-ui/actions.uts'
const show = ref(false)
const actions: MoriAction[] = [{ label: '复制', value: 'copy' }, { label: '收藏', value: 'save' }]
function select(action: MoriAction) { /* 处理 action.value */ }
</script>
```

## 状态与进阶使用

reference slot 可替换触发按钮内容，里面不要再嵌套 button。select(action) 后请求关闭。placement 为 bottom/top；根据窗口空间限制宽度和高度。H5 支持上下键、Escape、外部点击，滚动或缩放关闭以避免错位。需要放在没有 transform 的页面容器；非 H5 滚动时请由业务关闭，详见平台跟踪。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | boolean | false | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| text | string | "更多操作" | 展示文字。 |
| actions | Array（见用法） | [] | MoriAction[]，包含 label、value、description?、disabled?、loading?、danger?。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| placement | string | "bottom" | bottom / top；空间不足时自动调整。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`select`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

插槽：`reference`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
