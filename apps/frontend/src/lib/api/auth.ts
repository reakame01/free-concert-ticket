import api from '@/lib/api';
import type { AccessMode } from '@/types/access-mode';

export interface AuthUser {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const register = async (
  username: string,
  password: string,
  role: AccessMode,
): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/register', {
    username,
    password,
    role,
  });
  return data;
};

export const login = async (
  username: string,
  password: string,
  role?: AccessMode,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    username,
    password,
  }, {
    params: role ? { role } : undefined,
  });
  return data;
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
};
