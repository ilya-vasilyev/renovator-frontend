<script setup lang="ts">
const controlsAndOptionsStore = useControlsAndOptions();
const savedUrlSore = useSavedUrl();
const { copy, copied, isSupported } = useClipboard();
</script>
<template>
  <UCard class="my-4 text-center bg-gray-100 dark:bg-gray-900">
    <UIcon name="i-mdi-monitor-shimmer" class="size-16 text-primary" />
    <p class="text-center py-4">Share your design</p>
    <div class="flex gap-1">
      <UTooltip
        text="Link to your design"
        :popper="{ arrow: true }"
        class="w-full"
      >
        <UInput
          icon="i-mdi-link"
          color="primary"
          variant="outline"
          v-model="savedUrlSore.savedUrl"
          readonly
          class="w-full bg-gray-50 dark:bg-gray-900"
          @focus="$event.target.select()"
        />
      </UTooltip>
      <div v-if="isSupported">
        <UTooltip :text="copied ? 'Copied!' : 'Copy'" :popper="{ arrow: true }">
          <UButton
            v-if="!copied"
            icon="i-mdi-content-copy"
            size="sm"
            color="primary"
            square
            variant="outline"
            @click="copy(savedUrlSore.savedUrl)"
          />
          <UButton
            v-else
            icon="i-mdi-check"
            size="sm"
            color="primary"
            square
            variant="solid"
            @click="copy(savedUrlSore.savedUrl)"
          />
        </UTooltip>
      </div>
      <UTooltip text="Open in a new tab" :popper="{ arrow: true }">
        <UButton
          :to="savedUrlSore.savedUrl"
          target="_blank"
          icon="i-mdi-external-link"
          size="sm"
          color="primary"
          square
          variant="outline"
        />
      </UTooltip>
    </div>
  </UCard>
</template>
