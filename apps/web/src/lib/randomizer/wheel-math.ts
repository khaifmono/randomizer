const SEGMENT_COLORS: readonly string[] = [
  "#e53935", // red
  "#1e88e5", // blue
  "#43a047", // green
  "#fdd835", // yellow
  "#e53935", // red
  "#1e88e5", // blue
  "#43a047", // green
  "#fdd835", // yellow
  "#e53935", // red
  "#1e88e5", // blue
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
