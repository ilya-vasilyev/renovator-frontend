
interface TabItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  click: () => void;
  showProjectName?: boolean;
  showMetrics?: boolean;
}

export const useTabNavigation = defineStore("tabNavigation", () => {

  const projectStore = useProjectStore();

  const selectedTabKey = ref("");

  const tabItems = reactive<TabItem[][]>([
    [
      {
        key: 'welcome',
        label: 'Welcome',
        description: 'Get started here',
        icon: 'i-mdi-circle-outline',
        click: () => {
          selectedTabKey.value = 'welcome';
        },
        showProjectName: true,
      },
      {
        key: 'configurator',
        label: 'Design',
        description: 'Configure your house',
        icon: 'i-mdi-cursor-default-outline',
        click: () => {
          selectedTabKey.value = 'configurator';
        },
        showMetrics: true,
      },
      {
        key: 'metrics',
        label: 'Metrics',
        description: 'Detailed house performance',
        icon: 'i-mdi-gauge',
        click: () => {
          selectedTabKey.value = 'metrics';
        },
      },
      {
        key: 'share',
        label: 'Share',
        description: 'Save design as a link',
        icon: 'i-mdi-share-variant-outline',
        click: () => {
          selectedTabKey.value = 'share';
        },
        showProjectName: true,
      },
      {
        key: 'debug',
        label: 'Debug',
        description: 'For developers',
        icon: 'i-mdi-code-braces',
        click: () => {
          selectedTabKey.value = 'debug';
        },
      },
    ],
  ]);

const filteredTabItems = computed(() => {
  return tabItems.map((tabGroup) => {
    return tabGroup.filter((item) => {
      if (item.key === 'welcome' && !projectStore.activeProject?.show_welcome_tab)
        return false;
      if (item.key === 'metrics' && !projectStore.activeProject?.show_metrics)
        return false;
      if (item.key === 'debug' && !projectStore.isDebugActive) return false;
      return true;
    });
  });
});

const selectedTabItem = computed(
  () => tabItems.flat().find((tab) => tab.key === selectedTabKey.value) || null
);

function resetToFirstTab() {
  selectedTabKey.value = filteredTabItems.value.flat()[0]?.key || '';
};

// select first available item if current one is hidden
watch(filteredTabItems, (newValue) => {
  if (!newValue.flat().some((tab) => tab.key === selectedTabKey.value)) {
    selectedTabKey.value = newValue.flat()[0].key;
  }
});

function updateSelectedTabKey(key: string) {
  selectedTabKey.value = key
}

  return {
    selectedTabKey,
    selectedTabItem,
    filteredTabItems,
    updateSelectedTabKey,
    resetToFirstTab,
  };
});
