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
    // console.log("apiRequest error", error)
    return error
    // Non-Axios or unexpected error
      }
}
