# shadcn 风格与主题

2026-11-06 用户选择将 Mori 组件尽可能向 shadcn 看齐，并明确默认使用黑白中性主色。本轮替换此前默认灰蓝视觉，保留 uni-app x、UTS、`.uvue`、88 个组件及现有属性／事件。

## 默认主题

运行时以 `uni_modules/mori-ui/theme.uts` 为准，SCSS 基础位于 `styles/tokens.scss`。

| 语义 | 浅色 | 深色 |
|---|---|---|
| primary 主操作 | `#171717` | `#e5e5e5` |
| soft 柔和背景 | `#f5f5f5` | `#262626` |
| surface 内容表面 | `#ffffff` | `#171717` |
| ground 页面地色 | `#fafafa` | `#0a0a0a` |
| text 正文 | `#0a0a0a` | `#fafafa` |
| muted 辅助文字 | `#666666` | `#a3a3a3` |
| border 分隔／容器 | `#e5e5e5` | `#333333` |
| input 控件边界 | `#d4d4d4` | `#404040` |
| ring 焦点 | `#737373` | `#a3a3a3` |
| accent 悬停底色 | `#f5f5f5` | `#333333` |
| danger 错误文字／边框 | `#c62828` | `#f87171` |
| dangerSoft 错误底色 | `#fef2f2` | `#3f161b` |

默认继续为 `auto`；`light`／`dark` 固定外观，切回 `auto` 恢复跟随当前系统。`color`、`darkColor`、`softColor`、`darkSoftColor` 全局覆盖与组件实例颜色保持可用。品牌色数据、ColorPicker 色板、二维码与签名图像不按黑白界面一律改色。

## 组件对应

| Mori | 本轮样式 |
|---|---|
| Button solid / soft / outline / text | 主操作／次级灰底／中性描边／透明文字；现有 variant 名称保留 |
| Input / Textarea | 单一 1px 控件边框；正常焦点中性灰；错误聚焦时仍保持红色 |
| Switch / Checkbox / Radio | 中性选中态；关闭轨道和未选边框使用 input；深色开关滑块按轨道背景选择黑白 |
| Tabs / SegmentedControl | 灰底分组、独立选中表面；文字字重稳定，切换不改变项目尺寸 |
| Tag | 紧凑胶囊、500 字重；保留普通／危险／描边语义 |
| Card / Popover / Popup / Toast | 中性表面与细边界；H5 使用轻投影，Toast 保留状态文字和图标 |
| 其余组件 | 通过共享主题继承黑白主色、文字、边框和状态背景 |

系统字体、36px 默认按钮／输入、13px 文字、12px 标签继续保留。普通控件 8px 圆角，小档 6px，Checkbox 4px；主要内容容器 12px。选择动画保持原有时长，H5 尊重 `prefers-reduced-motion`。

输入没有照搬 shadcn 的外置焦点光圈，因为用户之前明确要求单一闭合边框；所有边框状态都保持 1px。H5 悬停、键盘焦点和投影限定于 `WEB` 条件编译，原生端保留语义配色与基础边界。没有引入 React、Radix 或 Tailwind 运行依赖，也没有将 shadcn 的 API 当作 Mori API。

## 参考与复现

参考 shadcn 官方 `new-york-v4` 的 [Button](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button.tsx)、[Input](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/input.tsx)、[Switch](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/switch.tsx)、[Tabs](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/tabs.tsx) 和 [Card](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx)，读取日期为 2026-11-06；这里记录视觉映射，不承诺与持续更新的上游逐像素一致。

先 `npm run site:build`、`npm run site:preview`，然后 `npm run test:theme` 检查按钮层级、焦点、错误、选择态与尺寸稳定性；`npm run test:site` 巡检 88 个真实示例。`tests/theme.mjs` 已接入 `test:unit`，检查默认灰阶、文字对比度、自动主题与自定义品牌。

原始截图与报告位于被忽略的 `.impeccable/review/shadcn-*`。本轮实际结果见 [当前进度](progress.md) 与 [兼容记录](compatibility.md)；历史 iOS 上传验证不代表新主题已经通过原生设备验收。
