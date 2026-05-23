import { describe, expect, it } from 'vitest';
import { getEffectiveAccessMode, isAdminOnlyPath } from '@/lib/role-access';

describe('getEffectiveAccessMode', () => {
  it('forces USER view when JWT role is not ADMIN', () => {
    expect(getEffectiveAccessMode('ADMIN', 'USER')).toBe('USER');
    expect(getEffectiveAccessMode('USER', 'USER')).toBe('USER');
  });

  it('forces USER view when JWT role is null', () => {
    expect(getEffectiveAccessMode('ADMIN', null)).toBe('USER');
  });

  it('allows session ADMIN mode when JWT role is ADMIN', () => {
    expect(getEffectiveAccessMode('ADMIN', 'ADMIN')).toBe('ADMIN');
  });

  it('allows session USER mode when JWT role is ADMIN', () => {
    expect(getEffectiveAccessMode('USER', 'ADMIN')).toBe('USER');
  });
});

describe('isAdminOnlyPath', () => {
  it('returns true for history page', () => {
    expect(isAdminOnlyPath('/history')).toBe(true);
  });

  it('returns true for create concert page', () => {
    expect(isAdminOnlyPath('/home/create')).toBe(true);
  });

  it('returns false for home and login', () => {
    expect(isAdminOnlyPath('/home')).toBe(false);
    expect(isAdminOnlyPath('/login')).toBe(false);
  });

  it('returns false for unrelated paths', () => {
    expect(isAdminOnlyPath('/register')).toBe(false);
    expect(isAdminOnlyPath('/concerts')).toBe(false);
  });
});
