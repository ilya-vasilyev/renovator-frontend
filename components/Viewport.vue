<script setup lang="ts">
const props = defineProps<{
  sketchfab_id: string;
}>();

const sketchfabFrame = ref<HTMLIFrameElement | null>(null);
const { loadModel, reset } = useSketchfab();

onMounted(() => {
  loadModel(props.sketchfab_id, sketchfabFrame);
});
onUnmounted(() => {
  reset();
});
</script>

<template>
  <iframe
    v-if="props.sketchfab_id"
    ref="sketchfabFrame"
    src=""
    id="api-frame"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
  />
</template>
