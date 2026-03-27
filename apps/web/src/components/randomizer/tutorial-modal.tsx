import { useState } from "react";
import { Button } from "@base-project/web/components/ui/button";
import { HelpCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

type TutorialStep = {
  title: string;
  description: string;
  illustration: React.ReactNode;
};

type TutorialModalProps = {
  toolName: string;
  accentColor: string;
  steps: TutorialStep[];
};

export function TutorialButton({ toolName, accentColor, steps }: TutorialModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  function handleOpen() {
    setCurrentStep(0);
    setOpen(true);
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={handleOpen}
      >
        <HelpCircle className="h-4 w-4" />
        How to use
      </Button>
    );
  }

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] md:max-h-[85vh] bg-background rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h2 className="text-lg font-bold">How to use {toolName}</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Illustration */}
          <div
            className="rounded-xl p-8 flex items-center justify-center mb-6"
            style={{ backgroundColor: `${accentColor}10` }}
          >
            {step.illustration}
          </div>

          {/* Step info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            disabled={isFirst}
            onClick={() => setCurrentStep((s) => s - 1)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i === currentStep ? accentColor : "#d1d5db",
                  transform: i === currentStep ? "scale(1.3)" : "scale(1)",
                }}
                onClick={() => setCurrentStep(i)}
              />
            ))}
          </div>

          {isLast ? (
            <Button
              size="sm"
              onClick={() => setOpen(false)}
              style={{ backgroundColor: accentColor }}
              className="text-white hover:opacity-90"
            >
              Got it!
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
