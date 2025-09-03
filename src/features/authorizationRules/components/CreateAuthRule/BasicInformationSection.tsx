import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HttpMethod } from '@/features/authorizationRules/types';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

interface BasicInformationSectionProps {
  service: string;
  method: HttpMethod;
  onServiceChange: (value: string) => void;
  onMethodChange: (value: HttpMethod) => void;
  getFieldError: (field: string) => string | undefined;
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  service,
  method,
  onServiceChange,
  onMethodChange,
  getFieldError,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="service" className="text-sm sm:text-base font-medium">
              Service *
            </Label>
            <Input
              id="service"
              value={service}
              onChange={(e) => onServiceChange(e.target.value)}
              placeholder="e.g., data, auth, api"
              className={`text-sm sm:text-base ${
                getFieldError('service') ? 'border-red-500' : ''
              }`}
            />
            {getFieldError('service') && (
              <p className="text-xs sm:text-sm text-red-500">
                {getFieldError('service')}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="method" className="text-sm sm:text-base font-medium">
              HTTP Method *
            </Label>
            <select
              id="method"
              value={method}
              onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
              className={`flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-sm ring-offset-background ${
                getFieldError('method') ? 'border-red-500' : ''
              }`}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {getFieldError('method') && (
              <p className="text-xs sm:text-sm text-red-500">
                {getFieldError('method')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};