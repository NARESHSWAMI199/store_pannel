import axios from 'axios';
import { host } from './util';

let authContext = null;
let router = null;

/**
 * Initialize API client with auth context and router
 * Call this in _app.js
 */
export const initializeApiClient = (auth, nextRouter) => {
  authContext = auth;
  router = nextRouter;
  setupAxiosInterceptors();
};

/**
 * Setup axios interceptors for centralized error handling
 */
const setupAxiosInterceptors = () => {
  // Request interceptor - add auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      if (authContext?.token) {
        config.headers.Authorization = authContext.token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401 errors globally
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.warn('Unauthorized access (401) - Redirecting to login');

        // Clear auth data
        if (authContext?.signOut) {
          authContext.signOut();
        }

        // Clear session storage
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('token');
          window.sessionStorage.removeItem('user');
          window.sessionStorage.removeItem('store');
          window.sessionStorage.removeItem('paginations');
        }

        // Redirect to login
        if (router) {
          router.push('/auth/login');
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Create axios instance with base URL
 */
export const apiClient = axios.create({
  baseURL: host,
});

// Setup interceptors for apiClient as well
apiClient.interceptors.request.use(
  (config) => {
    if (authContext?.token) {
      config.headers.Authorization = authContext.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access (401) - Redirecting to login');

      if (authContext?.signOut) {
        authContext.signOut();
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('store');
        window.sessionStorage.removeItem('paginations');
      }

      if (router) {
        router.push('/auth/login');
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
