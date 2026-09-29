const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Standard HTTP API client with automatic JWT bearer token handling
 */
export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('teenspend_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);

    // If session expired or unauthorized, trigger auth cleanup
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('teenspend_token');
      localStorage.removeItem('teenspend_user');
      window.dispatchEvent(new Event('teenspend:unauthorized'));
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = error.message || 'Unable to connect to the server. Please check your network connection.';
    }
    throw error;
  }
}
