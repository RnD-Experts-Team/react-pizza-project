/**
 * Test Authorization Rule Path DSL Dialog
 * 
 * Simple dialog for testing if a test path matches a DSL pattern
 * Now supports entering custom DSL patterns for testing
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuthRulesForm } from '../hooks/useAuthRules';

interface AuthRuleTestDialogProps {
  pathDsl?: string;
  onClose: () => void;
}

export const AuthRuleTestDialog: React.FC<AuthRuleTestDialogProps> = ({
  pathDsl: initialPathDsl = '',
  onClose,
}) => {
  const { testRule, testResult, isTesting, clearTestResult } = useAuthRulesForm();
  const [pathDsl, setPathDsl] = useState(initialPathDsl);
  const [testPath, setTestPath] = useState('');

  const handleTest = async () => {
    if (!pathDsl.trim() || !testPath.trim()) return;
    
    await testRule({
      path_dsl: pathDsl.trim(),
      test_path: testPath.trim(),
    });
  };

  const handleClose = () => {
    clearTestResult();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent 
        className="w-[95vw] max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-realistic)'
        }}
      >
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle 
            className="text-lg sm:text-xl text-center sm:text-left"
            style={{ color: 'var(--foreground)' }}
          >
            Test Path DSL Pattern
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 px-1">
          {/* DSL Pattern Input */}
          <div className="space-y-2">
            <Label 
              className="text-sm sm:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              DSL Pattern
            </Label>
            <Textarea
              value={pathDsl}
              onChange={(e) => setPathDsl(e.target.value)}
              placeholder="/api/users/{id}/posts/*"
              className="font-mono text-xs sm:text-sm min-h-[3rem] sm:min-h-[4rem] resize-none"
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Test Path Input */}
          <div className="space-y-2">
            <Label 
              className="text-sm sm:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Test Path
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="/api/users/123/posts/456"
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                className="text-xs sm:text-sm font-mono flex-1"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
              <Button 
                onClick={handleTest} 
                disabled={!pathDsl.trim() || !testPath.trim() || isTesting}
                size="sm"
                className="w-full sm:w-auto min-w-[4rem] text-sm"
                style={{
                  backgroundColor: (!pathDsl.trim() || !testPath.trim() || isTesting) ? 'var(--muted)' : 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  opacity: (!pathDsl.trim() || !testPath.trim() || isTesting) ? 0.6 : 1
                }}
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--primary-foreground)' }} />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div 
              className="space-y-3 p-3 sm:p-4 border rounded-md"
              style={{
                backgroundColor: 'var(--muted)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center gap-2">
                {testResult.matches ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" style={{ color: 'var(--chart-2)' }} />
                ) : (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" style={{ color: 'var(--destructive)' }} />
                )}
                <span 
                  className="font-medium text-sm sm:text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  {testResult.matches ? 'Pattern Matches!' : 'No Match'}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Generated Regex:
                  </span>
                  <div 
                    className="font-mono text-xs sm:text-sm p-2 sm:p-3 rounded mt-1 break-all"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    {testResult.path_regex}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Compilation:
                  </span>
                  <Badge 
                    variant={testResult.compiled_successfully ? 'default' : 'destructive'}
                    className="text-xs w-fit"
                    style={{
                       backgroundColor: testResult.compiled_successfully ? 'var(--primary)' : 'var(--destructive)',
                       color: testResult.compiled_successfully ? 'var(--primary-foreground)' : 'var(--destructive-foreground)'
                     }}
                  >
                    {testResult.compiled_successfully ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 sm:pt-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto min-w-[5rem] text-sm"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                borderColor: 'var(--border)'
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
