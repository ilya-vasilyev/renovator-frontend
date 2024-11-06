<script setup lang="ts">
const projectStore = useProjectStore();
const globalSettingsStore = useGlobalSettingsStore();

onMounted(async () => {
  projectStore.resetActiveProject();

  useHead({
    title:
      globalSettingsStore.globalSettings.configurator_name || "Configurator",
    meta: [
      {
        name: "description",
        content: "",
      },
    ],
  });
});

const sortedProjects = computed(() =>
  projectStore.projects.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  })
);
</script>

<template>
  <div
    v-if="projectStore.isFetching"
    class="size-full flex justify-center items-center"
  >
    <UBadge color="primary" variant="subtle">
      <UIcon name="i-mdi-loading" size="24" class="mr-2 animate-spin" />
      Loading...
    </UBadge>
  </div>
  <div v-else class="max-w-4xl mx-auto p-4">
    <div class="flex gap-4 justify-start items-center mb-4 pr-8">
      <NuxtImg
        :src="globalSettingsStore.globalSettings.logo?.url"
        class="size-12 rounded"
      />
      <h1 class="text-2xl font-bold">
        {{
          globalSettingsStore.globalSettings.configurator_name || "Configurator"
        }}
      </h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ProjectListCard
        v-for="project in sortedProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>
