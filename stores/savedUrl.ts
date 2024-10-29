import { Base64 } from "js-base64";

export const useSavedUrl = defineStore("savedUrlStore", () => {
  const controlsAndOptionsStore = useControlsAndOptions();
  const savedUrl = ref("");

  function saveControlStatesUrl() {
    const controlStatesString = JSON.stringify({
      ...controlsAndOptionsStore.controlStates,
    });
    const encoded = Base64.encodeURI(controlStatesString);
    const searchParams = new URLSearchParams();
    searchParams.set("state", encoded);
    savedUrl.value = `${window.location.origin}${
      window.location.pathname
    }?${searchParams.toString()}`;
  }

  function loadControlStatesUrl() {
    if (savedUrl.value === "") saveControlStatesUrl();
    const searchParams = new URLSearchParams(window.location.search);
    const state = searchParams.get("state");
    if (!state) return;
    const controlStatesString = Base64.decode(state);
    const controlStatesObject: Record<number, ControlState> =
      JSON.parse(controlStatesString);
    // update controls
    for (let controlId in controlStatesObject) {
      const optionId = controlStatesObject[controlId].selectedOption;
      controlsAndOptionsStore.selectOption(Number(controlId), optionId);
      // update subcontrols
      const selectedSubOptions =
        controlStatesObject[controlId].selectedSubOptions;
      if (selectedSubOptions)
        for (let subControlId in selectedSubOptions) {
          const subOptionId = selectedSubOptions[subControlId];
          controlsAndOptionsStore.selectSubOption(
            Number(controlId),
            Number(subControlId),
            subOptionId
          );
        }
    }
  }

  return {
    savedUrl,
    saveControlStatesUrl,
    loadControlStatesUrl,
  };
});
