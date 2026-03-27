import { useEffect, useRef } from "react";
import { animate } from "motion";
import { getSegmentColor, calculateStopAngle } from "@base-project/web/lib/randomizer/wheel-math";

type WheelCanvasProps = {
  items: string[];
  spinning: boolean;
  winnerIndex: number | null;
  winner: string | null;
  onSpin: () => void;
  onSpinEnd: () => void;
};

export function WheelCanvas({ items, spinning, winnerIndex, winner, onSpin, onSpinEnd }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cssSizeRef = useRef(0);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cssSize = entry.contentRect.width;
        if (cssSize === 0) continue;
        cssSizeRef.current = cssSize;
        canvas.width = cssSize * dpr;
        canvas.height = cssSize * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctxRef.current = ctx;
        }
      }
    });

    const parent = canvas.parentElement;
    if (parent) observer.observe(parent);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    function draw() {
      const ctx = ctxRef.current;
      const cssSize = cssSizeRef.current;
      const currentItems = itemsRef.current;

      if (!ctx || cssSize === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const cx = cssSize / 2;
      const cy = cssSize / 2;
      const radius = cssSize / 2 - 2;
      const hubRadius = radius * 0.15;

      ctx.clearRect(0, 0, cssSize, cssSize);

      if (currentItems.length === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#e5e5e5";
        ctx.fill();

        ctx.fillStyle = "#737373";
        ctx.font = `bold ${cssSize * 0.04}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Add items to spin", cx, cy);

        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const segmentAngle = (2 * Math.PI) / currentItems.length;

      // Draw segments
      for (let i = 0; i < currentItems.length; i++) {
        const startAngle = rotationRef.current + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Fill segment
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = getSegmentColor(i);
        ctx.fill();

        // White border between segments
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(startAngle) * radius, cy + Math.sin(startAngle) * radius);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text — bold, large, white, radial
        const midAngle = startAngle + segmentAngle / 2;
        const text = currentItems[i].length > 12
          ? currentItems[i].slice(0, 12) + "…"
          : currentItems[i];

        // Scale font size based on wheel size and item count
        const maxFontSize = cssSize * 0.055;
        const minFontSize = cssSize * 0.025;
        const fontSize = Math.max(minFontSize, Math.min(maxFontSize, (radius * 0.9) / currentItems.length * 2.2));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 3;
        ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
        ctx.fillText(text, radius - 14, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // White center hub
      ctx.beginPath();
      ctx.arc(cx, cy, hubRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Hub border
      ctx.beginPath();
      ctx.arc(cx, cy, hubRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

  // Motion animation
  useEffect(() => {
    if (!spinning || winnerIndex === null || items.length === 0) return;

    const fullRotations = 4 + Math.floor(Math.random() * 3);
    const targetAngle = calculateStopAngle(rotationRef.current, winnerIndex, items.length, fullRotations);
    const duration = 4 + Math.random();

    const controls = animate(rotationRef.current, targetAngle, {
      duration,
      ease: [0.12, 0, 0.39, 0],
      onUpdate: (latest) => {
        rotationRef.current = latest;
      },
      onComplete: () => {
        onSpinEnd();
      },
    });

    return () => {
      controls.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, winnerIndex, items.length]);

  const canClick = !spinning && items.length > 0;

  return (
    <div className="relative w-full">
      {/* Pointer on the right side */}
      <svg
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1 pointer-events-none z-10 drop-shadow-md"
        width="32"
        height="40"
        viewBox="0 0 32 40"
        aria-hidden="true"
      >
        <polygon points="0,0 32,20 0,40" fill="#fdd835" stroke="#e6c200" strokeWidth="2" />
      </svg>

      <canvas
        ref={canvasRef}
        className={[
          "w-full aspect-square",
          canClick ? "cursor-pointer" : items.length === 0 ? "cursor-default" : "cursor-not-allowed",
        ].join(" ")}
        onClick={() => canClick && onSpin()}
        role="img"
        aria-label="Spinning wheel"
      />

      {/* Winner overlay */}
      {winner !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/80 backdrop-blur-sm px-8 py-5 rounded-2xl animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            <p className="text-sm font-semibold text-white/60 text-center">Winner!</p>
            <p className="text-3xl font-black text-white text-center">{winner}</p>
          </div>
        </div>
      )}
    </div>
  );
}
