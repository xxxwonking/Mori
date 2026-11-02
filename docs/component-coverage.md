# 组件覆盖范围

2026-11-01：本轮补强从 72 增至 **88 个独立 easycom 组件**。清单在 scripts/component-manifest.mjs；每项均有 [独立指南](component-guides.md) 和官网真实 H5 示例。组件的模式、尺寸和演示不重复计数。

| 方向 | 新增组件 |
|---|---|
| 录入 | Autocomplete、TagInput、ColorPicker、DateRangePicker |
| 内容 | Table、Descriptions、TextEllipsis、RichText |
| 长列表 | VirtualList、Waterfall |
| 媒体 | ImageCropper、Signature、QRCode、Video |
| 交互布局 | Draggable、FloatingPanel |

已有能力补强：Form 增加异步／嵌套校验和 JSON 初始值重置；Picker 多列联动；Cascader 懒加载与失败重试；TreeSelect 父子联动／半选；SwipeCell 双侧多操作；ImagePreview 缩放／平移。Checkbox 同步增加半选属性。

## 明确边界与后续

- VirtualList 为固定行高；Waterfall 使用业务提供的卡片高度，暂不做异步测高和虚拟瀑布流。
- Table 为轻量只读表格与排序；RichText 为结构化安全内容展示，不含编辑器或任意 HTML 解析。
- ColorPicker 支持预设与 hex；ImageCropper 使用滑块定位，不含旋转／自由裁剪框。Signature 为图像采集，不是电子签章。
- Draggable 为同列表触摸排序和按钮替代，不做跨列表拖拽／边缘自动滚动。FloatingPanel 在当前容器中调整高度，宿主负责屏幕定位。
- Canvas 图片加载／导出、SVG 二维码显示、视频编码、触摸与滚动仍需原生和微信设备验收；H5 与编译证据以 [兼容记录](compatibility.md) 为准。
- Sticky 的原生自动吸顶、地区数据包、多文件／文档上传仍未补齐。地址、商品卡、SKU、优惠券等业务组件没有纳入本轮。
- 项目自身 LICENSE、贡献流程、CI、版本发布和官网公网部署仍待处理；保留的 Nayuki / Lucide 第三方许可不替代项目自身许可证。

## 历史规划（已由上面的当前范围更新）


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

## 2026-11-01：面向开源库的下一轮补齐建议

用户在官网完成后再次指出 72 个组件仍偏少，并询问开源组件库还需哪些工作。当前数量仍为 72；以下为建议清单，尚未实现或确定发布排期。前文“未提交／推送”为当时阶段状态，当前以 Git 与 progress.md 为准。

优先补足有独立使用价值的通用能力，再按需要增加业务组件；同一组件的尺寸、颜色或模式不重复计数。

| 批次 | 建议新增 | 对已有组件的补强 |
|---|---|---|
| 高频通用 | Autocomplete 自动补全、TagInput 标签输入、ColorPicker 颜色选择、DateRangePicker 日期范围弹层、Table 表格、Descriptions 描述列表、TextEllipsis 文本展开、RichText 富文本展示 | Picker 多列联动；Form 异步校验、嵌套字段与重置 |
| 复杂交互 | VirtualList 虚拟列表、Waterfall 瀑布流、ImageCropper 图片裁剪、Signature 签名、Draggable 拖拽排序、FloatingPanel 可拖动浮层、QRCode 二维码、Video 视频 | Cascader 懒加载；TreeSelect 父子联动／半选；SwipeCell 双侧多操作；ImagePreview 缩放；Sticky 原生吸顶 |
| 可选业务 | AddressEdit 地址编辑、AddressList 地址选择、GoodsCard 商品卡、Sku 规格选择、Coupon 优惠券 | 业务字段、货币／文案和插槽可配置，避免固定某个项目的数据模型 |

前两批共 16 个独立候选，全部实施后为 88 个；另有五个可选业务组件，全部实施后为 93 个。更多候选需先明确使用场景，不能为达到整百而拆分重复组件。每个新增组件需有源码、明确 API、独立指南、官网真实示例及适用行为／平台检查。

开源发布还需补齐项目自身的许可证（根目录目前没有 LICENSE）、贡献与问题反馈流程、CI、版本变更记录、uni_modules 分发说明和官网公网部署。原生／微信真机／Safari 验收与国际化、可访问性应持续推进。许可证选型、正式发布和平台可用性不能由组件数量代替。
