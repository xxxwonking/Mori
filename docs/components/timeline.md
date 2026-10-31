# 时间线 mori-timeline

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-timeline :items="events" reverse />
</template>

<script setup lang="uts">
import { MoriStepItem } from '@/uni_modules/mori-ui/content.uts'
const events: MoriStepItem[] = [{ title: '提交资料', time: '09:30' }, { title: '核验完成', time: '10:00', description: '示例记录' }]
</script>
```

## 状态与进阶使用

MoriStepItem 的 title、time、description、error 用于单条记录。reverse 复制后倒序，不修改父级数组；default 放置列表末尾补充内容。时间由业务格式化，组件不解析时区。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| items | MoriStepItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| reverse | boolean | false | 复制后倒序展示条目。 |
| label | string | '时间线' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
