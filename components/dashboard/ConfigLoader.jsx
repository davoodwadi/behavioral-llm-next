"use client";
// components/dashboard/ConfigLoader.jsx

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

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { memo } from "react";
import { useState, useRef } from "react";
import { useExperimentStore } from "@/lib/store/index";

import { UploadCloud } from "lucide-react"; // A better icon for this purpose
import { cn } from "@/lib/utils";

export const ConfigLoader = memo(function ConfigLoader({}) {
  const loadConfig = useExperimentStore((state) => state.loadConfig);
  const fileInputRef = useRef(null); // A ref to programmatically click the hidden input

  // State to track if a file is being dragged over the drop zone
  const [isDragging, setIsDragging] = useState(false);

  // --- Core File Processing Logic ---
  // This function is now shared by both drop and click-select
  const processFile = (file) => {
    if (!file) return;

    // Optional: Check file type
    if (
      !file.type.includes("yaml") &&
      !file.name.endsWith(".yml") &&
      !file.name.endsWith(".yaml")
    ) {
      toast.error("Invalid file type. Please upload a .yml or .yaml file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      loadConfig(content);
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      toast.error("Failed to read the selected file.");
    };
    reader.readAsText(file);
  };

  // --- Drag and Drop Event Handlers ---
  const handleDragEnter = (e) => {
    e.preventDefault(); // Prevent default browser behavior
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // This is crucial to allow a drop
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // e.dataTransfer.files contains the files that were dropped
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]); // Process the first file dropped
      e.dataTransfer.clearData(); // Clean up
    }
  };
  // --- Click Handler ---
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
    event.target.value = null; // Clear input to allow re-uploading the same file
  };

  console.log("ConfigLoader RERENDERED");

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Drag and drop a YAML file or click to upload.
        </CardDescription>
        <CardContent>
          {/* The hidden file input */}
          <Input
            id="yaml-uploader"
            type="file"
            accept=".yaml, .yml"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />

          {/* The visible drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()} // Click triggers the hidden input
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out",
              "border-zinc-300 bg-zinc-50 hover:bg-zinc-100",
              { "border-indigo-500 bg-indigo-50": isDragging } // Conditional styling when dragging
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud
                className={cn("w-10 h-10 mb-4 text-zinc-500", {
                  "text-indigo-600": isDragging,
                })}
              />
              <p
                className={cn("mb-2 text-sm text-zinc-600", {
                  "text-indigo-700": isDragging,
                })}
              >
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-zinc-500">YAML or YML file</p>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
});
