import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EMOJI_AVATARS } from '../data';
import { User } from '../types';
import { getUser, saveUser } from '../utils/storage';
import { FooterMarquee } from './FooterMarquee';

interface Props {
  onStart: (user: User) => void;
}

export function WelcomeScreen({ onStart }: Props) {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(EMOJI_AVATARS[0]);

  const handleStart = () => {
    if (!username.trim()) return;
    const existing = getUser(username.trim());
    if (existing) {
      if (existing.coins === undefined) existing.coins = 0;
      if (existing.purchasedAvatars === undefined) existing.purchasedAvatars = [];
      existing.avatar = avatar;
      saveUser(existing);
      onStart(existing);
    } else {
      const newUser: User = { 
        username: username.trim(), 
        avatar, 
        stars: 0, 
        totalScore: 0,
        streak: 0,
        lastPlayedDate: '',
        dailyCompletedDate: '',
        learnedWords: [],
        coins: 0,
        purchasedAvatars: []
      };
      saveUser(newUser);
      onStart(newUser);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 dark:bg-slate-900 p-4 sm:p-6 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 p-5 sm:p-8 md:p-10 rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-[0_8px_0_#DBEAFE] dark:shadow-[0_8px_0_#475569] max-w-md w-full text-center"
      >
        <motion.h1 
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-500 tracking-tight mb-6 sm:mb-8"
        >
          PuzzlePlay
        </motion.h1>
        
        <div className="mb-6">
          <label className="block text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-400 mb-3">Choose your Avatar</label>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {EMOJI_AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-transform ${
                  avatar === emoji ? 'bg-sky-100 dark:bg-sky-900 border-2 border-sky-400 dark:border-sky-600 scale-110 shadow-sm' : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-400 mb-3">What's your name?</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type your name here..."
            className="w-full text-center text-lg sm:text-xl font-bold p-3.5 sm:p-4 rounded-2xl border-4 border-blue-100 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={!username.trim()}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-lg sm:text-xl font-black py-3.5 sm:py-4 px-6 rounded-2xl shadow-[0_5px_0_#15803D] border-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-y-[2px] active:shadow-none cursor-pointer"
        >
          Start Playing!
        </motion.button>

        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5 tracking-wide">
          Educational Fun & Learning for Kids
        </p>

        <a
          href="https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20need%20support%20with%20PuzzlePlay!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
        >
          <span>💬 WhatsApp Support: 07070322351</span>
        </a>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0">
        <FooterMarquee />
      </div>
    </div>
  );
}
