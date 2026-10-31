# 72 组件扩充与复核记录

日期：2026-10-31（Asia/Shanghai）。本轮范围是 40→72 的 32 个新增组件、四组组合演示、独立指南和目录接入；不把上一个聊天未提交的 27 个组件计入本轮新增。完整清单见 [覆盖范围](component-coverage.md)。

## 独立复核与修复

独立 reviewer 读取新增组件和共享逻辑，逐张查看四个分类的 1280px 桌面、390px 深色手机及 360px 级联弹层共九张截图。指南抽读 Card、Swiper、List、PullRefresh、IndexBar；其余指南经过结构、参数与链接检查，不宣称全部经过逐页人工复读。保留既有灰蓝、系统字体与紧凑基线，无需重做视觉身份。

| 发现 | 修复与验证 | 最终评分 |
|---|---|---|
| List／PullRefresh 同步完成后请求锁无法释放 | Vue 更新后核对最终模型，同 tick 保持防重入；旧版新增回归先失败，修复后同步／异步重复调用均通过 | resolved |
| Swiper 隐藏页进入 Tab 并推动宿主外壳滚动 | 当前页唯一 Tab 入口、隐藏页退出辅助技术树、左右键切换；平台焦点采用 preventScroll。实际浏览器检查焦点与 wrapper.scrollLeft=0 | resolved |
| IndexBar 异步加载／重排 sections 后定位过期 | 根据受控值与 sections 计算目标，版本号取消过期 nextTick／卸载回调；真实 setup 的加载与重排回归通过 | resolved |
| PRODUCT.md 保留旧的小基础库约束 | 记录用户通用扩充选择、72 个实际导出以及仍存在的缺口 | resolved |

独立定向复核为 **ship，4/4 resolved，remaining clear**，只覆盖以上四项；没有将该评分扩大为全平台或所有组件能力的保证。最终九张截图复核有效，未观察到这批修复引入的回归。

## 验证与证据

- check、check:docs、完整 test:unit 通过；四项修复后追加的 extended-catalog 定向单元回归通过。
- 最终 H5／微信发行构建成功；Chromium 145 的 test:expanded 五组通过，无 pageerror。原基础九组、上一轮分类套件回归通过。
- 一次设计 detector 输出为空；独立 documenter 已同步 DESIGN.md 和 design.json，并验证 JSON／新增 token 引用。旧 sidecar 的 kind／refersTo 和预览数量漂移保留，未混入此次清理。
- 原始检查与截图位于被忽略的 `.impeccable/review/`：expanded-independent-review.md、expanded-independent-verdict.md、expanded-verification.json、expanded-*.png、expansion-h5.log、expansion-weixin.log。复现命令见 [验证说明](testing.md)。

没有 iOS／Android 原生、微信真机、Safari、鸿蒙或真实业务后端新增验收；具体环境缺项见 [兼容记录](compatibility.md)，需要独立适配的能力见 [平台清单](platform-adaptation.md)。本轮未提交、推送或发布。
