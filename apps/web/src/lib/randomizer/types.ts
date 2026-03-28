type HistoryEntry = {
  id: number;
  label: string;
  timestamp: number;
};

type TabId = "wheel" | "dice" | "coin" | "number" | "teams" | "bracket";

export type { HistoryEntry, TabId };
