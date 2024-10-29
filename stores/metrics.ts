export interface MetricsBreakdownGroup {
  metricName: string;
  metricLabel: string;
  metricIcon: string;
  metricUnit: string;
  metricBaseValue: number;
  metricTotalValue: number;
  metricLines: MetricsBreakdownLine[];
}
export interface MetricsBreakdownLine {
  controlName: string;
  optionName: string;
  value: number;
}

export const useMetrics = defineStore("metricsStore", () => {
  const projectStore = useProjectStore();
  const controlsAndOptionsStore = useControlsAndOptions();

  const metrics = computed(() => {
    return projectStore.activeProject?.metrics_definitions;
  });
  const metricsBreakdown = computed(() => {
    const metricsBreakdownGroups = ref<MetricsBreakdownGroup[]>([]);

    // Initialize metricsBreakdownGroups with base values from metrics
    if (metrics.value) {
      Object.entries(metrics.value).forEach(([metricName, metric]) => {
        metricsBreakdownGroups.value.push({
          metricName,
          metricLabel: metric.label as string,
          metricIcon: metric.icon as string,
          metricUnit: metric.unit as string,
          metricBaseValue: metric.base_value as number,
          metricTotalValue: metric.base_value as number,
          metricLines: [],
        });
      });
    }

    // Process metrics from selected options
    const processMetrics = (
      controlName: string,
      optionName: string,
      metrics: Record<string, number>
    ) => {
      Object.entries(metrics).forEach(([metricName, value]) => {
        const group = metricsBreakdownGroups.value.find(
          (group) => group.metricName === metricName
        );
        if (group) {
          group.metricTotalValue += value;
          group.metricLines.push({
            controlName,
            optionName,
            value,
          });
        }
      });
    };

    // traverse selected options and sub options to process metrics
    projectStore.activeProject?.controls.forEach((control) => {
      const selectedOptionId =
        controlsAndOptionsStore.controlStates[control.id].selectedOption;
      const selectedOption = control.options.find(
        (option) => option.id === selectedOptionId
      );
      if (selectedOption) {
        processMetrics(
          control.name,
          selectedOption.name,
          selectedOption.metrics || {}
        );

        selectedOption.controls?.forEach((subControl) => {
          const selectedSubOptionId =
            controlsAndOptionsStore.controlStates[control.id]
              .selectedSubOptions[subControl.id];
          const selectedSubOption = subControl.options.find(
            (option) => option.id === selectedSubOptionId
          );
          if (selectedSubOption) {
            processMetrics(
              subControl.name,
              selectedSubOption.name,
              selectedSubOption.metrics || {}
            );
          }
        });
      }
    });

    return metricsBreakdownGroups.value;
  });

  const focusedMetricKey = ref<string | null>(null);
  const focusedMetric = computed(() => {
    if (!focusedMetricKey.value) return null;
    return metricsBreakdown.value.find(
      (group) => group.metricName === focusedMetricKey.value
    );
  });
  const selectFocusedMetric = (metricKey: string) => {
    focusedMetricKey.value = metricKey;
  };

  return {
    metrics,
    metricsBreakdown,

    focusedMetricKey,
    focusedMetric,
    selectFocusedMetric,
  };
});
