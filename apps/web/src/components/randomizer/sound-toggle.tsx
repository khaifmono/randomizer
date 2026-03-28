import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, playClick } from "@base-project/web/lib/randomizer/sounds";

export function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playClick(); // play a click when unmuting as feedback
  }

  return (
    <button
      onClick={toggle}
      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      title={muted ? "Unmute sounds" : "Mute sounds"}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
