export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'animals' | 'space' | 'food' | 'magic' | 'ocean' | 'colors' | 'toys' | 'daily';
export type GameMode = 'scramble' | 'missing_letters';
export type AppGameType = 'spelling' | 'math' | 'memory';

export interface User {
  username: string;
  avatar: string;
  stars: number;
  totalScore: number;
  streak: number;
  lastPlayedDate: string;
  dailyCompletedDate: string;
  learnedWords: string[];
  coins: number;
  purchasedAvatars: string[];
}

export interface WordItem {
  word: string;
  hint: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  color: string;
}

export interface LeaderboardEntry {
  username: string;
  avatar: string;
  score: number;
  stars: number;
  date: string;
}
