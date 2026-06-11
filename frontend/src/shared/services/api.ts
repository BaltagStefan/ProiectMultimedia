import axios from "axios";
import { keycloak } from "../../features/auth/services/keycloak";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
  if (keycloak.token) config.headers.Authorization = `Bearer ${keycloak.token}`;
  return config;
});

