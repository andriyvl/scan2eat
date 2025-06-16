export function formatDate(date?: Date): string {
  if (!date) return '';
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const time = pad(date.getHours()) + ':' + pad(date.getMinutes());
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + time;
} 