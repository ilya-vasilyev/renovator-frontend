export interface GlobalSettings {
  configurator_name: string;
  primary_color_dark: string;
  primary_color_light: string;
  gray_tone_dark: string;
  gray_tone_light: string;
}

export const useGlobalSettingsStore = defineStore("globalSettingsStore", () => {
  const config = useRuntimeConfig();
  const API_URL = config.public.NUXT_PUBLIC_STRAPI_URL;

  // state
  const globalSettings = ref({} as GlobalSettings);
  const isFetching = ref(false);

  // fetching
  async function fetchGlobalSettings() {
    isFetching.value = true;
    const { data, error } = await useFetch<{ data: GlobalSettings }>(
      `${API_URL}/api/global`
    );
    if (error.value) {
      console.error("Failed to fetch global settings", error);
      const toast = useToast();
      toast.add({
        title: "Failed to fetch global settings",
        color: "red",
        timeout: 10000,
      });
    } else {
      if (data.value) globalSettings.value = data.value.data;
    }
    isFetching.value = false;
  }

  return {
    globalSettings,
    fetchGlobalSettings,
  };
});
