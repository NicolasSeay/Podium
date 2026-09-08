import { formatDate, formatDateRange } from './date-format';

describe('date formatting', () => {
  it('formats a single date', () => {
    expect(formatDate('2025-10-18')).toBe('Oct 18, 2025');
  });

  it('formats a same-month range compactly', () => {
    expect(formatDateRange('2025-10-18', '2025-10-19')).toBe('Oct 18-19, 2025');
  });

  it('formats a cross-month range', () => {
    expect(formatDateRange('2025-10-31', '2025-11-02')).toBe('Oct 31-Nov 2, 2025');
  });

  it('formats a cross-year range', () => {
    expect(formatDateRange('2025-12-31', '2026-01-02')).toBe('Dec 31, 2025-Jan 2, 2026');
  });
});
