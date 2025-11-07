// components/ExperimentDashboard.jsx
"use client";

import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConfigLoader } from "@/components/dashboard/ConfigLoader";
import { CoreConfigurator } from "@/components/dashboard/CoreConfigurator";
import { BlockVariablesManager } from "@/components/dashboard/BlockVariablesManager";
import { SystemPromptEditor } from "@/components/dashboard/SystemPromptEditor";
import { ExperimentActions } from "@/components/dashboard/ExperimentActions";
import { RoundsManager } from "@/components/rounds/RoundsManager";
import { ExperimentSummary } from "@/components/dashboard/ExperimentSummary";

export function ExperimentDashboard() {
  console.log("ExperimentDashboard RERENDERED");
  return (
    <div className="min-h-screen text-zinc-900">
      <main className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8">
        <DashboardHeader />
        {/* <Separator /> */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-4 ">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Experiment Setup</CardTitle>
                <CardDescription>
                  Define parameters and variables.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  //   defaultValue={"core-config"}
                  collapsible={true}
                  className="w-full"
                >
                  <AccordionItem value="load-config">
                    <AccordionTrigger>Load Configuration</AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <ConfigLoader />
                    </AccordionContent>
                    {/* No props! */}
                  </AccordionItem>
                  <AccordionItem value="core-config">
                    <AccordionTrigger>Core Configuration</AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <CoreConfigurator />
                    </AccordionContent>{" "}
                    {/* No props! */}
                  </AccordionItem>
                  <AccordionItem value="block-vars">
                    <AccordionTrigger>Block Variables</AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <BlockVariablesManager />
                    </AccordionContent>{" "}
                    {/* No props! */}
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-4">
            <SystemPromptEditor />
          </div>

          <div className="md:col-span-6  space-y-4 h-full">
            {/* --- NEW ROUNDS SECTION --- */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>User Message Rounds</CardTitle>
                <CardDescription>
                  Define the sequence of user messages and interactions for the
                  conversation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoundsManager />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-6  space-y-4 h-full">
            <ExperimentSummary />
          </div>

          <div className="md:col-span-6 space-y-4">
            <ExperimentActions />
          </div>
        </div>
      </main>
    </div>
  );
}
