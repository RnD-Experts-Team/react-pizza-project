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
import { useAuthRulesForm } from '../../features/authorizationRules/hooks/useAuthRules';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Test Path DSL Pattern</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* DSL Pattern Input */}
          <div>
            <Label>DSL Pattern</Label>
            <Textarea
              value={pathDsl}
              onChange={(e) => setPathDsl(e.target.value)}
              placeholder="/api/users/{id}/posts/*"
              className="mt-1 font-mono text-sm"
            />
          </div>

          {/* Test Path Input */}
          <div>
            <Label>Test Path</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="/api/users/123/posts/456"
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
              />
              <Button 
                onClick={handleTest} 
                disabled={!pathDsl.trim() || !testPath.trim() || isTesting}
                size="sm"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="space-y-3 p-3 border rounded-md">
              <div className="flex items-center gap-2">
                {testResult.matches ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {testResult.matches ? 'Pattern Matches!' : 'No Match'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Generated Regex:</span>
                  <div className="font-mono bg-gray-50 p-1 rounded mt-1">
                    {testResult.path_regex}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Compilation:</span>
                  <Badge variant={testResult.compiled_successfully ? 'default' : 'destructive'}>
                    {testResult.compiled_successfully ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
