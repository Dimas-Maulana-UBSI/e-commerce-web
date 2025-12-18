import axios from 'axios';
import https from "https";
import { APIConfiguration } from '@/config/api.config';

const apiClient = axios.create({
  baseURL: APIConfiguration.baseUrl,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // ⛔ ignore self-signed cert
  }),
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // ✅ Let Axios handle it
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default apiClient;
