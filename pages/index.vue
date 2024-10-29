<script setup lang="ts">
useHead({
  title: "Renovation Configurator",
  meta: [{ name: "description", content: "My amazing site." }],
});

const projectStore = useProjectStore();
const globalSettingsStore = useGlobalSettingsStore();

onMounted(async () => {
  projectStore.resetActiveProject();
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
    <h1 class="text-2xl font-bold mb-4">
      {{
        globalSettingsStore.globalSettings.configurator_name || "Configurator"
      }}
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ProjectListCard
        v-for="project in sortedProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>
