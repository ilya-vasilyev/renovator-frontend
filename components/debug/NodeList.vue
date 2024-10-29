<script setup lang="ts">
import { createReusableTemplate } from "@vueuse/core";
import type { Nodes } from "~/composables/useSketchfab";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  data: Nodes;
}>();
const sketchfab = useSketchfab();
// const showNodeTree = ref(false);
// const nodeLength = computed(() => Object.keys(sketchfab.nodes.value).length);
// const graph = ref();

function hideGeometry(name: any) {
  const nodeId = sketchfab.nodesByName.value[name];
  sketchfab.hide(nodeId);
}
function showGeometry(name: any) {
  const nodeId = sketchfab.nodesByName.value[name];
  sketchfab.show(nodeId);
}
</script>
<template>
  <DefineTemplate v-slot="{ data }">
    <summary v-if="data">
      <UTooltip
        :text="data.type as unknown as string"
        :popper="{ placement: 'right', offsetDistance: 16 }"
        class="align-middle"
      >
        <div class="flex items-center gap-1">
          <b class="cursor-pointer">{{ data.name || "..." }}</b>
          <div>
            <UButton
              size="2xs"
              icon="i-mdi-eye"
              variant="ghost"
              @click="showGeometry(data.name)"
            />
            <UButton
              size="2xs"
              icon="i-mdi-eye-off-outline"
              variant="ghost"
              @click="hideGeometry(data.name)"
            />
          </div>
        </div>
      </UTooltip>
    </summary>
    <div v-if="data.children">
      <details
        v-for="child in data.children"
        class="ml-1 pl-4 border-l border-dotted"
      >
        <ReuseTemplate :data="child" />
      </details>
    </div>
  </DefineTemplate>

  <div>
    <pre class="overflow-auto text-xs">
      <ReuseTemplate v-if="sketchfab.isGraphReady.value" :data="sketchfab.graph.value" />
    </pre>
    <UButton
      v-if="!sketchfab.isGraphReady.value"
      color="primary"
      variant="outline"
      block
      :loading="sketchfab.isLoadingGraph.value"
      @click="sketchfab.getGraph()"
    >
      {{
        sketchfab.isLoadingGraph.value ? "Loading..." : "Display model as graph"
      }}
    </UButton>
  </div>
</template>
