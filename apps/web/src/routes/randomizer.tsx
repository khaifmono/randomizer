import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base-project/web/components/ui/tabs";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { ResultHistory } from "@base-project/web/components/result-history";
import { cn } from "@base-project/web/lib/utils";
import { RotateCcw, Dices, Coins, History } from "lucide-react";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { WheelTab } from "@base-project/web/components/randomizer/wheel/wheel-tab";
import { DiceTab } from "@base-project/web/components/randomizer/dice/dice-tab";

export const Route = createFileRoute("/randomizer")({
  component: RandomizerPage,
});

export function RandomizerPage() {
  const [wheelHistory, setWheelHistory] = useState<HistoryEntry[]>([]);
  const [diceHistory, setDiceHistory] = useState<HistoryEntry[]>([]);
  const [coinHistory, setCoinHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>("wheel");
  const [historyOpen, setHistoryOpen] = useState(false);

  const activeHistory =
    activeTab === "wheel"
      ? wheelHistory
      : activeTab === "dice"
        ? diceHistory
        : coinHistory;

  function handleClearHistory() {
    if (activeTab === "wheel") setWheelHistory([]);
    else if (activeTab === "dice") setDiceHistory([]);
    else setCoinHistory([]);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <header className="text-center py-12 px-4">
        <h1 className="text-xl font-semibold leading-tight">Randomizer Toolkit</h1>
        <p className="text-sm font-normal leading-normal text-muted-foreground mt-1">
          Spin, roll, or flip — decide anything.
        </p>
      </header>

      {/* Main content area with split layout */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Tool area (left) */}
          <div className="flex-1 min-w-0">
            {/* Mobile history toggle */}
            <div className="flex justify-end mb-2 md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHistoryOpen(!historyOpen)}
              >
                <History className="h-4 w-4" />
                {historyOpen ? "Hide History" : "Show History"}
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="wheel" onValueChange={setActiveTab}>
              <TabsList variant="line">
                <TabsTrigger
                  value="wheel"
                  className={cn(
                    "gap-1",
                    "data-[state=active]:border-wheel-accent"
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  Wheel
                </TabsTrigger>
                <TabsTrigger
                  value="dice"
                  className={cn(
                    "gap-1",
                    "data-[state=active]:border-dice-accent"
                  )}
                >
                  <Dices className="h-4 w-4" />
                  Dice
                </TabsTrigger>
                <TabsTrigger
                  value="coin"
                  className={cn(
                    "gap-1",
                    "data-[state=active]:border-coin-accent"
                  )}
                  disabled
                >
                  <Coins className="h-4 w-4" />
                  Coin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wheel" className="mt-6">
                <WheelTab onHistoryChange={setWheelHistory} />
              </TabsContent>
              <TabsContent value="dice" className="mt-6">
                <DiceTab onHistoryChange={setDiceHistory} />
              </TabsContent>
              <TabsContent value="coin" className="mt-6">
                <CoinPlaceholder />
              </TabsContent>
            </Tabs>
          </div>

          {/* History panel (right) */}
          <div
            className={cn(
              "w-full md:w-64 shrink-0",
              historyOpen ? "block" : "hidden md:block"
            )}
          >
            <Card>
              <CardContent>
                <ResultHistory
                  entries={activeHistory}
                  onClear={handleClearHistory}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


function CoinPlaceholder() {
  return (
    <div className="opacity-50 pointer-events-none space-y-4">
      <p className="text-base font-semibold">Coin Flipper</p>
      <p className="text-sm text-muted-foreground">Coming in the next phase</p>
      <div className="flex gap-2">
        <div className="h-16 w-16 rounded-full border-2 border-border bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
          H
        </div>
        <div className="h-16 w-16 rounded-full border-2 border-border bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
          T
        </div>
      </div>
      <Button disabled className="w-full">Flip Coin</Button>
    </div>
  );
}

