import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import {
  PERFECT_SCORE_BONUS,
  SUBSEQUENT_COMPLETION_MULTIPLIER,
} from "@/app/lib/experience-points";

interface DailyXP {
  date: string; // YYYY-MM-DD format
  amount: number;
}

interface LocalStorageXP {
  dailyXP: DailyXP[];
  totalXP: number;
  expiry: number;
}

const XP_STORAGE_KEY = "localXP";
const EXPIRY_DAYS = 7;

// Get start of day in Sri Lanka time (UTC+5:30)
function getSriLankaDayAnchor(): Date {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
}

// Initialize or get XP data
export function getLocalXP(): LocalStorageXP {
  const storedData = localStorage.getItem(XP_STORAGE_KEY);
  if (!storedData) {
    const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const initialData: LocalStorageXP = {
      dailyXP: [],
      totalXP: 0,
      expiry,
    };
    localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  const data = JSON.parse(storedData) as LocalStorageXP;
  if (Date.now() > data.expiry) {
    localStorage.removeItem(XP_STORAGE_KEY);
    return getLocalXP();
  }

  return data;
}

// Update XP for the current day
export function updateLocalXP(xpAmount: number): {
  awarded: number;
  dailyTotal: number;
} {
  const data = getLocalXP();
  const today = getSriLankaDayAnchor().toISOString().split("T")[0];

  // Find or create today's entry
  const todayEntry = data.dailyXP.find((entry) => entry.date === today);
  if (todayEntry) {
    todayEntry.amount += xpAmount;
  } else {
    data.dailyXP.push({ date: today, amount: xpAmount });
  }

  // Update total XP
  data.totalXP += xpAmount;

  // Refresh expiry
  data.expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  // Store updated data
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));

  // Return awarded XP and daily total
  const dailyTotal =
    data.dailyXP.find((entry) => entry.date === today)?.amount || 0;
  return { awarded: xpAmount, dailyTotal };
}

// Clear XP data (used after migration)
export function clearLocalXP(): void {
  localStorage.removeItem(XP_STORAGE_KEY);
}

// Get total XP
export function getTotalLocalXP(): number {
  return getLocalXP().totalXP;
}

// Get daily XP for a specific date
export function getDailyLocalXP(
  date: string = getSriLankaDayAnchor().toISOString().split("T")[0]
): number {
  const data = getLocalXP();
  return data.dailyXP.find((entry) => entry.date === date)?.amount || 0;
}

// Validate XP data structure
export function validateLocalXPData(data: any): data is LocalStorageXP {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.dailyXP)) return false;
  if (typeof data.totalXP !== "number") return false;
  if (typeof data.expiry !== "number") return false;

  return data.dailyXP.every(
    (entry: any) =>
      typeof entry === "object" &&
      typeof entry.date === "string" &&
      typeof entry.amount === "number"
  );
}
