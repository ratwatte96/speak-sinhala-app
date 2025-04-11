export interface XPData {
  dailyXP: number;
  totalXP: number;
}

export interface UseXPReturn {
  xpData: XPData;
  isLoading: boolean;
  error: string | null;
  updateXP: (amount: number) => Promise<void>;
}

export type QuizType = "read" | "speak" | "quiz" | "custom-quiz";

export interface XPValues {
  read: number;
  speak: number;
  quiz: number;
  "custom-quiz": number;
  perfectScore: number;
  subsequentCompletion: number;
}

export interface XPCalculationParams {
  quizType: QuizType;
  isPerfectScore: boolean;
  isFirstCompletionOfDay: boolean;
}

export interface XPResult {
  awarded: number;
  dailyTotal: number;
  totalXP: number;
}

export interface DailyXPRecord {
  userId: number;
  date: Date;
  amount: number;
}

export interface UserXPSummary {
  totalXP: number;
  dailyXP: number;
}
