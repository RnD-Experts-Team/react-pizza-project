import type {
  AuthRulesResponse,
  CreateAuthRulePathDSLRequest,
  CreateAuthRuleRouteNameRequest,
  CreateAuthRuleResponse,
  TestAuthRuleRequest,
  TestAuthRuleResponse,
  ToggleAuthRuleStatusResponse,
  AuthRulesFilters,
} from '../types/authRules';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = 'https://auth.pnepizza.com/api/v1';

class AuthRulesService {
  private getAuthHeaders(): HeadersInit {
    const token = tokenStorage.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Network error occurred'
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Get all authorization rules with optional filters
   */
  async getAllAuthRules(filters: AuthRulesFilters = {}): Promise<AuthRulesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.service) queryParams.append('service', filters.service);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());

    const url = `${API_BASE_URL}/auth-rules${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AuthRulesResponse>(response);
  }

  /**
   * Create authorization rule using Path DSL
   */
  async createAuthRulePathDSL(data: CreateAuthRulePathDSLRequest): Promise<CreateAuthRuleResponse> {
    const response = await fetch(`${API_BASE_URL}/auth-rules`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<CreateAuthRuleResponse>(response);
  }

  /**
   * Create authorization rule using Route Name
   */
  async createAuthRuleRouteName(data: CreateAuthRuleRouteNameRequest): Promise<CreateAuthRuleResponse> {
    const response = await fetch(`${API_BASE_URL}/auth-rules`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<CreateAuthRuleResponse>(response);
  }

  /**
   * Test authorization rule path matching
   */
  async testAuthRule(data: TestAuthRuleRequest): Promise<TestAuthRuleResponse> {
    const response = await fetch(`${API_BASE_URL}/auth-rules/test`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<TestAuthRuleResponse>(response);
  }

  /**
   * Toggle authorization rule status (active/inactive)
   */
  async toggleAuthRuleStatus(ruleId: number): Promise<ToggleAuthRuleStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/auth-rules/${ruleId}/toggle-status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenStorage.getToken()}`,
        'Accept': 'application/json',
      },
    });

    return this.handleResponse<ToggleAuthRuleStatusResponse>(response);
  }
}

export const authRulesService = new AuthRulesService();
export default authRulesService;