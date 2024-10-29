<script setup>
const isOpen = ref(false);
const projectStore = useProjectStore();
const globalSettingsStore = useGlobalSettingsStore();

const colorMode = useColorMode();

const config = useRuntimeConfig();
const API_URL = config.public.NUXT_PUBLIC_STRAPI_URL;

const icons = {
  system: "mdi:monitor",
  dark: "mdi:moon-and-stars",
  light: "mdi:weather-sunny",
};

const firstProjects = computed(() =>
  projectStore.projects
    .filter((project) => project.id !== projectStore.activeProject?.id)
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 5)
);

onMounted(async () => {
  await projectStore.fetchAllProjects();
});
</script>

<template>
  <div>
    <UButton
      icon="i-lucide-panel-right-open"
      @click="isOpen = true"
      class="fixed top-2 right-2 z-10 rounded-full"
      variant="solid"
      color="gray"
      size="lg"
    />

    <USlideover v-model="isOpen" :ui="{ base: 'overflow-auto' }">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' } }">
        <template #header>
          <div class="flex justify-between items-center gap-4">
            <NuxtImg
              :src="`${API_URL}${globalSettingsStore.globalSettings.logo?.url}`"
              class="size-12 rounded"
            />
            <h2 class="text-xl font-bold">
              {{
                globalSettingsStore.globalSettings.configurator_name ||
                "Configurator"
              }}
            </h2>
            <UButton
              icon="i-mdi-close"
              variant="ghost"
              color="neutral"
              @click="isOpen = false"
            />
          </div>
        </template>

        <ClientOnly>
          <UFormGroup label="Theme" class="">
            <USelectMenu
              v-model="colorMode.preference"
              class="w-full"
              placeholder="Select theme..."
              :options="['system', 'dark', 'light']"
            >
              <template #label>
                <UIcon :name="icons[colorMode.preference]" />
                <span class="capitalize">{{ colorMode.preference }}</span>
              </template>

              <template #option="{ option: mode }">
                <UIcon :name="icons[mode]" />
                <span class="capitalize">{{ mode }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <section v-if="$route.path !== '/'" class="space-y-4 my-8">
            <p class="text-sm opacity-75">Other projects:</p>
            <ProjectListCard
              v-for="project in firstProjects"
              :key="project.id"
              :project="project"
              :disabled="projectStore.activeProject?.id === project.id"
              @project-selected="
                () => {
                  isOpen = false;
                }
              "
            />

            <UButton
              to="/"
              color="primary"
              variant="link"
              size="lg"
              block
              class="mb-8"
              :label="`See all projects (${projectStore.projects.length})`"
              @click="isOpen = false"
            />
          </section>
        </ClientOnly>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <label for="toggleDebug" class="text-xs cursor-pointer">
              <span class="opacity-75 px-2">Debug mode</span>
              <UToggle
                size="xs"
                v-model="projectStore.isDebugActive"
                color="amber"
                id="toggleDebug"
              />
            </label>
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>
