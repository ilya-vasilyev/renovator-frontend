<script setup lang="ts">
const tabNavigationStore = useTabNavigation();
onMounted(() => {
  tabNavigationStore.resetToFirstTab();
});
</script>

<template>
  <div
    v-if="tabNavigationStore.filteredTabItems[0].length < 5"
    class="flex gap-2"
  >
    <UTooltip
      v-for="tabItem in tabNavigationStore.filteredTabItems[0]"
      :key="tabItem.key"
      :text="tabItem.label"
      :popper="{ placement: 'bottom' }"
      class="motion-safe:transition-all motion-safe:duration-150"
      :class="{
        'flex-1': tabItem.key === tabNavigationStore.selectedTabKey,
        'flex-0': tabItem.key !== tabNavigationStore.selectedTabKey,
      }"
      :ui="{
        container:
          tabItem.key === tabNavigationStore.selectedTabKey ? 'hidden' : '',
      }"
    >
      <UButton
        :label="
          tabItem.key === tabNavigationStore.selectedTabKey ? tabItem.label : ''
        "
        :square="tabItem.key !== tabNavigationStore.selectedTabKey"
        :icon="tabItem.icon"
        :variant="
          tabItem.key !== tabNavigationStore.selectedTabKey
            ? 'solid'
            : 'outline'
        "
        size="xl"
        class="w-full font-bold justify-center p-3 motion-safe:transition-all motion-safe:duration-150"
        @click="tabNavigationStore.updateSelectedTabKey(tabItem.key)"
        :ui="{ rounded: 'rounded-full' }"
      />
    </UTooltip>
  </div>

  <UDropdown
    v-else
    v-model="tabNavigationStore.selectedTabKey"
    :items="tabNavigationStore.filteredTabItems"
    :popper="{ placement: 'bottom' }"
    :ui="{ container: 'w-auto' }"
    class="w-full"
  >
    <!-- dropdown trigger -->
    <UButton
      size="xl"
      variant="solid"
      :label="tabNavigationStore.selectedTabItem?.label"
      :icon="tabNavigationStore.selectedTabItem?.icon"
      block
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="w-full justify-between font-bold py-4 rounded-full"
    />
    <!-- dropdown content -->
    <template #item="{ item }">
      <div class="flex gap-2 items-center p-1">
        <UIcon :name="item.icon" class="flex-shrink-0 size-6 text-primary" />
        <div class="text-left">
          <p v-if="item.label" class="font-bold truncate">
            {{ item.label }}
          </p>
          <p v-if="item.description" class="text-sm opacity-75 truncate">
            {{ item.description }}
          </p>
        </div>
      </div>
    </template>
  </UDropdown>
</template>
