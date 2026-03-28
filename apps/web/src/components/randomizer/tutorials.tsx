import { MousePointer } from "lucide-react";

// SVG illustration helpers
function IllustrationBox({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-48 h-32 flex items-center justify-center">
        {children}
      </div>
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}

// ─── WHEEL TUTORIAL ──────────────────────────────────────
export const wheelTutorial = [
  {
    title: "Add your items",
    description: "Type an item name and press Enter or click Add. You can also click 'Bulk add' to paste multiple items at once — one per line.",
    illustration: (
      <IllustrationBox label="Quick add or bulk paste">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="10" y="10" width="140" height="32" rx="6" stroke="#3b82f6" strokeWidth="2" fill="#eff6ff" />
          <text x="20" y="31" fontSize="12" fill="#64748b" fontFamily="sans-serif">Enter an item...</text>
          <rect x="155" y="10" width="35" height="32" rx="6" fill="#3b82f6" />
          <text x="163" y="31" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif">Add</text>
          <rect x="10" y="55" width="180" height="22" rx="4" fill="#f1f5f9" />
          <circle cx="22" cy="66" r="4" fill="#3b82f6" />
          <text x="32" y="70" fontSize="10" fill="#334155" fontFamily="sans-serif">Pizza</text>
          <rect x="168" y="60" width="14" height="14" rx="2" fill="#fee2e2" />
          <text x="172" y="71" fontSize="9" fill="#ef4444" fontFamily="sans-serif">×</text>
          <rect x="10" y="82" width="180" height="22" rx="4" fill="#f1f5f9" />
          <circle cx="22" cy="93" r="4" fill="#3b82f6" />
          <text x="32" y="97" fontSize="10" fill="#334155" fontFamily="sans-serif">Sushi</text>
          <rect x="168" y="87" width="14" height="14" rx="2" fill="#fee2e2" />
          <text x="172" y="98" fontSize="9" fill="#ef4444" fontFamily="sans-serif">×</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Spin the wheel",
    description: "Click the Spin button or click directly on the wheel to start spinning. The wheel will spin 4-6 full rotations before slowing down dramatically.",
    illustration: (
      <IllustrationBox label="Click wheel or Spin button">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <circle cx="90" cy="60" r="50" fill="#e53935" />
          <path d="M90 10 A50 50 0 0 1 140 60 L90 60Z" fill="#1e88e5" />
          <path d="M90 10 A50 50 0 0 0 40 60 L90 60Z" fill="#43a047" />
          <path d="M40 60 A50 50 0 0 0 90 110 L90 60Z" fill="#fdd835" />
          <circle cx="90" cy="60" r="12" fill="white" />
          <polygon points="90,8 84,0 96,0" fill="#fdd835" stroke="#e6c200" strokeWidth="1" />
          <path d="M155 95 C155 95 170 95 170 95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
          <MousePointer x="165" y="50" className="w-6 h-6 text-gray-600" />
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Winner announced!",
    description: "After the wheel stops, the winning item pops up as a bold overlay in the center. The winner is automatically removed from the wheel.",
    illustration: (
      <IllustrationBox label="Winner overlay appears">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <circle cx="100" cy="60" r="50" fill="#ddd" opacity="0.5" />
          <rect x="45" y="35" width="110" height="50" rx="12" fill="#1a1a1a" opacity="0.85" />
          <text x="100" y="55" textAnchor="middle" fontSize="9" fill="#ffffff99" fontFamily="sans-serif" fontWeight="600">Winner!</text>
          <text x="100" y="72" textAnchor="middle" fontSize="16" fill="white" fontFamily="sans-serif" fontWeight="800">🍕 Pizza</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Reset when done",
    description: "After all items are drawn, a celebration appears! Click 'Reset Wheel' to restore all items and start again. Your items are saved in your browser.",
    illustration: (
      <IllustrationBox label="All done — reset to restart">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <text x="100" y="35" textAnchor="middle" fontSize="20" fontFamily="sans-serif">🎉</text>
          <text x="100" y="58" textAnchor="middle" fontSize="14" fill="#1a1a1a" fontFamily="sans-serif" fontWeight="800">All done!</text>
          <text x="100" y="74" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">All items have been drawn.</text>
          <rect x="60" y="85" width="80" height="26" rx="6" fill="#3b82f6" />
          <text x="100" y="102" textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif" fontWeight="600">Reset Wheel</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── DICE TUTORIAL ──────────────────────────────────────
export const diceTutorial = [
  {
    title: "Choose how many dice",
    description: "Use the + and - buttons to select between 1 and 6 dice. The default is 2.",
    illustration: (
      <IllustrationBox label="Stepper control: 1-6 dice">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="50" y="40" width="30" height="30" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="65" y="60" textAnchor="middle" fontSize="16" fill="#334155" fontFamily="sans-serif" fontWeight="bold">−</text>
          <rect x="85" y="35" width="30" height="40" rx="6" fill="white" stroke="#10b981" strokeWidth="2" />
          <text x="100" y="62" textAnchor="middle" fontSize="20" fill="#10b981" fontFamily="sans-serif" fontWeight="800">3</text>
          <rect x="120" y="40" width="30" height="30" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="135" y="60" textAnchor="middle" fontSize="16" fill="#334155" fontFamily="sans-serif" fontWeight="bold">+</text>
          <text x="100" y="95" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">Select 1 to 6 dice</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Roll the dice",
    description: "Click the Roll button. All dice toss into the air simultaneously with a 3D tumbling animation, then land showing their result.",
    illustration: (
      <IllustrationBox label="Dice toss into the air">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="30" y="20" width="35" height="35" rx="4" fill="white" stroke="#10b981" strokeWidth="2" transform="rotate(-15 47 37)" />
          <circle cx="47" cy="37" r="4" fill="#10b981" />
          <rect x="85" y="10" width="35" height="35" rx="4" fill="white" stroke="#10b981" strokeWidth="2" transform="rotate(10 102 27)" />
          <circle cx="95" cy="22" r="3" fill="#10b981" />
          <circle cx="109" cy="32" r="3" fill="#10b981" />
          <rect x="140" y="25" width="35" height="35" rx="4" fill="white" stroke="#10b981" strokeWidth="2" transform="rotate(-8 157 42)" />
          <circle cx="150" cy="35" r="3" fill="#10b981" />
          <circle cx="157" cy="42" r="3" fill="#10b981" />
          <circle cx="164" cy="49" r="3" fill="#10b981" />
          <path d="M47 55 L47 70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
          <path d="M102 50 L102 70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
          <path d="M157 65 L157 70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
          <text x="100" y="90" textAnchor="middle" fontSize="14" fill="#10b981" fontFamily="sans-serif" fontWeight="800">Total: 6</text>
          <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">1 + 2 + 3 = 6</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "See your results",
    description: "After landing, each die shows pip dots on its face. The total sum is displayed below. Every roll is saved to the history panel on the right.",
    illustration: (
      <IllustrationBox label="Results in history panel">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="30" y="15" width="140" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" strokeWidth="1" />
          <text x="40" y="33" fontSize="10" fill="#10b981" fontFamily="sans-serif" fontWeight="600">#1</text>
          <text x="60" y="33" fontSize="10" fill="#334155" fontFamily="sans-serif">4+2+6 = 12</text>
          <rect x="30" y="48" width="140" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" strokeWidth="1" />
          <text x="40" y="66" fontSize="10" fill="#10b981" fontFamily="sans-serif" fontWeight="600">#2</text>
          <text x="60" y="66" fontSize="10" fill="#334155" fontFamily="sans-serif">1+5+3 = 9</text>
          <rect x="30" y="81" width="140" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" strokeWidth="1" />
          <text x="40" y="99" fontSize="10" fill="#10b981" fontFamily="sans-serif" fontWeight="600">#3</text>
          <text x="60" y="99" fontSize="10" fill="#334155" fontFamily="sans-serif">6+6+2 = 14</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── COIN TUTORIAL ──────────────────────────────────────
export const coinTutorial = [
  {
    title: "Pick how many coins",
    description: "Use the + and - buttons to select 1 to 10 coins. Each coin will flip independently.",
    illustration: (
      <IllustrationBox label="Select 1-10 coins">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="50" y="56" textAnchor="middle" fontSize="14" fill="#92400e" fontFamily="sans-serif" fontWeight="800">50</text>
          <circle cx="100" cy="50" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="100" y="56" textAnchor="middle" fontSize="14" fill="#92400e" fontFamily="sans-serif" fontWeight="800">50</text>
          <circle cx="150" cy="50" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="150" y="56" textAnchor="middle" fontSize="14" fill="#92400e" fontFamily="sans-serif" fontWeight="800">50</text>
          <text x="100" y="95" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">3 coins selected</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Flip!",
    description: "Click the Flip button. All coins toss into the air with a realistic arc, spinning vertically before landing on heads or tails.",
    illustration: (
      <IllustrationBox label="Coins toss upward and spin">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <ellipse cx="60" cy="30" rx="18" ry="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" transform="rotate(-20 60 30)" />
          <ellipse cx="100" cy="20" rx="18" ry="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" transform="rotate(10 100 20)" />
          <ellipse cx="140" cy="35" rx="18" ry="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" transform="rotate(-5 140 35)" />
          <path d="M60 40 C60 60 60 80 60 90" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3,2" />
          <path d="M100 30 C100 50 100 70 100 90" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3,2" />
          <path d="M140 45 C140 60 140 75 140 90" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3,2" />
          <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">↑ toss arc animation</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Count heads & tails",
    description: "After landing, you see the result: how many heads and tails. A running session tally tracks your totals across all flips until you clear history.",
    illustration: (
      <IllustrationBox label="Session tally tracks totals">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <circle cx="60" cy="40" r="20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="60" y="46" textAnchor="middle" fontSize="12" fill="#92400e" fontFamily="sans-serif" fontWeight="800">50</text>
          <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#10b981" fontFamily="sans-serif" fontWeight="600">H</text>
          <circle cx="110" cy="40" r="20" fill="#d4a017" stroke="#b8860b" strokeWidth="2" />
          <text x="110" y="46" textAnchor="middle" fontSize="10" fill="#78350f" fontFamily="sans-serif" fontWeight="700">T</text>
          <text x="110" y="72" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="sans-serif" fontWeight="600">T</text>
          <circle cx="160" cy="40" r="20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="160" y="46" textAnchor="middle" fontSize="12" fill="#92400e" fontFamily="sans-serif" fontWeight="800">50</text>
          <text x="160" y="72" textAnchor="middle" fontSize="9" fill="#10b981" fontFamily="sans-serif" fontWeight="600">H</text>
          <rect x="30" y="85" width="140" height="24" rx="6" fill="#fef3c7" />
          <text x="100" y="101" textAnchor="middle" fontSize="10" fill="#92400e" fontFamily="sans-serif" fontWeight="700">2H 1T across 3 flips</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── NUMBER TUTORIAL ──────────────────────────────────────
export const numberTutorial = [
  {
    title: "Set your range",
    description: "Pick a preset (1-10, 1-100, 1-1000) or enter a custom min and max. The number of slot reels adjusts automatically.",
    illustration: (
      <IllustrationBox label="Presets or custom range">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="20" y="20" width="45" height="24" rx="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="42" y="36" textAnchor="middle" fontSize="9" fill="#1a1a1a" fontFamily="sans-serif" fontWeight="800">1-10</text>
          <rect x="72" y="20" width="50" height="24" rx="12" fill="transparent" stroke="#52525b" strokeWidth="1.5" />
          <text x="97" y="36" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="sans-serif" fontWeight="700">1-100</text>
          <rect x="128" y="20" width="55" height="24" rx="12" fill="transparent" stroke="#52525b" strokeWidth="1.5" />
          <text x="155" y="36" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="sans-serif" fontWeight="700">1-1000</text>
          <rect x="40" y="60" width="50" height="30" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <text x="65" y="80" textAnchor="middle" fontSize="12" fill="#ffd700" fontFamily="serif" fontWeight="800">0</text>
          <rect x="95" y="60" width="50" height="30" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <text x="120" y="80" textAnchor="middle" fontSize="12" fill="#ffd700" fontFamily="serif" fontWeight="800">7</text>
          <text x="100" y="108" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">2 reels for range 1-10</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Pull the lever!",
    description: "Click the golden 'Pull the Lever!' button. The digit reels scroll rapidly, then lock left-to-right with a satisfying bounce.",
    illustration: (
      <IllustrationBox label="Reels spin and lock sequentially">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="30" y="20" width="40" height="50" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
          <text x="50" y="52" textAnchor="middle" fontSize="18" fill="#ffd700" fontFamily="serif" fontWeight="800">4</text>
          <text x="50" y="80" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="sans-serif" fontWeight="600">✓ locked</text>
          <rect x="80" y="20" width="40" height="50" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
          <text x="100" y="48" textAnchor="middle" fontSize="14" fill="#ffd70088" fontFamily="serif" fontWeight="800">2</text>
          <text x="100" y="60" textAnchor="middle" fontSize="14" fill="#ffd70088" fontFamily="serif" fontWeight="800">7</text>
          <text x="100" y="80" textAnchor="middle" fontSize="8" fill="#f59e0b" fontFamily="sans-serif">spinning...</text>
          <rect x="130" y="20" width="40" height="50" rx="8" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
          <text x="150" y="45" textAnchor="middle" fontSize="12" fill="#ffd70066" fontFamily="serif" fontWeight="800">5</text>
          <text x="150" y="55" textAnchor="middle" fontSize="12" fill="#ffd70066" fontFamily="serif" fontWeight="800">9</text>
          <text x="150" y="65" textAnchor="middle" fontSize="12" fill="#ffd70066" fontFamily="serif" fontWeight="800">1</text>
          <text x="150" y="80" textAnchor="middle" fontSize="8" fill="#f59e0b" fontFamily="sans-serif">spinning...</text>
          <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">Left locks first → right last</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Your lucky number",
    description: "Once all reels stop, your random number is displayed big and bold below the machine. The result is added to your history.",
    illustration: (
      <IllustrationBox label="Result shown below reels">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="35" y="15" width="130" height="50" rx="12" fill="#27272a" stroke="#3f3f46" strokeWidth="2" />
          <rect x="50" y="25" width="30" height="30" rx="6" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
          <text x="65" y="46" textAnchor="middle" fontSize="16" fill="#ffd700" fontFamily="serif" fontWeight="800">4</text>
          <rect x="85" y="25" width="30" height="30" rx="6" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
          <text x="100" y="46" textAnchor="middle" fontSize="16" fill="#ffd700" fontFamily="serif" fontWeight="800">2</text>
          <rect x="120" y="25" width="30" height="30" rx="6" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
          <text x="135" y="46" textAnchor="middle" fontSize="16" fill="#ffd700" fontFamily="serif" fontWeight="800">7</text>
          <text x="100" y="90" textAnchor="middle" fontSize="24" fill="#a855f7" fontFamily="sans-serif" fontWeight="900">427</text>
          <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">Range: 1 to 1000</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── TEAMS TUTORIAL ──────────────────────────────────────
export const teamsTutorial = [
  {
    title: "Enter names",
    description: "Type one name per line in the text area. The badge below shows how many names you've entered.",
    illustration: (
      <IllustrationBox label="One name per line">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="30" y="10" width="140" height="80" rx="6" fill="white" stroke="#8b5cf6" strokeWidth="2" />
          <text x="40" y="30" fontSize="10" fill="#334155" fontFamily="sans-serif">Alice</text>
          <text x="40" y="46" fontSize="10" fill="#334155" fontFamily="sans-serif">Bob</text>
          <text x="40" y="62" fontSize="10" fill="#334155" fontFamily="sans-serif">Carol</text>
          <text x="40" y="78" fontSize="10" fill="#334155" fontFamily="sans-serif">David</text>
          <rect x="70" y="96" width="60" height="18" rx="9" fill="#8b5cf6" />
          <text x="100" y="109" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="600">4 names</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Choose a mode",
    description: "Pick One selects a single random person. Split Teams divides everyone into groups — choose 2-8 teams with the stepper.",
    illustration: (
      <IllustrationBox label="Pick One or Split Teams">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="20" y="20" width="70" height="30" rx="6" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="2" />
          <text x="55" y="40" textAnchor="middle" fontSize="10" fill="#8b5cf6" fontFamily="sans-serif" fontWeight="700">Pick One</text>
          <rect x="100" y="20" width="80" height="30" rx="6" fill="#8b5cf6" />
          <text x="140" y="40" textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif" fontWeight="700">Split Teams</text>
          <text x="100" y="75" textAnchor="middle" fontSize="11" fill="#334155" fontFamily="sans-serif" fontWeight="600">Teams: 2</text>
          <text x="100" y="100" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">Stepper adjusts 2-8 teams</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Shuffle!",
    description: "Click Shuffle and watch names scramble. In Pick One mode, one name is highlighted. In Split Teams, names are distributed into colored columns.",
    illustration: (
      <IllustrationBox label="Teams displayed in colored columns">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="15" y="10" width="80" height="100" rx="6" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="55" y="28" textAnchor="middle" fontSize="10" fill="#8b5cf6" fontFamily="sans-serif" fontWeight="700">Team 1</text>
          <text x="55" y="48" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="sans-serif">Alice</text>
          <text x="55" y="66" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="sans-serif">Carol</text>
          <rect x="105" y="10" width="80" height="100" rx="6" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
          <text x="145" y="28" textAnchor="middle" fontSize="10" fill="#ec4899" fontFamily="sans-serif" fontWeight="700">Team 2</text>
          <text x="145" y="48" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="sans-serif">Bob</text>
          <text x="145" y="66" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="sans-serif">David</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── BRACKET TUTORIAL ──────────────────────────────────────
export const bracketTutorial = [
  {
    title: "Enter your options",
    description: "Type one option per line in the text area, or use the Add button to add them one at a time. You need at least 2 options to start.",
    illustration: (
      <IllustrationBox label="Bulk paste or add one at a time">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="10" y="10" width="180" height="55" rx="6" stroke="#eab308" strokeWidth="2" fill="#fefce8" />
          <text x="20" y="28" fontSize="10" fill="#713f12" fontFamily="sans-serif">Pizza</text>
          <text x="20" y="42" fontSize="10" fill="#713f12" fontFamily="sans-serif">Sushi</text>
          <text x="20" y="56" fontSize="10" fill="#713f12" fontFamily="sans-serif">Tacos</text>
          <rect x="10" y="73" width="130" height="26" rx="6" fill="white" stroke="#d4d4d8" strokeWidth="1.5" />
          <text x="20" y="90" fontSize="10" fill="#a1a1aa" fontFamily="sans-serif">Add an option...</text>
          <rect x="148" y="73" width="42" height="26" rx="6" fill="#eab308" />
          <text x="169" y="90" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif">Add</text>
          <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#92400e" fontFamily="sans-serif">3 options entered</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Watch them battle",
    description: "Options face off one-on-one. In Random mode, click a match to auto-pick the winner. In Judge mode, click your preferred option after the VS animation plays.",
    illustration: (
      <IllustrationBox label="VS animation: shake → flash → winner">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          {/* Left match card */}
          <rect x="15" y="20" width="70" height="80" rx="6" fill="white" stroke="#eab308" strokeWidth="2" />
          <text x="50" y="47" textAnchor="middle" fontSize="9" fill="#334155" fontFamily="sans-serif">Pizza</text>
          <line x1="15" y1="60" x2="85" y2="60" stroke="#e2e8f0" strokeWidth="1" />
          <text x="50" y="80" textAnchor="middle" fontSize="9" fill="#334155" fontFamily="sans-serif">Sushi</text>
          {/* VS badge */}
          <rect x="82" y="48" width="36" height="24" rx="4" fill="#1a1a1a" opacity="0.85" />
          <text x="100" y="64" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold" fontFamily="sans-serif">VS</text>
          {/* Right match card */}
          <rect x="115" y="20" width="70" height="80" rx="6" fill="white" stroke="#d4d4d8" strokeWidth="2" />
          <text x="150" y="47" textAnchor="middle" fontSize="9" fill="#eab308" fontWeight="bold" fontFamily="sans-serif">Tacos</text>
          <line x1="115" y1="60" x2="185" y2="60" stroke="#e2e8f0" strokeWidth="1" />
          <text x="150" y="80" textAnchor="middle" fontSize="9" fill="#a1a1aa" fontFamily="sans-serif" textDecoration="line-through">Burgers</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Champion crowned!",
    description: "The last option standing is your winner! A crown appears with a confetti burst. Click 'New Tournament' to start over with the same or new options.",
    illustration: (
      <IllustrationBox label="Crown + confetti = champion">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          {/* Confetti dots */}
          <circle cx="40" cy="20" r="4" fill="#ffd700" />
          <circle cx="70" cy="10" r="3" fill="#ff6b6b" />
          <circle cx="130" cy="15" r="4" fill="#4ecdc4" />
          <circle cx="160" cy="25" r="3" fill="#45b7d1" />
          <circle cx="55" cy="35" r="3" fill="#96ceb4" />
          <circle cx="145" cy="32" r="3" fill="#ffd700" />
          {/* Crown icon */}
          <polygon points="100,38 88,52 100,48 112,52" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="88" cy="52" r="3" fill="#eab308" />
          <circle cx="100" cy="48" r="3" fill="#eab308" />
          <circle cx="112" cy="52" r="3" fill="#eab308" />
          {/* Winner text */}
          <text x="100" y="73" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">Winner!</text>
          <text x="100" y="89" textAnchor="middle" fontSize="14" fill="#1a1a1a" fontWeight="bold" fontFamily="sans-serif">Pizza</text>
          {/* New Tournament button */}
          <rect x="55" y="98" width="90" height="18" rx="6" fill="white" stroke="#d4d4d8" strokeWidth="1.5" />
          <text x="100" y="111" textAnchor="middle" fontSize="8" fill="#374151" fontFamily="sans-serif">New Tournament</text>
        </svg>
      </IllustrationBox>
    ),
  },
];

// ─── CARDS TUTORIAL ──────────────────────────────────────
export const cardsTutorial = [
  {
    title: "Choose draw mode",
    description: "Single mode draws one card at a time. Hand mode lets you draw 1-5 cards at once. The deck has 52 cards — the badge shows how many remain.",
    illustration: (
      <IllustrationBox label="Single or Hand mode">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="20" y="15" width="65" height="28" rx="6" fill="#e11d48" />
          <text x="52" y="33" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="700">Single</text>
          <rect x="90" y="15" width="55" height="28" rx="6" fill="transparent" stroke="#52525b" strokeWidth="1.5" />
          <text x="117" y="33" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="sans-serif" fontWeight="700">Hand</text>
          <rect x="55" y="55" width="90" height="22" rx="11" fill="#f1f5f9" />
          <text x="100" y="70" textAnchor="middle" fontSize="9" fill="#334155" fontFamily="sans-serif" fontWeight="600">48 remaining</text>
          <text x="100" y="105" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">Deck depletes as you draw</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Draw cards",
    description: "Click Draw. Cards shuffle through the deck with a cycling animation, then flip face-up to reveal. In hand mode, cards flip one by one left-to-right.",
    illustration: (
      <IllustrationBox label="Cards cycle then flip to reveal">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <rect x="25" y="15" width="45" height="65" rx="4" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" transform="rotate(-5 47 47)" />
          <rect x="35" y="12" width="45" height="65" rx="4" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" transform="rotate(3 57 44)" />
          <rect x="45" y="10" width="45" height="65" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          <text x="55" y="28" fontSize="11" fill="#dc2626" fontFamily="sans-serif" fontWeight="800">A♥</text>
          <text x="67" y="52" fontSize="18" fill="#dc2626" fontFamily="sans-serif">♥</text>
          <rect x="110" y="10" width="45" height="65" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
          <text x="120" y="28" fontSize="11" fill="#1a1a1a" fontFamily="sans-serif" fontWeight="800">K♠</text>
          <text x="132" y="52" fontSize="18" fill="#1a1a1a" fontFamily="sans-serif">♠</text>
          <text x="100" y="100" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">Cards flip left → right</text>
        </svg>
      </IllustrationBox>
    ),
  },
  {
    title: "Reshuffle the deck",
    description: "When the deck runs out (0 remaining), click Reshuffle to restore all 52 cards. Your draw history is kept in the sidebar.",
    illustration: (
      <IllustrationBox label="Reset to full 52-card deck">
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <text x="100" y="30" textAnchor="middle" fontSize="12" fill="#ef4444" fontFamily="sans-serif" fontWeight="700">0 remaining</text>
          <rect x="55" y="45" width="90" height="30" rx="6" fill="#e11d48" />
          <text x="100" y="65" textAnchor="middle" fontSize="11" fill="white" fontFamily="sans-serif" fontWeight="700">Reshuffle</text>
          <path d="M100 85 L100 95" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="95,95 105,95 100,100" fill="#64748b" />
          <text x="100" y="115" textAnchor="middle" fontSize="10" fill="#10b981" fontFamily="sans-serif" fontWeight="600">52 remaining ✓</text>
        </svg>
      </IllustrationBox>
    ),
  },
];
