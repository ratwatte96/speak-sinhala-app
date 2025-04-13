import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import {
  XP_BY_TYPE,
  PERFECT_SCORE_BONUS,
  SUBSEQUENT_COMPLETION_MULTIPLIER,
  isValidQuizType,
} from "@/app/lib/experience-points";
import type { QuizType } from "@/app/lib/experience-points/types";
import {
  LocalStorageError,
  handleLocalStorageError,
} from "./localStorageError";

export interface DailyXP {
  date: string; // YYYY-MM-DD format
  amount: number;
  completedQuizTypes: QuizType[]; // Track which quiz types were completed today
}

export interface LocalStorageXP {
  dailyXP: DailyXP[];
  totalXP: number;
  expiry: number;
}

const XP_STORAGE_KEY = "localXP";
const EXPIRY_DAYS = 7;

// Get start of day in Sri Lanka time (UTC+5:30)
function getSriLankaDayAnchor(): Date {
  try {
    const tz = "Asia/Colombo";
    const now = new Date();
    const zoned = toZonedTime(now, tz);
    const start = startOfDay(zoned);
    return new Date(
      Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        0,
        0,
        0,
        0
      )
    );
  } catch (error) {
    throw new LocalStorageError(
      "Failed to calculate Sri Lanka timezone",
      "TIMEZONE_ERROR"
    );
  }
}

// Initialize or get XP data
export function getLocalXP(): LocalStorageXP {
  try {
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

    let data: unknown;
    try {
      data = JSON.parse(storedData);
    } catch {
      throw new LocalStorageError(
        "Failed to parse stored XP data",
        "INVALID_DATA"
      );
    }

    if (!validateLocalXPData(data)) {
      throw new LocalStorageError(
        "Invalid XP data structure",
        "INVALID_STRUCTURE"
      );
    }

    if (Date.now() > data.expiry) {
      localStorage.removeItem(XP_STORAGE_KEY);
      return getLocalXP();
    }

    // Migrate old data structure if needed
    if (data.dailyXP.some((entry) => !entry.completedQuizTypes)) {
      data.dailyXP = data.dailyXP.map((entry) => ({
        ...entry,
        completedQuizTypes: [],
      }));
      localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    return handleLocalStorageError(error);
  }
}

// Calculate XP for a quiz completion
export function calculateLocalXP(
  quizType: QuizType,
  isPerfectScore: boolean
): number {
  if (!isValidQuizType(quizType)) {
    throw new LocalStorageError(
      `Invalid quiz type: ${quizType}`,
      "INVALID_QUIZ_TYPE"
    );
  }

  const data = getLocalXP();
  const today = getSriLankaDayAnchor().toISOString().split("T")[0];
  const todayEntry = data.dailyXP.find((entry) => entry.date === today);
  const isFirstCompletionOfDay =
    !todayEntry?.completedQuizTypes.includes(quizType);

  // Base XP from quiz type
  let xpAmount = XP_BY_TYPE[quizType];

  // Add perfect score bonus if applicable
  if (isPerfectScore) {
    xpAmount += PERFECT_SCORE_BONUS;
  }

  // Apply diminishing returns for subsequent completions
  if (!isFirstCompletionOfDay) {
    xpAmount = Math.floor(xpAmount * SUBSEQUENT_COMPLETION_MULTIPLIER);
  }

  return xpAmount;
}

// Update XP for the current day
export function updateLocalXP(
  quizType: QuizType,
  isPerfectScore: boolean
): {
  awarded: number;
  dailyTotal: number;
  totalXP: number;
} {
  try {
    if (!isValidQuizType(quizType)) {
      throw new LocalStorageError(
        `Invalid quiz type: ${quizType}`,
        "INVALID_QUIZ_TYPE"
      );
    }

    const data = getLocalXP();
    const today = getSriLankaDayAnchor().toISOString().split("T")[0];
    const xpAmount = calculateLocalXP(quizType, isPerfectScore);

    // Find or create today's entry
    let todayEntry = data.dailyXP.find((entry) => entry.date === today);
    if (todayEntry) {
      todayEntry.amount += xpAmount;
      if (!todayEntry.completedQuizTypes.includes(quizType)) {
        todayEntry.completedQuizTypes.push(quizType);
      }
    } else {
      todayEntry = {
        date: today,
        amount: xpAmount,
        completedQuizTypes: [quizType],
      };
      data.dailyXP.push(todayEntry);
    }

    // Update total XP
    data.totalXP += xpAmount;

    // Refresh expiry
    data.expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    try {
      localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        // Try to free up space by removing old entries
        data.dailyXP = data.dailyXP.slice(-30); // Keep only last 30 days
        localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
      } else {
        throw error;
      }
    }

    return {
      awarded: xpAmount,
      dailyTotal: todayEntry.amount,
      totalXP: data.totalXP,
    };
  } catch (error) {
    return handleLocalStorageError(error);
  }
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
  date = getSriLankaDayAnchor().toISOString().split("T")[0]
): number {
  const data = getLocalXP();
  return data.dailyXP.find((entry) => entry.date === date)?.amount ?? 0;
}

// Validate XP data structure
export function validateLocalXPData(data: unknown): data is LocalStorageXP {
  if (!data || typeof data !== "object") return false;

  const xpData = data as Record<string, unknown>;

  if (!Array.isArray(xpData.dailyXP)) return false;
  if (typeof xpData.totalXP !== "number") return false;
  if (typeof xpData.expiry !== "number") return false;

  return xpData.dailyXP.every((entry: unknown) => {
    if (typeof entry !== "object" || !entry) return false;
    const dailyEntry = entry as Record<string, unknown>;

    return (
      typeof dailyEntry.date === "string" &&
      typeof dailyEntry.amount === "number" &&
      Array.isArray(dailyEntry.completedQuizTypes) &&
      dailyEntry.completedQuizTypes.every(
        (type: unknown) => typeof type === "string" && isValidQuizType(type)
      )
    );
  });
}

// Get completed quiz types for today
export function getTodayCompletedQuizTypes(): QuizType[] {
  const data = getLocalXP();
  const today = getSriLankaDayAnchor().toISOString().split("T")[0];
  return (
    data.dailyXP.find((entry) => entry.date === today)?.completedQuizTypes ?? []
  );
}
