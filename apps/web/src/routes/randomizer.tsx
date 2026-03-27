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

  const historyMap: Record<string, HistoryEntry[]> = {
    wheel: wheelHistory,
    dice: diceHistory,
    coin: coinHistory,
    number: numberHistory,
    teams: teamsHistory,
    cards: cardsHistory,
  };
  const activeHistory = historyMap[activeTab] || [];

  function handleClearHistory() {
    if (activeTab === "wheel") setWheelHistory([]);
    else if (activeTab === "dice") setDiceHistory([]);
    else if (activeTab === "coin") {
      setCoinHistory([]);
      coinClearSessionRef.current?.();
    }
    else if (activeTab === "number") setNumberHistory([]);
    else if (activeTab === "teams") setTeamsHistory([]);
    else if (activeTab === "cards") setCardsHistory([]);
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

  const tabs = [
    { value: "wheel", icon: RotateCcw, label: "Wheel", accent: "data-[state=active]:border-wheel-accent data-[state=active]:text-wheel-accent" },
    { value: "dice", icon: Dices, label: "Dice", accent: "data-[state=active]:border-dice-accent data-[state=active]:text-dice-accent" },
    { value: "coin", icon: Coins, label: "Coin", accent: "data-[state=active]:border-coin-accent data-[state=active]:text-coin-accent" },
    { value: "number", icon: Hash, label: "Number", accent: "data-[state=active]:border-number-accent data-[state=active]:text-number-accent" },
    { value: "teams", icon: Users, label: "Teams", accent: "data-[state=active]:border-teams-accent data-[state=active]:text-teams-accent" },
    { value: "cards", icon: RectangleHorizontal, label: "Cards", accent: "data-[state=active]:border-rose-500 data-[state=active]:text-rose-500" },
  ];

  return (
    <div className={cn("min-h-screen relative transition-colors duration-500 bg-gradient-to-br", bgAccentMap[activeTab] || bgAccentMap.wheel)}>
      {/* Background accents */}
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
          <span className="hidden sm:inline">Home</span>
        </Link>
        <h1 className="text-lg md:text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">Randomizer</span>
          {" "}Toolkit
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <History className="h-4 w-4" />
        </Button>
        <div className="hidden md:block w-20" />
      </header>

      {/* Main content */}
      <div className="relative flex flex-col md:flex-row h-[calc(100vh-57px)]">
        {/* Tool area */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <Tabs defaultValue={initialTab} onValueChange={setActiveTab}>
            {/* Tab bar — horizontally scrollable on mobile, icon-only on small screens */}
            <div className="sticky top-0 bg-background/60 backdrop-blur-md z-10 border-b border-border/20">
              <div className="overflow-x-auto scrollbar-none">
                <TabsList variant="line" className="gap-0 w-max min-w-full justify-center px-2 py-3 md:py-5">
                  {tabs.map(({ value, icon: Icon, label, accent }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className={cn(
                        "gap-1 md:gap-2 text-xs md:text-base font-semibold px-3 md:px-5 py-2 md:py-2.5 shrink-0",
                        accent
                      )}
                    >
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="hidden sm:inline">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
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
