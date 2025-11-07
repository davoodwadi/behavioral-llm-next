// components/dashboard/BlockVariablesManager.jsx
"use client";

import { useState, memo } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";

import {
  Info,
  Trash2,
  Plus,
  PlusCircle,
  FolderPlus,
  FolderMinus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const BlockVariablesManager = memo(function BlockVariablesManager({}) {
  const [newVariableName, setNewVariableName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    blockVariables,
    setBlockVariables,
    deleteBlockVariable,
    addBlockVariable,
    updateBlockVariableLevel,
    addLevelToBlockVariable,
    deleteLevelFromBlockVariable,
    updateBlockVariableLevelField,
  } = useExperimentStore(
    useShallow((state) => ({
      blockVariables: state.blockVariables,
      setBlockVariables: state.setBlockVariables,
      deleteBlockVariable: state.deleteBlockVariable,
      addBlockVariable: state.addBlockVariable,
      updateBlockVariableLevel: state.updateBlockVariableLevel,
      addLevelToBlockVariable: state.addLevelToBlockVariable,
      deleteLevelFromBlockVariable: state.deleteLevelFromBlockVariable,
      updateBlockVariableLevelField: state.updateBlockVariableLevelField,
    }))
  );

  console.log("BlockVariablesManager RERENDERED");
  // console.log(blockVariables);

  const handleAddVariable = () => {
    if (!newVariableName.trim()) return;
    addBlockVariable(newVariableName.trim());
    setNewVariableName("");
  };

  return (
    <div className="space-y-6">
      {/* Title and Add Block Variable */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Enter new variable name..."
          value={newVariableName}
          onChange={(e) => setNewVariableName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddVariable} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Block Variable
        </Button>
      </div>

      {/* Block Variables List */}
      {blockVariables.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No block variables added yet.
        </p>
      ) : (
        blockVariables.map((variable, varIndex) => (
          <div key={varIndex} className="rounded-xl border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{variable.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteBlockVariable(varIndex)}
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>

            {/* Levels Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[35%]">Text</TableHead>
                  <TableHead className="w-[20%]">Group ID</TableHead>
                  <TableHead className="w-[10%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variable.levels.map((level, levelIndex) => (
                  <TableRow key={levelIndex}>
                    <TableCell>
                      <Input
                        value={level.name}
                        onChange={(e) =>
                          updateBlockVariableLevelField(
                            varIndex,
                            levelIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={level.text}
                        onChange={(e) =>
                          updateBlockVariableLevelField(
                            varIndex,
                            levelIndex,
                            "text",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={level.group_id}
                        onChange={(e) =>
                          updateBlockVariableLevelField(
                            varIndex,
                            levelIndex,
                            "group_id",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteLevelFromBlockVariable(varIndex, levelIndex)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Add Level Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => addLevelToBlockVariable(varIndex)}
                variant="secondary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Level
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
});
