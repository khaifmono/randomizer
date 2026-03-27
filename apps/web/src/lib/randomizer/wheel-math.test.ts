import { describe, it, expect } from "vitest";
import { normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor } from "./wheel-math";

const PI = Math.PI;
const TWO_PI = 2 * PI;

describe("normalizeAngle", () => {
  it("returns 0 for 0", () => {
    expect(normalizeAngle(0)).toBeCloseTo(0, 10);
  });

  it("returns 0 for 2*PI (within float tolerance)", () => {
    expect(normalizeAngle(TWO_PI)).toBeCloseTo(0, 10);
  });

  it("returns 3*PI/2 for -PI/2", () => {
    expect(normalizeAngle(-PI / 2)).toBeCloseTo((3 * PI) / 2, 10);
  });

  it("returns PI for 7*PI", () => {
    expect(normalizeAngle(7 * PI)).toBeCloseTo(PI, 10);
  });

  it("returns PI/2 for 5*PI/2", () => {
    expect(normalizeAngle((5 * PI) / 2)).toBeCloseTo(PI / 2, 10);
  });
});

describe("calculateStopAngle", () => {
  for (let itemCount = 2; itemCount <= 10; itemCount++) {
    it(`places winner segment center at pointer (-PI/2) for ${itemCount} items`, () => {
      for (let winnerIndex = 0; winnerIndex < itemCount; winnerIndex++) {
        const currentRotation = 0;
        const fullRotations = 4;
        const stopAngle = calculateStopAngle(currentRotation, winnerIndex, itemCount, fullRotations);

        // The stop angle should be less than currentRotation (wheel spins forward = angle decreases)
        expect(stopAngle).toBeLessThan(currentRotation);

        // Verify: at stopAngle, the winner segment center aligns with the pointer at -PI/2
        // Segment i spans: [stopAngle + i*segAngle, stopAngle + (i+1)*segAngle]
        // Winner center: stopAngle + winnerIndex * segAngle + segAngle/2
        // Normalized, this should equal normalizeAngle(-PI/2) = 3*PI/2
        const segmentAngle = TWO_PI / itemCount;
        const winnerCenterAtStop = stopAngle + winnerIndex * segmentAngle + segmentAngle / 2;
        const normalizedCenter = normalizeAngle(winnerCenterAtStop);
        const pointerNormalized = normalizeAngle(-PI / 2); // = 3*PI/2
        expect(normalizedCenter).toBeCloseTo(pointerNormalized, 8);
      }
    });
  }

  it("returns a value less than currentRotation (wheel spins forward)", () => {
    const stopAngle = calculateStopAngle(0, 0, 4, 4);
    expect(stopAngle).toBeLessThan(0);
  });
});

describe("SEGMENT_COLORS", () => {
  it("is a 16-element array", () => {
    expect(SEGMENT_COLORS).toHaveLength(16);
  });

  it("has all unique colors", () => {
    const unique = new Set(SEGMENT_COLORS);
    expect(unique.size).toBe(16);
  });
});

describe("getSegmentColor", () => {
  it("returns SEGMENT_COLORS[0] for index 0", () => {
    expect(getSegmentColor(0)).toBe(SEGMENT_COLORS[0]);
  });

  it("returns SEGMENT_COLORS[9] for index 9", () => {
    expect(getSegmentColor(9)).toBe(SEGMENT_COLORS[9]);
  });

  it("cycles: index 16 returns SEGMENT_COLORS[0]", () => {
    expect(getSegmentColor(16)).toBe(SEGMENT_COLORS[0]);
  });

  it("cycles: index 17 returns SEGMENT_COLORS[1]", () => {
    expect(getSegmentColor(17)).toBe(SEGMENT_COLORS[1]);
  });
});
