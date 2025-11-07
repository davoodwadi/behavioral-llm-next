// components/rounds/SegmentEditor.jsx

import React, { useCallback } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { shallow } from "zustand/shallow";
import { useShallow } from "zustand/react/shallow";

export const SegmentEditor = React.memo(({ roundIndex, segmentIndex }) => {
  const { segment, updateText, removeSegmentFromRound, segmentCount } =
    useExperimentStore(
      useShallow((state) => ({
        segment: state.rounds[roundIndex].segments[segmentIndex],
        updateText: state.updateRoundSegmentText,
        removeSegmentFromRound: state.removeSegmentFromRound,
        segmentCount: state.rounds[roundIndex].segments.length,
      }))
    );

  const removeSegment = useCallback(() => {
    removeSegmentFromRound(roundIndex, segmentIndex);
  }, [roundIndex, segmentIndex, removeSegmentFromRound]);

  if (!segment) {
    return null;
  }

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-zinc-50/50">
      <div className="flex justify-between items-center mb-2">
        <Label
          htmlFor={`segment_${segment.segmentId}`}
          className="font-semibold text-zinc-700"
        >
          Segment {segmentIndex + 1}
        </Label>
        {segmentCount > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-500 hover:text-red-500"
            onClick={removeSegment}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Textarea
        id={`segment_${segment.segmentId}`}
        key={`segment_${segment.segmentId}`}
        placeholder="e.g., Please choose the value on a 7-point Likert scale..."
        value={segment.segmentText}
        onChange={(e) => updateText(roundIndex, segmentIndex, e.target.value)}
        className="min-h-[120px]"
      />
    </div>
  );
});
