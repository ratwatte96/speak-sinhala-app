export type QuizType = "read" | "speak" | "quiz" | "custom-quiz";

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
