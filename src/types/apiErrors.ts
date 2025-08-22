// src/types/apiError.ts
export interface ApiFieldErrors {
  [field: string]: string | string[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string | number;
  fieldErrors?: ApiFieldErrors;
}
