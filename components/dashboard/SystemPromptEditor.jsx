// components/dashboard/SystemPromptEditor.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";
import { useExperimentStore } from "@/lib/store/index";

export const SystemPromptEditor = memo(function SystemPromptEditor({}) {
  const systemPrompt = useExperimentStore((state) => state.config.systemPrompt);
  const setConfig = useExperimentStore((state) => state.setConfig);
  console.log("SystemPromptEditor RERENDERED");
  // console.log("system prompt", systemPrompt);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>System Prompt</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <Textarea
          value={systemPrompt}
          onChange={(e) => setConfig("systemPrompt", e.target.value)}
          className="min-h-[200px] h-full"
        />
      </CardContent>
    </Card>
  );
});
