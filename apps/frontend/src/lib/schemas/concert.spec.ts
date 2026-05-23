import { describe, expect, it } from 'vitest';
import { en } from '@/lib/i18n/locales/en';
import { createConcertSchema } from './concert';

const createConcertSchemaEn = createConcertSchema(en.validation.concert);

describe('createConcertSchema', () => {
  it('accepts valid concert input', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Jazz Night',
      description: 'Live music',
      totalSeats: 100,
    });
    expect(result.success).toBe(true);
  });

  it('trims name and description', () => {
    const result = createConcertSchemaEn.safeParse({
      name: '  Jazz Night  ',
      description: '  Live music  ',
      totalSeats: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Jazz Night');
      expect(result.data.description).toBe('Live music');
    }
  });

  it('rejects empty name after trim', () => {
    const result = createConcertSchemaEn.safeParse({
      name: '   ',
      description: 'desc',
      totalSeats: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects name over 255 characters', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'x'.repeat(256),
      description: 'desc',
      totalSeats: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Show',
      description: '',
      totalSeats: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer seats', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Show',
      description: 'desc',
      totalSeats: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero seats', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Show',
      description: 'desc',
      totalSeats: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative seats', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Show',
      description: 'desc',
      totalSeats: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects NaN seats', () => {
    const result = createConcertSchemaEn.safeParse({
      name: 'Show',
      description: 'desc',
      totalSeats: Number.NaN,
    });
    expect(result.success).toBe(false);
  });
});
