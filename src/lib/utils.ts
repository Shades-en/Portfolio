import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(utcTimestamp: string): string {
  const now = Date.now();
  const timestampWithZ = utcTimestamp.endsWith('Z') || utcTimestamp.includes('+') 
    ? utcTimestamp 
    : `${utcTimestamp}Z`;
  const parsedDate = new Date(timestampWithZ);
  const t = parsedDate.getTime();
  const diffSec = Math.max(0, Math.floor((now - t) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `${diffMon}mo ago`;
  const diffYear = Math.floor(diffMon / 12);
  return `${diffYear}y ago`;
}
