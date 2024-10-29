<script setup lang="ts">
const { project } = defineProps<{
  project: {
    name: string;
    description: string;
    slug: string;
  };
}>();
</script>
<template>
  <UCard class="mx-0.5">
    <div class="flex gap-4 justify-between items-start">
      <div>
        <b>{{ project.name }}</b>
        <p class="text-sm opacity-75">
          {{ project.description }}
        </p>
      </div>
      <UTooltip text="Open" :popper="{ placement: 'left' }">
        <UButton
          size="lg"
          square
          icon="i-mdi-arrow-right"
          class="rounded-full"
          :to="`/project/${project.slug}`"
          @click="$emit('project-selected')"
        />
      </UTooltip>
    </div>
  </UCard>
</template>
