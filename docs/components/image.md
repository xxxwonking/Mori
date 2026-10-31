# 图片 mori-image

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-image src="/static/example.png" alt="示例封面" height="180px" preview />
</template>
```

## 状态与进阶使用

固定容器避免加载前后布局跳动；src 变化重置加载与失败状态。error、loading 插槽替换占位。preview 调用 uni.previewImage；业务监听 click(src)，load(src)、error(src) 处理结果。尺寸传 CSS 长度，radius 单位 px。原生图片格式和预览能力按 MEDIA-01 跟踪。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| src | string | '' | 图片资源地址。 |
| alt | string | '图片' | 图片的可访问名称。 |
| width | string | '100%' | CSS 宽度，支持 px 和百分比。 |
| height | string | '160px' | 容器高度；字符串为 CSS 长度，数值为 px。 |
| radius | number | 8 | 圆角半径，单位 px。 |
| mode | string | 'aspectFill' | 宿主 image 的缩放模式。 |
| lazyLoad | boolean | true | 传递给宿主图片的懒加载开关。 |
| preview | boolean | false | 点击时调用宿主图片预览。 |
| errorText | string | '图片暂不可用' | 错误状态的可见提示或重试文案。 |

## 事件、插槽与方法

公开事件：'load', 'error', 'click'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：error、loading。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
