/**
 * API Service for communicating with the backend
 * 
 * This service handles all HTTP requests to the backend API.
 * Update VITE_API_URL in your .env.local file to point to your backend.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        // Handle 401 (unauthorized) - token expired or invalid
        if (response.status === 401) {
          this.removeToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || `API Error: ${response.statusText}`);
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // ==================== AUTH ====================
  
  async login(email: string, password: string, role: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    // Note: The response structure might need adjustment based on your backend
    if ('token' in response) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(name: string, email: string, password: string, role: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    
    if ('token' in response) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  logout(): void {
    this.removeToken();
  }

  // ==================== CLIENTS ====================
  
  async getClients() {
    return this.request<any[]>('/clients');
  }

  async getClient(id: string) {
    return this.request<any>(`/clients/${id}`);
  }

  async createClient(client: any) {
    return this.request<any>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: string, updates: any) {
    return this.request<any>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteClient(id: string) {
    return this.request<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== SPACES ====================
  
  async getSpaces() {
    return this.request<any[]>('/spaces');
  }

  async createSpace(space: any) {
    return this.request<any>('/spaces', {
      method: 'POST',
      body: JSON.stringify(space),
    });
  }

  async updateSpace(id: string, updates: any) {
    return this.request<any>(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // ==================== BOOKINGS ====================
  
  async getBookings() {
    return this.request<any[]>('/bookings');
  }

  async createBooking(booking: any) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id: string, updates: any) {
    return this.request<any>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelBooking(id: string) {
    return this.request<any>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROJECTS ====================
  
  async getProjects() {
    return this.request<any[]>('/projects');
  }

  async createProject(project: any) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, updates: any) {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string) {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== STUDENTS ====================
  
  async getStudents() {
    return this.request<any[]>('/students');
  }

  async createStudent(student: any) {
    return this.request<any>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: string, updates: any) {
    return this.request<any>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteStudent(id: string) {
    return this.request<void>(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== TRANSACTIONS ====================
  
  async getTransactions() {
    return this.request<any[]>('/transactions');
  }

  async createTransaction(transaction: any) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async approveTransaction(id: string, approvedBy: string) {
    return this.request<any>(`/transactions/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approvedBy }),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== EMPLOYEES ====================
  
  async getEmployees() {
    return this.request<any[]>('/employees');
  }

  async createEmployee(employee: any) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: string, updates: any) {
    return this.request<any>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DOCUMENTS ====================
  
  async getDocuments() {
    return this.request<any[]>('/documents');
  }

  async uploadDocument(file: File, metadata: any) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async deleteDocument(id: string) {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== TASKS ====================
  
  async getTasks() {
    return this.request<any[]>('/tasks');
  }

  async createTask(task: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string) {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();

