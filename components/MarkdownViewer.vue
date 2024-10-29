<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const props = defineProps<{ source: string }>();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const dirtyHtml = computed(() => md.render(props.source));
const cleanHtml = computed(() => DOMPurify.sanitize(dirtyHtml.value));
const tabNavigationStore = useTabNavigation();
</script>

<template>
  <UCard class="my-4" :ui="{ background: 'bg-gray-100 dark:bg-gray-900' }">
    <div class="prose max-w-none dark:prose-invert" v-html="cleanHtml"></div>
    <div class="mt-6 text-center">
      <UButton
        size="xl"
        variant="outline"
        color="primary"
        @click="tabNavigationStore.updateSelectedTabKey('configurator')"
        class="font-bold px-16 py-4"
        trailing-icon="i-mdi-chevron-right"
        label="Get Started"
      />
    </div>
  </UCard>
</template>
