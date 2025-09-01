import React from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AssignmentResultProps {
  result: {
    success: boolean;
    message: string;
  } | null;
}

export const AssignmentResult: React.FC<AssignmentResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <Alert className={`px-4 sm:px-6 py-3 sm:py-4 ${
      result.success 
        ? 'border-[#10b981] bg-[#dcfce7]' 
        : 'border-[#ef4444] bg-[#fef2f2]'
    } dark:${
      result.success 
        ? 'border-[#059669] bg-[#064e3b]' 
        : 'border-[#dc2626] bg-[#7f1d1d]'
    }`}>
      {result.success ? (
        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#059669] flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#dc2626] flex-shrink-0" />
      )}
      <AlertDescription className={`text-sm sm:text-base ${
        result.success 
          ? 'text-[#065f46]' 
          : 'text-[#991b1b]'
      } dark:${
        result.success 
          ? 'text-[#10b981]' 
          : 'text-[#f87171]'
      } ml-2`}>
        {result.message}
      </AlertDescription>
    </Alert>
  );
};