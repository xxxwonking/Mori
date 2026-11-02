<script setup>
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { computed, ref, watch } from 'vue';
import ComponentPreview from './ComponentPreview.vue';
const { frontmatter } = useData();
const component = computed(() => frontmatter.value.component);
const mobileOpen = ref(false);
watch(component, () => { mobileOpen.value = false; });
</script>
<template>
  <div :class="{ 'mori-has-preview': component }">
    <DefaultTheme.Layout>
      <template #aside-top><ComponentPreview v-if="component" :key="component" :component="component" /></template>
      <template #doc-before>
        <details v-if="component" :key="component" class="mobile-demo" @toggle="mobileOpen = $event.target.open">
          <summary>打开 {{ component }} 交互预览</summary>
          <ComponentPreview v-if="mobileOpen" :component="component" />
        </details>
      </template>
    </DefaultTheme.Layout>
  </div>
</template>
