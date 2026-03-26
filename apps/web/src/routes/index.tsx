import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { RotateCcw, Dices, Coins, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-10 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide uppercase">Decide anything</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
            Randomizer Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Spin a wheel, roll some dice, or flip a coin — with satisfying animations that make deciding fun.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl">
          <ToolCard
            icon={<RotateCcw className="h-8 w-8" />}
            title="Spinning Wheel"
            description="Add your options and spin — the wheel decides. Items get removed as they're picked."
            accentClass="bg-wheel-accent/10 text-wheel-accent border-wheel-accent/20"
            iconBgClass="bg-wheel-accent/15 text-wheel-accent"
            tab="wheel"
          />
          <ToolCard
            icon={<Dices className="h-8 w-8" />}
            title="Dice Roller"
            description="Roll 1-6 dice with 3D tumbling animation. See pip faces and totals instantly."
            accentClass="bg-dice-accent/10 text-dice-accent border-dice-accent/20"
            iconBgClass="bg-dice-accent/15 text-dice-accent"
            tab="dice"
          />
          <ToolCard
            icon={<Coins className="h-8 w-8" />}
            title="Coin Flipper"
            description="Flip up to 10 coins at once. Watch them toss through the air and land on heads or tails."
            accentClass="bg-coin-accent/10 text-coin-accent border-coin-accent/20"
            iconBgClass="bg-coin-accent/15 text-coin-accent"
            tab="coin"
          />
        </div>

        {/* CTA */}
        <Button size="lg" className="h-12 px-8 text-base" asChild>
          <Link to="/randomizer">Try them all</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/40 text-center">
        <p className="text-sm text-muted-foreground">
          Built with React, Tailwind CSS & fun animations. All randomization happens in your browser.
        </p>
      </footer>
    </div>
  );
}

function ToolCard({
  icon,
  title,
  description,
  accentClass,
  iconBgClass,
  tab,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentClass: string;
  iconBgClass: string;
  tab: string;
}) {
  return (
    <Link to="/randomizer" search={{ tab }}>
      <Card className={`border ${accentClass} hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full`}>
        <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${iconBgClass}`}>
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
