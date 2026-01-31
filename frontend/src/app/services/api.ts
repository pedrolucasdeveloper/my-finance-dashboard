import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

export const api = {
  async get(endpoint: string) {
    const headers = await getAuthHeaders();
    return fetch(`${API_BASE}${endpoint}`, { headers });
  },

  async post(endpoint: string, body: any) {
    const headers = await getAuthHeaders();
    return fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  },

  async put(endpoint: string, body: any) {
    const headers = await getAuthHeaders();
    return fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeaders();
    return fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
  }
};