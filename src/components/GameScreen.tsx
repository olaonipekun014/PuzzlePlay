import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Difficulty, User, WordItem, GameMode } from '../types';
import { WORD_BANK, CATEGORIES } from '../data';
import { playCorrectSound, playIncorrectSound } from '../utils/audio';
import { Star, HelpCircle, X, Check, Volume2 } from 'lucide-react';
import { FooterMarquee } from './FooterMarquee';

interface Props {
  user: User;
  category: Category;
  difficulty: Difficulty;
  onFinish: (score: number, stars: number, completedWords: string[]) => void;
  onQuit: () => void;
  onSpendStar: () => void;
}

const ROUND_LENGTH = 5;

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getMissingIndices(word: string, percentage: number): number[] {
  const count = Math.max(1, Math.floor(word.length * percentage));
  const indices = Array.from({ length: word.length }, (_, i) => i);
  return shuffle(indices).slice(0, count);
}

export function GameScreen({ user, category, difficulty, onFinish, onQuit, onSpendStar }: Props) {
  const [roundWords, setRoundWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [gameMode, setGameMode] = useState<GameMode>('scramble');
  
  // Scramble State
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; letter: string; used: boolean }[]>([]);
  const [placedLetters, setPlacedLetters] = useState<{ id: string; letter: string }[]>([]);
  
  // Missing Letters State
  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [filledLetters, setFilledLetters] = useState<Record<number, string>>({});
  
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [showHintText, setShowHintText] = useState(false);

  // Initialize round
  useEffect(() => {
    if (category === 'daily') {
      const allWords = [
        ...WORD_BANK.animals[difficulty],
        ...WORD_BANK.space[difficulty],
        ...WORD_BANK.food[difficulty],
        ...WORD_BANK.magic[difficulty]
      ];
      setRoundWords(shuffle(allWords).slice(0, ROUND_LENGTH));
    } else {
      const bank = WORD_BANK[category][difficulty];
      const selected = shuffle(bank).slice(0, ROUND_LENGTH);
      setRoundWords(selected);
    }
  }, [category, difficulty]);

  // Setup current word
  useEffect(() => {
    if (roundWords.length === 0 || currentIndex >= roundWords.length) return;
    
    const word = roundWords[currentIndex].word;
    const mode = Math.random() > 0.5 ? 'scramble' : 'missing_letters';
    setGameMode(mode);
    setFeedback('none');
    setShowHintText(false);

    if (mode === 'scramble') {
      const letters = word.split('').map((letter, i) => ({
        id: `${letter}-${i}`,
        letter,
        used: false
      }));
      setScrambledLetters(shuffle(letters));
      setPlacedLetters([]);
    } else {
      // missing letters mode: replace ~40% of letters
      const missing = getMissingIndices(word, 0.4);
      setMissingIndices(missing);
      setFilledLetters({});
    }
  }, [currentIndex, roundWords]);

  const catInfo = category === 'daily' 
    ? { id: 'daily', label: 'Daily Challenge', icon: '🗓️', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
    : CATEGORIES.find(c => c.id === category)!;
  const currentWord = roundWords[currentIndex]?.word;

  const handleScrambleSelect = (id: string, letter: string) => {
    if (feedback !== 'none') return;
    setScrambledLetters(prev => prev.map(l => l.id === id ? { ...l, used: true } : l));
    setPlacedLetters(prev => [...prev, { id, letter }]);
  };

  const handleScrambleUndo = (index: number, id: string) => {
    if (feedback !== 'none') return;
    setPlacedLetters(prev => prev.filter((_, i) => i !== index));
    setScrambledLetters(prev => prev.map(l => l.id === id ? { ...l, used: false } : l));
  };

  const handleKeyboardType = (key: string) => {
    if (feedback !== 'none' || gameMode !== 'missing_letters') return;
    
    // find first empty missing index
    const emptyIndex = missingIndices.find(idx => !filledLetters[idx]);
    if (emptyIndex !== undefined) {
      setFilledLetters(prev => ({ ...prev, [emptyIndex]: key }));
    }
  };

  const handleMissingUndo = (index: number) => {
    if (feedback !== 'none') return;
    setFilledLetters(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  // Check completion
  useEffect(() => {
    if (!currentWord || feedback !== 'none') return;

    let isComplete = false;
    let isCorrect = false;

    if (gameMode === 'scramble') {
      if (placedLetters.length === currentWord.length) {
        isComplete = true;
        isCorrect = placedLetters.map(l => l.letter).join('') === currentWord;
      }
    } else {
      const allFilled = missingIndices.every(idx => filledLetters[idx] !== undefined);
      if (allFilled) {
        isComplete = true;
        isCorrect = currentWord.split('').every((char, idx) => {
          if (missingIndices.includes(idx)) {
            return filledLetters[idx] === char;
          }
          return true;
        });
      }
    }

    if (isComplete) {
      if (isCorrect) {
        playCorrectSound();
        setFeedback('correct');
        setScore(prev => prev + 100);
        setTimeout(() => {
          if (currentIndex < roundWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            // End of round
            onFinish(score + 100, 10, roundWords.map(w => w.word)); // arbitrary stars per round completion
          }
        }, 1500);
      } else {
        playIncorrectSound();
        setFeedback('incorrect');
        setTimeout(() => {
          // Reset current attempt
          setFeedback('none');
          if (gameMode === 'scramble') {
            setPlacedLetters([]);
            setScrambledLetters(prev => prev.map(l => ({ ...l, used: false })));
          } else {
            setFilledLetters({});
          }
        }, 1000);
      }
    }
  }, [placedLetters, filledLetters, gameMode, currentWord, feedback, currentIndex, roundWords.length, score, missingIndices, onFinish]);

  const handleHintClick = () => {
    if (user.stars <= 0) return;
    onSpendStar();
    setShowHintText(true);
    
    // Also reveal one letter
    if (gameMode === 'scramble') {
      const targetChar = currentWord[placedLetters.length];
      const availableChar = scrambledLetters.find(l => !l.used && l.letter === targetChar);
      if (availableChar) {
        handleScrambleSelect(availableChar.id, availableChar.letter);
      }
    } else {
      const emptyIndex = missingIndices.find(idx => !filledLetters[idx]);
      if (emptyIndex !== undefined) {
        setFilledLetters(prev => ({ ...prev, [emptyIndex]: currentWord[emptyIndex] }));
      }
    }
  };

  const handleSpeakWord = () => {
    if (currentWord && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.toLowerCase());
      utterance.rate = 0.8; // slightly slower for spelling practice
      window.speechSynthesis.speak(utterance);
    }
  };

  if (roundWords.length === 0) {
    return (
      <div className="h-full min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-200">
        Loading puzzle...
      </div>
    );
  }

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="h-16 sm:h-20 bg-white dark:bg-slate-800 border-b-4 border-blue-200 dark:border-slate-700 flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onQuit} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
            title="Exit game"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="font-extrabold text-base sm:text-xl flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">{catInfo.icon}</span>
            <span className="truncate max-w-[120px] sm:max-w-none">{catInfo.label}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-blue-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">Score:</span>
            <span className="text-blue-600 dark:text-blue-400">{score}</span>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-yellow-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>{user.stars}</span>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-slate-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span className="text-slate-700 dark:text-slate-200">{currentIndex + 1}/{roundWords.length}</span>
          </div>
        </div>
      </nav>

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-between p-3 sm:p-6 max-w-4xl w-full mx-auto">
        {/* Game Mode Title & Progress Bar */}
        <div className="w-full max-w-lg text-center mb-2">
          <h2 className="text-base sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {gameMode === 'scramble' ? '🔀 Word Scramble' : '✏️ Missing Letters'}
          </h2>
          <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden w-full shadow-inner">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex) / roundWords.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Feedback Animation Area */}
        <div className="h-10 sm:h-12 flex items-center justify-center my-1">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-4 sm:px-6 py-1.5 rounded-full border-2 border-green-300 dark:border-green-700 shadow-sm"
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6" /> Awesome!
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: [0, -8, 8, -8, 8, 0], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-4 sm:px-6 py-1.5 rounded-full border-2 border-rose-300 dark:border-rose-700 shadow-sm"
              >
                Oops! Try again.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clue & Audio Speak Section */}
        <div className="w-full flex flex-col items-center mb-4">
          <div className="flex flex-wrap gap-2 items-center justify-center mb-4">
            {showHintText && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm font-bold text-blue-800 dark:text-blue-200 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-2xl border-2 border-blue-200 dark:border-blue-700 max-w-sm text-center"
              >
                💡 Clue: {roundWords[currentIndex].hint}
              </motion.div>
            )}
            
            <button
              onClick={handleSpeakWord}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-[0_3px_0_#1D4ED8] transition-all active:translate-y-[2px] active:shadow-none shrink-0"
              title="Speak Word"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Target Slots */}
          <div className="flex gap-1.5 sm:gap-2.5 md:gap-3 justify-center flex-wrap max-w-full px-2 py-2">
            {currentWord?.split('').map((char, idx) => {
              if (gameMode === 'scramble') {
                const placed = placedLetters[idx];
                return (
                  <div 
                    key={idx}
                    onClick={() => placed && handleScrambleUndo(idx, placed.id)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black transition-all cursor-pointer select-none ${
                      placed 
                        ? 'bg-white dark:bg-slate-800 border-3 sm:border-4 border-blue-500 shadow-[0_4px_0_#2563EB] text-blue-900 dark:text-blue-200' 
                        : 'bg-blue-100/50 dark:bg-slate-800/50 border-3 sm:border-4 border-dashed border-blue-300 dark:border-slate-600'
                    }`}
                  >
                    {placed?.letter || ''}
                  </div>
                );
              } else {
                const isMissing = missingIndices.includes(idx);
                const filledChar = filledLetters[idx];
                return (
                  <div 
                    key={idx}
                    onClick={() => isMissing && filledChar && handleMissingUndo(idx)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black transition-all select-none ${
                      !isMissing 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-3 sm:border-4 border-slate-300 dark:border-slate-600 shadow-sm' 
                        : filledChar 
                          ? 'bg-white dark:bg-slate-800 border-3 sm:border-4 border-blue-500 shadow-[0_4px_0_#2563EB] text-blue-900 dark:text-blue-200 cursor-pointer'
                          : 'bg-blue-100/50 dark:bg-slate-800/50 border-3 sm:border-4 border-dashed border-blue-300 dark:border-slate-600 text-transparent'
                    }`}
                  >
                    {!isMissing ? char : (filledChar || '')}
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Source Letters / Interactive Keyboard */}
        <div className="w-full flex flex-col items-center justify-center my-3">
          {gameMode === 'scramble' && (
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap max-w-xl">
              {scrambledLetters.map((l) => (
                <motion.button
                  key={l.id}
                  whileHover={!l.used ? { scale: 1.05 } : {}}
                  whileTap={!l.used ? { scale: 0.95 } : {}}
                  onClick={() => !l.used && handleScrambleSelect(l.id, l.letter)}
                  className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl text-xl sm:text-2xl md:text-3xl font-black flex items-center justify-center transition-all select-none ${
                    l.used 
                      ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 border-2 sm:border-3 border-slate-200 dark:border-slate-700 shadow-none cursor-default' 
                      : 'bg-white dark:bg-slate-800 border-3 sm:border-4 border-blue-500 shadow-[0_4px_0_#2563EB] text-blue-900 dark:text-blue-200 cursor-pointer active:translate-y-[2px]'
                  }`}
                >
                  {l.letter}
                </motion.button>
              ))}
            </div>
          )}

          {gameMode === 'missing_letters' && (
            <div className="w-full max-w-md flex flex-col gap-1.5 sm:gap-2 items-center">
              {KEYBOARD_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
                  {row.map(letter => (
                    <motion.button
                      key={letter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, y: 1 }}
                      onClick={() => handleKeyboardType(letter)}
                      className="flex-1 max-w-[36px] sm:max-w-[42px] h-10 sm:h-12 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-[0_2px_0_#94A3B8] dark:shadow-[0_2px_0_#475569] rounded-lg sm:rounded-xl text-base sm:text-lg font-black text-slate-700 dark:text-slate-200 hover:border-blue-400 active:translate-y-[2px] transition-colors"
                    >
                      {letter}
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hint Action Button */}
        <div className="mt-auto py-2">
          <button
            onClick={handleHintClick}
            disabled={user.stars <= 0 || showHintText}
            className="bg-slate-500 hover:bg-slate-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base border-none shadow-[0_4px_0_#334155] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all active:translate-y-[2px] active:shadow-none flex items-center gap-2"
          >
            <span>Need a Hint?</span>
            <span className="bg-slate-600 px-2 py-0.5 rounded-lg text-xs font-extrabold text-yellow-300">1 ⭐</span>
          </button>
        </div>
      </main>

      <FooterMarquee />
    </div>
  );
}
