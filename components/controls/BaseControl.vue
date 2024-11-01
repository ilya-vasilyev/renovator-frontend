<script setup lang="ts">
const props = defineProps<{
  control: Control;
}>();

const projectStore = useProjectStore();
const controlsAndOptionsStore = useControlsAndOptions();
const metricssStore = useMetrics();
const { isNodeListReady } = useSketchfab();

function isSelected(optionId: number) {
  return (
    controlsAndOptionsStore.controlStates[props.control.id].selectedOption ===
    optionId
  );
}
function handleSelectOption(optionId: number) {
  controlsAndOptionsStore.selectOption(props.control.id, optionId);
}
const selectedOptionId = computed(
  () => controlsAndOptionsStore.controlStates[props.control.id].selectedOption
);
const selectedOption = computed(() =>
  props.control.options.find((option) => option.id === selectedOptionId.value)
);
const focusedMetric = computed(
  () =>
    selectedOption.value?.metrics &&
    selectedOption.value?.metrics[metricssStore.focusedMetricKey!]
);
</script>
<template>
  <div class="divide-y divide-gray-300 dark:divide-gray-700">
    <div class="px-2 py-4 space-y-2">
      <div
        class="flex justify-between items-center text-gray-950 dark:text-gray-50"
      >
        <span class="font-bold min-h-6">{{ props.control.name }}</span>
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
      <div v-if="props.control.type === 'buttons'" class="flex flex-wrap gap-2">
        <UButton
          v-for="option in props.control.options"
          :key="option.id"
          size="sm"
          :variant="isSelected(option.id) ? 'solid' : 'solid'"
          :color="isSelected(option.id) ? 'primary' : 'gray'"
          :disabled="isNodeListReady === false"
          :loading="isNodeListReady === false"
          class="min-w-16 justify-center py-3"
          @click="handleSelectOption(option.id)"
        >
          <UAvatar v-if="option.image" :src="option.image.formats?.small?.url" size="lg" />
          {{ option.name }}
        </UButton>
      </div>

      <!-- Select -->
      <USelectMenu
        v-else-if="props.control.type === 'select'"
        v-model="selectedOption"
        size="xl"
        color="primary"
        :options="props.control.options"
        option-attribute="name"
        :disabled="isNodeListReady === false"
        :loading="isNodeListReady === false"
        @change="handleSelectOption($event.id)"
      >
      <template #leading>
      <UAvatar v-if="selectedOption?.image" :src="selectedOption.image.formats.small.url" size="lg" />
      </template>
      <template #option="{ option }">
        <div class="flex items-center space-x-2">
          <UAvatar v-if="option?.image" :src="option.image.formats?.small?.url" size="lg" />
          <span>{{ option.name }}</span>
        </div>
      </template>
      </USelectMenu>

      <!-- Radio -->
      <URadioGroup
        v-else-if="props.control.type === 'radio'"
        :options="props.control.options"
        option-attribute="name"
        value-attribute="id"
        :model-value="selectedOptionId"
        :disabled="isNodeListReady === false"
        :loading="isNodeListReady === false"
        @change="handleSelectOption($event)"
        class="radio-wrapper"
        >
        <template #label="{ option }">
          <div class="flex items-center gap-2 pb-2 select-none">
            <UAvatar v-if="option.image" :src="option.image.formats?.small?.url" size="lg" />
            <span>{{ option.label }}</span>
          </div>
        </template>
      </URadioGroup>

      <!-- Gallery -->
      <div v-else-if="props.control.type === 'gallery'" class="gallery mt-4">
        <h4 class="font-bold mb-2">Preview Images</h4>
        <div class="flex flex-wrap gap-4">
          <div v-for="option in props.control.options" :key="option.id" class="w-32 h-32">
            <img v-if="option.image" :src="option.image?.formats.small.url" :alt="option.name" class="w-full h-full object-cover rounded-lg" />
            <p class="text-center mt-1 text-sm">{{ option.name }}</p>
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
        description="This control is missing TYPE property"
      />
    </div>

    <!-- sub controls -->
    <div
      v-if="selectedOption?.controls?.length"
      class="divide-y divide-gray-300 dark:divide-gray-700"
    >
      <ControlsBaseSubControl
        v-for="subControl in selectedOption?.controls"
        :key="subControl.id"
        :sub-control
        :current-control="props.control.id"
      />
    </div>
  </div>
</template>

<style>
.radio-wrapper fieldset div {
  align-items: center;
}
</style>
