import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { List, MessageSquare, PlusCircle, Trash2 } from "lucide-react";
import { AddRoundDialog } from "./AddRoundDialog";
import { Separator } from "../ui/separator";

export function RoundSelector() {
  const { rounds, selectedRoundIndex, selectRound, removeRound } =
    useExperimentStore(
      useShallow((state) => ({
        rounds: state.rounds,
        selectedRoundIndex: state.selectedRoundIndex,
        selectRound: state.selectRound,
        removeRound: state.removeRound,
      }))
    );

  // --- Empty State ---
  if (rounds.length === 0) {
    return (
      <Card className="h-full border-none">
        <CardContent className="p-2 text-start border-none">
          <Alert className="mb-4 h-full w-full border-none">
            {/* <MessageSquare className="h-4 w-4" /> */}
            <AlertTitle>No Rounds Defined</AlertTitle>
            <AlertDescription>
              Create at least one round of conversation for the LLM to process.
            </AlertDescription>
          </Alert>
          <AddRoundDialog
            triggerButton={
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add First Round
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <h3 className="text-lg font-semibold flex items-center px-2 py-2">
            <List className="mr-2 h-5 w-5" /> Rounds
          </h3>
          <Separator />
          <div className="flex flex-col my-4 gap-2">
            {rounds.map((round, index) => (
              <div key={round.key} className="flex items-center gap-1">
                <Button
                  variant={
                    index === selectedRoundIndex ? "default" : "secondary"
                  }
                  className="flex-grow justify-start"
                  onClick={() => selectRound(index)}
                >
                  Round {index + 1}: {round.round_type}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-500 hover:text-red-500"
                  onClick={() => removeRound(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* <Separator /> */}
        </div>

        <AddRoundDialog
          triggerButton={
            <Button variant="outline" className="w-full mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Round
            </Button>
          }
        />
      </div>
    </>
  );
}
