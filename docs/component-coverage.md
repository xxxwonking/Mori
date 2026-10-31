# 组件覆盖范围

2026-10-31：用户指出 40 个组件不足，选择通用场景全面补齐。本轮新增 32 个，当前 72 个独立 easycom 导出；不把组合演示或同组件变体重复计数。完整 API 见 [72 份指南](component-guides.md)。

| 场景 | 本轮新增 |
|---|---|
| 媒体 | Image、Avatar、AvatarGroup、Swiper、ImagePreview |
| 内容与状态 | Card、CellGroup、Grid、Steps、Timeline、Highlight、Result、NoticeBar |
| 数字与时间 | CountDown、CountTo |
| 列表 | List、LoadMore、PullRefresh、IndexBar |
| 导航与布局 | SegmentedControl、Sidebar、DropdownMenu、Fab、BackTop、Sticky、SafeArea、ActionBar |
| 复杂录入 | Cascader、TreeSelect、NumberKeyboard、PasswordInput |
| 手势 | SwipeCell |

## 已实现能力的边界

- Cascader 采用业务传入树，明确叶子确认；不内置全国行政区、不提供异步懒加载协议。TreeSelect 只选叶子，没有父子半选联动。
- List 提供滚动触底与手动加载，不是虚拟列表；PullRefresh 手势由宿主承担，保留按钮入口。
- SwipeCell 当前是右侧单操作。ImagePreview 是弹窗翻页，缩放交给可选宿主预览。
- Sticky 在 APP 默认普通布局，受控 fixed 模式由页面滚动驱动；原生自动吸顶未实现。
- NumberKeyboard 是普通 UI 输入，不宣称安全键盘、密码加密或支付能力。

## 后续仍可扩充的独立能力

下表保留真实缺口，不将 72 个组件描述为涵盖主流库所有能力。

| 方向 | 尚未实现 | 主要设计点 |
|---|---|---|
| 复杂录入 | 多列联动 Picker、日期范围弹层、地区数据包、异步表单校验、签名、颜色选择 | 数据契约、异步取消与真机输入 |
| 长内容 | 虚拟列表、表格、富文本渲染、文本展开、瀑布流 | 动态高度、跨端测量与可访问性 |
| 媒体 | 图片裁剪、自定义缩放、多文件／文档上传、视频组件 | 原生媒体权限、格式与资源生命周期 |
| 手势与布局 | 拖拽排序、双侧多操作 SwipeCell、可拖动浮层 | 滚动冲突、键盘替代、触摸验收 |
| 业务组合 | 地址编辑／选择、优惠券、商品卡、SKU 选择、提交栏 | 业务字段可配置，避免把单一业务模型固化 |

下一步优先按具体接入项目选择一组能力做完整 API 和平台验收。已有源码留在当前工作区，本轮未提交／推送。
