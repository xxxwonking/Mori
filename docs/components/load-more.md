# 加载状态 mori-load-more

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-load-more status="error" @load="retry" />
</template>

<script setup lang="uts">
function retry() { /* 由业务重试当前页请求 */ }
</script>
```

## 状态与进阶使用

status: more／loading／finished／error。more 和 error 提供 load() 操作；loading／finished 不触发。所有提示文字可替换。只表达状态，不观察滚动；滚动加载使用 List。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| status | string | 'more' | 状态枚举，具体取值见状态说明。 |
| loadingText | string | '正在加载' | 进行中的提示文案。 |
| finishedText | string | '已显示全部内容' | 列表结束的提示文案。 |
| errorText | string | '加载失败，点击重试' | 错误状态的可见提示或重试文案。 |
| moreText | string | '加载更多' | 请求更多的按钮文案。 |

## 事件、插槽与方法

公开事件：'load'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
