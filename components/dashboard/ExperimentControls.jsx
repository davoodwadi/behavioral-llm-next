// components/dashboard/ExperimentControls.jsx
"use client";

import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { generateCombinations } from "@/lib/experiment-generator";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Download } from "lucide-react";
// Assuming you have a RunExperiment component to show results
// import { RunExperiment } from "./RunExperiment";

export function ExperimentControls({ onDownload }) {
  const {
    rounds,
    blockVariables,
    experimentCombinations,
    setExperimentCombinations,
    resetExperiment,
  } = useExperimentStore(
    useShallow((state) => ({
      rounds: state.rounds,
      blockVariables: state.blockVariables,
      experimentCombinations: state.experimentCombinations,
      setExperimentCombinations: state.setExperimentCombinations,
      resetExperiment: state.resetExperiment,
    }))
  );

  const generateAndStoreCombinations = () => {
    console.log("Generating combinations with:", { rounds, blockVariables });
    const combinations = generateCombinations(rounds, blockVariables);
    setExperimentCombinations(combinations);
    console.log("Generated Combinations:", combinations);
    console.log(`Total combinations found: ${combinations.length}`);
  };

  const onReset = () => {
    // You might want a confirmation dialog here
    resetExperiment();
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button size="lg" onClick={generateAndStoreCombinations}>
        <Play className="mr-2 h-5 w-5" /> Run Experiment
      </Button>
      <Button variant="destructive" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" /> Reset Run
      </Button>
      <Button variant="outline" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" /> Download Config
      </Button>
      {/* 
        This part is for displaying results.
        You can build a RunExperiment component that reads 
        `experimentCombinations` from the store.
      */}
      {/* {experimentCombinations.length > 0 && <RunExperiment />} */}
    </div>
  );
}
