import { Card, CardContent } from "@base-project/web/components/ui/card";
import { Textarea } from "@base-project/web/components/ui/textarea";
import { Users } from "lucide-react";

type TeamsNameEntryProps = {
  rawText: string;
  onChange: (text: string) => void;
  disabled?: boolean;
};

export function TeamsNameEntry({ rawText, onChange, disabled }: TeamsNameEntryProps) {
  const names = rawText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const n = names.length;

  return (
    <Card className="w-full border-2 border-border/60">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-teams-accent" />
          <span className="text-sm font-semibold">Participants</span>
          {n > 0 && (
            <span className="ml-auto text-xs font-medium bg-teams-accent/10 text-teams-accent px-2 py-0.5 rounded-full" data-testid="names-count">
              {n} name{n !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Textarea
          placeholder={"One name per line...\nAlice\nBob\nCharlie\nDana"}
          rows={5}
          value={rawText}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="resize-none"
        />
        {n === 0 && (
          <span className="text-xs text-muted-foreground" data-testid="names-count">
            0 names
          </span>
        )}
      </CardContent>
    </Card>
  );
}
