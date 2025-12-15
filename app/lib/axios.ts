import axios from "axios";

const api = axios.create({
  baseURL: "https://doc-cluster.me/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional: interceptors (later for refresh token)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
