import { describe, expect, it } from 'vitest';
import { en } from '@/lib/i18n/locales/en';
import { createLoginSchema, createRegisterSchema } from './auth';

const loginSchema = createLoginSchema(en.validation.login);
const registerSchema = createRegisterSchema(en.validation.register);

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      username: 'alice',
      password: 'secret',
    });
    expect(result.success).toBe(true);
  });

  it('trims username whitespace', () => {
    const result = loginSchema.safeParse({
      username: '  alice  ',
      password: 'secret',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe('alice');
    }
  });

  it('rejects empty username', () => {
    const result = loginSchema.safeParse({ username: '', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only username', () => {
    const result = loginSchema.safeParse({ username: '   ', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('rejects username over 100 characters', () => {
    const result = loginSchema.safeParse({
      username: 'a'.repeat(101),
      password: 'x',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      username: 'alice',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      password: 'secret1',
      confirmPassword: 'secret1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects username shorter than 3 characters', () => {
    const result = registerSchema.safeParse({
      username: 'ab',
      password: 'secret1',
      confirmPassword: 'secret1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      password: 'secret1',
      confirmPassword: 'secret2',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmPassword',
      );
      expect(confirmError?.message).toBe('Passwords do not match');
    }
  });

  it('rejects empty confirm password', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      password: 'secret1',
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });
});
