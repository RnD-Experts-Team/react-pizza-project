import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface BulkAssignmentResult {
  success: boolean;
  message: string;
  successCount?: number;
  failureCount?: number;
  details?: string[];
}

interface BulkAssignmentResultProps {
  result: BulkAssignmentResult | null;
}

export const BulkAssignmentResult: React.FC<BulkAssignmentResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <Alert
      className={`border-2 ${
        result.success
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      }`}
    >
      {result.success ? (
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      )}
      <AlertDescription
        className={`text-sm ${
          result.success
            ? 'text-green-800 dark:text-green-200'
            : 'text-red-800 dark:text-red-200'
        }`}
      >
        <div className="space-y-2">
          <div className="font-medium">{result.message}</div>
          
          {(result.successCount !== undefined || result.failureCount !== undefined) && (
            <div className="text-xs space-y-1">
              {result.successCount !== undefined && result.successCount > 0 && (
                <div className="text-green-700 dark:text-green-300">
                  ✓ {result.successCount} assignment{result.successCount !== 1 ? 's' : ''} completed successfully
                </div>
              )}
              {result.failureCount !== undefined && result.failureCount > 0 && (
                <div className="text-red-700 dark:text-red-300">
                  ✗ {result.failureCount} assignment{result.failureCount !== 1 ? 's' : ''} failed
                </div>
              )}
            </div>
          )}
          
          {result.details && result.details.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-medium opacity-80">Details:</div>
              <ul className="text-xs space-y-1 ml-4">
                {result.details.map((detail, index) => (
                  <li key={index} className="list-disc">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};