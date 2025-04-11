import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import { QuizType, XPCalculationParams } from "./types";

// XP values for different quiz types
export const XP_BY_TYPE: Record<QuizType, number> = {
  "Accent Practice": 12,
  "New Accents": 15,
  "New Letters": 10,
  "New Rule": 12,
  "Unit Review": 20,
  "Unit Test": 25,
};

// Perfect score bonus XP
export const PERFECT_SCORE_BONUS = 5;

// Subsequent completion multiplier (25%)
export const SUBSEQUENT_COMPLETION_MULTIPLIER = 0.25;

/**
 * Gets the start of the current day in Sri Lanka time (UTC+5:30)
 */
export function getSriLankaDayAnchor(): Date {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
}

/**
 * Calculates the XP to be awarded based on quiz type and conditions
 */
export function calculateXP({
  quizType,
  isPerfectScore,
  isFirstCompletionOfDay,
}: XPCalculationParams): number {
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

/**
 * Validates if a string is a valid quiz type
 */
export function isValidQuizType(type: string): type is QuizType {
  return type in XP_BY_TYPE;
}
