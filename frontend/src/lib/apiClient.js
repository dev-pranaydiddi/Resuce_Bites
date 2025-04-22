// src/lib/apiClient.js

/**
 * Throw if response status is not 2xx
 * @param {Response} res
 */
async function throwIfResNotOk(res) {
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  }
  
  /**
   * Simple fetch wrapper with JSON body + credentials
   * @param {"GET"|"POST"|"PUT"|"DELETE"} method
   * @param {string} url
   * @param {object=} data
   * @returns {Promise<Response>}
   */
  export async function apiRequest(method, url, data) {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    await throwIfResNotOk(res);
    return res;
  }
  