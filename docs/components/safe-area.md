# 安全区 mori-safe-area

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-safe-area position="bottom" />
</template>
```

## 状态与进阶使用

独立占位，不含内容插槽。size=-1 自动：WEB／微信使用 env，App 读取 safeAreaInsets；size>=0 显式 px 覆盖。旋转或窗口变化时业务可更新 size，当前未安装全局 resize 监听。SAFE-01 跟踪刘海／横屏／键盘，避免页面和组件重复补偿。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| position | string | 'bottom' | 安全区方向：top 或 bottom。 |
| background | string | 'transparent' | 安全区填充色。 |
| size | number | -1 | 显示尺寸，单位 px；特殊含义见状态说明。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
