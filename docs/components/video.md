# 视频 mori-video

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

封装宿主视频播放与错误恢复。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-video src="/static/mori-demo.webm" title="本地演示短片" /><mori-text text="本地生成的演示短片；生产项目请按目标平台提供相应媒体格式。" tone="muted" />
</template>

<script setup lang="uts">

</script>
```

## 状态与进阶使用

src/poster 交给 uni-app video，默认 controls=true、autoplay=false。play/pause/ended 无参数；timeUpdate(currentTime,duration) 单位秒；error(message) 后显示重试按钮，retry() 事件表示用户请求重新加载。视频编码、自动播放、全屏和权限取决于目标平台；演示 WebM 不代表所有设备支持该格式。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| src | string | '' | 具体语义见上文与示例。 |
| poster | string | '' | 具体语义见上文与示例。 |
| title | string | '视频' | 标题／可访问名称。 |
| height | number | 200 | 显示区域高度，单位 px。 |
| controls | boolean | true | 具体语义见上文与示例。 |
| autoplay | boolean | false | 具体语义见上文与示例。 |
| muted | boolean | false | 具体语义见上文与示例。 |
| loop | boolean | false | 具体语义见上文与示例。 |
| objectFit | string | 'contain' | 具体语义见上文与示例。 |

## 事件、插槽与方法

实例 play()、pause()、seek(seconds)。离开时暂停；src 改变重新挂载。原生 controls 的样式与键盘行为由宿主提供。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
