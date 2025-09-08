import { z } from 'zod';

// Base user validation fields
const baseUserFields = {
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(255, 'Email address must not exceed 255 characters'),
  
  roles: z.array(z.string()),
  permissions: z.array(z.string())
};

// Password validation for create user (required)
const requiredPasswordFields = {
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  password_confirmation: z
    .string()
    .min(1, 'Please confirm your password'),
};

// Password validation for edit user (optional)
const optionalPasswordFields = {
  password: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty password
      return val.length >= 8;
    }, 'Password must be at least 8 characters')
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return val.length <= 128;
    }, 'Password must not exceed 128 characters')
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val);
    }, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  password_confirmation: z
    .string()
    .optional(),
};

// Create User Schema (password required)
export const createUserFormSchema = z.object({
  ...baseUserFields,
  ...requiredPasswordFields
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

// Edit User Schema (password optional)
export const editUserFormSchema = z.object({
  ...baseUserFields,
  ...optionalPasswordFields
}).refine((data) => {
  // Only validate password confirmation if password is provided
  if (data.password && data.password.trim() !== '') {
    return data.password === data.password_confirmation;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

// Type definitions
export type CreateUserFormType = z.infer<typeof createUserFormSchema>;
export type EditUserFormType = z.infer<typeof editUserFormSchema>;

// Common user form data interface
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  roles: string[];
  permissions: string[];
}

// Role and Permission interfaces
export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

// Pagination info interface
export interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Form submission data interfaces
export interface CreateUserSubmissionData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[];
  permissions: string[];
}

export interface EditUserSubmissionData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  roles: string[];
  permissions: string[];
}