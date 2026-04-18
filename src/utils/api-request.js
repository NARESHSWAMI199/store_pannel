import axios from 'axios';
import { host } from './util';

/**
 * API helper functions for common HTTP operations
 * These automatically benefit from centralized 401 error handling
 * 
 * Usage:
 * - GET: apiRequest.get('/endpoint')
 * - POST: apiRequest.post('/endpoint', data)
 * - PUT: apiRequest.put('/endpoint', data)
 * - DELETE: apiRequest.delete('/endpoint')
 */

export const apiRequest = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} config - optional axios config
   */
  get: (endpoint, config = {}) => {
    return axios.get(`${host}${endpoint}`, config);
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} data - Request body
   * @param {object} config - optional axios config
   */
  post: (endpoint, data = {}, config = {}) => {
    return axios.post(`${host}${endpoint}`, data, config);
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} data - Request body
   * @param {object} config - optional axios config
   */
  put: (endpoint, data = {}, config = {}) => {
    return axios.put(`${host}${endpoint}`, data, config);
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} config - optional axios config
   */
  delete: (endpoint, config = {}) => {
    return axios.delete(`${host}${endpoint}`, config);
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} data - Request body
   * @param {object} config - optional axios config
   */
  patch: (endpoint, data = {}, config = {}) => {
    return axios.patch(`${host}${endpoint}`, data, config);
  },
};

export default apiRequest;

/**
 * MIGRATION GUIDE - How to refactor existing API calls:
 * 
 * OLD WAY (with manual Authorization header):
 * ```
 * axios.defaults.headers = {
 *   Authorization: auth.token
 * }
 * axios.post(host + "/admin/item/all", data)
 *   .then(res => {
 *     // handle success
 *     if (res.response?.status === 401) {
 *       // manually handle 401
 *     }
 *   })
 *   .catch(err => {
 *     let status = (!!err.response ? err.response.status : 0);
 *     if (status == 401) {
 *       auth.signOut();
 *       router.push("/auth/login")
 *     }
 *   })
 * ```
 * 
 * NEW WAY (with centralized 401 handling):
 * ```
 * import { apiRequest } from 'src/utils/api-request';
 * 
 * apiRequest.post('/admin/item/all', data)
 *   .then(res => {
 *     // handle success - 401 is handled globally
 *   })
 *   .catch(err => {
 *     // handle errors other than 401
 *   })
 * ```
 * 
 * BENEFITS:
 * 1. No need to manually set Authorization header
 * 2. No need to check for 401 status in each component
 * 3. Consistent error handling across entire app
 * 4. Changes to auth logic only need to be made in one place
 * 5. Cleaner, more readable component code
 */
