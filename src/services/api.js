// src/services/api.js
export const API_BASE_URL = 'http://192.168.5.87:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para obter headers com token
  getHeaders(token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Pegar token do localStorage se não foi fornecido
    const authToken = token || localStorage.getItem('token');
    
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = options.token || localStorage.getItem('token');
    
    const config = {
      headers: this.getHeaders(token),
      ...options,
    };

    // Remove token das options para não interferir no fetch
    delete config.token;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro na requisição: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`Erro na API (${endpoint}):`, error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos de tickets gerais
  async getTickets(params = {}) {
    const queryString = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key]) {
        queryString.append(key, params[key]);
      }
    });

    const endpoint = `/tickets${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getTicket(id, token = null) {
    return this.request(`/tickets/${id}`, { token });
  }

  async createTicket(formData, token = null) {
    const url = `${this.baseURL}/tickets`;
    const authToken = token || localStorage.getItem('token');
    
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData, // FormData para upload de arquivos
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar ticket');
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      throw error;
    }
  }

  async updateTicketStatus(id, status, token = null) {
    return this.request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    });
  }

  // Métodos específicos para empresas
  async getAvailableTickets(token = null) {
    return this.request('/tickets/available', { token });
  }

  async getAssignedTickets(token = null) {
    return this.request('/tickets/assigned', { token });
  }

  async assumeTicket(id, token = null) {
    return this.request(`/tickets/${id}/assume`, {
      method: 'PATCH',
      token,
    });
  }
}

// Exportar instância única
const api = new ApiService();
export default api;