export const createExperimentSlice = (set, get) => ({
  // experiment-generator
  isCalculating: false,
  experimentCombinations: [],
  // --- Experiment Execution ---
  setExperimentCombinations: (combinations) =>
    set({
      experimentCombinations: combinations,
    }),
  resetExperiment: () => set({ experimentCombinations: [] }),
});
