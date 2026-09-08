const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

type DateParts = { year: number; month: number; day: number };

function dateParts(date: string): DateParts {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

export function formatDate(date: string): string {
  const parts = dateParts(date);
  return `${MONTH_NAMES[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

export function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate || endDate === startDate) return formatDate(startDate);

  const start = dateParts(startDate);
  const end = dateParts(endDate);
  if (start.year === end.year && start.month === end.month) {
    return `${MONTH_NAMES[start.month - 1]} ${start.day}-${end.day}, ${start.year}`;
  }
  if (start.year === end.year) {
    return `${MONTH_NAMES[start.month - 1]} ${start.day}-${MONTH_NAMES[end.month - 1]} ${end.day}, ${start.year}`;
  }
  return `${formatDate(startDate)}-${formatDate(endDate)}`;
}
