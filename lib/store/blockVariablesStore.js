import { initialBlockVariables } from "./initialConfig";
export const createBlockVariablesSlice = (set) => ({
  blockVariables: initialBlockVariables,

  setBlockVariables: (newBlockVariables) =>
    set({ blockVariables: newBlockVariables }),

  updateBlockVariableLevel: (varIndex, rowIndex, field, value) =>
    set((state) => {
      const updated = structuredClone(state.blockVariables);
      updated[varIndex].levels[rowIndex][field] =
        field === "group_id" ? parseInt(value) || 0 : value;
      return { blockVariables: updated };
    }),

  // added
  addBlockVariable: (name) =>
    set((state) => ({
      blockVariables: [
        ...state.blockVariables,
        {
          name,
          levels: [{ name: "", text: "", group_id: 1, var_name: name }],
        },
      ],
    })),

  deleteBlockVariable: (index) =>
    set((state) => ({
      blockVariables: state.blockVariables.filter((_, i) => i !== index),
    })),

  addLevelToBlockVariable: (varIndex) =>
    set((state) => {
      const newBlockVariables = JSON.parse(
        JSON.stringify(state.blockVariables)
      );
      const variable = newBlockVariables[varIndex];
      const maxGroupId =
        variable.levels.length > 0
          ? Math.max(...variable.levels.map((l) => l.group_id))
          : 0;
      variable.levels.push({
        name: "",
        text: "",
        group_id: maxGroupId + 1,
        var_name: variable.name,
      });
      return { blockVariables: newBlockVariables };
    }),

  deleteLevelFromBlockVariable: (varIndex, levelIndex) =>
    set((state) => {
      const newBlockVariables = JSON.parse(
        JSON.stringify(state.blockVariables)
      );
      newBlockVariables[varIndex].levels.splice(levelIndex, 1);
      return { blockVariables: newBlockVariables };
    }),

  updateBlockVariableLevelField: (varIndex, levelIndex, field, value) =>
    set((state) => {
      const newBlockVariables = JSON.parse(
        JSON.stringify(state.blockVariables)
      );
      const parsedValue = field === "group_id" ? parseInt(value) || 0 : value;
      newBlockVariables[varIndex].levels[levelIndex][field] = parsedValue;
      return { blockVariables: newBlockVariables };
    }),
});
