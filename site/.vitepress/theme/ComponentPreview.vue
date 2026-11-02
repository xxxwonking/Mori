<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';
import Icon from './Icon.vue';
const props = defineProps({ component: { type: String, default: 'button' }, hero: Boolean });
const { isDark } = useData();
const origin = ref('');
const overrideTheme = ref('');
const revision = ref(0);
const frame = ref(null);
const loaded = ref(false);
const qr = ref('');
const qrError = ref('');
const theme = computed(() => overrideTheme.value || (isDark.value ? 'dark' : 'light'));
const demoBase = import.meta.env.VITE_MORI_DEMO_URL || '/demo/index.html';
const src = computed(() => `${demoBase}#/pages/preview/preview?component=${encodeURIComponent(props.component)}&theme=${theme.value}`);
const absoluteUrl = computed(() => origin.value ? new URL(src.value, origin.value).href : '');
const localOnly = computed(() => origin.value && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(new URL(absoluteUrl.value).hostname));
watch([src, revision], () => { loaded.value = false; qr.value = ''; });
onMounted(() => { origin.value = window.location.origin; });
async function makeQr(event) {
  if (!event.target.open || !absoluteUrl.value) return;
  qrError.value = '';
  const url = absoluteUrl.value;
  try {
    const QRCode = await import('qrcode');
    const data = await QRCode.toDataURL(url, { width: 200, margin: 2, color: { dark: '#1d2430', light: '#ffffff' } });
    if (url === absoluteUrl.value) qr.value = data;
  } catch { qrError.value = '二维码生成失败，请使用独立打开。'; }
}
function toggleTheme() { overrideTheme.value = theme.value === 'dark' ? 'light' : 'dark'; }
</script>

<template>
  <section class="component-preview" :class="{ 'hero-preview': hero }" aria-label="真实组件效果预览">
    <div class="preview-toolbar">
      <span class="preview-toolbar-label">交互预览</span>
      <div class="preview-tools">
        <button type="button" :title="theme === 'dark' ? '切换为浅色预览' : '切换为深色预览'" :aria-label="theme === 'dark' ? '切换为浅色预览' : '切换为深色预览'" @click="toggleTheme"><Icon :name="theme === 'dark' ? 'sun' : 'moon'" /></button>
        <button type="button" title="刷新示例" aria-label="刷新示例" @click="revision++"><Icon name="refresh" /></button>
        <details :key="src" class="preview-qr" @toggle="makeQr">
          <summary aria-label="显示预览二维码" title="二维码"><Icon name="qr" /></summary>
          <div class="qr-popover"><img v-if="qr" :src="qr" alt="当前组件预览地址二维码" width="200" height="200" /><p v-else>{{ qrError || '正在生成二维码…' }}</p><p>{{ localOnly ? '当前是本机地址。部署后，或通过局域网 IP 访问官网后，即可用手机扫码。' : '手机扫码，打开当前组件。请确保手机能够访问此地址。' }}</p></div>
        </details>
        <a :href="src" target="_blank" rel="noopener" title="独立打开示例" aria-label="独立打开示例"><Icon name="external" /></a>
      </div>
    </div>
    <div class="preview-screen" :class="{ 'is-loading': !loaded }">
      <iframe ref="frame" :key="component + theme + revision" :src="src" :title="`${component} 组件实时示例`" @load="loaded = true" />
    </div>
    <div class="preview-bottom"><span>真实 H5 示例</span><a :href="src" target="_blank" rel="noopener">在新窗口体验 <Icon name="external" /></a></div>
  </section>
</template>
