import { useState, useRef } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base-project/web/components/ui/tabs";
import { Button } from "@base-project/web/components/ui/button";
import { ResultHistory } from "@base-project/web/components/result-history";
import { cn } from "@base-project/web/lib/utils";
import { RotateCcw, Dices, Coins, History, ChevronLeft } from "lucide-react";
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

  const tabAccentMap: Record<string, string> = {
    wheel: "from-blue-500/20 via-transparent to-transparent",
    dice: "from-emerald-500/20 via-transparent to-transparent",
    coin: "from-amber-500/20 via-transparent to-transparent",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Subtle background glow that shifts with active tab */}
      <div className={cn("absolute inset-0 bg-gradient-to-b transition-all duration-700 pointer-events-none", tabAccentMap[activeTab] || tabAccentMap.wheel)} />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-sm">
          <ChevronLeft className="h-4 w-4" />
          Home
        </Link>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">Randomizer</span>
          {" "}Toolkit
        </h1>
        {/* Mobile history toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white/50 hover:text-white hover:bg-white/10"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <History className="h-4 w-4 mr-1" />
          {historyOpen ? "Hide" : "History"}
        </Button>
        <div className="hidden md:block w-20" />
      </header>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tool area */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue={initialTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList variant="line" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-2">
                  <TabsTrigger
                    value="wheel"
                    className={cn(
                      "gap-1.5 text-white/50 data-[state=active]:text-white",
                      "data-[state=active]:border-blue-400"
                    )}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Wheel
                  </TabsTrigger>
                  <TabsTrigger
                    value="dice"
                    className={cn(
                      "gap-1.5 text-white/50 data-[state=active]:text-white",
                      "data-[state=active]:border-emerald-400"
                    )}
                  >
                    <Dices className="h-4 w-4" />
                    Dice
                  </TabsTrigger>
                  <TabsTrigger
                    value="coin"
                    className={cn(
                      "gap-1.5 text-white/50 data-[state=active]:text-white",
                      "data-[state=active]:border-amber-400"
                    )}
                  >
                    <Coins className="h-4 w-4" />
                    Coin
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="wheel" className="mt-0">
                <WheelTab onHistoryChange={setWheelHistory} />
              </TabsContent>
              <TabsContent value="dice" className="mt-0">
                <DiceTab onHistoryChange={setDiceHistory} />
              </TabsContent>
              <TabsContent value="coin" className="mt-0">
                <CoinTab
                  onHistoryChange={setCoinHistory}
                  registerClearSession={(fn) => { coinClearSessionRef.current = fn; }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* History panel */}
          <div
            className={cn(
              "w-full md:w-72 shrink-0",
              historyOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <ResultHistory
                entries={activeHistory}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
