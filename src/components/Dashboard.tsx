import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data';
import { Category, Difficulty, User } from '../types';
import { LogOut, Star, Trophy, Flame, Calendar, Sparkles, BookOpen, Volume2, VolumeX, Moon, Sun, HelpCircle, Store, Heart, Gift, Play, Brain, Calculator, MessageCircle, Phone } from 'lucide-react';
import { WordListModal } from './WordListModal';
import { HelpCenterModal } from './HelpCenterModal';
import { AvatarShopModal } from './AvatarShopModal';
import { SupportModal } from './SupportModal';
import { FooterMarquee } from './FooterMarquee';
import { getAudioEnabled, setAudioEnabled } from '../utils/audio';

interface Props {
  user: User;
  onLogout: () => void;
  onStartGame: (category: Category, difficulty: Difficulty) => void;
  onStartMathGame: (difficulty: Difficulty) => void;
  onStartMemoryGame: (difficulty: Difficulty) => void;
  onViewScoreboard: () => void;
  onUpdateUser: (user: User) => void;
}

export function Dashboard({ 
  user, 
  onLogout, 
  onStartGame, 
  onStartMathGame,
  onStartMemoryGame,
  onViewScoreboard, 
  onUpdateUser 
}: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showWordList, setShowWordList] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isAudio, setIsAudio] = useState(getAudioEnabled);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleAudio = () => {
    const next = !isAudio;
    setIsAudio(next);
    setAudioEnabled(next);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('puzzleplay_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('puzzleplay_theme', 'light');
    }
  };

  const speakGameDesc = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1.1;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-slate-800 border-b-4 border-blue-200 dark:border-slate-700 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-sm">
        {/* User Identity & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            onClick={() => setShowAvatarShop(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 dark:bg-slate-700 rounded-full border-2 border-sky-300 dark:border-slate-600 flex items-center justify-center text-xl sm:text-2xl shrink-0 hover:scale-105 transition-transform"
            title="Change Avatar"
          >
            {user.avatar}
          </button>
          <div className="leading-tight">
            <div className="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100 truncate max-w-[110px] sm:max-w-[180px]">
              {user.username}
            </div>
            <div className="text-[10px] sm:text-xs text-blue-500 dark:text-blue-400 font-extrabold tracking-wide uppercase">
              PuzzlePlay ⭐
            </div>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 shadow-sm border-2 border-slate-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm" title="Daily Streak">
            <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${user.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300 dark:text-slate-500'}`} />
            <span className={user.streak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}>{user.streak || 0}</span>
          </div>

          <button 
            onClick={() => setShowAvatarShop(true)}
            className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 shadow-sm border-2 border-yellow-300 dark:border-yellow-600/70 font-extrabold text-xs sm:text-sm hover:bg-yellow-50 dark:hover:bg-slate-600 transition-colors"
            title="Avatar Shop & Coins"
          >
            <span>🪙</span>
            <span className="text-yellow-700 dark:text-yellow-300">{user.coins || 0}</span>
          </button>

          <button 
            onClick={onViewScoreboard}
            className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 shadow-sm border-2 border-blue-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
            title="Leaderboard Score"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
            <span className="text-slate-700 dark:text-slate-200">{user.totalScore}</span>
          </button>

          <div className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 shadow-sm border-2 border-blue-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm" title="Stars">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-slate-700 dark:text-slate-200">{user.stars}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* WhatsApp Support button */}
          <a
            href="https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20need%20support%20with%20PuzzlePlay!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 sm:px-3 py-1.5 rounded-full font-extrabold text-xs sm:text-sm shadow-[0_3px_0_#15803D] transition-all active:translate-y-[2px] active:shadow-none"
            title="Chat with Support on WhatsApp: 07070322351"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          {/* Support / Donate button */}
          <button
            onClick={() => setShowSupportModal(true)}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-2.5 sm:px-3 py-1.5 rounded-full font-extrabold text-xs sm:text-sm shadow-[0_3px_0_#BE123C] transition-all active:translate-y-[2px] active:shadow-none"
            title="Support Habib & Basil"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white animate-pulse" />
            <span>Support</span>
          </button>

          {/* Help Center */}
          <button 
            onClick={() => setShowHelpCenter(true)}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
            title="Help Center"
          >
            <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-yellow-400" /> : <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600" />}
          </button>

          {/* Audio Toggle */}
          <button 
            onClick={toggleAudio}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
            title={isAudio ? "Mute audio" : "Enable audio"}
          >
            {isAudio ? <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-green-500" /> : <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400" />}
          </button>

          {/* Logout */}
          <button 
            onClick={onLogout}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white dark:bg-slate-700 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 bg-white/70 dark:bg-slate-800/80 border-r-4 border-blue-200 dark:border-slate-700 p-5 flex-col shrink-0 gap-5">
          <div>
            <div className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mb-2.5">
              Difficulty Level
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`text-xs font-bold uppercase tracking-wide py-2 rounded-xl transition-all border-2 text-center ${
                    difficulty === level 
                      ? 'bg-blue-500 text-white border-blue-600 shadow-[0_3px_0_#1D4ED8]' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setShowWordList(true)}
              className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-between border-2 border-blue-200 dark:border-slate-600 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>My Word List</span>
              </div>
              <span className="text-xs bg-blue-200 dark:bg-blue-900/60 px-2 py-0.5 rounded-full font-bold">
                {(user.learnedWords || []).length}
              </span>
            </button>

            <button 
              onClick={() => onStartMathGame(difficulty)}
              className="w-full bg-amber-50 hover:bg-amber-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-amber-700 dark:text-amber-300 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-between border-2 border-amber-200 dark:border-slate-600 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-amber-500" />
                <span>Math Safari</span>
              </div>
              <span className="text-xs bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-full font-bold">
                Play 🧮
              </span>
            </button>

            <button 
              onClick={() => onStartMemoryGame(difficulty)}
              className="w-full bg-purple-50 hover:bg-purple-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-purple-700 dark:text-purple-300 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-between border-2 border-purple-200 dark:border-slate-600 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Brain className="w-5 h-5 text-purple-500" />
                <span>Memory Match</span>
              </div>
              <span className="text-xs bg-purple-200 dark:bg-purple-900/60 px-2 py-0.5 rounded-full font-bold">
                Play 🃏
              </span>
            </button>

            <button 
              onClick={() => setShowAvatarShop(true)}
              className="w-full bg-amber-50 hover:bg-amber-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-amber-700 dark:text-amber-300 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-between border-2 border-amber-200 dark:border-slate-600 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-5 h-5 text-amber-500" />
                <span>Avatar Shop</span>
              </div>
              <span className="text-xs font-bold">🪙 {user.coins}</span>
            </button>
          </div>

          {/* Support Habib & Basil Card */}
          <div className="mt-auto bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border-2 border-rose-200 dark:border-rose-900/50 shadow-sm text-center">
            <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-300 mb-1">
              Support Our App
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">
              Help Habib & Basil keep PuzzlePlay free & ad-free for all kids!
            </p>
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-[0_3px_0_#BE123C] transition-all"
            >
              💖 Donate via Palmpay
            </button>
            <a
              href="https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20need%20support%20with%20PuzzlePlay!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2 px-3 rounded-xl text-xs shadow-[0_3px_0_#15803D] transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp: 07070322351</span>
            </a>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Mobile Controls Toolbar */}
            <div className="md:hidden bg-white dark:bg-slate-800 rounded-2xl p-3 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400">Difficulty</span>
                <div className="flex gap-1">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border ${
                        difficulty === level 
                          ? 'bg-blue-500 text-white border-blue-600' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => onStartMathGame(difficulty)}
                  className="bg-amber-50 dark:bg-slate-700 text-amber-700 dark:text-amber-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-200 dark:border-slate-600"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-500" />
                  <span>Math Safari 🧮</span>
                </button>
                <button 
                  onClick={() => onStartMemoryGame(difficulty)}
                  className="bg-purple-50 dark:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-purple-200 dark:border-slate-600"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-500" />
                  <span>Memory Match 🃏</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setShowWordList(true)}
                  className="bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-blue-200 dark:border-slate-600"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Words ({(user.learnedWords || []).length})</span>
                </button>
                <button 
                  onClick={() => setShowSupportModal(true)}
                  className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/60"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Donate / Support</span>
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                <a 
                  href="https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20need%20support%20with%20PuzzlePlay!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                  <span>WhatsApp Support: 07070322351</span>
                </a>
              </div>
            </div>

            {/* Kids Educational Arcade Section */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>🎮</span> Kids Learning Arcade
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                    Fun educational games designed to make learning joyful!
                  </p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1 text-xs font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3.5 h-3.5" /> Easy to Play
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Game 1: Word Speller */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-b from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-4 border-blue-200 dark:border-blue-900/50 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl shadow-[0_3px_0_#1D4ED8]">
                        🔤
                      </div>
                      <button
                        onClick={() => speakGameDesc("Word Speller: Solve scrambled letters and fill in missing letters to learn spelling.")}
                        className="p-1.5 text-blue-500 hover:text-blue-700 bg-white dark:bg-slate-700 rounded-full border border-blue-200 dark:border-slate-600"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">
                      Word Speller
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                      Interactive spelling puzzles, missing letters, and word unscrambles.
                    </p>
                  </div>
                  <button
                    onClick={() => onStartGame('animals', difficulty)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-[0_3px_0_#1D4ED8] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Spelling</span>
                  </button>
                </motion.div>

                {/* Game 2: Math Safari */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-4 border-amber-200 dark:border-amber-900/50 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-[0_3px_0_#B45309]">
                        🧮
                      </div>
                      <button
                        onClick={() => speakGameDesc("Math Safari: Touch and count fruits, animals, and solve cheerful addition puzzles.")}
                        className="p-1.5 text-amber-600 hover:text-amber-800 bg-white dark:bg-slate-700 rounded-full border border-amber-200 dark:border-slate-600"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">
                      Math Safari
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                      Count fruits, tap animals, and master fun addition & multiplication!
                    </p>
                  </div>
                  <button
                    onClick={() => onStartMathGame(difficulty)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-[0_3px_0_#B45309] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Math</span>
                  </button>
                </motion.div>

                {/* Game 3: Memory Match */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-4 border-purple-200 dark:border-purple-900/50 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-[0_3px_0_#7E22CE]">
                        🃏
                      </div>
                      <button
                        onClick={() => speakGameDesc("Memory Match: Flip cards over to match friendly animal pairs and hear their names.")}
                        className="p-1.5 text-purple-600 hover:text-purple-800 bg-white dark:bg-slate-700 rounded-full border border-purple-200 dark:border-slate-600"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">
                      Memory Match
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                      Flip and match cute animals while learning phonics vocabulary!
                    </p>
                  </div>
                  <button
                    onClick={() => onStartMemoryGame(difficulty)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-[0_3px_0_#7E22CE] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Memory</span>
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Daily Challenge Card */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Daily Challenge
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Special Reward
                </span>
              </div>

              <motion.button
                whileHover={user.dailyCompletedDate !== new Date().toISOString().split('T')[0] ? { scale: 1.01 } : {}}
                whileTap={user.dailyCompletedDate !== new Date().toISOString().split('T')[0] ? { scale: 0.99 } : {}}
                onClick={() => {
                  if (user.dailyCompletedDate !== new Date().toISOString().split('T')[0]) {
                    onStartGame('daily', difficulty);
                  }
                }}
                className={`w-full rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-4 flex items-center justify-between shadow-sm transition-all ${
                  user.dailyCompletedDate === new Date().toISOString().split('T')[0]
                    ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 cursor-default opacity-85'
                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-yellow-300 dark:border-yellow-500/80 hover:border-yellow-400 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-5">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl sm:text-3xl shrink-0 border-2 border-yellow-200 dark:border-slate-600 shadow-sm">
                    {user.dailyCompletedDate === new Date().toISOString().split('T')[0] ? '✅' : '🌟'}
                  </div>
                  <div className="text-left">
                    <div className="text-base sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                      {user.dailyCompletedDate === new Date().toISOString().split('T')[0] ? 'Challenge Completed!' : "Today's Special Puzzle"}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {user.dailyCompletedDate === new Date().toISOString().split('T')[0] 
                        ? 'Awesome job! Come back tomorrow for a new puzzle.' 
                        : 'Complete to earn +5 bonus stars and advance your streak!'}
                    </div>
                  </div>
                </div>
                {user.dailyCompletedDate !== new Date().toISOString().split('T')[0] && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-yellow-400 text-yellow-950 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-sm shrink-0">
                    <Sparkles className="w-4 h-4" />
                    +5 Stars
                  </div>
                )}
              </motion.button>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 flex items-center gap-2">
                <span>📚</span> Choose a Category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStartGame(cat.id, difficulty)}
                    className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-4 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-750 transition-all flex items-center gap-4 shadow-sm text-left group"
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 transition-transform group-hover:scale-110 ${cat.color.split(' ')[0]}`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 truncate">
                        {cat.label}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        Spelling & Phonics
                      </div>
                    </div>
                    <div className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors font-black text-xl">
                      →
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showWordList && (
          <WordListModal user={user} onClose={() => setShowWordList(false)} />
        )}
        {showHelpCenter && (
          <HelpCenterModal onClose={() => setShowHelpCenter(false)} />
        )}
        {showAvatarShop && (
          <AvatarShopModal user={user} onClose={() => setShowAvatarShop(false)} onUpdateUser={onUpdateUser} />
        )}
        {showSupportModal && (
          <SupportModal onClose={() => setShowSupportModal(false)} />
        )}
      </AnimatePresence>
      
      {/* Footer Powered Marquee */}
      <FooterMarquee />
    </div>
  );
}
