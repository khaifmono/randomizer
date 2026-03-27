import { useState, useRef } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base-project/web/components/ui/tabs";
import { Button } from "@base-project/web/components/ui/button";
import { ResultHistory } from "@base-project/web/components/result-history";
import { cn } from "@base-project/web/lib/utils";
import { RotateCcw, Dices, Coins, History, ChevronLeft, Hash, Users, RectangleHorizontal, Lock } from "lucide-react";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { WheelTab } from "@base-project/web/components/randomizer/wheel/wheel-tab";
import { DiceTab } from "@base-project/web/components/randomizer/dice/dice-tab";
import { CoinTab } from "@base-project/web/components/randomizer/coin/coin-tab";
import { NumberTab } from "@base-project/web/components/randomizer/number/number-tab";

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
  const [numberHistory, setNumberHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [historyOpen, setHistoryOpen] = useState(false);
  const coinClearSessionRef = useRef<(() => void) | null>(null);

  const activeHistory =
    activeTab === "wheel"
      ? wheelHistory
      : activeTab === "dice"
        ? diceHistory
        : activeTab === "coin"
          ? coinHistory
          : numberHistory;

  function handleClearHistory() {
    if (activeTab === "wheel") setWheelHistory([]);
    else if (activeTab === "dice") setDiceHistory([]);
    else if (activeTab === "coin") {
      setCoinHistory([]);
      coinClearSessionRef.current?.();
    }
    else if (activeTab === "number") setNumberHistory([]);
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/40">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="h-4 w-4" />
          Home
        </Link>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">Randomizer</span>
          {" "}Toolkit
        </h1>
        {/* Mobile history toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <History className="h-4 w-4 mr-1" />
          {historyOpen ? "Hide" : "History"}
        </Button>
        <div className="hidden md:block w-20" />
      </header>

      {/* Main content — full height */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-53px)]">
        {/* Tool area — takes all available space */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <Tabs defaultValue={initialTab} onValueChange={setActiveTab}>
            <div className="flex justify-center py-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b border-border/20">
              <TabsList variant="line">
                <TabsTrigger
                  value="wheel"
                  className={cn(
                    "gap-1.5",
                    "data-[state=active]:border-wheel-accent"
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  Wheel
                </TabsTrigger>
                <TabsTrigger
                  value="dice"
                  className={cn(
                    "gap-1.5",
                    "data-[state=active]:border-dice-accent"
                  )}
                >
                  <Dices className="h-4 w-4" />
                  Dice
                </TabsTrigger>
                <TabsTrigger
                  value="coin"
                  className={cn(
                    "gap-1.5",
                    "data-[state=active]:border-coin-accent"
                  )}
                >
                  <Coins className="h-4 w-4" />
                  Coin
                </TabsTrigger>
                <TabsTrigger
                  value="number"
                  className={cn("gap-1.5", "data-[state=active]:border-number-accent")}
                >
                  <Hash className="h-4 w-4" />
                  Number
                </TabsTrigger>
                <TabsTrigger value="teams" disabled className="gap-1.5 opacity-40">
                  <Users className="h-4 w-4" />
                  Teams
                </TabsTrigger>
                <TabsTrigger value="cards" disabled className="gap-1.5 opacity-40">
                  <RectangleHorizontal className="h-4 w-4" />
                  Cards
                </TabsTrigger>
              </TabsList>
            </div>

              <TabsContent value="wheel" className="mt-0 p-4 flex items-start justify-center">
                <WheelTab onHistoryChange={setWheelHistory} />
              </TabsContent>
              <TabsContent value="dice" className="mt-0 p-6 flex items-start justify-center">
                <DiceTab onHistoryChange={setDiceHistory} />
              </TabsContent>
              <TabsContent value="coin" className="mt-0 p-6 flex items-start justify-center">
                <CoinTab
                  onHistoryChange={setCoinHistory}
                  registerClearSession={(fn) => { coinClearSessionRef.current = fn; }}
                />
              </TabsContent>
              <TabsContent value="number" className="mt-0 p-6 flex items-start justify-center">
                <NumberTab onHistoryChange={setNumberHistory} />
              </TabsContent>
              <TabsContent value="teams" className="mt-0 p-6">
                <ComingSoon icon={<Users className="h-10 w-10" />} title="Name Picker / Team Shuffler" description="Enter names and randomly split into teams or pick one person." />
              </TabsContent>
              <TabsContent value="cards" className="mt-0 p-6">
                <ComingSoon icon={<RectangleHorizontal className="h-10 w-10" />} title="Card Drawer" description="Draw from a standard 52-card deck with a satisfying flip animation." />
              </TabsContent>
            </Tabs>
          </div>

          {/* History sidebar */}
          <div
            className={cn(
              "w-full md:w-72 shrink-0 border-l border-border/40 overflow-y-auto p-4",
              historyOpen ? "block" : "hidden md:block"
            )}
          >
            <ResultHistory
              entries={activeHistory}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>
  );
}

function ComingSoon({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center max-w-md mx-auto">
      <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
        <Lock className="h-3 w-3" />
        Coming soon
      </div>
    </div>
  );
}
