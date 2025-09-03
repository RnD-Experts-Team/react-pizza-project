import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PathConfigurationSectionProps {
  pathType: 'dsl' | 'route';
  pathDsl: string;
  routeName: string;
  onPathTypeChange: (value: string) => void;
  onPathDslChange: (value: string) => void;
  onRouteNameChange: (value: string) => void;
  onTestClick: () => void;
  getFieldError: (field: string) => string | undefined;
}

export const PathConfigurationSection: React.FC<PathConfigurationSectionProps> = ({
  pathType,
  pathDsl,
  routeName,
  onPathTypeChange,
  onPathDslChange,
  onRouteNameChange,
  onTestClick,
  getFieldError,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Label className="text-sm sm:text-base font-medium">Path Configuration *</Label>
      <Tabs value={pathType} onValueChange={onPathTypeChange}>
        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
          <TabsTrigger value="dsl" className="text-xs sm:text-sm">
            Path DSL
          </TabsTrigger>
          <TabsTrigger value="route" className="text-xs sm:text-sm">
            Route Name
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dsl" className="mt-3 sm:mt-4">
          <div className="space-y-2">
            <Label htmlFor="pathDsl" className="text-sm sm:text-base">
              Path DSL Pattern
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea
                id="pathDsl"
                value={pathDsl}
                onChange={(e) => onPathDslChange(e.target.value)}
                placeholder="/api/users/{id}/posts/*"
                className={`text-sm font-mono min-h-[2.5rem] sm:min-h-[3rem] flex-1 ${
                  getFieldError('pathDsl') ? 'border-red-500' : ''
                }`}
              />
              {pathDsl.trim() && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-sm"
                  onClick={onTestClick}
                >
                  Test
                </Button>
              )}
            </div>
            {getFieldError('pathDsl') && (
              <p className="text-xs sm:text-sm text-red-500">
                {getFieldError('pathDsl')}
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="route" className="mt-3 sm:mt-4">
          <div className="space-y-2">
            <Label htmlFor="routeName" className="text-sm sm:text-base">
              Route Name
            </Label>
            <Input
              id="routeName"
              value={routeName}
              onChange={(e) => onRouteNameChange(e.target.value)}
              placeholder="users.posts.index"
              className={`text-sm sm:text-base ${
                getFieldError('routeName') ? 'border-red-500' : ''
              }`}
            />
            {getFieldError('routeName') && (
              <p className="text-xs sm:text-sm text-red-500">
                {getFieldError('routeName')}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};