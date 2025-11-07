// lib/store.js
import { create } from "zustand";
import yaml from "js-yaml";
import { toast } from "sonner";
import { generateExperimentCombinations } from "@/lib/experiment-generator";
// --- Constants and Initial State ---
const ALL_MODELS = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "gemini-pro", label: "Gemini Pro" },
];

const initialConfig = {
  systemPrompt:
    "You are a helpful assistant designed to analyze behavioral data.",
  iterations: 1,
  isMockRun: true,
  sleepAmount: 0.1,
  modelsToTest: [ALL_MODELS[0].value],
  apiKeys: {},
  paperUrl: "",
  randomizeItems: true,
};

const initialBlockVariables = [
  {
    name: "country",
    levels: [
      {
        name: "us",
        text: "United States",
        group_id: 1,
        var_name: "country",
      },
      {
        name: "china",
        text: "China",
        group_id: 2,
        var_name: "country",
      },
    ],
  },
  {
    name: "nationality",
    levels: [
      {
        name: "american",
        text: "American",
        group_id: 1,
        var_name: "nationality",
      },
      {
        name: "chinese",
        text: "Chinese",
        group_id: 2,
        var_name: "nationality",
      },
    ],
  },
];

const initialRounds = [
  {
    key: `round_${1}`, // Unique key
    segments: [
      {
        segmentText: "a {{product}} from {{country}} {{year}}",
        segmentId: `segment_${1}`,
      },
    ],
    factorsArray: [
      {
        key: `factor_${1}`,
        name: "product",
        levels: [
          {
            key: "level_1762526519411",
            name: "laptop",
            text: "Laptop",
            var_name: "product",
          },
          {
            key: "level_1762526519412",
            name: "tablet",
            text: "Tablet",
            var_name: "product",
          },
        ],
      },
      {
        key: `factor_${12}`,
        name: "year",
        levels: [
          {
            key: "level_17625265194112",
            name: "2020",
            text: "2020",
            var_name: "year",
          },
          {
            key: "level_17625265194121",
            name: "2021",
            text: "2021",
            var_name: "year",
          },
        ],
      },
    ],
    round_type: "Rating",
  },
  {
    key: `round_${2}`, // Unique key
    segments: [
      {
        segmentText: "{{country}}-made {{brand}}",
        segmentId: `segment_${2}`,
      },
    ],
    factorsArray: [
      {
        key: `factor_${2}`,
        name: "brand",
        levels: [
          {
            key: `level_${3}`,
            name: "apple",
            text: "Apple",
            var_name: "brand",
          },
          {
            key: `level_${4}`,
            name: "samsung",
            text: "Samsung",
            var_name: "brand",
          },
        ],
      },
    ],
    round_type: "Rating",
  },
  {
    key: `round_${3}`, // Unique key
    segments: [
      {
        segmentText: "This {{country}}",
        segmentId: `segment_${3}`,
      },
    ],
    factorsArray: [],
    round_type: "Rating",
  },
];
export const useExperimentStore = create((set, get) => ({
  // --- STATE ---
  config: initialConfig,
  blockVariables: initialBlockVariables,
  allModels: ALL_MODELS,

  rounds: initialRounds,
  selectedRoundIndex: initialRounds.length > 0 ? 0 : null,

  // --- ACTIONS (functions that modify state) ---
  setConfig: (key, value) =>
    set((state) => ({ config: { ...state.config, [key]: value } })),

  setBlockVariables: (newBlockVariables) =>
    set({ blockVariables: newBlockVariables }),

  // You can create more granular actions for better performance
  updateBlockVariableLevel: (varIndex, rowIndex, field, value) =>
    set((state) => {
      const newBlockVariables = JSON.parse(
        JSON.stringify(state.blockVariables)
      ); // Deep copy for safety
      const parsedValue = field === "group_id" ? parseInt(value) || 0 : value;
      newBlockVariables[varIndex].levels[rowIndex][field] = parsedValue;
      return { blockVariables: newBlockVariables };
    }),

  selectRound: (index) => set({ selectedRoundIndex: index }),

  addRound: (roundType) =>
    set((state) => {
      const newRound = {
        key: `round_${Date.now()}`, // Unique key
        segments: [
          {
            segmentText: "",
            segmentId: `segment_${Date.now()}`,
          },
        ],
        factorsArray: [],
        round_type: roundType,
      };
      if (roundType === "Choice") {
        newRound["choicesShown"] = 2;
      }
      const newRounds = [...state.rounds, newRound];
      return {
        rounds: newRounds,
        // Select the newly added round
        selectedRoundIndex: newRounds.length - 1,
      };
    }),

  removeRound: (indexToRemove) => {
    const { rounds, selectedRoundIndex } = get();
    const roundToRemove = rounds[indexToRemove];
    const newRounds = rounds.filter((_, index) => index !== indexToRemove);

    let newSelectedRoundIndex = selectedRoundIndex;

    if (newRounds.length === 0) {
      newSelectedRoundIndex = null; // No rounds left
    } else if (indexToRemove === selectedRoundIndex) {
      // If we deleted the selected round, select the first one
      newSelectedRoundIndex = 0;
    } else if (indexToRemove < selectedRoundIndex) {
      // If we deleted a round before the selected one, shift index down
      newSelectedRoundIndex = selectedRoundIndex - 1;
    }
    // If we deleted after the selected, index remains the same

    set({ rounds: newRounds, selectedRoundIndex: newSelectedRoundIndex });
    toast.info(
      `Round ${indexToRemove + 1} - ${roundToRemove.round_type} deleted`
    );
  },

  updateRoundSegmentText: (roundIndex, segmentIndex, value) =>
    set((state) => {
      const newRounds = JSON.parse(JSON.stringify(state.rounds)); // Deep copy
      newRounds[roundIndex].segments[segmentIndex].segmentText = value;
      return { rounds: newRounds };
    }),

  addSegmentToRound: (roundIndex) =>
    set((state) => {
      const newRounds = JSON.parse(JSON.stringify(state.rounds));
      newRounds[roundIndex].segments.push({
        segmentId: `seg_${Date.now()}`,
        segmentText: "", // New segments start empty
      });
      return { rounds: newRounds };
    }),

  removeSegmentFromRound: (roundIndex, segmentIndex) =>
    set((state) => {
      const newRounds = JSON.parse(JSON.stringify(state.rounds));
      // Use filter to create a new array without the segment
      newRounds[roundIndex].segments = newRounds[roundIndex].segments.filter(
        (_, index) => index !== segmentIndex
      );
      return { rounds: newRounds };
    }),

  // --- Factor Management ---
  addFactorToRound: (
    roundIndex,
    factorName // Add factorName parameter
  ) =>
    set((state) => {
      const newFactor = {
        key: `factor_${Date.now()}`, // Unique key
        name: factorName.trim() || "New Factor", // Use the provided name
        levels: [
          {
            key: `level_${Date.now()}`, // Unique key
            name: "Level 1",
            text: "",
            var_name: factorName.trim() || "New Factor",
          },
        ],
      };
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: [...round.factorsArray, newFactor],
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  deleteFactorFromRound: (roundIndex, factorKey) =>
    set((state) => {
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: round.factorsArray.filter(
              (factor) => factor.key !== factorKey
            ),
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  updateFactorField: (roundIndex, factorKey, field, value) =>
    set((state) => {
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: round.factorsArray.map((factor) => {
              if (factor.key === factorKey) {
                return { ...factor, [field]: value };
              }
              return factor;
            }),
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  // --- Level Management ---
  addLevelToFactor: (roundIndex, factorKey) =>
    set((state) => {
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: round.factorsArray.map((factor) => {
              if (factor.key === factorKey) {
                const newLevel = {
                  key: `level_${Date.now()}`,
                  name: `Level ${factor.levels.length + 1}`,
                  text: "",
                };
                return {
                  ...factor,
                  levels: [...factor.levels, newLevel],
                };
              }
              return factor;
            }),
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  deleteLevelFromFactor: (roundIndex, factorKey, levelKey) =>
    set((state) => {
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: round.factorsArray.map((factor) => {
              if (factor.key === factorKey) {
                return {
                  ...factor,
                  levels: factor.levels.filter(
                    (level) => level.key !== levelKey
                  ),
                };
              }
              return factor;
            }),
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  updateLevelField: (roundIndex, factorKey, levelKey, field, value) =>
    set((state) => {
      const newRounds = state.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            factorsArray: round.factorsArray.map((factor) => {
              if (factor.key === factorKey) {
                return {
                  ...factor,
                  levels: factor.levels.map((level) => {
                    if (level.key === levelKey) {
                      return { ...level, [field]: value };
                    }
                    return level;
                  }),
                };
              }
              return factor;
            }),
          };
        }
        return round;
      });
      return { rounds: newRounds };
    }),

  // experiment-generator
  isCalculating: false,
  experimentCombinations: [],
  // --- Experiment Execution ---
  setExperimentCombinations: (combinations) =>
    set({
      experimentCombinations: combinations,
    }),
  resetExperiment: () => set({ experimentCombinations: [] }),

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
}));
