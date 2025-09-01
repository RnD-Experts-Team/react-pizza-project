import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressIndicatorProps {
  assignmentSteps: AssignmentStep[];
  completedSteps: number;
  progressPercentage: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  assignmentSteps,
  completedSteps,
  progressPercentage,
}) => {
  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <span className="text-sm sm:text-base font-medium text-[var(--card-foreground)]">
              Assignment Progress
            </span>
            <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              {completedSteps} of {assignmentSteps.length} steps completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 sm:h-3" />
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2">
            {assignmentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 sm:gap-1 lg:gap-2">
                {step.completed ? (
                  <CheckCircle className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-[#10b981] flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 rounded-full border-2 border-[var(--muted)] flex-shrink-0" />
                )}
                <span className={`text-xs sm:text-[10px] lg:text-xs ${
                  step.completed ? 'text-[#059669]' : 'text-[var(--muted-foreground)]'
                } truncate`}>
                  {step.title}
                </span>
                {index < assignmentSteps.length - 1 && (
                  <ArrowRight className="h-3 w-3 sm:h-2 sm:w-2 lg:h-3 lg:w-3 text-[var(--muted-foreground)] ml-1 sm:ml-0 lg:ml-2 hidden sm:block flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};