<script setup lang="ts">
const props = defineProps<{
  groups: ControlGroup[];
  controls: Control[];
}>();

const formattedGroups = computed(() => {
  return props.groups.map((group) => ({
    id: group.id,
    label: group.group_name,
    content: group.group_description,
    icon: group.group_icon || "i-mdi-view-grid-outline",
  }));
});
</script>

<template>
  <div v-if="formattedGroups.length" class="my-8">
    <UAccordion
      :items="formattedGroups"
      color="gray"
      variant="solid"
      size="xl"
      open-icon="i-mdi-expand-horizontal"
      close-icon="i-mdi-collapse-horizontal"
      :ui="{ default: { class: 'bg-gray-100 py-4 mt-2' } }"
    >
      <template #item="{ item }">
        <p v-if="item.content" class="text-sm">
          {{ item.content }}
        </p>
        <div class="divide-y divide-gray-300 dark:divide-gray-700">
          <ControlsBaseControl
            v-for="control in controls.filter(
              (c) => c.belongs_to_group === item.label
            )"
            :key="control.id"
            :control
          />
        </div>
      </template>
    </UAccordion>
  </div>
  <div class="divide-y divide-gray-300 dark:divide-gray-700">
    <ControlsBaseControl
      v-for="control in controls.filter((c) => c.belongs_to_group === null)"
      :key="control.id"
      :control
    />
  </div>
</template>
