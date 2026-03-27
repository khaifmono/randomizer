import { useState, useRef } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base-project/web/components/ui/tabs";
import { Button } from "@base-project/web/components/ui/button";
import { ResultHistory } from "@base-project/web/components/result-history";
import { cn } from "@base-project/web/lib/utils";
import { RotateCcw, Dices, Coins, History, ChevronLeft, Hash, Users, RectangleHorizontal } from "lucide-react";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { WheelTab } from "@base-project/web/components/randomizer/wheel/wheel-tab";
import { DiceTab } from "@base-project/web/components/randomizer/dice/dice-tab";
import { CoinTab } from "@base-project/web/components/randomizer/coin/coin-tab";
import { NumberTab } from "@base-project/web/components/randomizer/number/number-tab";
import { TeamsTab } from "@base-project/web/components/randomizer/teams/teams-tab";
import { CardsTab } from "@base-project/web/components/randomizer/cards/cards-tab";

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
  const [teamsHistory, setTeamsHistory] = useState<HistoryEntry[]>([]);
  const [cardsHistory, setCardsHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [historyOpen, setHistoryOpen] = useState(false);
  const coinClearSessionRef = useRef<(() => void) | null>(null);

  const activeHistory = (
    { wheel: wheelHistory, dice: diceHistory, coin: coinHistory, number: numberHistory, teams: teamsHistory, cards: cardsHistory } as Record<string, HistoryEntry[]>
  )[activeTab] ?? [];

  function handleClearHistory() {
    if (activeTab === "wheel") setWheelHistory([]);
    else if (activeTab === "dice") setDiceHistory([]);
    else if (activeTab === "coin") {
      setCoinHistory([]);
      coinClearSessionRef.current?.();
    }
    else if (activeTab === "cards") setCardsHistory([]);
    else if (activeTab === "number") setNumberHistory([]);
    else if (activeTab === "teams") setTeamsHistory([]);
  }

  const bgAccentMap: Record<string, string> = {
    wheel: "from-blue-50 via-background to-indigo-50/50",
    dice: "from-emerald-50 via-background to-teal-50/50",
    coin: "from-amber-50 via-background to-yellow-50/50",
    number: "from-purple-50 via-background to-fuchsia-50/50",
    teams: "from-violet-50 via-background to-purple-50/50",
    cards: "from-rose-50 via-background to-pink-50/50",
  };

  const dotAccentMap: Record<string, string> = {
    wheel: "text-blue-200/40",
    dice: "text-emerald-200/40",
    coin: "text-amber-200/40",
    number: "text-purple-200/40",
    teams: "text-violet-200/40",
    cards: "text-rose-200/40",
  };

  return (
    <div className={cn("min-h-screen relative transition-colors duration-500 bg-gradient-to-br", bgAccentMap[activeTab] || bgAccentMap.wheel)}>
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className={cn("absolute -top-24 -right-24 w-96 h-96 transition-colors duration-500", dotAccentMap[activeTab])} viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" opacity="0.3" />
          <circle cx="100" cy="100" r="60" opacity="0.2" />
          <circle cx="100" cy="100" r="40" opacity="0.15" />
        </svg>
        <svg className={cn("absolute -bottom-32 -left-32 w-80 h-80 transition-colors duration-500", dotAccentMap[activeTab])} viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="90" opacity="0.2" />
          <circle cx="100" cy="100" r="50" opacity="0.15" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/60 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ChevronLeft className="h-5 w-5" />
          Home
        </Link>
        <h1 className="text-xl font-bold tracking-tight">
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
            <div className="flex justify-center py-5 sticky top-0 bg-background/60 backdrop-blur-md z-10 border-b border-border/20">
              <TabsList variant="line" className="gap-1">
                <TabsTrigger
                  value="wheel"
                  className={cn(
                    "gap-2 text-base font-semibold px-5 py-2.5",
                    "data-[state=active]:border-wheel-accent"
                  )}
                >
                  <RotateCcw className="h-5 w-5" />
                  Wheel
                </TabsTrigger>
                <TabsTrigger
                  value="dice"
                  className={cn(
                    "gap-2 text-base font-semibold px-5 py-2.5",
                    "data-[state=active]:border-dice-accent"
                  )}
                >
                  <Dices className="h-5 w-5" />
                  Dice
                </TabsTrigger>
                <TabsTrigger
                  value="coin"
                  className={cn(
                    "gap-2 text-base font-semibold px-5 py-2.5",
                    "data-[state=active]:border-coin-accent"
                  )}
                >
                  <Coins className="h-5 w-5" />
                  Coin
                </TabsTrigger>
                <TabsTrigger
                  value="number"
                  className={cn("gap-2 text-base font-semibold px-5 py-2.5", "data-[state=active]:border-number-accent")}
                >
                  <Hash className="h-5 w-5" />
                  Number
                </TabsTrigger>
                <TabsTrigger
                  value="teams"
                  className={cn("gap-2 text-base font-semibold px-5 py-2.5", "data-[state=active]:border-teams-accent")}
                >
                  <Users className="h-5 w-5" />
                  Teams
                </TabsTrigger>
                <TabsTrigger
                  value="cards"
                  className={cn("gap-2 text-base font-semibold px-5 py-2.5", "data-[state=active]:border-cards-accent")}
                >
                  <RectangleHorizontal className="h-5 w-5" />
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
              <TabsContent value="teams" className="mt-0 p-6 flex items-start justify-center">
                <TeamsTab onHistoryChange={setTeamsHistory} />
              </TabsContent>
              <TabsContent value="cards" className="mt-0 p-6 flex items-start justify-center">
                <CardsTab onHistoryChange={setCardsHistory} />
              </TabsContent>
            </Tabs>
          </div>

          {/* History sidebar */}
          <div
            className={cn(
              "w-full md:w-72 shrink-0 border-l border-border/40 overflow-y-auto p-4 bg-background/40 backdrop-blur-sm",
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

