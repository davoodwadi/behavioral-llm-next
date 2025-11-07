import { initialConfig, ALL_MODELS } from "./initialConfig";

import yaml from "js-yaml";
import { toast } from "sonner";

export const createConfigSlice = (set) => ({
  config: initialConfig,

  allModels: ALL_MODELS,

  setConfig: (key, value) =>
    set((state) => ({
      config: { ...state.config, [key]: value },
    })),

  resetAll: () =>
    set({
      config: initialConfig,
      blockVariables: initialBlockVariables,
      rounds: [], // Also reset rounds
      selectedRoundIndex: null,
    }),

  downloadConfig: () => {
    const { config, blockVariables, rounds } = get();

    // 1. Combine all relevant state into a single object
    const fullState = {
      config,
      blockVariables,
      rounds,
    };

    // 2. Convert the JavaScript object to a YAML string
    const yamlString = yaml.dump(fullState);

    // 3. Create a Blob (a file-like object) from the string
    const blob = new Blob([yamlString], { type: "text/yaml" });

    // 4. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 5. Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `llm-experiment-config-${timestamp}.yml`; // The filename
    document.body.appendChild(a);
    a.click();

    // 6. Clean up by removing the link and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  loadConfig: (fileContent) => {
    try {
      // 1. Parse the YAML string from the file into a JS object
      const loadedState = yaml.load(fileContent);

      // 2. Validate the loaded data (basic check)
      if (!loadedState || !loadedState.config || !loadedState.blockVariables) {
        throw new Error("Invalid or corrupted configuration file.");
      }

      // 3. Update the store's state with the loaded data
      set({
        config: loadedState.config,
        blockVariables: loadedState.blockVariables,
        // Load rounds if they exist, otherwise default to empty array
        rounds: loadedState.rounds,
        selectedRoundIndex:
          loadedState.rounds && loadedState.rounds.length > 0 ? 0 : null,
      });

      toast.success("Configuration loaded successfully!");
    } catch (error) {
      //   console.error("Failed to load or parse YAML file:", error);
      toast.error(`Error loading configuration: ${error.message}`);
    }
  },
});
