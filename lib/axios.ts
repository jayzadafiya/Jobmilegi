import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth headers or custom logic here
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    const { response, request, message } = error;

    if (response) {
      // Server responded with error status
      const { status, data } = response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data.message || data.error);
          break;
        case 401:
          console.error("Unauthorized access");
          // Redirect to login for admin routes
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          }
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 422:
          console.error("Validation error:", data.message || data.error);
          break;
        case 429:
          console.error("Too many requests");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error(
            `Error ${status}:`,
            data.message || data.error || "Unknown error"
          );
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data.message || data.error || `HTTP ${status} Error`,
        data: data,
      });
    } else if (request) {
      // Request was made but no response received
      console.error("Network error: No response received");
      return Promise.reject({
        status: 0,
        message: "Network error: Unable to connect to server",
        data: null,
      });
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", message);
      return Promise.reject({
        status: -1,
        message: message || "Request setup error",
        data: null,
      });
    }
  }
);

// Helper functions for common HTTP methods
export const api = {
  get: <T = any>(url: string, config = {}) =>
    axiosInstance.get<T>(url, config).then((response) => response.data),

  post: <T = any>(url: string, data = {}, config = {}) =>
    axiosInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data = {}, config = {}) =>
    axiosInstance.put<T>(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data = {}, config = {}) =>
    axiosInstance.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config = {}) =>
    axiosInstance.delete<T>(url, config).then((response) => response.data),
};

// Admin API helpers
export const adminApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post("/api/admin/login", credentials),

  logout: () => api.post("/api/admin/logout"),

  verify: () => api.get("/api/admin/verify"),

  getJobs: () => api.get("/api/admin/jobs"),

  getJob: (id: string) => api.get(`/api/admin/jobs/${id}`),

  createJob: (jobData: any) => api.post("/api/admin/jobs", jobData),

  updateJob: (id: string, jobData: any) =>
    api.put(`/api/admin/jobs/${id}`, jobData),

  deleteJob: (id: string) => api.delete(`/api/admin/jobs/${id}`),
};

// Public API helpers
export const publicApi = {
  getJobs: (params = {}) => api.get("/api/jobs", { params }),

  getJob: (slug: string) => api.get(`/api/jobs/${slug}`),

  getJobsByCategory: (category: string, params = {}) =>
    api.get(`/api/jobs?category=${category}`, { params }),
};

export default axiosInstance;
