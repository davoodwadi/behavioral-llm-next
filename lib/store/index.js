import { create } from "zustand";
import { createConfigSlice } from "./configStore";
import { createBlockVariablesSlice } from "./blockVariablesStore";
import { createRoundsSlice } from "./roundsStore";
import { createExperimentSlice } from "./experimentStore";
import { createFactorSlice } from "./factorStore";

export const useExperimentStore = create((...a) => ({
  ...createConfigSlice(...a),
  ...createBlockVariablesSlice(...a),
  ...createRoundsSlice(...a),
  ...createExperimentSlice(...a),
  ...createFactorSlice(...a),
}));
