import axios from 'axios';
import type {
  // ServiceClient,
  ServiceClientsResponse,
  ServiceClientResponse,
  CreateServiceClientResponse,
  RotateTokenResponse,
  CreateServiceClientForm,
  RotateTokenForm,
  ServiceClientsQueryParams,
} from '../types/serviceClient';

// Base API URL
const API_BASE_URL = 'https://auth.pnepizza.com/api/v1';

// Create axios instance with default config
const serviceClientApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to requests if available
serviceClientApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
serviceClientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const serviceClientService = {
  // Get all service clients with pagination and search
  getServiceClients: async (params: ServiceClientsQueryParams = {}): Promise<ServiceClientsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    
    const url = `/service-clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await serviceClientApi.get<ServiceClientsResponse>(url);
    return response.data;
  },

  // Create a new service client
  createServiceClient: async (data: CreateServiceClientForm): Promise<CreateServiceClientResponse> => {
    const response = await serviceClientApi.post<CreateServiceClientResponse>('/service-clients', data);
    return response.data;
  },

  // Rotate service client token
  rotateServiceToken: async (id: number, data: RotateTokenForm): Promise<RotateTokenResponse> => {
    const response = await serviceClientApi.post<RotateTokenResponse>(
      `/service-clients/${id}/rotate-token`,
      data
    );
    return response.data;
  },

  // Toggle service client status (active/inactive)
  toggleServiceStatus: async (id: number): Promise<ServiceClientResponse> => {
    const response = await serviceClientApi.post<ServiceClientResponse>(
      `/service-clients/${id}/toggle-status`
    );
    return response.data;
  },

  // Get single service client (if needed for future use)
  getServiceClient: async (id: number): Promise<ServiceClientResponse> => {
    const response = await serviceClientApi.get<ServiceClientResponse>(`/service-clients/${id}`);
    return response.data;
  },
};

export default serviceClientService;