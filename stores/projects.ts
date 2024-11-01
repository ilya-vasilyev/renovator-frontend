export interface Project {
  id: number;
  name: string;
  description: string;
  slug: string;
  updatedAt: string;
  sketchfab_id: string;
  show_metrics: boolean | null;
  show_welcome_tab: boolean | null;
  welcome_content: string;
  metrics_definitions: Record<
    string,
    Record<string, string | number | boolean>
  > | null;
  controls: Control[];
  group_list: ControlGroup[];
}
export interface ControlGroup {
  id: number;
  group_name: string;
  group_description: string;
  group_icon: string;
}

export const useProjectStore = defineStore("projectStore", () => {
  // debug
  const isDebugActive = useLocalStorage("isDebugActive", false);

  const controlsAndOptionsStore = useControlsAndOptions();

  const config = useRuntimeConfig();
  const API_URL = config.public.NUXT_PUBLIC_STRAPI_URL;

  // state
  const projects = ref([] as Project[]);
  const activeProject = ref(null as null | Project);
  const isFetching = ref(false);

  // fetching
  async function fetchAllProjects() {
    isFetching.value = true;
    const { data, error } = await useFetch<{ data: Project[] }>(
      `${API_URL}/api/projects`
    );
    if (error.value) {
      console.error("Failed to fetch projects", error);
      const toast = useToast();
      toast.add({
        title: "Failed to fetch projects",
        color: "red",
        timeout: 10000,
      });
    } else {
      projects.value = data.value?.data || [];
    }
    isFetching.value = false;
  }
  async function fetchProjectBySlug(slug: string) {
    isFetching.value = true;
    const { data, error } = await useFetch<{ data: Project[] }>(
      `${API_URL}/api/projects?filters[slug][$eq]=${slug}&populate=controls.options.controls.options&populate=controls.options.image&populate=controls.options.controls.options.image&populate=group_list`
    );
    if (error.value) {
      console.error("Failed to fetch project", error);
      const toast = useToast();
      toast.add({
        title: "Failed to fetch project",
        color: "red",
        timeout: 10000,
      });
    } else {
      activeProject.value = data.value?.data[0] || null;
      controlsAndOptionsStore.resetOptions();
    }
    isFetching.value = false;
  }
  function resetActiveProject() {
    activeProject.value = null;
  }

  return {
    isDebugActive,
    isFetching,
    projects,
    activeProject,
    fetchAllProjects,
    fetchProjectBySlug,
    resetActiveProject,
  };
});
