# 索引列表 mori-index-bar

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-index-bar v-model="index" :sections="sections" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriIndexSection } from '@/uni_modules/mori-ui/extended-input.uts'
const index = ref('A')
const sections: MoriIndexSection[] = [{ index: 'A', title: 'A', items: ['安同学'] }, { index: 'B', title: 'B', items: ['白同学'] }]
</script>
```

## 状态与进阶使用

MoriIndexSection: index（唯一）、title、items:string[]。点击索引通过 scroll-into-view 跳转；change(index) 为索引操作，select(sectionIndex:string,item:string,itemIndex:number) 为条目操作。v-model 不随自由滚动自动更新。固定高度独立滚动，不支持手指沿索引拖动或虚拟列表。INDEX-01 跟踪宿主滚动定位。

## 属性

sections 异步载入或重排后，会按 modelValue 重新解析分组位置；不存在的值清除滚动目标。重复点击当前索引仍会重新定位，卸载后取消待执行的定位回调。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | '' | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| sections | MoriIndexSection[] | [] | MoriIndexSection[]，index 唯一。 |
| height | string | '320px' | 容器高度；字符串为 CSS 长度，数值为 px。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'change', 'select'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
