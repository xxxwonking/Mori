# 头像组 mori-avatar-group

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-avatar-group :items="members" :max="3" />
</template>

<script setup lang="uts">
import { MoriAvatarItem } from '@/uni_modules/mori-ui/content.uts'
const members: MoriAvatarItem[] = [{ value: 'lin', name: '林' }, { value: 'chen', name: '陈' }]
</script>
```

## 状态与进阶使用

items: MoriAvatarItem[]（value 唯一、name、可选 src）；max 至少显示一个，剩余项显示 +N。overlap 控制重叠 px，最多头像尺寸的一半。展示组件，不代替成员选择器。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| items | MoriAvatarItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| max | number | 5 | 数量上限；0 的含义见状态说明。 |
| size | number | 36 | 显示尺寸，单位 px；特殊含义见状态说明。 |
| overlap | number | 8 | 相邻头像重叠距离，单位 px。 |
| label | string | '成员' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
