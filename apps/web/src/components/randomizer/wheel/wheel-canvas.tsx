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
  // Store the items in a ref so the draw loop always has the latest value
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // DPR-aware canvas initialization with ResizeObserver
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

    // Observe the parent element for size changes
    const parent = canvas.parentElement;
    if (parent) {
      observer.observe(parent);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Draw loop — runs continuously via requestAnimationFrame
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
      const radius = cssSize / 2 - 4;

      ctx.clearRect(0, 0, cssSize, cssSize);

      if (currentItems.length === 0) {
        // Empty state: placeholder circle with text
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#e5e5e5";
        ctx.fill();

        ctx.fillStyle = "#737373";
        ctx.font = "14px sans-serif";
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

        // Stroke segment border
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw radial text
        const midAngle = startAngle + segmentAngle / 2;
        const text = currentItems[i].length > 16
          ? currentItems[i].slice(0, 16) + "…"
          : currentItems[i];
        const fontSize = Math.max(11, Math.min(14, radius / currentItems.length * 1.5));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 2;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillText(text, radius - 10, 4);
        ctx.restore();
      }

      // Draw outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center hub
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

  // Motion animation effect — triggers when spinning becomes true
  useEffect(() => {
    if (!spinning || winnerIndex === null || items.length === 0) return;

    const fullRotations = 4 + Math.floor(Math.random() * 3); // 4-6 rotations
    const targetAngle = calculateStopAngle(rotationRef.current, winnerIndex, items.length, fullRotations);
    const duration = 4 + Math.random(); // 4-5 seconds

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
  // onSpinEnd is intentionally excluded — it should not restart animation when it changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, winnerIndex, items.length]);

  const canClick = !spinning && items.length > 0;

  const handleCanvasClick = () => {
    if (canClick) {
      onSpin();
    }
  };

  return (
    <div className="relative">
      {/* Pointer triangle at 12 o'clock — SVG with white fill and dark stroke */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 pointer-events-none z-10"
        width="24"
        height="26"
        viewBox="0 0 24 26"
        aria-hidden="true"
      >
        {/* Dark shadow/stroke triangle */}
        <polygon points="12,25 1,1 23,1" fill="#1a1a1a" />
        {/* White fill triangle */}
        <polygon points="12,23 3,2 21,2" fill="#ffffff" />
      </svg>

      <canvas
        ref={canvasRef}
        className={[
          "w-full aspect-square max-w-[min(70vh,700px)]",
          canClick ? "cursor-pointer" : items.length === 0 ? "cursor-default" : "cursor-not-allowed",
        ].join(" ")}
        onClick={handleCanvasClick}
        role="img"
        aria-label="Spinning wheel"
      />

      {/* Winner overlay */}
      {winner !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            className="px-6 py-3 rounded-xl animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: "oklch(0.55 0.18 240 / 0.85)" }}
          >
            <p className="text-sm font-semibold text-white/80 text-center">Winner!</p>
            <p className="text-xl font-semibold text-white text-center">{winner}</p>
          </div>
        </div>
      )}
    </div>
  );
}
