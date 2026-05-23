import { AxiosError } from 'axios';

interface NestErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const axiosError = error as AxiosError<NestErrorBody>;
  const data = axiosError.response?.data;

  if (!data) {
    return fallback;
  }

  if (Array.isArray(data.message)) {
    return data.message.join(', ');
  }

  if (typeof data.message === 'string' && data.message.length > 0) {
    return data.message;
  }

  return fallback;
};

export const isAdminForbiddenError = (error: unknown): boolean => {
  const message = getApiErrorMessage(error, '');
  return message.includes('ADMIN');
};
