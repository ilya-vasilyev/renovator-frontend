<script setup>
const metricsStore = useMetrics();
const tabNavigationStore = useTabNavigation();
</script>

<template>
  <UCard
    class="w-full my-8"
    :ui="{
      background:
        'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-none',
    }"
  >
    <div class="grid grid-cols-3 gap-4 justify-center">
      <UTooltip
        v-for="(metric, i) in metricsStore.metricsBreakdown"
        :key="metric.metricLabel"
        :text="metric.metricLabel"
        :popper="{ placement: 'top' }"
      >
        <div
          class="w-full flex gap-1 justify-center items-baseline hover:underline cursor-pointer select-none"
          @click="metricsStore.selectFocusedMetric(metric.metricName)"
          @dblclick="tabNavigationStore.updateSelectedTabKey('metrics')"
        >
          <UIcon
            :name="metric.metricIcon"
            class="size-5 self-center shrink-0"
            :class="{
              'text-primary':
                metricsStore.focusedMetricKey === metric.metricName,
            }"
          />
          <span class="text-sm font-bold">{{ metric.metricTotalValue }}</span>
          <span class="text-xs opacity-75">{{ metric.metricUnit }}</span>
        </div>
      </UTooltip>
    </div>
  </UCard>
</template>
