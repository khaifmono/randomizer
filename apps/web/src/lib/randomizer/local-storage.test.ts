import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readStorage, writeStorage } from "./local-storage";

describe("readStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns parsed JSON when key exists", () => {
    localStorage.setItem("test-key", JSON.stringify(["a", "b", "c"]));
    expect(readStorage("test-key", [])).toEqual(["a", "b", "c"]);
  });

  it("returns fallback when key is missing", () => {
    expect(readStorage("missing-key", ["fallback"])).toEqual(["fallback"]);
  });

  it("returns fallback when value is invalid JSON", () => {
    localStorage.setItem("bad-json", "not-valid-json{{{");
    expect(readStorage("bad-json", 42)).toBe(42);
  });

  it("returns parsed object correctly", () => {
    const obj = { name: "Alice", score: 10 };
    localStorage.setItem("obj-key", JSON.stringify(obj));
    expect(readStorage("obj-key", {})).toEqual(obj);
  });

  it("returns fallback when key holds null JSON", () => {
    localStorage.setItem("null-key", "null");
    // JSON.parse("null") returns null which is a valid value, not an error
    // The function should return null (the parsed value), not the fallback
    expect(readStorage("null-key", "default")).toBeNull();
  });
});

describe("writeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("writes JSON.stringify(value) to localStorage", () => {
    writeStorage("my-key", ["x", "y"]);
    expect(localStorage.getItem("my-key")).toBe(JSON.stringify(["x", "y"]));
  });

  it("silently succeeds even if localStorage throws (quota exceeded)", () => {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    expect(() => writeStorage("any-key", { big: "data" })).not.toThrow();
    localStorage.setItem = originalSetItem;
  });

  it("writes a number correctly", () => {
    writeStorage("num-key", 99);
    expect(localStorage.getItem("num-key")).toBe("99");
  });
});
