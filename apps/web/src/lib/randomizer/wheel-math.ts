const SEGMENT_COLORS: readonly string[] = [
  "#e53935", // red
  "#1e88e5", // blue
  "#43a047", // green
  "#fdd835", // yellow
  "#8e24aa", // purple
  "#fb8c00", // orange
  "#00acc1", // teal
  "#d81b60", // pink
  "#7cb342", // lime
  "#5c6bc0", // indigo
  "#f4511e", // deep orange
  "#00897b", // dark teal
  "#c0ca33", // yellow-green
  "#3949ab", // dark blue
  "#e91e63", // hot pink
  "#009688", // cyan
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
