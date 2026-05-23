import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessMode } from '@/lib/access-mode';
import { isAdminForbiddenError } from '@/lib/api-error';
import { isAdminOnlyPath } from '@/lib/role-access';

let handlingAdminForbidden = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (
        error.response?.status === 403 &&
        isAdminForbiddenError(error) &&
        !handlingAdminForbidden
      ) {
        handlingAdminForbidden = true;
        setAccessMode('USER');
        const path = window.location.pathname;
        if (path === '/home' || isAdminOnlyPath(path)) {
          window.location.replace('/home');
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
