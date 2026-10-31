# 数字过渡 mori-count-to

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-count-to :end-value="128.5" :decimals="1" suffix=" 分" label="示例分数" />
</template>
```

## 状态与进阶使用

有限数字从 startValue 过渡到 endValue，支持负数、prefix、suffix，decimals 0–6。duration 毫秒（上限 60 秒）；重启取消旧任务。H5 减少动态效果直接到最终值。start() 重新播放，reset() 回到起点并遵守 autoplay；finish(value:number) 表示到达终点。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| startValue | number | 0 | 数字过渡的起始值。 |
| endValue | number | 0 | 数字过渡的目标值。 |
| duration | number | 800 | 过渡时长，单位毫秒。 |
| decimals | number | 0 | 保留小数位数，范围 0–6。 |
| autoplay | boolean | true | 是否自动开始轮播或数字过渡。 |
| prefix | string | '' | 数字前的文字。 |
| suffix | string | '' | 数字后的文字。 |
| label | string | '' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'finish'。参数、触发条件和提交语义见上文。

公开实例方法：start, reset。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
