export const createFactorSlice = (set, get) => ({
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
});
