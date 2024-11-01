<script setup lang="ts">
import { promiseTimeout } from "@vueuse/core";

const globalSettingsStore = useGlobalSettingsStore();
const projectStore = useProjectStore();
const controlsAndOptionsStore = useControlsAndOptions();
const savedUrlSore = useSavedUrl();
const metricsStore = useMetrics();
const tabNavigationStore = useTabNavigation();

const controls = computed(() => projectStore.activeProject?.controls || []);
const groups = computed(() => projectStore.activeProject?.group_list || []);

const route = useRoute();
const sketchfab = useSketchfab();

onMounted(async () => {
  await projectStore.fetchProjectBySlug(route.params.slug as string);
  savedUrlSore.loadControlStatesUrl();
  metricsStore.selectFocusedMetric(
    metricsStore.metricsBreakdown[0]?.metricName
  );

  useHead({
    title:
      projectStore.activeProject?.name ||
      globalSettingsStore.globalSettings.configurator_name ||
      "Configurator",
    meta: [
      {
        name: "description",
        content: projectStore.activeProject?.description || "",
      },
    ],
  });
});

watch(sketchfab.isNodeListReady, async () => {
  if (sketchfab.isNodeListReady.value === true) {
    await promiseTimeout(10);
    controlsAndOptionsStore.resetOptions();
    savedUrlSore.loadControlStatesUrl();
    await promiseTimeout(50);
    controlsAndOptionsStore.resetOptions();
    savedUrlSore.loadControlStatesUrl();
    await promiseTimeout(250);
    controlsAndOptionsStore.resetOptions();
    savedUrlSore.loadControlStatesUrl();
  }
});

const windowSize = useWindowSize();
const isVerticalScreen = computed(
  () => windowSize.height.value > windowSize.width.value
);

const isActiveProject = computed(() => projectStore.activeProject?.id);
</script>

<template>
  <div class="size-full flex justify-center items-center">
    <div v-if="projectStore.isFetching">
      <Transition name="appear" appear>
        <UBadge color="gray" variant="subtle">
          <UIcon name="i-mdi-loading" size="24" class="mr-2 animate-spin" />
          Loading...
        </UBadge>
      </Transition>
    </div>

    <div v-else-if="!projectStore.activeProject">
      <Transition name="error-msg" appear>
        <UBadge color="red" variant="solid" size="lg">
          <UIcon name="i-mdi-emoticon-sad-outline" size="24" class="mr-2" />
          Project not found
        </UBadge>
      </Transition>
    </div>

    <main
      v-else
      class="w-full h-screen max-w-[1600px] max-h-screen flex justify-center items-center md:gap-4 mx-auto md:p-4"
      :class="{ 'flex-col-reverse': isVerticalScreen }"
    >
      <Transition name="aside" appear>
        <aside
          v-show="
            !projectStore.isFetching &&
            projectStore.activeProject &&
            sketchfab.isNodeListReady
          "
          class="size-full min-w-64 lg:max-w-96 lg:max-h-[960px] bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 md:rounded-3xl p-2 md:p-4 my-auto overflow-x-hidden overflow-y-auto relative"
        >
          <TabDropdown />

          <div>
            <!-- Project name and decription -->
            <Transition name="tab-content">
              <section
                v-if="tabNavigationStore.selectedTabItem?.showProjectName"
                class="my-8 flex justify-between gap-4"
              >
                <div class="w-full flex justify-start items-center gap-4">
                  <NuxtImg
                    :src="globalSettingsStore.globalSettings.logo?.url"
                    class="size-12 rounded"
                  />
                  <div>
                    <h2 class="text-lg font-bold">
                      {{ projectStore.activeProject?.name }}
                    </h2>
                    <span class="text-xs opacity-50 leading-tight">
                      {{ projectStore.activeProject?.description }}
                    </span>
                  </div>
                </div>
              </section>
            </Transition>

            <!-- metrics -->
            <Transition name="tab-content">
              <section
                v-if="
                  projectStore.activeProject?.show_metrics &&
                  tabNavigationStore.selectedTabItem?.showMetrics
                "
              >
                <MetricsMiniPanel />
              </section>
            </Transition>
          </div>

          <Transition name="tab-content">
            <section v-if="tabNavigationStore.selectedTabKey === 'welcome'">
              <MarkdownViewer
                v-if="projectStore.activeProject?.welcome_content?.length"
                :source="projectStore.activeProject?.welcome_content || ''"
              />
              <UCard v-else class="text-center text-sm py-8 my-8"
                >welcome tab content is missing</UCard
              >
            </section>
          </Transition>

          <Transition name="tab-content">
            <section
              v-if="tabNavigationStore.selectedTabKey === 'configurator'"
            >
              <ControlsGroupAccordion :groups="groups" :controls="controls" />
            </section>
          </Transition>

          <Transition name="tab-content">
            <section v-if="tabNavigationStore.selectedTabKey === 'metrics'">
              <MetricsPanel />
            </section>
          </Transition>

          <Transition name="tab-content">
            <section v-if="tabNavigationStore.selectedTabKey === 'share'">
              <SharePanel />
            </section>
          </Transition>

          <Transition name="tab-content">
            <section
              v-if="tabNavigationStore.selectedTabKey === 'debug'"
              class="space-y-4 py-4"
            >
              <DebugNodeList />
              <UDivider />
              <p>
                <small><b>Sketchfab ID:</b></small>
              </p>
              <pre class="text-xs">{{
                projectStore.activeProject?.sketchfab_id
              }}</pre>
              <UDivider />

              <p>
                <small><b>Camera view</b></small>
                <UButton
                  size="xs"
                  variant="ghost"
                  @click="sketchfab.getCurrentCameraView"
                >
                  get
                </UButton>
              </p>

              <pre class="text-xs">{{ sketchfab.cameraView?.value }}</pre>

              <UDivider />
              <p>
                <small><b>State:</b></small>
              </p>
              <pre class="text-xs bg-neutral-200 dark:bg-neutral-800 p-2">{{
                JSON.stringify(controlsAndOptionsStore.controlStates, null, 2)
              }}</pre>
            </section>
          </Transition>
        </aside>
      </Transition>

      <Transition name="viewport" appear>
        <Viewport
          v-show="
            !projectStore.isFetching &&
            sketchfab.isApiLoaded &&
            sketchfab.isNodeListReady
          "
          :sketchfab_id="projectStore.activeProject?.sketchfab_id || ''"
          class="size-full lg:max-h-[960px] m-auto md:rounded-3xl"
        />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.viewport-enter-active,
.viewport-leave-active {
  transition: 0.5s ease;
  transition-delay: 0.25s;
}

.viewport-enter-from,
.viewport-leave-to {
  opacity: 0;
  transform: scale3d(0.95, 0.95, 0.95) translate3d(0, 40px, 0);
}
.aside-enter-active,
.aside-leave-active {
  transition: 0.5s ease;
}

.aside-enter-from,
.aside-leave-to {
  opacity: 0;
  transform: scale3d(0.95, 0.95, 0.95) translate3d(0, 40px, 0);
}

.tab-content-enter-active {
  transition: 0.1s ease;
  transition-delay: 0.1s;
}
.tab-content-leave-active {
  transition: 0.1s ease;
}
.tab-content-enter-from {
  opacity: 0;
  transform: scale3d(1.05, 1.05, 1.05) translate3d(0, -15px, 0);
}
.tab-content-leave-to {
  opacity: 0;
  transform: scale3d(0.95, 0.95, 0.95) translate3d(0, 50px, 0);
}

.error-msg-enter-active,
.error-msg-leave-active {
  transition: 0.5s ease;
  transition-delay: 2000ms;
}
.error-msg-enter-from,
.error-msg-leave-to {
  opacity: 0;
}

/* chante all transitions to 0 in case of prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .viewport-enter-active,
  .viewport-leave-active,
  .aside-enter-active,
  .aside-leave-active,
  .tab-content-enter-active,
  .tab-content-leave-active,
  .error-msg-enter-active,
  .error-msg-leave-active {
    transition: 0s;
  }
}
</style>
