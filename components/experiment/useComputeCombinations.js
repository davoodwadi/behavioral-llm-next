import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { generateRatingCombinations } from "@/lib/experiment-generator";
// a custom hook
export function useComputeCombinations() {
  const {
    rounds,
    blockVariables,
    experimentCombinations,
    setExperimentCombinations,
  } = useExperimentStore(
    useShallow((state) => ({
      rounds: state.rounds,
      blockVariables: state.blockVariables,
      experimentCombinations: state.experimentCombinations,
      setExperimentCombinations: state.setExperimentCombinations,
    }))
  );

  const computeCombinations = () => {
    // console.log("EXPERIMENT RUNNER");
    const blockAllRoundsCombinations = generateRatingCombinations(
      rounds,
      blockVariables
    );
    setExperimentCombinations(blockAllRoundsCombinations);
    return blockAllRoundsCombinations;
    // console.log("blockAllRoundsCombinations", blockAllRoundsCombinations);
  };

  return computeCombinations;
}
