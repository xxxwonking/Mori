# 宫格 mori-grid

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-grid :items="entries" :column-num="3" @select="selected = $event" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriGridItem } from '@/uni_modules/mori-ui/content.uts'
const selected = ref('')
const entries: MoriGridItem[] = [{ value: 'home', label: '首页', icon: 'home' }, { value: 'settings', label: '设置', icon: 'settings' }]
</script>
```

## 状态与进阶使用

items 为 MoriGridItem[]：value、label、可选 icon／description／disabled。columnNum 限制 1–8，宽度等分父容器，长标签换行。select(value:string) 仅对有效项触发，路由由业务处理。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| items | MoriGridItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| columnNum | number | 4 | 每行宫格列数，钳制为 1–8。 |
| border | boolean | true | 是否显示边界线。 |
| label | string | '快捷入口' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'select'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
