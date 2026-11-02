<script setup>
defineProps({ name: String });
const paths = {
  external: 'M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5',
  refresh: 'M20 7v5h-5M4 17v-5h5M6.1 6.1A8 8 0 0 1 19.4 9M4.6 15A8 8 0 0 0 17.9 17.9',
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6v-3M21 12v3M12 3v3M12 12h3M3 12h3M12 18v3',
  sun: 'M12 3V1M12 23v-2M3 12H1M23 12h-2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'm5 12 4 4L19 6',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16'
};
</script>
<template><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name] || paths.code" /></svg></template>
