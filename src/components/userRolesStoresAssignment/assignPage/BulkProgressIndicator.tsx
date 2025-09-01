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

interface BulkProgressIndicatorProps {
  assignmentSteps: AssignmentStep[];
  completedSteps: number;
  progressPercentage: number;
}

export const BulkProgressIndicator: React.FC<BulkProgressIndicatorProps> = ({
  assignmentSteps,
  completedSteps,
  progressPercentage,
}) => {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-card-foreground">Assignment Progress</span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {completedSteps} of {assignmentSteps.length} steps completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5 sm:h-2 bg-secondary" />
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
            {assignmentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                {step.completed ? (
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" style={{color: '#10b981'}} />
                ) : (
                  <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-muted bg-background" />
                )}
                <span className={`text-xs sm:text-sm ${step.completed ? 'font-medium' : 'text-muted-foreground'}`} style={{color: step.completed ? '#059669' : undefined}}>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.title.split(' ')[1] || step.title}</span>
                </span>
                {index < assignmentSteps.length - 1 && (
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground ml-1 sm:ml-2 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};