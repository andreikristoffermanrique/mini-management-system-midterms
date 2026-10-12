const API_BASE_URL = "http://localhost:5000";

/**
 * Utility function to send API requests to the Flask backend.
 * @param {string} endpoint - The backend API route (e.g., '/api/register')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Handle non-2xx response statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}