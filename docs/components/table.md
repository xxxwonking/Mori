# 表格 mori-table

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

可横向滚动的轻量数据表，支持数值与文字排序。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-table :rows="rows" :columns="columns" label="示例任务列表" />
</template>

<script setup lang="uts">
import { MoriTableColumn } from '@/uni_modules/mori-ui/advanced.uts'
const columns: MoriTableColumn[] = [{ key: 'name', label: '任务', width: 150 }, { key: 'progress', label: '完成度', sortable: true, width: 110 }]
const rows: UTSJSONObject[] = [{ id: 'a', name: '界面设计', progress: 80 }, { id: 'b', name: '交互开发', progress: 45 }, { id: 'c', name: '测试验收', progress: 20 }]
</script>
```

## 状态与进阶使用

columns 每列 key/label，width 最小 64px，sortable 开启双向排序。rows 为对象数组，rowKey 默认 id 且应唯一。排序复制数组，不修改传入 rows；sortChange(key, order) 中 order 为 asc/desc，rowClick(row,index) 的 index 是排序后的行号。null 显示破折号。此版不含编辑、固定列、分页或树形表格。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| rows | UTSJSONObject[] | [] | 具体语义见上文与示例。 |
| columns | MoriTableColumn[] | [] | 具体语义见上文与示例。 |
| rowKey | string | 'id' | 具体语义见上文与示例。 |
| label | string | '数据表格' | 可见标签或可访问名称。 |
| loading | boolean | false | 外部加载状态。 |
| emptyText | string | '暂无数据' | 具体语义见上文与示例。 |

## 事件、插槽与方法

cell 插槽参数 {row,column,index}，用于自定义单元格。没有公开实例方法。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
