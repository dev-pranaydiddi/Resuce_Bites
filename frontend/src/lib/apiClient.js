// src/lib/apiClient.js
import axios from "axios";

/**
 * Unified API request wrapper using Axios
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {string} url
 * @param {object=} data
 * @returns {Promise<any>} response data
 * @throws {Error} with status and message on failure
 */
export async function apiRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    if (data) config.data = data;
    console.log(data)

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Axios errors have .response when server responded
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data: respData } = error.response;
        const message = respData?.message || error.message;
        throw new Error(`Request to ${url} failed with status ${status}: ${message}`);
      } else if (error.request) {
        // Request made but no response
        throw new Error(`No response received from ${url}`);
      }
    }
    // Non-Axios or unexpected error
    throw error;
  }
}
