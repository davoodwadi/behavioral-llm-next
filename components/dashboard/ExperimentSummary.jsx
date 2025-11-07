// components/dashboard/ExperimentSummary.jsx

"use client";

import { useMemo } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import { calculateTotalCombinations } from "@/lib/experiment-calculator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// You can place this sub-component here or in its own file
function Metric({ label, value, note }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
      <div className="text-sm font-medium text-muted-foreground text-center">
        {label}
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function ExperimentSummary() {
  const { rounds, blockVariables, iterations, modelsToTest } =
    useExperimentStore(
      useShallow((state) => ({
        rounds: state.rounds,
        blockVariables: state.blockVariables,
        iterations: state.config.iterations,
        modelsToTest: state.config.modelsToTest,
      }))
    );

  // --- Calculations (migrated from Python & memoized for performance) ---
  const experimentMetrics = useMemo(() => {
    const totalModels = modelsToTest.length;
    const kValue = iterations;

    const totalCombinations = calculateTotalCombinations({
      rounds,
      blockVariables,
    });

    // For now, assume all combinations will be run
    const combinationsToRun = totalCombinations;

    const totalIterations = totalModels * combinationsToRun * kValue;

    const numBlockVariableLevels = blockVariables[0]?.levels.length || 0;

    return {
      totalModels,
      kValue,
      numBlockVariableLevels,
      totalCombinations,
      combinationsToRun,
      totalIterations,
    };
  }, [rounds, blockVariables, iterations, modelsToTest]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Configuration Summary</CardTitle>
        <CardDescription>
          An overview of the total size and complexity of this experiment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Total Models" value={experimentMetrics.totalModels} />
          <Metric label="k Value" value={experimentMetrics.kValue} />
          <Metric
            label="Block Variable Levels"
            value={experimentMetrics.numBlockVariableLevels}
            note={
              blockVariables.length > 1
                ? `(${blockVariables.length} vars total)`
                : "(First variable)"
            }
          />
          <Metric
            label="Total Combinations"
            value={experimentMetrics.totalCombinations.toLocaleString()}
          />
        </div>

        {/* Subset Selection (Placeholder) */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Choose a Subset of Combinations to Run (optional)
            </AccordionTrigger>
            <AccordionContent>
              Feature coming soon. Here you will be able to select a subset of
              the {experimentMetrics.totalCombinations.toLocaleString()}{" "}
              combinations to execute.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Execution Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Execution Plan</AlertTitle>
          <AlertDescription>
            Executing{" "}
            <strong>
              {experimentMetrics.combinationsToRun.toLocaleString()}
            </strong>{" "}
            out of {experimentMetrics.totalCombinations.toLocaleString()} total
            combinations.
          </AlertDescription>
        </Alert>

        {/* Total Iterations */}
        <div className="pt-2">
          <Metric
            label="Total Iterations"
            value={experimentMetrics.totalIterations.toLocaleString()}
            note="Models × Combinations × k"
          />
        </div>
      </CardContent>
    </Card>
  );
}
