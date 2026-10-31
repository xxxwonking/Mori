# 分页 mori-pagination

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

按总记录数和每页大小计算页码，默认从 1 开始。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-pagination ref="pagination" v-model="page" :total="96" :page-size="10" @change="loadPage" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriPaginationInstance } from '@/uni_modules/mori-ui/navigation.uts'
const page = ref(1)
const pagination = ref<MoriPaginationInstance | null>(null)
function loadPage(value: number) { /* 请求第 value 页的数据 */ }
</script>
```

## 状态与进阶使用

simple=true 显示“当前页 / 总页数”；showPageSize 控制可见数字按钮数，限制为 1–9。total=0 仍显示第 1 页且前后按钮禁用；pageSize<=0 按 1 处理。越界外部模型只钳制显示，不主动写回。ref 支持 next() / prev() / select(page:number)，均遵循 disabled 和页码边界。change(page:number) 用于加载数据，加载时可禁用分页。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 1 | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| total | number | 0 | 记录总数，不是页数。 |
| pageSize | number | 10 | 每页记录数，最小按 1。 |
| showPageSize | number | 5 | 可见页码按钮数，限制 1–9。 |
| simple | boolean | false | 仅显示当前页与总页数。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| label | string | "分页" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`next, prev, select`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
