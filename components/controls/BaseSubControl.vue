<script setup lang="ts">
const props = defineProps<{
  subControl: Control;
  currentControl: number;
}>();

const projectStore = useProjectStore();
const controlsAndOptionsStore = useControlsAndOptions();
const metricssStore = useMetrics();
const { isNodeListReady } = useSketchfab();

function isSelected(subOptionId: number) {
  return (
    controlsAndOptionsStore.controlStates[props.currentControl]
      .selectedSubOptions[props.subControl.id] === subOptionId
  );
}
function handleSelectSubOption(subOptionId: number) {
  controlsAndOptionsStore.selectSubOption(
    props.currentControl,
    props.subControl.id,
    subOptionId
  );
}

const selectedSubOptionId = computed(
  () =>
    controlsAndOptionsStore.controlStates[props.currentControl]
      .selectedSubOptions[props.subControl.id]
);
const selectedSubOption = computed(() =>
  props.subControl.options.find(
    (option) => option.id === selectedSubOptionId.value
  )
);
const focusedMetric = computed(
  () =>
    selectedSubOption.value?.metrics &&
    selectedSubOption.value?.metrics[metricssStore.focusedMetricKey!]
);
</script>
<template>
  <div class="px-2 py-4 space-y-2">
    <div
      class="flex justify-between items-center text-gray-950 dark:text-gray-50"
    >
      <span class="font-bold min-h-6">{{ props.subControl.name }}</span>
      <UBadge
        v-if="
          projectStore.activeProject?.show_metrics !== null && focusedMetric
        "
        color="white"
        variant="solid"
      >
        {{ focusedMetric }}
        {{ metricssStore.focusedMetric?.metricUnit }}
      </UBadge>
    </div>

    <!-- Buttons -->
    <div
      v-if="props.subControl.type === 'buttons'"
      class="flex flex-wrap gap-2 pt-2 pb-4"
    >
      <UButton
        v-for="subOption in props.subControl.options"
        :key="subOption.id"
        size="sm"
        :variant="isSelected(subOption.id) ? 'solid' : 'solid'"
        :color="isSelected(subOption.id) ? 'primary' : 'gray'"
        :disabled="isNodeListReady === false"
        :loading="isNodeListReady === false"
        class="min-w-16 justify-center py-3"
        @click="handleSelectSubOption(subOption.id)"
      >
        <UAvatar
          v-if="subOption.image"
          :src="subOption.image.formats?.thumbnail?.url"
          size="lg"
        />
        {{ subOption.name }}
      </UButton>
    </div>

    <!-- Select -->
    <USelectMenu
      v-else-if="props.subControl.type === 'select'"
      v-model="selectedSubOption"
      size="xl"
      color="primary"
      :options="props.subControl.options"
      option-attribute="name"
      :disabled="isNodeListReady === false"
      :loading="isNodeListReady === false"
      @change="handleSelectSubOption($event.id)"
    >
      <template #option="{ option }">
        <div class="flex items-center space-x-2">
          <UAvatar
            v-if="option?.image"
            :src="option.image.formats?.thumbnail?.url"
            size="lg"
          />
          <span>{{ option.name }}</span>
        </div>
      </template>
    </USelectMenu>

    <!-- Radio -->
    <URadioGroup
      v-else-if="props.subControl.type === 'radio'"
      :options="props.subControl.options"
      option-attribute="name"
      value-attribute="id"
      :model-value="selectedSubOptionId"
      :disabled="isNodeListReady === false"
      :loading="isNodeListReady === false"
      @change="handleSelectSubOption($event)"
    >
      <template #label="{ option }">
        <div class="flex items-center gap-2 pb-2 select-none">
          <UAvatar
            v-if="option.image"
            :src="option.image.formats?.thumbnail?.url"
            size="lg"
          />
          <span>{{ option.label }}</span>
        </div>
      </template>
    </URadioGroup>

    <!-- Gallery -->
    <div v-else-if="props.subControl.type === 'gallery'" class="mt-4">
      <h4 class="mb-2">{{ selectedSubOption?.name }}</h4>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="option in props.subControl.options"
          :key="option.id"
          @click="handleSelectSubOption(option.id)"
          class="aspect-[1/1] rounded-lg overflow-hidden cursor-pointer"
          :class="{ 'ring-4 ring-primary': selectedSubOptionId === option.id }"
        >
          <img
            v-if="option.image"
            :src="option.image?.formats.thumbnail.url"
            :alt="option.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- No type -->
    <UAlert
      v-else
      icon="i-heroicons-command-line"
      color="red"
      variant="solid"
      title="Error!"
      description="This subcontrol is missing TYPE property"
    />
  </div>
</template>
