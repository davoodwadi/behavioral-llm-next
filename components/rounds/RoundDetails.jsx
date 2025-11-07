// components/rounds/RoundDetails.jsx

import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PlusCircle, Trash2 } from "lucide-react";

import { SegmentEditor } from "@/components/rounds/SegmentEditor";
import { FactorsEditor } from "@/components/rounds/FactorsEditor";

export function RoundDetails({ selectedRoundIndex }) {
  //   console.log("selectedRoundIndex", selectedRoundIndex);
  const { round, addSegmentToRound } = useExperimentStore(
    useShallow((state) => ({
      round: state.rounds[selectedRoundIndex],
      addSegmentToRound: state.addSegmentToRound,
    }))
  );
  //   console.log("round", round);
  if (selectedRoundIndex === null) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[300px]">
        <CardContent className="text-center text-zinc-500">
          <p>Select a round to see its details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Round {selectedRoundIndex + 1}:{" "}
          {round.round_type.charAt(0).toUpperCase() + round.round_type.slice(1)}
        </CardTitle>
        <CardDescription>
          Configure the text segments and experimental factors for this round.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="factors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="factors">Factors</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>

          <TabsContent value="factors" className="pt-6">
            <FactorsEditor roundIndex={selectedRoundIndex} />
          </TabsContent>

          <TabsContent value="segments" className="pt-6 space-y-6">
            {round.segments.map((segment) => (
              <SegmentEditor
                key={segment.segmentId}
                roundIndex={selectedRoundIndex}
                segmentIndex={
                  // Find the index by ID for robustness
                  round.segments.findIndex(
                    (s) => s.segmentId === segment.segmentId
                  )
                }
              />
            ))}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addSegmentToRound(selectedRoundIndex)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Segment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
