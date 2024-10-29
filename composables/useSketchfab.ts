declare global {
  interface Window {
    Sketchfab: any;
  }
}
interface SketchfabViewerApi {
  start: () => void;
  addEventListener: (e: string, callback: () => void) => void;
  getNodeMap: (callback: (err: Error, nodeMap: Nodes) => void) => void;
  getSceneGraph: (callback: (err: Error, nodeMap: Nodes) => void) => void;
  getScreenShot: (
    format: string,
    callback: (err: Error, result: string) => void
  ) => void;
  show: (nodeId: number) => void;
  hide: (nodeId: number) => void;
  getMaterialList: (callback: (err: Error, materials: any) => void) => void;
  createMaterial: (
    material: any,
    callback: (err: Error, material: any) => void
  ) => void;
  assignMaterial: (
    node: any,
    materialId: any,
    callback: (err: Error) => void
  ) => void;
}
export type Node = {
  id: number;
  name: string;
  type?: string;
  children: Node[];
};
export type Nodes = Record<
  string,
  {
    id: number;
    name: string;
    type?: string;
    children: Node[];
  }
>;

// --------------------------------------------------

let client;

const isApiLoaded = ref(false);
const isModelReady = ref(false);
const isNodeListReady = ref(false);
const isLoadingGraph = ref(false);
const isGraphReady = ref(false);

let api = ref<SketchfabViewerApi | null>(null);

const nodes = ref<Nodes>({});
const nodesByName = ref<Record<string, number>>({});

const graph = ref<Nodes>({});

export const useSketchfab = () => {
  const show = (nodeId: number) => api.value?.show(nodeId);
  const hide = (nodeId: number) => api.value?.hide(nodeId);

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Sketchfab API script failed to load");
      document.head.appendChild(script);
    });
  };

  const loadModel = async (
    sketchfabId: string,
    sketchfabFrame: globalThis.Ref<HTMLIFrameElement | null>
  ) => {
    if (!sketchfabId || !sketchfabFrame.value) return;

    if (!isApiLoaded.value) {
      try {
        await loadScript();
        isApiLoaded.value = true;
      } catch (error) {
        console.error(error);
        return;
      }
    }

    client = new window.Sketchfab(sketchfabFrame.value);

    client.init(sketchfabId, {
      autospin: 0,
      autostart: 1,
      success: function onSuccess(sketchfabApi: SketchfabViewerApi) {
        api.value = sketchfabApi;
        api.value.start();
        api.value.addEventListener("viewerready", () => {
          isModelReady.value = true;
          getNodes();
        });
      },
      error: function onError() {
        console.error("Failed to initialize the viewer");
      },
    });
  };

  function getNodes() {
    api.value?.getNodeMap((err, nodeMap) => {
      if (err) {
        console.error(err);
      } else {
        nodes.value = nodeMap;
        // create a reversed map with name as key and id as value
        Object.entries(nodes.value).map(([key, val]) => {
          const name = val.name;
          const id = parseInt(key, 10);
          nodesByName.value[name] = id;
        });
        isNodeListReady.value = true;
      }
    });
  }

  function reset() {
    isApiLoaded.value = false;
    isModelReady.value = false;
    isNodeListReady.value = false;
    nodes.value = {};
    nodesByName.value = {};
  }

  function getGraph() {
    isLoadingGraph.value = true;
    api.value?.getSceneGraph(function (err, graphNodes) {
      if (!err) {
        graph.value = graphNodes;
        isGraphReady.value = true;
        isLoadingGraph.value = false;
      }
    });
  }

  async function getScreenshot() {
    return new Promise<string>((resolve, reject) => {
      api.value?.getScreenShot("image/png", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // ========================== MATERIALS =============================

  const isAssigningMaterial = ref(false);

  async function getMaterialIdByName(materialName: string): Promise<string> {
    try {
      const materials = await new Promise<{ name: string; id: string }[]>(
        (resolve, reject) => {
          api.value?.getMaterialList((err, materials) => {
            if (err) reject(err);
            else resolve(materials);
          });
        }
      );
      const material = materials.find((m) => m.name === materialName);
      if (!material) throw new Error(`Material ${materialName} not found`);
      return material.id;
    } catch (err) {
      console.error("Cannot get material", err);
      throw err;
    }
  }

  function getNodeByName(nodeName: string): Node {
    const node = Object.values(nodes.value).find(
      (node) => node.name === nodeName
    );
    if (!node) throw new Error(`Node ${nodeName} not found`);
    return toRaw(node);
  }

  function assignMaterial(node: Node, materialId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (node.children?.length) {
        Promise.all(
          node.children.map((child) => assignMaterial(child, materialId))
        )
          .then(() => resolve())
          .catch((err) => reject(err));
      } else {
        api.value?.assignMaterial(node, materialId, (err) => {
          if (err) {
            console.error("Material assignment failed", err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }

  async function assignMaterialToNode({
    nodeName,
    materialName,
  }: {
    nodeName: string;
    materialName: string;
  }) {
    try {
      const node = getNodeByName(nodeName);
      const materialId = await getMaterialIdByName(materialName);
      isAssigningMaterial.value = true;
      await assignMaterial(node, materialId);
    } catch (err) {
      console.error("Failed to assign material to node", err);
    } finally {
      isAssigningMaterial.value = false;
    }
  }

  return {
    loadModel,
    isApiLoaded,
    isModelReady,
    isLoadingGraph,
    isGraphReady,
    isNodeListReady,
    show,
    hide,
    nodes,
    nodesByName,
    api,
    reset,
    graph,
    getGraph,
    getScreenshot,
    isAssigningMaterial,
    assignMaterialToNode,
  };
};
