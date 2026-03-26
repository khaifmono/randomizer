import { useState, useRef } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base-project/web/components/ui/tabs";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { ResultHistory } from "@base-project/web/components/result-history";
import { cn } from "@base-project/web/lib/utils";
import { RotateCcw, Dices, Coins, History } from "lucide-react";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { WheelTab } from "@base-project/web/components/randomizer/wheel/wheel-tab";
import { DiceTab } from "@base-project/web/components/randomizer/dice/dice-tab";
import { CoinTab } from "@base-project/web/components/randomizer/coin/coin-tab";

export const Route = createFileRoute("/randomizer")({
  component: RandomizerPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || "wheel",
  }),
});

export function RandomizerPage() {
  const { tab: initialTab } = useSearch({ from: "/randomizer" });
  const [wheelHistory, setWheelHistory] = useState<HistoryEntry[]>([]);
  const [diceHistory, setDiceHistory] = useState<HistoryEntry[]>([]);
  const [coinHistory, setCoinHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [historyOpen, setHistoryOpen] = useState(false);
  const coinClearSessionRef = useRef<(() => void) | null>(null);

  const activeHistory =
    activeTab === "wheel"
      ? wheelHistory
      : activeTab === "dice"
        ? diceHistory
        : coinHistory;

  function handleClearHistory() {
    if (activeTab === "wheel") setWheelHistory([]);
    else if (activeTab === "dice") setDiceHistory([]);
    else {
      setCoinHistory([]);
      coinClearSessionRef.current?.();
    }
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
            <Tabs defaultValue={initialTab} onValueChange={setActiveTab}>
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
                <CoinTab
                  onHistoryChange={setCoinHistory}
                  registerClearSession={(fn) => { coinClearSessionRef.current = fn; }}
                />
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


