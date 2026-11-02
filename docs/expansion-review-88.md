# 88 组件补强复核记录

2026-11-01。范围为新增 16 个独立组件及 Form、Picker、Cascader、TreeSelect、SwipeCell、ImagePreview 的能力补强，Checkbox 同步半选。官网、独立指南、manifest 与示例已同步到 88；使用方式见 [逐组件指南](component-guides.md)。

## 独立复核与修正

| 问题 | 最终处理 | 证据 |
|---|---|---|
| Signature 非等比显示导致输出变形 | 显示随容器宽度保持 5:3，对应 600×360 输出 | 实际绘制等长直角笔迹；PNG 像素外框宽高差 ≤2px，桌面／手机截图 |
| VirtualList 关闭缓冲时漏末行 | 可见末端按 ceil((top+height)/rowHeight) 计算 | top=43、45 和近尾部的窗口断言 |
| Form 空 message 吞掉异步拒绝 | reject 始终产生非空兜底错误 | message='' 的拒绝返回 valid=false |
| TagInput/ColorPicker 读取旧草稿 | 接收 blur 最终文本；成功后重建 Input 清除迟到事件 | 同一任务中 input→blur→click，检查提交值、延迟后的清空／规范化结果 |
| ImagePreview 固定键盘边界 | platform 层测量实际宽度并观察 H5 resize | 非 280px 视口左右最大平移和缩窄后的自动收敛 |

Reviewer 最终评分为 **5/5 resolved、remaining=clear、disposition=ship**。该 verdict 仅覆盖这五项修复；八张指定截图有效，未发现修复引入的回归。初审与最终原始报告保存在被忽略的 .impeccable/review/strengthen-independent-review.md、strengthen-independent-verdict.md，本文件保存可分发结论。

## 验证与设计记录

- 精确 88 个 easycom 导出，88 份指南、94 段 Vue/UTS 示例和本地链接检查通过；CRLF 示例不会漏检。
- 完整单元通过，包含真实 Vue setup、异步竞态、窗口／裁剪几何和独立 jsQR 解码回环。
- 最终 H5、VitePress 和微信发行构建通过；保留已知 Sass 与 H5 withKeys／NodeListOf／onPageScroll 提示。
- Chromium 145.0.7632.6：17 组新增真实交互通过。官网五组与全部 88 个示例在 360px 巡检通过，1440／1280／768／390px 浅深主题与文档预览通过。原基础、表单、分类、第二轮扩展套件通过。
- 独立 documenter 同步 DESIGN.md 与 design.json，核验原核心／官网 token、20 个预览条目和旧扩展字段保留；新增尺度与源码一致。一次设计检测无发现。

## 交付边界

本轮没有提交、推送、发布组件包或部署公网。原生 iOS／Android、微信设备、Safari、鸿蒙与真实业务后端没有新增运行证据；[平台编号](platform-adaptation.md) 和 [兼容记录](compatibility.md) 区分编译、浏览器与设备结果。

新组件的功能限制仍按各指南保留：定高虚拟列表、给定高度瀑布流、结构化富文本、hex 色板、滑块裁剪、同列表排序与由宿主定位的浮动面板。Sticky 原生自动吸顶与可选业务组件未纳入本轮。
