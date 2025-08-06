const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class RealApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on ' + API_BASE_URL);
      }
      throw error;
    }
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    this.token = response.token;
    localStorage.setItem('auth_token', this.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('auth_token', this.token);
    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async generateSinglePrompt(data: any) {
    return await this.request('/generation/single', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateAgenticWorkflow(data: any) {
    return await this.request('/generation/agentic', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGenerationHistory(page = 1, limit = 10) {
    return await this.request(`/generation/history?page=${page}&limit=${limit}`);
  }

  async getUserStats() {
    return await this.request('/user/stats');
  }

  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    return await this.request('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId, successUrl, cancelUrl }),
    });
  }

  async createPortalSession(returnUrl: string) {
    return await this.request('/billing/create-portal-session', {
      method: 'POST',
      body: JSON.stringify({ returnUrl }),
    });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default new RealApiService();
