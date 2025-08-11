const API_BASE_URL = 'http://localhost:8000';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API calls with error handling
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const apiService = {
  // Dashboard API
  async getDashboardMetrics(timeframe: string = '30d', region?: string) {
    const params = new URLSearchParams({ timeframe });
    if (region) params.append('region', region);
    
    return apiCall(`/api/dashboard/metrics?${params}`);
  },

  // Products API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category && params.category !== '') searchParams.append('category', params.category);
    if (params?.search && params.search !== '') searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sort_by', params.sortBy);

    return apiCall(`/api/products?${searchParams}`);
  },

  async createProduct(productData: {
    name: string;
    category: string;
    ingredients: string[];
    targetDemographic: string;
    region: string;
    description?: string;
  }) {
    return apiCall('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Market Trends API
  async getMarketTrends(region?: string, category?: string) {
    const params = new URLSearchParams();
    if (region && region !== '') params.append('region', region);
    if (category && category !== '') params.append('category', category);

    return apiCall(`/api/market-trends?${params}`);
  },

  // Product Analysis API
  async analyzeProduct(productConcept: {
    name: string;
    category: string;
    ingredients: string[];
    region: string;
  }) {
    return apiCall('/api/analyze-product', {
      method: 'POST',
      body: JSON.stringify(productConcept),
    });
  },

  // Competitors API
  async getCompetitors(category?: string) {
    const params = new URLSearchParams();
    if (category && category !== '') params.append('category', category);

    return apiCall(`/api/competitors?${params}`);
  },

  // Health check
  async healthCheck() {
    return apiCall('/health');
  },
};

// Export for backward compatibility
export default apiService;