import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaseTimeline({
  stages,
  currentStage,
}: {
  stages: string[];
  currentStage: string;
}) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <ol className="flex flex-col gap-6 sm:flex-row sm:gap-0">
      {stages.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={stage} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
            <div className="flex items-center gap-3 sm:flex-col sm:items-center">
              <span
                className={cn(
                  "timeline-step relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isComplete && "border-success bg-success text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-border text-muted-foreground"
                )}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {isCurrent && (
                  <span
                    className="pulse-ring absolute inset-0 rounded-full border-2 border-primary"
                    aria-hidden
                  />
                )}
                {isComplete ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
              </span>
              {index < stages.length - 1 && (
                <span
                  className="relative h-px flex-1 overflow-hidden bg-border sm:mt-4 sm:h-0.5 sm:w-full"
                  aria-hidden
                >
                  {isComplete && (
                    <span
                      className="timeline-line-fill absolute inset-0 bg-success"
                      style={{ animationDelay: `${index * 120 + 150}ms` }}
                    />
                  )}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-sm transition-colors duration-500",
                isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {stage}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
