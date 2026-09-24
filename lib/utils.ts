import { type ClassValue } from "clsx";
import { cn as baseCn } from "cn";
import { format, parseISO } from "date-fns";

export function cn(...inputs: any[]) {
  return baseCn(...inputs);
}

/**
 * Formats a number to Colombian Peso currency string
 * Example: 25000 -> "$ 25.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Converts minutes from midnight into 24h/12h time string
 * Example: 480 -> "08:00 AM", 1080 -> "06:00 PM"
 */
export function formatMinutesToTime(minutes: number, is24h: boolean = false): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const padH = hours.toString().padStart(2, "0");
  const padM = mins.toString().padStart(2, "0");

  if (is24h) {
    return `${padH}:${padM}`;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, "0")}:${padM} ${period}`;
}

/**
 * Converts "HH:MM" string to minutes from midnight
 * Example: "08:30" -> 510
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts day number (0-6) to day name in English
 */
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayName(dayOfWeek: number): string {
  return DAYS_OF_WEEK[dayOfWeek] ?? `Day ${dayOfWeek}`;
}

/**
 * Formats an ISO date string to a human readable format
 * e.g. "September 12, 2026"
 */
export function formatFullDate(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "MMMM d, yyyy");
  } catch {
    return isoString;
  }
}

/**
 * Formats an ISO date string to time only
 * e.g. "02:30 PM"
 */
export function formatTimeOnly(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "hh:mm a");
  } catch {
    return isoString;
  }
}

/**
 * Formats an ISO date to short date (e.g. "Sep 12 - 03:00 PM")
 */
export function formatShortDateTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "MMM d, hh:mm a");
  } catch {
    return isoString;
  }
}
