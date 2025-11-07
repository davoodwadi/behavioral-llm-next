// components/dashboard/ExperimentActions.jsx
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Download, ArrowRight } from "lucide-react";
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { memo } from "react";

import { useComputeCombinations } from "@/components/experiment/useComputeCombinations";
import { csvHandleDownload } from "@/components/experiment/csvHandleDownload";
import { useCSV, useCsv } from "@/components/experiment/useCSV";

export const ExperimentActions = memo(function ExperimentActions({}) {
  console.log("ExperimentActions RERENDERED");

  const onReset = useExperimentStore((state) => state.resetAll);
  const onDownload = useExperimentStore((state) => state.downloadConfig);
  const experimentCombinations = useExperimentStore(
    (state) => state.experimentCombinations
  );

  const computeCombinations = useComputeCombinations();
  const getCSV = useCSV();

  // Step 1:
  const handleComputeCombinations = () => {
    const combinations = computeCombinations(); // also setExperimentCombinations in store
    toast.success("Combinations Computed Successfully.");
  };

  // Step 1:
  const handleRunExperiment = () => {
    console.log("Run experiment clicked");
  };

  // Step 2: run experiment
  const handleDownloadCSV = () => {
    console.log("handleDownloadCSV clicked");
    const csvContent = getCSV();
    if (!csvContent) {
      toast.error("CSV Content is Empty");
      return;
    }
    csvHandleDownload(csvContent);
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Step 1: always available */}
      <Button size="lg" onClick={handleComputeCombinations}>
        <Play className="mr-2 h-5 w-5" /> Compute Combinations
      </Button>

      {/* Step 2: only available after at least one computation */}
      {experimentCombinations.length > 0 && (
        <div className="flex space-x-2">
          <Button size="lg" onClick={handleRunExperiment} className="flex-1">
            <ArrowRight className="mr-2 h-5 w-5" /> Run Experiment
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadCSV}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" /> Download Combinations (CSV)
          </Button>
        </div>
      )}

      <div className="flex flex-row space-x-2">
        <Button variant="destructive" onClick={onReset} className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Configuration
        </Button>
        <Button variant="outline" onClick={onDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" /> Download Config (YAML)
        </Button>
      </div>
      {/* {experimentCombinations.length > 0 && <RunExperiment />} */}
    </div>
  );
});
