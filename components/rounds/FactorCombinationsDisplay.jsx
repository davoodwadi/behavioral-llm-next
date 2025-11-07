// components/rounds/FactorCombinationsDisplay.jsx

import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FlaskConical } from "lucide-react"; // A nice icon for experiments

export function FactorCombinationsDisplay({ roundIndex }) {
  const round = useExperimentStore(
    useShallow((state) => state.rounds[roundIndex])
  );

  // Guard against missing data or no factors
  if (!round?.factorsArray || round.factorsArray.length === 0) {
    return (
      <Alert variant="default">
        <FlaskConical className="h-4 w-4" />
        <AlertTitle>Experimental Design</AlertTitle>
        <AlertDescription>
          Add factors in the tab below to see the design details for this round.
        </AlertDescription>
      </Alert>
    );
  }

  // Filter out factors that have no levels, as they don't contribute to the design
  const validFactors = round.factorsArray.filter(
    (f) => f.levels && f.levels.length > 0
  );

  if (validFactors.length === 0) {
    return (
      <Alert variant="default">
        <FlaskConical className="h-4 w-4" />
        <AlertTitle>Experimental Design</AlertTitle>
        <AlertDescription>
          Add at least one level to a factor to see the design details.
        </AlertDescription>
      </Alert>
    );
  }

  // Corresponds to: " x ".join([str(len(fl)) for fl in factor_levels])
  const factorialDesign = validFactors
    .map((factor) => factor.levels.length)
    .join(" x ");

  const totalCombinations = validFactors.reduce(
    (acc, factor) => acc * (factor.levels.length || 1),
    1
  );

  // Corresponds to the loop creating the detailed string
  const designDetails = validFactors
    .map((factor) => {
      const levelNames = factor.levels
        .map((level) => level.name || `Level ${level.group_id}`) // Fallback for empty names
        .join(", ");
      return `${factor.name} (${levelNames})`;
    })
    .join(" x ");

  // --- Display the information ---
  return (
    <Alert>
      <FlaskConical className="h-4 w-4" />
      <AlertTitle>Experimental Design</AlertTitle>
      <AlertDescription>
        <div>
          <p className="mb-1.5">
            <strong>Design:</strong>{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {factorialDesign}
            </code>{" "}
            Full Factorial ({totalCombinations} total combinations)
          </p>
          <p className="text-xs text-muted-foreground">{designDetails}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
