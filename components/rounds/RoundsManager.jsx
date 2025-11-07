// components/rounds/RoundsManager.jsx
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import { RoundDetails } from "./RoundDetails";
import { RoundSelector } from "./RoundSelector";

export function RoundsManager() {
  const { selectedRoundIndex } = useExperimentStore(
    useShallow((state) => ({
      selectedRoundIndex: state.selectedRoundIndex,
    }))
  );

  console.log("RoundsManager RERENDER");

  // --- Populated State ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Column: Selector */}
      <div className="md:col-span-1 space-y-2">
        <RoundSelector />
      </div>

      {/* Right Column: Details */}
      <div className="md:col-span-3">
        <RoundDetails selectedRoundIndex={selectedRoundIndex} />
      </div>
    </div>
  );
}
