// Auth Rule Types and Interfaces

export interface AuthRule {
  id: number;
  service: string;
  method: string;
  path_dsl: string | null;
  path_regex: string | null;
  route_name: string | null;
  roles_any: string[] | null;
  permissions_any: string[] | null;
  permissions_all: string[] | null;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AuthRulesResponse {
  success: boolean;
  data: {
    current_page: number;
    data: AuthRule[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CreateAuthRulePathDSLRequest {
  service: string;
  method: string;
  path_dsl: string;
  permissions_any?: string[];
  permissions_all?: string[];
  roles_any?: string[];
  priority: number;
  is_active: boolean;
}

export interface CreateAuthRuleRouteNameRequest {
  service: string;
  method: string;
  route_name: string;
  permissions_any?: string[];
  permissions_all?: string[];
  roles_any?: string[];
  priority: number;
  is_active: boolean;
}

export interface CreateAuthRuleResponse {
  success: boolean;
  message: string;
  data: {
    rule: AuthRule;
  };
}

export interface TestAuthRuleRequest {
  path_dsl: string;
  test_path: string;
}

export interface TestAuthRuleResponse {
  success: boolean;
  data: {
    path_dsl: string;
    path_regex: string;
    test_path: string;
    matches: boolean;
    compiled_successfully: boolean;
  };
}

export interface ToggleAuthRuleStatusResponse {
  success: boolean;
  message: string;
  data: {
    rule: AuthRule;
  };
}

export interface AuthRulesFilters {
  service?: string;
  search?: string;
  page?: number;
}

export type CreateAuthRuleRequest = CreateAuthRulePathDSLRequest | CreateAuthRuleRouteNameRequest;

export interface AuthRuleFormData {
  service: string;
  method: string;
  path_dsl?: string;
  route_name?: string;
  permissions_any: string[];
  permissions_all: string[];
  roles_any: string[];
  priority: number;
  is_active: boolean;
  rule_type: 'path_dsl' | 'route_name';
}