// components/dashboard/DashboardHeader.jsx
import { memo } from "react";

export const DashboardHeader = memo(function DashboardHeader() {
  console.log("DashboardHeader RERENDERED");

  return (
    <header>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
        Behavioral LLM Experiment Runner
      </h1>
      <p className="mt-2 text-lg text-zinc-600">
        Configure, manage, and execute your mixed-variable LLM experiments.
      </p>
    </header>
  );
});
