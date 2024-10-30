export interface ControlState {
  selectedOption: number;
  selectedSubOptions: Record<number, number>;
}
export interface Control {
  id: number;
  name: string;
  type: "buttons" | "select" | "radio";
  options: Option[];
  belongs_to_group: string | null;
}
export interface Option {
  id: number;
  name: string;
  geometry_name: string | null;
  material_assignments: Record<string, string>;
  metrics: Record<string, number>;
  controls?: Control[];
}

export const useControlsAndOptions = defineStore(
  "controlsAndOptionsStore",
  () => {
    const projectStore = useProjectStore();
    const savedUrlStore = useSavedUrl();
    const sketchfab = useSketchfab();

    const controlStates = reactive({} as Record<number, ControlState>);

    function resetOptions() {
      projectStore.activeProject?.controls.forEach((control) => {
        // update state
        controlStates[control.id] = {
          selectedOption: control.options[0].id,
          selectedSubOptions: {},
        };
        // hide all geometries, show only first option
        control.options.forEach((option) => {
          if (option.geometry_name) {
            // split and process multiple geometries
            const geometryNames = option.geometry_name.split("\n");
            geometryNames.forEach((geometryName) => {
              const nodeId = sketchfab.nodesByName.value[geometryName];
              if (option.id === control.options[0].id) {
                sketchfab.show(nodeId);
                runMaterialAssignments(option);
              } else {
                sketchfab.hide(nodeId);
              }
            });
          }
        });
        // reset sub options to nothing
        resetSubOptions(control.id);
        // select first sub option for each sub control
        control.options.forEach((option) => {
          if (option.controls?.length) {
            option.controls.forEach((subControl) => {
              selectSubOption(
                control.id,
                subControl.id,
                subControl.options[0].id
              );
            });
          }
        });
      });
    }

    function selectOption(controlId: number, optionId: number) {
      // update state
      controlStates[controlId].selectedOption = optionId;
      // find control
      const control = getControlById(controlId);
      // hide all geometries, show only selected option
      control?.options.forEach((option) => {
        if (option.geometry_name) {
          // split and process multiple geometries
          const geometryNames = option.geometry_name.split("\n");
          geometryNames.forEach((geometryName) => {
            const nodeId = sketchfab.nodesByName.value[geometryName];
            if (option.id === optionId) {
              sketchfab.show(nodeId);
            } else {
              sketchfab.hide(nodeId);
            }
          });
        }
        if (option.id === optionId) runMaterialAssignments(option);
      });

      resetSubOptions(controlId);
      // select first sub option only for selected option
      control?.options.forEach((option) => {
        const isSelected = option.id === optionId;
        if (option.controls?.length && isSelected) {
          option.controls.forEach((subControl) => {
            selectSubOption(controlId, subControl.id, subControl.options[0].id);
          });
        }
      });
      // save updated state to URL
      savedUrlStore.saveControlStatesUrl();
    }

    function resetSubOptions(controlId: number) {
      // find control
      const control = getControlById(controlId);
      // reset state
      controlStates[controlId].selectedSubOptions = {};
      // hide all geometries of all sub options of all options
      // NOTE: unlike options, suboptions are reset to nothing
      control?.options.forEach((option) => {
        if (option.controls?.length) {
          option.controls.forEach((subControl) => {
            subControl.options.forEach((subOption) => {
              if (subOption.geometry_name) {
                // split and process multiple geometries
                const geometryNames = subOption.geometry_name.split("\n");
                geometryNames.forEach((geometryName) => {
                  const nodeId = sketchfab.nodesByName.value[geometryName];
                  sketchfab.hide(nodeId);
                });
              }
            });
          });
        }
      });
    }

    function selectSubOption(
      controlId: number,
      subControlId: number,
      subOptionId: number
    ) {
      // find control
      const control = getControlById(controlId);
      // check if selected sub option belongs to selected option
      const selectedOptionId = controlStates[controlId].selectedOption;
      const selectedOption = control?.options.find(
        (option) => option.id === selectedOptionId
      );
      const selectedSubControl = selectedOption?.controls?.find(
        (subControl) => subControl.id === subControlId
      );
      if (!selectedSubControl) return;
      // update state
      controlStates[controlId].selectedSubOptions[subControlId] = subOptionId;
      // display geometry for selected control and selected sub option
      // hide  geometry for all other sub options
      selectedOption?.controls?.forEach((subControl) => {
        if (subControl.id === subControlId) {
          subControl.options.forEach((subOption) => {
            if (subOption.geometry_name) {
              // split and process multiple geometries
              const geometryNames = subOption.geometry_name.split("\n");
              geometryNames.forEach((geometryName) => {
                const nodeId = sketchfab.nodesByName.value[geometryName];
                if (subOption.id === subOptionId) {
                  sketchfab.show(nodeId);
                } else {
                  sketchfab.hide(nodeId);
                }
              });
            }
            if (subOption.id === subOptionId) runMaterialAssignments(subOption);
          });
        }
      });
      // save updated state to URL
      savedUrlStore.saveControlStatesUrl();
    }

    function runMaterialAssignments(option: Option) {
      if (!option.material_assignments || !sketchfab.isNodeListReady.value) {
        return;
      }
      Object.entries(option.material_assignments).forEach(
        ([nodeName, materialName]) => {
          sketchfab.assignMaterialToNode({
            materialName,
            nodeName,
          });
        }
      );
    }

    function getControlById(controlId: number) {
      return projectStore.activeProject?.controls?.find(
        (control) => control.id === controlId
      );
    }

    return {
      controlStates,
      selectOption,
      selectSubOption,
      resetOptions,
      resetSubOptions,
    };
  }
);
