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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, request, message } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          }
          break;
      }

      return Promise.reject({
        status,
        message: data.message || data.error || `HTTP ${status} Error`,
        data: data,
      });
    } else if (request) {
      return Promise.reject({
        status: 0,
        message: "Network error: Unable to connect to server",
        data: null,
      });
    } else {
      return Promise.reject({
        status: -1,
        message: message || "Request setup error",
        data: null,
      });
    }
  }
);

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

export const publicApi = {
  getJobs: (params = {}) => api.get("/api/jobs", { params }),

  getJob: (slug: string) => api.get(`/api/jobs/${slug}`),

  getJobsByCategory: (category: string, params = {}) =>
    api.get(`/api/jobs?category=${category}`, { params }),
};

export default axiosInstance;
