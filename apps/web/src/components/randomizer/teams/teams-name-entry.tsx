import { Card, CardContent } from "@base-project/web/components/ui/card";
import { Label } from "@base-project/web/components/ui/label";
import { Textarea } from "@base-project/web/components/ui/textarea";

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
    <Card className="w-full">
      <CardContent className="p-4 space-y-3">
        <Label className="text-sm font-semibold">Names</Label>
        <Textarea
          placeholder="One name per line..."
          rows={6}
          value={rawText}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <span className="text-xs text-muted-foreground" data-testid="names-count">
          {n} name{n !== 1 ? "s" : ""}
        </span>
      </CardContent>
    </Card>
  );
}
