import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { RotateCcw, Dices, Coins, Zap, Hash, Users, RectangleHorizontal, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
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
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16 space-y-10 max-w-5xl mx-auto">
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

        {/* Tool cards */}
        <div className="grid md:grid-cols-3 gap-5 w-full max-w-3xl">
          <ToolCard
            icon={<RotateCcw className="h-8 w-8" />}
            title="Spin the Wheel"
            description="Add your options, spin, and let fate decide. Items vanish as they're picked."
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            glowColor="shadow-blue-500/25"
            tab="wheel"
          />
          <ToolCard
            icon={<Dices className="h-8 w-8" />}
            title="Roll the Dice"
            description="Toss 1-6 dice with satisfying 3D tumbles. Pip faces and instant totals."
            gradientFrom="from-emerald-500"
            gradientTo="to-emerald-600"
            glowColor="shadow-emerald-500/25"
            tab="dice"
          />
          <ToolCard
            icon={<Coins className="h-8 w-8" />}
            title="Flip a Coin"
            description="Toss up to 10 coins. Watch them arc through the air and land on H or T."
            gradientFrom="from-amber-500"
            gradientTo="to-amber-600"
            glowColor="shadow-amber-500/25"
            tab="coin"
          />
          <ToolCard
            icon={<Hash className="h-8 w-8" />}
            title="Lucky Number"
            description="Pull the lever on a casino-style slot machine and get your random number."
            gradientFrom="from-purple-500"
            gradientTo="to-purple-600"
            glowColor="shadow-purple-500/25"
            tab="number"
          />
          <ComingSoonCard
            icon={<Users className="h-8 w-8" />}
            title="Team Shuffler"
            description="Enter names and randomly split into teams or pick one person."
          />
          <ComingSoonCard
            icon={<RectangleHorizontal className="h-8 w-8" />}
            title="Card Drawer"
            description="Draw from a 52-card deck with a satisfying flip animation."
          />
        </div>

        {/* CTA */}
        <Button size="lg" className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 shadow-xl shadow-violet-500/25 border-0 text-white" asChild>
          <Link to="/randomizer">
            <Zap className="h-5 w-5 mr-2" />
            Let&apos;s go!
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="relative py-6 px-6 text-center border-t border-white/5">
        <p className="text-sm text-white/30">
          Built with React & Tailwind. All randomization happens in your browser.
        </p>
      </footer>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  tab: string;
}) {
  return (
    <Link to="/randomizer" search={{ tab }}>
      <Card className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl ${glowColor} transition-all duration-300 cursor-pointer h-full group`}>
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ComingSoonCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white/[0.03] border-white/5 h-full opacity-60">
      <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/30">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white/40">{title}</h3>
          <p className="text-sm text-white/25 leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          <Lock className="h-3 w-3" />
          Coming soon
        </div>
      </CardContent>
    </Card>
  );
}
