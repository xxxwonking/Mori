import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { componentManifest } from './component-manifest.mjs';
import { listModuleFiles, verifyDistribution } from './distribution.mjs';

/** Reject additions, deletions and edits before reusing a consumer build. */
export function verifyConsumerModules(source, project) {
  const runtimeFiles = root => listModuleFiles(root).filter(file => !file.endsWith('.md') && file.split('/').at(-1) !== 'LICENSE');
  const files = runtimeFiles(source);
  assert.deepEqual(files, runtimeFiles(project), 'Cannot reuse stale consumer file list; run test:consumer without --reuse.');
  for (const file of files) {
    assert(readFileSync(join(source, file)).equals(readFileSync(join(project, file))), `Cannot reuse stale consumer code: ${file}`);
  }
}

/** Only the packaged modules enter the fixture. No workbench/demo imports or symlinks. */
export function createConsumerProject(distribution, parent) {
  const manifest = verifyDistribution(distribution);
  mkdirSync(parent, { recursive: true });
  const output = mkdtempSync(join(parent, 'mori-consumer-'));
  cpSync(join(distribution, 'uni_modules'), join(output, 'uni_modules'), { recursive: true });
  const write = (path, content) => writeFileSync(join(output, path), content);
  const writeJson = (path, value) => write(path, JSON.stringify(value, null, 2) + '\n');
  mkdirSync(join(output, 'pages/index'), { recursive: true });
  writeJson('package.json', { name: 'mori-consumer-check', version: manifest.version, private: true });
  writeJson('manifest.json', { name: 'Mori Consumer Check', appid: '', versionName: manifest.version, versionCode: 100, 'uni-app-x': { vapor: true, styleIsolationVersion: '2' }, app: { defaultAppTheme: 'auto' }, web: { darkmode: true, router: { mode: 'hash' } }, 'mp-weixin': { appid: '', darkmode: true } });
  writeJson('pages.json', { pages: [{ path: 'pages/index/index', style: { navigationBarTitleText: 'Mori Consumer Check', navigationStyle: 'custom' } }] });
  write('main.uts', `import App from './App.uvue'\nimport { createSSRApp } from 'vue'\nexport function createApp() { return { app: createSSRApp(App) } }\n`);
  write('App.uvue', `<script lang="uts">\nimport { initMoriTheme } from '@/uni_modules/mori-ui/theme.uts'\nexport default { onLaunch() { initMoriTheme() } }\n</script>\n<style>page { font-family: system-ui, sans-serif; } </style>\n`);
  write('index.html', '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Mori Consumer Check</title></head><body><div id="app"></div><script type="module" src="/main.uts"></script></body></html>\n');
  const allComponents = componentManifest.map(c => `<view class="consumer-item"><mori-${c.name}${c.name === 'form' ? ' :model="emptyModel"' : c.name === 'radio' ? ' value="consumer-radio"' : ''} /></view>`).join('\n');
  write('pages/index/index.uvue', `<template>
<view class="consumer" :style="'background-color:' + moriPalette.ground">
  <mori-navbar title="独立接入验证" />
  <mori-button label="切换主题" variant="outline" @click="toggleTheme" />
  <mori-input v-model="name" label="姓名" clearable required />
  <mori-switch v-model="enabled" label="接收通知" />
  <mori-button label="打开弹层" @click="opened = true" />
  <mori-popup v-model="opened" title="独立项目弹层"><mori-text :text="name" /><mori-button label="完成" @click="opened = false" /></mori-popup>
  <mori-stepper v-model="count" :min="0" :max="1" label="数量" />
  <mori-upload :auto-upload="false" :disabled="true" />
  <mori-text :text="'选择状态：' + (enabled ? '开启' : '关闭')" />
  <mori-button label="更换内置提示" @click="customizeMessages" />
  <mori-button label="恢复默认配置" @click="restoreDefaults" />
  <mori-button label="浅色模式深色提示" @click="showSurfaceToast(true)" />
  <mori-button label="深色模式浅色提示" @click="showSurfaceToast(false)" />
  <mori-toast v-model="toastVisible" type="success" message="保存成功" :duration="0" />
  <mori-button label="加载全部组件" @click="allComponents = true" />
  <view v-if="allComponents" class="consumer-catalog">${allComponents}</view>
</view>
</template>
<script setup lang="uts">
import { ref } from 'vue'
import { moriPalette, moriIsDark, setMoriConfig, resetMoriConfig } from '@/uni_modules/mori-ui/theme.uts'
const name = ref('')
const enabled = ref(false)
const opened = ref(false)
const count = ref(0)
const allComponents = ref(false)
const toastVisible = ref(false)
const emptyModel = ref({} as UTSJSONObject)
function toggleTheme() { setMoriConfig({ theme: moriIsDark.value ? 'light' : 'dark' }) }
function customizeMessages() { setMoriConfig({ messages: { required: 'Required', clearInput: 'Clear input', closePopup: 'Close panel', increase: 'Increase', decrease: 'Decrease' } }) }
function restoreDefaults() { toastVisible.value = false; resetMoriConfig() }
function showSurfaceToast(darkSurface: boolean) {
  if (darkSurface) setMoriConfig({ theme: 'light', light: { surface: '#000000', text: '#ffffff' } })
  else setMoriConfig({ theme: 'dark', dark: { surface: '#ffffff', text: '#000000' } })
  toastVisible.value = true
}
</script>
<style>.consumer { min-height: 100vh; padding: 16px; display: flex; flex-direction: column; gap: 16px; font-family: system-ui, 'Segoe UI', 'Microsoft YaHei', sans-serif; }</style>
`);
  return output;
}
