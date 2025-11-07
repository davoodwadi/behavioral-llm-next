import { initialRounds } from "./initialConfig";

export const createRoundsSlice = (set, get) => ({
  rounds: initialRounds,

  selectedRoundIndex: null,

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
});
