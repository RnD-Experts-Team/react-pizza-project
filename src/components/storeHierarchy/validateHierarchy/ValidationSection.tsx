import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  Loader2, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2 
} from 'lucide-react';

interface ValidationResult {
  success: boolean;
  valid: boolean;
  errors: string[];
}

interface ValidationSectionProps {
  isValidating: boolean;
  isLoading: boolean;
  canValidate: boolean;
  validationResult: ValidationResult | null;
  hierarchiesCount: number;
  onValidate: () => void;
  onCreateHierarchy: () => void;
  onRemoveHierarchy: () => void;
}

const ValidationSection: React.FC<ValidationSectionProps> = ({
  isValidating,
  isLoading,
  canValidate,
  validationResult,
  hierarchiesCount,
  onValidate,
  onCreateHierarchy,
  onRemoveHierarchy
}) => {
  return (
    <>
      {/* Validation Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button 
              onClick={onValidate}
              disabled={isValidating || isLoading || !canValidate}
              className="min-w-[200px] px-6 sm:px-8 py-2 text-sm sm:text-base w-full sm:w-auto"
              size="lg"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="hidden sm:inline">Validating...</span>
                  <span className="sm:hidden">Validating</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Validate Hierarchy</span>
                  <span className="sm:hidden">Validate</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              {validationResult.success ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              )}
              <span>Validation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {validationResult.success ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Hierarchy relationship found: This hierarchy already exists for this store.
                  </AlertDescription>
                </Alert>
                
                {validationResult.errors && validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Validation Details:</h4>
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} variant={index === 0 ? "default" : "destructive"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={onRemoveHierarchy}
                    variant="destructive"
                    className="min-w-[200px]"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Hierarchy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Hierarchy relationship not found: This hierarchy does not exist for this store.
                    {hierarchiesCount > 0 && (
                      <span className="block mt-1 text-sm">
                        Checked against {hierarchiesCount} existing hierarchy relationships.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
                
                {validationResult.errors && validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Additional Validation Notes:</h4>
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} variant="default">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={onCreateHierarchy}
                    className="min-w-[200px]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Hierarchy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ValidationSection;