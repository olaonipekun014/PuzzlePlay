import { LeaderboardEntry, User } from '../types';

const USERS_KEY = 'puzzleplay_users';
const LEADERBOARD_KEY = 'puzzleplay_leaderboard';

export const getUsers = (): Record<string, User> => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users[user.username] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUser = (username: string): User | null => {
  const users = getUsers();
  return users[username] || null;
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToLeaderboard = (entry: LeaderboardEntry) => {
  const board = getLeaderboard();
  board.push(entry);
  // Sort descending by score
  board.sort((a, b) => b.score - a.score);
  // Keep top 10
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board.slice(0, 10)));
};
