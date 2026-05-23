import { formatDateTimeDisplay } from '@/common/utils/format-datetime';

describe('formatDateTimeDisplay', () => {
  it('formats date as DD/MM/YYYY HH:mm:ss', () => {
    const date = new Date(2026, 4, 20, 14, 5, 9);
    expect(formatDateTimeDisplay(date)).toBe('20/05/2026 14:05:09');
  });

  it('pads single-digit day, month, hours, minutes, seconds', () => {
    const date = new Date(2026, 0, 3, 7, 8, 9);
    expect(formatDateTimeDisplay(date)).toBe('03/01/2026 07:08:09');
  });
});
