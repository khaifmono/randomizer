const SEGMENT_COLORS: readonly string[] = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#3b82f6",
  "#f97316",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
];

function normalizeAngle(angle: number): number {
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function calculateStopAngle(
  currentRotation: number,
  winnerIndex: number,
  itemCount: number,
  fullRotations: number,
): number {
  const segmentAngle = (2 * Math.PI) / itemCount;
  const winnerCenter = winnerIndex * segmentAngle + segmentAngle / 2;
  const rawStop = -Math.PI / 2 - winnerCenter;
  const targetAngle = currentRotation - fullRotations * 2 * Math.PI + rawStop;
  return targetAngle;
}

function getSegmentColor(index: number): string {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length];
}

export { normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor };
