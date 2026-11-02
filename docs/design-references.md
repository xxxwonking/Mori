# 本轮组件参考

根据用户截图修正输入双层焦点、宿主复选框选中皮肤，并补足紧凑尺寸、图标操作和 Switch 定制能力。

- [Vant Switch](https://github.com/youzan/vant/tree/main/packages/vant/src/switch)：参考独立的 activeColor / inactiveColor、固定轨道与 transform 滑块过渡。
- [Vant Checkbox](https://github.com/youzan/vant/tree/main/packages/vant/src/checkbox)：参考组件自行绘制选中填充与高对比勾标记。
- [Wot Design Uni Switch](https://github.com/Moonofweisheng/wot-design-uni/tree/master/src/uni_modules/wot-design-uni/components/wd-switch)：参考 uni-app 的受控状态和颜色配置方式。
- [Wot Design Uni Input](https://github.com/Moonofweisheng/wot-design-uni/tree/master/src/uni_modules/wot-design-uni/components/wd-input)：参考统一字段边界与独立图标操作。
- [Lucide](https://github.com/lucide-icons/lucide)：实际采用 eye、eye-off、circle-x、check 的 SVG，浅深色仅改描边色；完整许可随 uni_modules/mori-ui/THIRD_PARTY_NOTICES.md 保留。
- [uni-app x image](https://doc.dcloud.net.cn/uni-app-x/component/image.html#svg-support)：使用独立 SVG 文件和 image，避免跨端不支持的内联 SVG；原生真机效果仍需验证。

Vant 和 Wot 作为 API / 视觉实现参考，未作为运行依赖引入；组件以 UTS / uvue 重新实现。

## 2026-10-30：表单基础扩展

本批在 Mori 原有风格上补齐 Form／FormItem、Radio／RadioGroup、CheckboxGroup、Textarea。沿用中性灰蓝、系统字体、紧凑间距与浅深主题；参考来源用于明确职责与交互边界。

| 来源 | 参考内容 | Mori 的取舍 |
|---|---|---|
| [Vant Form 文档源码](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/form/README.zh-CN.md) | 字段规则、主动校验、校验结果与业务提交分离 | 第一批只提供同步顶层字段规则及 validate／validateField／clearValidate，不声明异步、嵌套或 resetFields 能力 |
| [Vant RadioGroup 源码](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/radio-group/RadioGroup.tsx) | 组级受控值、更新与 change 事件、组级禁用 | 使用唯一 string value 的 options；Mori 用 uvue 自绘圆点，H5 增加组内键盘导航 |
| [Wot Form](https://wot-ui.cn/component/form.html) | Form 与 FormItem 组合、字段标题／必填态／错误的职责划分 | FormItem 提供共享字段上下文，Input／Textarea 避免重复标签和错误消息 |
| [Wot Textarea](https://wot-ui.cn/component/textarea.html) | 多行输入、长度计数、自适应高度及表单组合 | 保留受控字符串、maxlength、showWordLimit、autoHeight；不把参考库的所有属性视作 Mori 已实现 API |

以上链接是所查阅的官方文档或源码入口，会随上游更新；Mori 的当前准确 API 以 [组件 API](components.md) 和本仓库源码为准。未增加 Vant、Wot、Ant Design Mobile 或 NutUI 运行依赖。既有 Lucide 资产来源与许可保持在模块内的 THIRD_PARTY_NOTICES.md；若后续直接引入第三方源码或素材，应另行记录对应来源与许可。

## 2026-10-30：反馈与弹层扩展

| 来源 | 参考内容 | Mori 的取舍 |
|---|---|---|
| [Vant Toast 文档源码](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/toast/README.zh-CN.md) | 文字／结果／加载提示、显示时长与主动关闭 | 页面内挂载一个实例，通过 ref 的 show／close 调用；重复显示替换当前提示，不提供全局函数、队列或阻断背景点击 |
| [Vant Popup 文档源码](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/popup/README.zh-CN.md) | 多位置弹出、关闭入口、遮罩和叠加展示 | 保留默认 v-model，默认从底部弹出；内部统一管理弹层次序和 H5 焦点／滚动适配 |
| [Vant Dialog 文档源码](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/dialog/README.zh-CN.md) | 内容确认、取消及等待业务处理的场景 | 由 Popup 组合，confirm 只通知业务，是否关闭由父组件决定；不提供 Promise 式全局调用 |
| [Wot Popup](https://wot-ui.cn/component/popup.html) | uni-app 场景中的弹出位置、遮罩和底部安全区 | 按 UTS／uvue 自行实现，H5 DOM 行为隔离到 platform；原生和小程序滚动／焦点能力按实际验证记录处理 |

Mori 的 prop 名称、默认值和事件与参考库不完全一致，接入时以本项目 API 为准。Toast、Popup、Dialog 的字体、圆角、按钮尺寸及亮暗配色沿用 Mori 规范；继续复用已随模块分发的 Lucide 图标及许可，没有新增上述参考库的运行依赖。


## 2026-10-30：常用组件目录扩展

查阅并自行以UTS实现，没有增加上游运行依赖：

| 官方来源 | 采用的交互约定 | Mori边界 |
|---|---|---|
| [Vant Calendar源码文档](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/calendar/README.zh-CN.md) | 单选/多选/范围、禁用与确认 | 使用严格字符串日期数组、月切换与标记；不照搬Date对象API |
| [Vant Uploader源码文档](https://raw.githubusercontent.com/youzan/vant/main/packages/vant/src/uploader/README.zh-CN.md) | 文件列表、预览、读取后业务处理 | 提供 afterRead 及平台上传入口；APP-IOS 用独立 PHPicker／URLSession，其他平台用 uni API；模型不是 Vant 的浏览器 File 对象 |
| [Wot Tabs源码文档](https://raw.githubusercontent.com/Moonofweisheng/wot-design-uni/master/docs/component/tabs.md) | 标签唯一标识、禁用与切换 | 使用string value + items；内容通过slot，不实现Wot全套Tab子组件接口 |
| [uview-plus NumberBox](https://raw.githubusercontent.com/ijry/uview-plus/master/src/uni_modules/uview-plus/components/u-number-box/props.js) | 步长、上下界和禁用输入 | 数值模型与有限边界，原有36px设计 |
| [uview-plus DatetimePicker](https://raw.githubusercontent.com/ijry/uview-plus/master/src/uni_modules/uview-plus/components/u-datetime-picker/props.js) | 显隐模型与日期时间选择 | Mori组合日历与时分步进，返回本地格式字符串 |
| [uview-plus Upload](https://raw.githubusercontent.com/ijry/uview-plus/master/src/uni_modules/uview-plus/components/u-upload/props.js) | 选择前处理与文件预览/状态 | 独立平台选择与请求入口，iOS差异编号跟踪 |

新增16种Lucide图标从官方icons目录获取，仅调整浅深描边；Mori的home名称映射上游house。许可继续随模块分发。


## 2026-10-31 通用覆盖扩充参考

参考 [Vant Cascader](https://github.com/youzan/vant/blob/main/packages/vant/src/cascader/README.zh-CN.md) 的逐级选择与路径语义、[Vant List](https://github.com/youzan/vant/blob/main/packages/vant/src/list/README.zh-CN.md) 的 loading／finished／error 分离。查阅 [Wot NumberKeyboard](https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/number-keyboard.md) 时确认其已迁移到 Keyboard；Mori 保留明确的 NumberKeyboard 名称，只承诺数字／小数点／X 键能力。未引入这些库运行依赖、未复制其组件实现。

新增 static/examples/geometry.svg 是项目自绘矩形、圆与线段，用于图片加载／裁切／预览验证；沿用随库 Lucide 图标许可，未增加外部照片。

## QR 编码参考（2026-11-01）

QRCode 使用 [Project Nayuki QR Code generator](https://www.nayuki.io/page/qr-code-generator-library) 的 MIT TypeScript 算法，保留完整许可声明于 uni_modules/mori-ui/vendor/qrcodegen.uts。原始来源为 [qrcodegen.ts](https://github.com/nayuki/QR-Code-generator/blob/master/typescript-javascript/qrcodegen.ts)。本地适配将 namespace 展平为 UTS 模块、统一 number 数组并用 Error；算法不依赖 Node Buffer 或浏览器 DOM。

下载时原始文件 SHA-256：`7021f1b4bf05c584b55502173cf19d7a5779263dccbaa7b123e25089f0181162`。jsQR 仅用于开发环境独立解码回环测试。第三方 MIT 许可不等于项目自身已经选择开源许可证。
