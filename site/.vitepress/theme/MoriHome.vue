<script setup>
import { computed, ref } from 'vue';
import ComponentPreview from './ComponentPreview.vue';
import Icon from './Icon.vue';
import { componentManifest } from '../../../scripts/component-manifest.mjs';
const selected = ref('button');
const group = ref('基础');
const groups = ['基础', '录入', '反馈', '导航', '展示', ...new Set(componentManifest.map(c => c.group).filter(g => !['基础', '录入', '反馈', '导航', '展示'].includes(g)))];
const query = ref('');
const filtered = computed(() => componentManifest.filter(c => query.value ? `${c.name}${c.title}`.toLowerCase().includes(query.value.toLowerCase()) : c.group === group.value));
const english = name => name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
const examples = [{ name: 'button', title: '按钮' }, { name: 'input', title: '输入框' }, { name: 'switch', title: '开关' }, { name: 'popup', title: '弹出层' }];
</script>

<template>
  <main class="mori-home">
    <section class="home-hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">为每一屏，<br />留一点从容。</h1>
        <p class="hero-description">面向 uni-app x 的移动组件库。<br />把细节交给 Mori，把时间留给你的产品。</p>
        <div class="hero-actions"><a class="mori-primary" href="/user-guide">开始使用 <Icon name="arrow" /></a><a class="mori-secondary" href="/components/button">浏览组件</a></div>
        <div class="hero-facts"><span>{{ componentManifest.length }} 个组件</span><span>UTS + .uvue</span><span>浅色 / 深色</span></div>
        <div class="hero-caption"><span class="brand-mini" aria-hidden="true"><i></i><i></i><i></i></span><p>熟悉的系统质感。<br /><span>更轻的界面，更自然的交互。</span></p></div>
      </div>
      <div class="hero-playground">
        <div class="playground-tabs" aria-label="选择首页演示组件"><button v-for="item in examples" :key="item.name" :class="{ active: selected === item.name }" :aria-pressed="selected === item.name" @click="selected = item.name">{{ item.title }}</button></div>
        <ComponentPreview :component="selected" hero />
        <p class="playground-note">点一点，感受真实组件。</p>
      </div>
    </section>

    <section class="component-section" aria-labelledby="component-title">
      <div class="section-heading"><div><h2 id="component-title">好用的基础，已经就位。</h2><p>从一个按钮，到一整套移动界面。</p></div><a href="/component-guides">全部 {{ componentManifest.length }} 个组件 <Icon name="arrow" /></a></div>
      <div class="catalog-controls"><div class="group-tabs" aria-label="组件分类"><button v-for="item in groups" :key="item" :class="{ active: group === item && !query }" :aria-pressed="group === item && !query" @click="group = item; query = ''">{{ item }}<span>{{ componentManifest.filter(c => c.group === item).length }}</span></button></div><input v-model="query" aria-label="搜索组件" placeholder="查找组件…" type="search" /></div>
      <div class="component-links"><a v-for="item in filtered" :key="item.name" :href="`/components/${item.name}`"><span>{{ english(item.name) }}</span><span>{{ item.title }}</span><Icon name="arrow" /></a></div>
      <p v-if="!filtered.length" class="catalog-empty" role="status">没有找到“{{ query }}”。试试“按钮”、Input 或其他关键词。</p>
    </section>

    <section class="home-principles" aria-labelledby="principles-title">
      <div class="principle-lead"><h2 id="principles-title">少一点调整，<br />多一点默契。</h2><p>组件之间保持一致，<br />项目之间自由组合。</p></div>
      <div class="principle-list"><article><h3>紧凑，刚刚好。</h3><p>36px 默认按钮与输入、13px 控件文字。让内容有空间，让操作有分寸。</p></article><article><h3>明暗之间，自然切换。</h3><p>默认跟随系统，也可全局固定浅色或深色。品牌色与组件实例都能按需调整。</p></article><article><h3>从源码开始，自由构建。</h3><p>整包复制到 uni_modules，通过 easycom 使用。组件专注交互，业务逻辑由你决定。</p></article></div>
    </section>

    <section class="home-platforms" aria-labelledby="platform-title"><div><h2 id="platform-title">跨端目标，<br />进度清晰可见。</h2><p>每一份兼容承诺，都对应实际验证。</p><a href="/compatibility">查看完整兼容记录 <Icon name="arrow" /></a></div><table><caption class="visually-hidden">目标平台及当前验证状态</caption><thead><tr><th>平台</th><th>当前进度</th></tr></thead><tbody><tr><td>H5</td><td><span class="platform-verified">构建与浏览器验证</span></td></tr><tr><td>微信小程序</td><td>构建通过，设备待验证</td></tr><tr><td>iOS / Android</td><td>原生编译与真机待验证</td></tr><tr><td>HarmonyOS</td><td>按组件逐步适配</td></tr></tbody></table></section>

    <section class="home-closing"><div><h2>下一个项目，从 Mori 开始。</h2><p>先选一个组件，试试它如何融入你的界面。</p></div><a class="mori-primary" href="/user-guide">阅读接入指南 <Icon name="arrow" /></a></section>
  </main>
</template>
