# 40 组件扩展自检记录

日期：2026-10-31（Asia/Shanghai）。本轮从 `e08185e` 的 13 个组件扩展到 40 个，按已有灰蓝、系统字体、36px 默认控件和 UTS / uvue 规范实现。目录与逐项 API 见 [组件指南](component-guides.md)。参考来源见 [设计参考](design-references.md)。本轮工作区未提交、推送或发布。

## 复核结果

独立 reviewer 阅读新增 27 个组件、相关文档和测试，并查看最终五张分类页截图。首次提出 6 项 P2；两次定向复核后全部 resolved，评分 6/6，本轮范围内无剩余 P1/P2。最终判定为 **ship-with-caveats**，限定于源码、文档及已验证 H5 行为，不代表所有目标平台验收。

| 发现 | 修复与验证 |
|---|---|
| Stepper 显示与模型失配 | 宿主 input 100ms 节流会使快速失焦时的草稿落后；Input 转发 blur/confirm 的最终文本，Stepper 归一化后重建已经结束编辑的输入以清理宿主缓存。generation 防止过期处理覆盖新编辑。独立无延时复测超限、空值、负数／小数草稿、Enter、连续失焦、编辑后直接增加和逐字符输入均通过 |
| Upload 迟到拒绝 | beforeRead 的 catch 增加 generation／disposed／disabled 检查。真实 Vue setup 测试覆盖清空后迟到 resolve/reject、新选择后旧 reject、删除中断及卸载，旧任务不会恢复文件或展示过期错误 |
| Slider 深色颜色与拇指 | 轨道／填充即时随主题切换，拇指使用主色。最终计算颜色及深色截图复核通过 |
| Slider 可访问名称 | 在 WEB 平台入口同步实际 range 的 label 与 disabled；名称、动态禁用／恢复、方向键操作复核通过 |
| Badge 裁切 | 由组件自身预留标记空间；99+、dot、Tabbar 数字徽标完整，标记边界断言通过 |
| Collapse 插槽说明不准确 | 改为动态具名插槽，提供 `#usage` 示例，与源码一致 |

最终查看的截图：`catalog-basic-desktop-light.png`、`catalog-navigation-desktop-light.png`、`catalog-input-desktop-light.png`、`catalog-input-mobile-dark.png`、`catalog-popover-mobile-dark.png`。原始文件在被忽略的 `.impeccable/review/`。

主线程补充自检还复现了同一宿主节流对 Search 的影响：连续输入后立即 Enter 会提交旧查询。Search 现接收 blur/confirm 最终文本、补齐模型并提交；新增用例先在旧实现失败，修复后连续输入／Enter 和连续输入／点击搜索均通过。此项属于主线程补充回归，不计入独立 reviewer 的六项评分。

## 代码、文档与构建检查

- H5、微信发行构建通过；现有 Sass 弃用及 H5 类型提示保留在日志中。
- `check`、`test:unit`、`check:docs` 通过；40 份组件指南、42 段 Vue/UTS 示例结构和本地链接已核验。
- `npm test` 9 组、`test:forms`、`test:feedback`、`test:catalog` 通过，无浏览器 pageerror。最后 Input 参数修复后再次执行基础、表单及分类套件。
- 分类套件含导航／分页、反馈、数值、选择器取消与提交、日历禁用区间、日期时间、真实图片选择、浅深主题／移动布局和真实过渡中间帧。
- 独立设计文档整理保留原基础 tokens 与示例，补充新增组件分组、6 个组件 tokens、3 个示例及动效／语义说明；JSON/YAML、引用与源码参数映射已核对。
- 一次设计检测未返回发现。上述检查是明确范围内的证据，不能外推为零缺陷或全设备支持。

## 交付边界与跟进

每个完成组件都有独立用法、参数、事件、插槽／方法及边界。组件模块包含平台适配、样式、图标和许可，复制时须完整保留。新增 Input `blur(value: string)` 参数向后兼容不读取参数的监听器；confirm 使用宿主最终文本，准确契约已同步 API 和手册。

iOS 上传以 `MORI-UP-IOS-01` 至 `06` 在源码与 [平台适配清单](platform-adaptation.md) 留痕：权限、临时路径、HEIC、后台中断、文档选择、ATS／服务端协议。已提供选择器替换、异步读取前检查、响应解析与前台传输生命周期；原生转码、后台会话、断点续传和默认文档上传不在本版能力中。

微信只有编译证据；iOS／Android 原生、Safari、微信设备、鸿蒙及真实业务后端尚待验证。具体环境和缺项见 [兼容记录](compatibility.md)。后续按平台编号接入真实项目、设备及后端，不从浏览器模拟结果推断原生通过。
