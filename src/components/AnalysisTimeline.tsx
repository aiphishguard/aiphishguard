import { Check, X, Clock, Loader2, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalysisStep } from '@/types/analysis';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AnalysisTimelineProps {
  steps: AnalysisStep[];
  className?: string;
}

const statusIcons = {
  pending: Clock,
  running: Loader2,
  completed: Check,
  failed: X,
  skipped: SkipForward,
};

const statusColors = {
  pending: 'text-muted-foreground bg-muted',
  running: 'text-primary bg-primary/10',
  completed: 'text-success bg-success/10',
  failed: 'text-destructive bg-destructive/10',
  skipped: 'text-muted-foreground bg-muted',
};

const resultColors = {
  pass: 'border-l-success',
  fail: 'border-l-destructive',
  warning: 'border-l-warning',
};

export function AnalysisTimeline({ steps, className }: AnalysisTimelineProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Analysis Timeline
      </h3>
      
      <Accordion type="single" collapsible className="space-y-2">
        {steps.map((step, index) => {
          const Icon = statusIcons[step.status];
          const isLast = index === steps.length - 1;
          
          return (
            <AccordionItem
              key={step.id}
              value={step.id}
              className={cn(
                "border rounded-lg bg-card/50 overflow-hidden",
                step.result && resultColors[step.result]
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30">
                <div className="flex items-center gap-3 w-full">
                  {/* Status Icon */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                    statusColors[step.status]
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      step.status === 'running' && "animate-spin"
                    )} />
                  </div>
                  
                  {/* Step Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{step.name}</span>
                      {step.result && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          step.result === 'pass' && "bg-success/10 text-success",
                          step.result === 'fail' && "bg-destructive/10 text-destructive",
                          step.result === 'warning' && "bg-warning/10 text-warning"
                        )}>
                          {step.result}
                        </span>
                      )}
                    </div>
                    {step.duration !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(step.duration)}
                      </span>
                    )}
                  </div>
                  
                  {/* Connection Line */}
                  {!isLast && (
                    <div className="absolute left-7 top-12 w-0.5 h-4 bg-border" />
                  )}
                </div>
              </AccordionTrigger>
              
              {step.details && (
                <AccordionContent className="px-4 pb-3">
                  <div className="ml-11 text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                    {step.details}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
