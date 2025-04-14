export type LeaderboardType = "daily" | "allTime";

export interface LeaderboardEntry {
  userId: number;
  rank: number;
  score: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
}

export interface LeaderboardState {
  daily: LeaderboardData | null;
  allTime: LeaderboardData | null;
  isLoading: boolean;
  error: string | null;
}
