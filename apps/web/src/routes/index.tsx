import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { RotateCcw, Dices, Coins, Zap, Hash, Users, RectangleHorizontal, Eye, Search, CircleHelp, Hand, Trophy, Timer, KeyRound, Palette, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const tools = [
  {
    icon: <RotateCcw className="h-8 w-8" />,
    title: "Spin the Wheel",
    description: "Add your options, spin, and let fate decide. Items vanish as they're picked.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    glowColor: "shadow-blue-500/25",
    tab: "wheel",
    keywords: ["wheel", "spin", "picker", "random"],
  },
  {
    icon: <Dices className="h-8 w-8" />,
    title: "Roll the Dice",
    description: "Toss 1-6 dice with satisfying 3D tumbles. Pip faces and instant totals.",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    glowColor: "shadow-emerald-500/25",
    tab: "dice",
    keywords: ["dice", "roll", "d6", "board game"],
  },
  {
    icon: <Coins className="h-8 w-8" />,
    title: "Flip a Coin",
    description: "Toss up to 10 coins. Watch them arc through the air and land on H or T.",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    glowColor: "shadow-amber-500/25",
    tab: "coin",
    keywords: ["coin", "flip", "toss", "heads", "tails"],
  },
  {
    icon: <Hash className="h-8 w-8" />,
    title: "Lucky Number",
    description: "Pull the lever on a casino-style slot machine and get your random number.",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    glowColor: "shadow-purple-500/25",
    tab: "number",
    keywords: ["number", "slot", "lucky", "generator", "random"],
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Shuffler",
    description: "Enter names, pick one or split into teams with a shuffle animation.",
    gradientFrom: "from-violet-500",
    gradientTo: "to-violet-600",
    glowColor: "shadow-violet-500/25",
    tab: "teams",
    keywords: ["team", "shuffle", "group", "names", "split"],
  },
  {
    icon: <RectangleHorizontal className="h-8 w-8" />,
    title: "Card Drawer",
    description: "Draw from a 52-card deck. Watch cards cycle through then flip to reveal.",
    gradientFrom: "from-rose-500",
    gradientTo: "to-rose-600",
    glowColor: "shadow-rose-500/25",
    tab: "cards",
    keywords: ["card", "draw", "deck", "poker", "playing"],
  },
  {
    icon: <CircleHelp className="h-8 w-8" />,
    title: "Magic 8-Ball",
    description: "Shake the ball and watch your answer float up from the deep. Ask anything.",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-900",
    glowColor: "shadow-indigo-500/25",
    tab: "8ball",
    keywords: ["8ball", "magic", "shake", "fortune", "answer", "question"],
    comingSoon: true,
  },
  {
    icon: <Hand className="h-8 w-8" />,
    title: "Rock Paper Scissors",
    description: "Play against the computer with animated hand throws. Best of 1, 3, or 5.",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-600",
    glowColor: "shadow-orange-500/25",
    tab: "rps",
    keywords: ["rock", "paper", "scissors", "game", "hand"],
    comingSoon: true,
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "Bracket Tournament",
    description: "Enter options, watch them battle head-to-head in a random elimination bracket.",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
    glowColor: "shadow-yellow-500/25",
    tab: "bracket",
    keywords: ["bracket", "tournament", "elimination", "versus", "winner"],
    comingSoon: true,
  },
  {
    icon: <Timer className="h-8 w-8" />,
    title: "Timer Roulette",
    description: "Spin for a random countdown (1-60 min). Great for study sprints or break intervals.",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-600",
    glowColor: "shadow-teal-500/25",
    tab: "timer",
    keywords: ["timer", "countdown", "roulette", "study", "break", "pomodoro"],
    comingSoon: true,
  },
  {
    icon: <KeyRound className="h-8 w-8" />,
    title: "Password Generator",
    description: "Animated slot-machine reels spin and lock into a secure random password.",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-cyan-600",
    glowColor: "shadow-cyan-500/25",
    tab: "password",
    keywords: ["password", "generator", "secure", "slot", "random"],
    comingSoon: true,
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Color Randomizer",
    description: "Generate random colors with a paint splash animation. Copy hex codes instantly.",
    gradientFrom: "from-pink-500",
    gradientTo: "to-pink-600",
    glowColor: "shadow-pink-500/25",
    tab: "color",
    keywords: ["color", "colour", "hex", "paint", "palette", "random"],
    comingSoon: true,
  },
];

function LandingPage() {
  const [search, setSearch] = useState("");

  const filtered = tools.filter((tool) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      tool.title.toLowerCase().includes(q)
      || tool.description.toLowerCase().includes(q)
      || tool.keywords.some((k) => k.includes(q))
    );
  });

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-wheel-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-dice-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-coin-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        {/* Floating emoji */}
        <div className="absolute top-[15%] left-[10%] text-4xl animate-bounce [animation-delay:0.5s] [animation-duration:3s] opacity-40">🎲</div>
        <div className="absolute top-[20%] right-[15%] text-3xl animate-bounce [animation-delay:1.2s] [animation-duration:2.5s] opacity-40">🪙</div>
        <div className="absolute bottom-[25%] left-[20%] text-3xl animate-bounce [animation-delay:0.8s] [animation-duration:3.5s] opacity-40">🎡</div>
        <div className="absolute bottom-[15%] right-[10%] text-4xl animate-bounce [animation-delay:1.5s] [animation-duration:2.8s] opacity-40">✨</div>
        <div className="absolute top-[50%] left-[5%] text-2xl animate-bounce [animation-delay:2s] [animation-duration:3.2s] opacity-30">🎯</div>
        <div className="absolute top-[10%] left-[50%] text-2xl animate-bounce [animation-delay:0.3s] [animation-duration:2.7s] opacity-30">🍀</div>
      </div>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 pt-16 pb-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 font-medium">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            100% client-side — no accounts, no tracking
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]">
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">Randomizer</span>
            <br />
            Toolkit
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Spin, roll, or flip your way to a decision. Fun animations. Zero signup. Just pick a tool and go.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all text-base"
          />
        </div>
      </section>

      {/* Tool grid */}
      <section className="relative flex-1 px-4 pb-8 max-w-5xl mx-auto w-full">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((tool) => (
              <ToolCard key={tool.tab} {...tool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No tools found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative py-6 px-6 text-center border-t border-white/5">
        <p className="text-sm text-white/30">
          Built with React & Tailwind. All randomization happens in your browser.
        </p>
        <VisitorCounter />
      </footer>
    </div>
  );
}

function VisitorCounter() {
  return (
    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/20">
      <Eye className="h-3 w-3" />
      <img
        src="https://visitor-badge.laobi.icu/badge?page_id=randomizer-toolkit.vercel.app&right_color=%23374151&left_color=%23374151&left_text=visitors"
        alt="visitor count"
        className="h-[18px] opacity-30 rounded-sm"
      />
    </div>
  );
}

function ToolCard({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  glowColor,
  tab,
  comingSoon,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  tab: string;
  keywords?: string[];
  comingSoon?: boolean;
}) {
  const card = (
    <Card className={`relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 ${comingSoon ? "opacity-50 cursor-default" : `hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl ${glowColor} cursor-pointer`} transition-all duration-300 h-full group`}>
      <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white shadow-lg ${comingSoon ? "" : "group-hover:scale-110"} transition-transform duration-300`}>
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{description}</p>
        </div>
      </CardContent>
      {comingSoon && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
          <Lock className="h-3 w-3 text-white/60" />
          <span className="text-xs font-semibold text-white/60">Coming Soon</span>
        </div>
      )}
    </Card>
  );

  if (comingSoon) return card;

  return (
    <Link to="/randomizer" search={{ tab }}>
      {card}
    </Link>
  );
}
