import React from 'react';
import RoleSelection from '../validateHierarchy/RoleSelection';
import MetadataSection from './MetadataSection';
import SubmitActions from './SubmitActions';

interface Role {
  id: number;
  name: string;
  permissions?: any[];
}

interface FormData {
  higher_role_id: string;
  lower_role_id: string;
  created_by: string;
  reason: string;
}

interface CreateHierarchyFormProps {
  formData: FormData;
  roles: Role[];
  rolesLoading: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  validationErrors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRoleChange: (field: 'higher_role_id' | 'lower_role_id', value: string) => void;
  onCancel: () => void;
}

const CreateHierarchyForm: React.FC<CreateHierarchyFormProps> = ({
  formData,
  roles,
  rolesLoading,
  isSubmitting,
  isLoading,
  validationErrors,
  onSubmit,
  onInputChange,
  onRoleChange,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      {/* Higher Role Selection */}
      <RoleSelection
        title="Higher Role"
        description="Select the role that will be higher in the hierarchy (parent role)"
        icon="crown"
        roles={roles}
        selectedRoleId={formData.higher_role_id}
        disabledRoleId={formData.lower_role_id}
        isLoading={rolesLoading}
        validationError={validationErrors.higher_role_id}
        onRoleChange={(value) => onRoleChange('higher_role_id', value)}
      />

      {/* Lower Role Selection */}
      <RoleSelection
        title="Lower Role"
        description="Select the role that will be lower in the hierarchy (child role)"
        icon="usercheck"
        roles={roles}
        selectedRoleId={formData.lower_role_id}
        disabledRoleId={formData.higher_role_id}
        isLoading={rolesLoading}
        validationError={validationErrors.lower_role_id}
        onRoleChange={(value) => onRoleChange('lower_role_id', value)}
      />

      {/* Metadata */}
      <MetadataSection
        createdBy={formData.created_by}
        reason={formData.reason}
        validationErrors={validationErrors}
        onInputChange={onInputChange}
      />

      {/* Submit Actions */}
      <SubmitActions
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        rolesLoading={rolesLoading}
        onCancel={onCancel}
      />
    </form>
  );
};

export default CreateHierarchyForm;