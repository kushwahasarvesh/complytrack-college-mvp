export function formatDue(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'DUE_SOON': return 'Due soon';
    case 'OVERDUE': return 'Overdue';
    case 'COMPLETED': return 'Completed';
    default: return 'Upcoming';
  }
}
