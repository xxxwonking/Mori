# 签名 mori-signature

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

手写绘制、撤销、清空和 PNG 导出。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-signature @confirm="result = $event" /><mori-text v-if="result.length > 0" text="签名导出结果" /><mori-image v-if="result.length > 0" :src="result" alt="签名导出结果" height="100px" mode="aspectFit" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const result = ref('')
</script>
```

## 状态与进阶使用

画布输出为 600×360，显示区域随容器宽度保持 5:3；坐标等比映射，导出保留笔迹比例。鼠标／触摸绘制，撤销按笔画，单击也形成点。默认固定白底深色笔迹以保持导出可读；color/background 可覆盖。change(hasContent)、confirm(dataURL)、error(message)。空白画布和禁用状态不能导出。签名图像不构成身份验证或电子签章。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| label | string | '在此处手写签名' | 可见标签或可访问名称。 |
| color | string | '#1D2430' | 具体语义见上文与示例。 |
| background | string | '#FFFFFF' | 具体语义见上文与示例。 |
| lineWidth | number | 3 | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

实例 undo()、clear()、exportImage(): string；失败返回空字符串。画布为手写专用输入，业务需为无法手写的用户提供替代流程。

非 WEB 使用异步尺寸查询，查询期间的触点按序处理；等待绘制结束前不能导出，exportImage() 返回空字符串。清空、禁用或卸载会取消尚未绘制的触点。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
