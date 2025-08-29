/**
 * Validate Hierarchy Page
 * 
 * Page for validating if a specific role hierarchy relationship exists for a store.
 * Users can select higher and lower roles to check if the hierarchy exists,
 * then create or remove it based on the validation result.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStoreHierarchy, useHierarchyTree } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Crown,
  UserCheck,
  Shield,
  Search,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ValidateHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { roles, loading: rolesLoading } = useRoles();
  
  // Use hierarchy hooks for validation
  const { hierarchies, isLoading: hierarchiesLoading, error: hierarchiesError } = useStoreHierarchy(storeId);
  const { tree, utils: treeUtils, isLoading: treeLoading, error: treeError } = useHierarchyTree(storeId);
  
  // Form state
  const [formData, setFormData] = useState<{
    higher_role_id: string;
    lower_role_id: string;
  }>({
    higher_role_id: '',
    lower_role_id: ''
  });
  
  // Validation state
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    valid: boolean;
    errors: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleBack = () => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  const handleRoleChange = (field: 'higher_role_id' | 'lower_role_id', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear previous validation result when roles change
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.higher_role_id) {
      errors.higher_role_id = 'Please select a higher role';
    }
    
    if (!formData.lower_role_id) {
      errors.lower_role_id = 'Please select a lower role';
    }
    
    if (formData.higher_role_id === formData.lower_role_id && formData.higher_role_id) {
      errors.lower_role_id = 'Higher role and lower role cannot be the same';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleValidate = async () => {
    if (!validateForm()) {
      return;
    }

    if (!storeId) {
      setValidationErrors({ general: 'Store ID is required' });
      return;
    }

    setIsValidating(true);
    
    try {
      const higherRoleId = parseInt(formData.higher_role_id);
      const lowerRoleId = parseInt(formData.lower_role_id);
      
      // Check if hierarchy relationship exists using the fetched hierarchies
      const hierarchyExists = hierarchies.some(hierarchy => 
        hierarchy.higher_role_id === higherRoleId && 
        hierarchy.lower_role_id === lowerRoleId
      );
      
      // Additional validation using tree utilities
      let additionalValidation: string[] = [];
      
      if (treeUtils && tree.length > 0) {
        // Check if the roles exist in the tree
        const higherRoleNode = treeUtils.findNodeByRoleId(higherRoleId);
        const lowerRoleNode = treeUtils.findNodeByRoleId(lowerRoleId);
        
        if (!higherRoleNode) {
          additionalValidation.push(`Higher role (ID: ${higherRoleId}) not found in hierarchy tree`);
        }
        
        if (!lowerRoleNode) {
          additionalValidation.push(`Lower role (ID: ${lowerRoleId}) not found in hierarchy tree`);
        }
        
        // Check if there's already a path between these roles
        if (higherRoleNode && lowerRoleNode) {
          const pathToLowerRole = treeUtils.getPathToRole(lowerRoleId);
          const isAlreadyConnected = pathToLowerRole.some(node => node.role.id === higherRoleId);
          
          if (isAlreadyConnected && !hierarchyExists) {
            additionalValidation.push('Roles are already connected through an indirect hierarchy path');
          }
        }
        
        // Validate overall hierarchy structure
        const hierarchyValidation = treeUtils.validateHierarchy();
        if (!hierarchyValidation.isValid) {
          additionalValidation.push(...hierarchyValidation.errors);
        }
      }
      
      if (hierarchyExists) {
        setValidationResult({
          success: true,
          valid: true,
          errors: ['This hierarchy relationship already exists', ...additionalValidation]
        });
      } else {
        setValidationResult({
          success: false,
          valid: false,
          errors: additionalValidation
        });
      }
    } catch (error) {
      console.error('Failed to validate hierarchy:', error);
      setValidationErrors({ general: 'Failed to validate hierarchy. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateHierarchy = () => {
    navigate(`/stores-hierarchy/${storeId}/create-hierarchy`, {
      state: {
        preselectedHigherRole: formData.higher_role_id,
        preselectedLowerRole: formData.lower_role_id
      }
    });
  };

  const handleRemoveHierarchy = () => {
    // Navigate to delete confirmation page with the validated hierarchy data
    navigate(`/stores-hierarchy/${storeId}/delete-confirmation`, {
      state: {
        preselectedHigherRole: formData.higher_role_id,
        preselectedLowerRole: formData.lower_role_id,
        validatedHierarchy: {
          higher_role_id: parseInt(formData.higher_role_id),
          lower_role_id: parseInt(formData.lower_role_id),
          store_id: storeId
        }
      }
    });
  };

  // Clear validation errors when form data changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [formData]);

  if (!storeId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Store ID is required to validate hierarchy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 ">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2 hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
              <span>Validate Hierarchy</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Check if a role hierarchy exists for store: <span className="font-mono">{storeId}</span>
              {hierarchies.length > 0 && (
                <span className="ml-2 text-sm text-green-600">
                  ({hierarchies.length} existing hierarchies loaded)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Error Alerts */}
        {validationErrors.general && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              {validationErrors.general}
            </AlertDescription>
          </Alert>
        )}
        
        {hierarchiesError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              Failed to load hierarchies: {hierarchiesError?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}
        
        {treeError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              Failed to load hierarchy tree: {treeError?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {/* Role Selection Form */}
        <div className="space-y-6">
          {/* Higher Role Selection */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                <span>Higher Role</span>
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select the role that should be higher in the hierarchy (parent role)
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {rolesLoading || hierarchiesLoading || treeLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                  <span className="text-sm sm:text-base text-muted-foreground">Loading roles and hierarchy data...</span>
                </div>
              ) : (
                <RadioGroup
                  value={formData.higher_role_id}
                  onValueChange={(value) => handleRoleChange('higher_role_id', value)}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={role.id.toString()}
                        id={`higher-role-${role.id}`}
                        disabled={formData.lower_role_id === role.id.toString()}
                      />
                      <Label
                        htmlFor={`higher-role-${role.id}`}
                        className={cn(
                          "text-sm sm:text-base font-medium leading-none cursor-pointer",
                          formData.lower_role_id === role.id.toString() && "text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {role.name}
                        {role.permissions && role.permissions.length > 0 && (
                          <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                            ({role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {validationErrors.higher_role_id && (
                <p className="text-sm text-destructive mt-2">{validationErrors.higher_role_id}</p>
              )}
            </CardContent>
          </Card>

          {/* Lower Role Selection */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>Lower Role</span>
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select the role that should be lower in the hierarchy (child role)
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {rolesLoading || hierarchiesLoading || treeLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                  <span className="text-sm sm:text-base text-muted-foreground">Loading roles and hierarchy data...</span>
                </div>
              ) : (
                <RadioGroup
                  value={formData.lower_role_id}
                  onValueChange={(value) => handleRoleChange('lower_role_id', value)}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={role.id.toString()}
                        id={`lower-role-${role.id}`}
                        disabled={formData.higher_role_id === role.id.toString()}
                      />
                      <Label
                        htmlFor={`lower-role-${role.id}`}
                        className={cn(
                          "text-sm sm:text-base font-medium leading-none cursor-pointer",
                          formData.higher_role_id === role.id.toString() && "text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {role.name}
                        {role.permissions && role.permissions.length > 0 && (
                          <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                            ({role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {validationErrors.lower_role_id && (
                <p className="text-sm text-destructive mt-2">{validationErrors.lower_role_id}</p>
              )}
            </CardContent>
          </Card>

          {/* Validation Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Button 
                  onClick={handleValidate}
                  disabled={isValidating || rolesLoading || hierarchiesLoading || treeLoading || !formData.higher_role_id || !formData.lower_role_id}
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
                        onClick={handleRemoveHierarchy}
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
                        {hierarchies.length > 0 && (
                          <span className="block mt-1 text-sm">
                            Checked against {hierarchies.length} existing hierarchy relationships.
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
                        onClick={handleCreateHierarchy}
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
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto text-sm sm:text-base hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Hierarchy</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidateHierarchyPage;