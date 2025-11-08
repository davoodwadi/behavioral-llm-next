// components/dashboard/ExperimentActions.jsx
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { Play, RotateCcw, Download, ArrowRight } from "lucide-react";
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { memo } from "react";

import { useComputeCombinations } from "@/components/experiment/useComputeCombinations";
import { csvHandleDownload } from "@/components/experiment/csvHandleDownload";
import { useCSV, useCsv } from "@/components/experiment/useCSV";

export const ExperimentActions = memo(function ExperimentActions({}) {
  console.log("ExperimentActions RERENDERED");

  const onReset = useExperimentStore((state) => state.resetAll);
  const downloadConfig = useExperimentStore((state) => state.downloadConfig);
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

  const handleDownloadConfig = () => {
    // console.log("Download Config Requested");
    downloadConfig();
  };

  return (
    <div className="flex flex-col space-y-2">
      <ButtonGroup className="w-full">
        {/* Step 1: always available */}
        <Button
          size="lg"
          onClick={handleComputeCombinations}
          className="flex-1 cursor-pointer"
        >
          <Play className="mr-2 h-5 w-5" /> Compute Combinations
        </Button>
        <ButtonGroupSeparator />
        {/* Step 2: only available after at least one computation */}
        <Button
          // variant="outline"
          size="lg"
          onClick={handleDownloadCSV}
          className="flex-1 cursor-pointer"
          disabled={experimentCombinations.length === 0}
        >
          <Download className="mr-2 h-4 w-4" /> Download Combinations (CSV)
        </Button>
      </ButtonGroup>

      <Separator />
      <div className="flex flex-row space-x-2">
        <ButtonGroup className="w-full">
          <Button
            variant="destructive"
            onClick={onReset}
            className="flex-1 cursor-pointer"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Configuration
          </Button>
          <ButtonGroupSeparator />

          <Button
            variant="outline"
            onClick={handleDownloadConfig}
            className="flex-1 cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" /> Download Config (YAML)
          </Button>
        </ButtonGroup>
      </div>
      {/* {experimentCombinations.length > 0 && <RunExperiment />} */}
    </div>
  );
});
