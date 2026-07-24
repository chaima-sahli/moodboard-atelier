const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Une erreur est survenue');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: (endpoint) => 
    fetch(`${API_URL}${endpoint}`, { method: 'GET', headers: getHeaders() })
      .then(handleResponse),

  post: (endpoint, data) => 
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  put: (endpoint, data) => 
    fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (endpoint) => 
    fetch(`${API_URL}${endpoint}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    }).then(handleResponse),
};