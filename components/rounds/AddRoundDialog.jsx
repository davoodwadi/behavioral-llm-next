// components/rounds/AddRoundDialog.jsx
import { useState } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export function AddRoundDialog({ triggerButton }) {
  const addRound = useExperimentStore((state) => state.addRound);
  const DEFAULT_ROUND = "Rating";
  const [roundType, setRoundType] = useState(DEFAULT_ROUND);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRound = () => {
    addRound(roundType);
    setIsOpen(false); // Close dialog on add
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="">
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Round</DialogTitle>
          <DialogDescription>
            Select the experiment type for this conversation round.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={DEFAULT_ROUND}
          onValueChange={setRoundType}
          className="py-4 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"Rating"} id="r1" />
            <Label htmlFor="r1">Rating</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Choice" id="r2" />
            <Label htmlFor="r2">Choice</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddRound}>Add Round</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
