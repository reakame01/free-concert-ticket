import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, isAdminForbiddenError } from './api-error';

describe('getApiErrorMessage', () => {
  it('returns fallback for null error', () => {
    expect(getApiErrorMessage(null, 'Fallback')).toBe('Fallback');
  });

  it('returns fallback for non-object error', () => {
    expect(getApiErrorMessage('oops', 'Fallback')).toBe('Fallback');
  });

  it('returns fallback when axios response has no data', () => {
    const error = new AxiosError('Network');
    expect(getApiErrorMessage(error, 'Fallback')).toBe('Fallback');
  });

  it('returns string message from response', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: { message: 'Tickets are full', statusCode: 400 },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error, 'Fallback')).toBe('Tickets are full');
  });

  it('joins array messages from validation errors', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: { message: ['name is required', 'seats must be positive'] },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error, 'Fallback')).toBe(
      'name is required, seats must be positive',
    );
  });

  it('returns fallback when message is empty string', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: { message: '' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error, 'Fallback')).toBe('Fallback');
  });
});

describe('isAdminForbiddenError', () => {
  it('returns true when message contains ADMIN', () => {
    const error = new AxiosError('Forbidden');
    error.response = {
      data: { message: 'Requires ADMIN role' },
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    };

    expect(isAdminForbiddenError(error)).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    const error = new AxiosError('Bad Request');
    error.response = {
      data: { message: 'Tickets are full' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    };

    expect(isAdminForbiddenError(error)).toBe(false);
  });
});
