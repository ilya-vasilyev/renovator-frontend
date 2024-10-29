<script setup>
const metricsStore = useMetrics();
</script>

<template>
  <div class="my-4">
    <p v-if="metricsStore.metricsBreakdown.length === 0" class="text-center">
      No metrics to display
    </p>
    <div v-else class="grid grid-cols-2 gap-4">
      <div
        v-for="(metric, i) in metricsStore.metricsBreakdown"
        :key="metric.metricLabel"
        class="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 ring-primary ring-0 rounded-lg text-center cursor-pointer transition-shadow duration-100"
        :class="{
          'col-span-2':
            i % 2 === 0 && i === metricsStore.metricsBreakdown.length - 1,
          'ring-2': metricsStore.focusedMetricKey === metric.metricName,
        }"
        @click="metricsStore.selectFocusedMetric(metric.metricName)"
      >
        <UIcon :name="metric.metricIcon" class="size-12 text-primary" />
        <p class="text-2xl font-black">{{ metric.metricTotalValue }}</p>
        <small class="opacity-75">{{ metric.metricUnit }}</small>
        <h3 class="font-bold mt-2">{{ metric.metricLabel }}</h3>
      </div>
    </div>

    <UDivider label="full breakdown" class="my-12" />

    <p v-if="metricsStore.metricsBreakdown.length === 0" class="text-center">
      No metrics to display
    </p>

    <div v-for="item in metricsStore.metricsBreakdown" class="relative">
      <Transition>
        <section
          v-show="item.metricName === metricsStore.focusedMetricKey"
          class="absolute w-full"
        >
          <p class="font-bold text-2xl flex items-center gap-4 mb-4">
            <UIcon :name="item.metricIcon" class="size-8 text-primary" />
            <span>
              {{ item.metricLabel }}
            </span>
          </p>
          <div class="flex justify-between my-1 px-2">
            <div><p>Base value</p></div>
            <div>
              {{ item.metricBaseValue }}
              <small class="opacity-75">{{ item.metricUnit }}</small>
            </div>
          </div>

          <div
            v-for="line in item.metricLines"
            :key="line"
            class="flex justify-between my-1 px-2"
          >
            <div>
              <span>{{ line.optionName }}</span>
              <small class="opacity-75 ms-1">({{ line.controlName }})</small>
            </div>
            <div>
              {{ line.value }}
              <small class="opacity-75">{{ item.metricUnit }}</small>
            </div>
          </div>

          <div
            class="flex justify-between text-lg my-2 p-2 border-t-2 border-primary text-gray-900 dark:text-gray-100 font-bold"
          >
            <div>Total</div>
            <div>
              {{ item.metricTotalValue }}
              <span> {{ item.metricUnit }} </span>
            </div>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
