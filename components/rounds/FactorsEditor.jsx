// components/rounds/FactorsEditor.jsx

import { useState } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, PlusCircle, Trash2 } from "lucide-react";

import { FactorCombinationsDisplay } from "./FactorCombinationsDisplay";

export function FactorsEditor({ roundIndex }) {
  const [newFactorName, setNewFactorName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    factors,
    addFactorToRound,
    deleteFactorFromRound,
    updateFactorField,
    addLevelToFactor,
    deleteLevelFromFactor,
    updateLevelField,
  } = useExperimentStore(
    useShallow((state) => ({
      factors: state.rounds[roundIndex]?.factorsArray,

      addFactorToRound: state.addFactorToRound,
      deleteFactorFromRound: state.deleteFactorFromRound,
      updateFactorField: state.updateFactorField, // We might not need this one if name is static
      addLevelToFactor: state.addLevelToFactor,
      deleteLevelFromFactor: state.deleteLevelFromFactor,
      updateLevelField: state.updateLevelField,
    }))
  );

  if (!factors) return null;

  const handleAddFactor = () => {
    if (newFactorName.trim()) {
      addFactorToRound(roundIndex, newFactorName);
      setNewFactorName("");
      setIsDialogOpen(false);
    }
  };
  //   console.log("factors", factors);

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Round Factors</AlertTitle>
        <AlertDescription>
          Define variables specific to this round. These will be combined to
          create different variations for the LLM.
        </AlertDescription>
      </Alert>

      <FactorCombinationsDisplay roundIndex={roundIndex} />

      {factors.map((factor) => (
        <Card key={factor.key}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-lg">{factor.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteFactorFromRound(roundIndex, factor.key)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factor.levels.map((level) => (
                  <TableRow key={level.key}>
                    <TableCell>
                      <Input
                        placeholder="e.g., Laptop"
                        value={level.name}
                        onChange={(e) =>
                          updateLevelField(
                            roundIndex,
                            factor.key,
                            level.key,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Descriptive text..."
                        value={level.text}
                        onChange={(e) =>
                          updateLevelField(
                            roundIndex,
                            factor.key,
                            level.key,
                            "text",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteLevelFromFactor(
                            roundIndex,
                            factor.key,
                            level.key
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-zinc-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => addLevelToFactor(roundIndex, factor.key)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Level
            </Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Factor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Round Factor</DialogTitle>
            <DialogDescription>
              Enter a name for the new factor (e.g., "product", "tone").
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFactorName}
              onChange={(e) => setNewFactorName(e.target.value)}
              placeholder="Factor Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFactor();
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddFactor}>Add Factor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
