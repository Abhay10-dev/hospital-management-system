const getCleanBaseUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return raw.trim().replace(/\/+$/, '');
};

class ApiClient {
  private getBaseUrl(): string {
    return getCleanBaseUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status: number }> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.getBaseUrl()}${cleanEndpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // for HttpOnly cookies
      });

      const status = res.status;
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return {
          error: errJson.message || `Request failed with status ${status}`,
          status,
        };
      }

      const data = await res.json().catch(() => ({}));
      return { data, status };
    } catch (err: any) {
      return {
        error: err.message || 'Network connection failed',
        status: 0,
      };
    }
  }

  // Auth Endpoints
  async login(email: string, password: string, rememberMe = false, role?: string) {
    return this.request<{ message: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe, ...(role ? { role } : {}) }),
    });
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async switchRole(role: string) {
    return this.request<{ message: string; role: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Audit Logs (SUPER_ADMIN only)
  async getAuditLogs(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{ data: any[]; pagination: any }>(
      `/api/audit-logs${query ? `?${query}` : ''}`
    );
  }

  // Patients
  async getPatients(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<any[]>(`/api/patients${query}`);
  }

  // Appointments & AI Voice contracts
  async getAppointments() {
    return this.request<any[]>('/api/appointments');
  }

  async getAvailability(date?: string, department?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (department) params.append('department', department);
    const query = params.toString();
    return this.request<any>(`/api/availability${query ? `?${query}` : ''}`);
  }

  async createBookingRequest(bookingData: {
    patientPhone: string;
    patientName?: string;
    department: string;
    preferredDate: string;
    notes?: string;
  }) {
    return this.request<any>('/api/booking-requests', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
