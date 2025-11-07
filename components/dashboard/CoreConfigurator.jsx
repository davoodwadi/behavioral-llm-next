// components/dashboard/CoreConfigurator.jsx
"use client";

import { useMemo, memo } from "react";
import { useExperimentStore } from "@/lib/store/index";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/MultiSelect";

export const CoreConfigurator = memo(function CoreConfigurator({}) {
  console.log("CoreConfigurator RERENDERED");
  // --- BEST PRACTICE: Use granular, atomic selectors ---
  const isMockRun = useExperimentStore((state) => state.config.isMockRun);
  const iterations = useExperimentStore((state) => state.config.iterations);
  const sleepAmount = useExperimentStore((state) => state.config.sleepAmount);
  const modelsToTest = useExperimentStore((state) => state.config.modelsToTest);
  const apiKeys = useExperimentStore((state) => state.config.apiKeys);
  const paperUrl = useExperimentStore((state) => state.config.paperUrl);
  const randomizeItems = useExperimentStore(
    (state) => state.config.randomizeItems
  );
  const allModels = useExperimentStore((state) => state.allModels);

  // Get the action function. This won't cause re-renders.
  const setConfig = useExperimentStore((state) => state.setConfig);

  const selectedProviders = useMemo(() => {
    const providers = new Set(modelsToTest.map((model) => model.split("-")[0]));
    return Array.from(providers);
  }, [modelsToTest]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <Label htmlFor="mock-run" className="font-medium">
          Run Mock Experiments
        </Label>
        <Switch
          id="mock-run"
          checked={isMockRun}
          onCheckedChange={(val) => setConfig("isMockRun", val)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="iterations">Number of Iterations</Label>
        <Input
          id="iterations"
          type="number"
          value={iterations}
          onChange={(e) => setConfig("iterations", parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sleep">Pause between API calls (seconds)</Label>
        <Input
          id="sleep"
          type="number"
          value={sleepAmount}
          onChange={(e) => setConfig("sleepAmount", parseFloat(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label>LLMs to Test</Label>
        <MultiSelect
          options={allModels}
          selected={modelsToTest}
          onChange={(val) => setConfig("modelsToTest", val)}
        />
      </div>

      {!isMockRun && selectedProviders.length > 0 && (
        <Card className="bg-zinc-100 border-zinc-200">
          <CardHeader>
            <CardHeader className="text-base font-semibold p-4">
              API Keys
            </CardHeader>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProviders.map((provider) => (
              <div key={provider} className="space-y-2">
                <Label htmlFor={`${provider}-key`}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
                </Label>
                <Input
                  id={`${provider}-key`}
                  type="password"
                  value={apiKeys[provider] || ""}
                  onChange={(e) =>
                    setConfig("apiKeys", {
                      ...apiKeys,
                      [provider]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="paper-url">Paper URL (optional)</Label>
        <Input
          id="paper-url"
          type="text"
          placeholder="https://arxiv.org/..."
          value={paperUrl}
          onChange={(e) => setConfig("paperUrl", e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="randomize"
          checked={randomizeItems}
          onCheckedChange={(val) => setConfig("randomizeItems", val)}
        />
        <Label htmlFor="randomize">Randomize items in choice segments</Label>
      </div>
    </div>
  );
});
