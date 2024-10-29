<script setup lang="ts">
const globalSettingsStore = useGlobalSettingsStore();
const appConfig = useAppConfig();
const colorMode = useColorMode();

function setColors() {
  appConfig.ui.primary =
    colorMode.value === "dark"
      ? globalSettingsStore.globalSettings.primary_color_dark?.toLowerCase() ||
        "emerald"
      : globalSettingsStore.globalSettings.primary_color_light?.toLowerCase() ||
        "emerald";
  appConfig.ui.gray =
    colorMode.value === "dark"
      ? globalSettingsStore.globalSettings.gray_tone_dark?.toLowerCase() ||
        "neutral"
      : globalSettingsStore.globalSettings.gray_tone_light?.toLowerCase() ||
        "neutral";
}

watch(colorMode, setColors);

onMounted(async () => {
  await globalSettingsStore.fetchGlobalSettings();
  setColors();
});

const route = useRoute();
</script>

<template>
  <div
    class="w-full h-screen bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-gray-100"
    :class="{ 'bg-gray-800': route.name === 'project-slug' }"
  >
    <MainMenu />
    <slot />
  </div>
</template>
