# 本轮组件参考

根据用户截图修正输入双层焦点、宿主复选框选中皮肤，并补足紧凑尺寸、图标操作和 Switch 定制能力。

- [Vant Switch](https://github.com/youzan/vant/tree/main/packages/vant/src/switch)：参考独立的 activeColor / inactiveColor、固定轨道与 transform 滑块过渡。
- [Vant Checkbox](https://github.com/youzan/vant/tree/main/packages/vant/src/checkbox)：参考组件自行绘制选中填充与高对比勾标记。
- [Wot Design Uni Switch](https://github.com/Moonofweisheng/wot-design-uni/tree/master/src/uni_modules/wot-design-uni/components/wd-switch)：参考 uni-app 的受控状态和颜色配置方式。
- [Wot Design Uni Input](https://github.com/Moonofweisheng/wot-design-uni/tree/master/src/uni_modules/wot-design-uni/components/wd-input)：参考统一字段边界与独立图标操作。
- [Lucide](https://github.com/lucide-icons/lucide)：实际采用 eye、eye-off、circle-x、check 的 SVG，浅深色仅改描边色；完整许可随 uni_modules/mori-ui/THIRD_PARTY_NOTICES.md 保留。
- [uni-app x image](https://doc.dcloud.net.cn/uni-app-x/component/image.html#svg-support)：使用独立 SVG 文件和 image，避免跨端不支持的内联 SVG；原生真机效果仍需验证。

Vant 和 Wot 作为 API / 视觉实现参考，未作为运行依赖引入；组件以 UTS / uvue 重新实现。
