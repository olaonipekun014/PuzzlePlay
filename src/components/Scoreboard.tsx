import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../utils/storage';
import { Trophy, Home } from 'lucide-react';
import { FooterMarquee } from './FooterMarquee';

interface Props {
  onGoHome: () => void;
  recentScore?: { score: number; stars: number } | null;
}

export function Scoreboard({ onGoHome, recentScore }: Props) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setBoard(getLeaderboard());
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex flex-col items-center p-3 sm:p-6 md:p-10 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      <nav className="w-full max-w-2xl flex justify-between items-center mb-4 sm:mb-8 px-2">
         <button 
            onClick={onGoHome}
            className="bg-white dark:bg-slate-800 rounded-full p-2.5 sm:p-3.5 shadow-sm border-2 border-blue-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"
            title="Go to Dashboard"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="text-xl sm:text-3xl font-black text-blue-500 tracking-tight">Hall of Fame</div>
          <div className="w-10 sm:w-14" /> {/* Spacer */}
      </nav>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col"
      >
        <div className="bg-blue-50 dark:bg-slate-700/60 p-5 sm:p-8 text-center border-b-4 border-slate-200 dark:border-slate-700">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-2 sm:mb-3" />
          <h1 className="text-2xl sm:text-3xl font-black text-blue-900 dark:text-blue-200">Leaderboard</h1>
        </div>

        {recentScore && (
          <div className="bg-yellow-50 dark:bg-yellow-950/40 p-4 sm:p-6 border-b-4 border-slate-200 dark:border-slate-700 flex justify-center gap-6 sm:gap-12 items-center text-center">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold text-yellow-700 dark:text-yellow-400 mb-0.5">Round Score</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 dark:text-yellow-300">+{recentScore.score}</p>
            </div>
            <div className="w-1 h-10 sm:h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full" />
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold text-yellow-700 dark:text-yellow-400 mb-0.5">Stars Earned</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 dark:text-yellow-300">+{recentScore.stars} ⭐</p>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 flex-1">
          {board.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 text-base sm:text-lg font-bold py-8">
              No scores yet! Play a game to get on the leaderboard.
            </p>
          ) : (
            <div className="space-y-2.5 sm:space-y-3.5">
              {board.map((entry, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-colors ${
                    idx === 0 ? 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-700' :
                    idx === 1 ? 'bg-slate-50 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600' :
                    idx === 2 ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800' :
                    'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-6 sm:w-8 text-center font-black text-base sm:text-lg text-slate-400">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sky-100 dark:bg-slate-700 border-2 border-sky-300 dark:border-slate-600 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 truncate">
                    {entry.username}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-blue-600 dark:text-blue-400 text-lg sm:text-xl">{entry.score}</div>
                    <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 tracking-wider">{entry.stars} ⭐</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t-4 border-slate-200 dark:border-slate-700 text-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoHome}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg shadow-[0_4px_0_#15803D] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            Play Again
          </motion.button>
        </div>
      </motion.div>

      <div className="w-full mt-auto pt-8">
        <FooterMarquee />
      </div>
    </div>
  );
}
