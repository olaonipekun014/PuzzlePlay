import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Star, RefreshCw, Volume2, Sparkles, Check, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Difficulty } from '../types';
import { playCorrectSound, playIncorrectSound, playPopSound, playFanfareSound } from '../utils/audio';
import { FooterMarquee } from './FooterMarquee';

interface CardItem {
  id: string;
  emoji: string;
  label: string;
  matched: boolean;
}

const MEMORY_ITEMS = [
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🐬', label: 'Dolphin' },
  { emoji: '🍓', label: 'Berry' },
  { emoji: '🐶', label: 'Puppy' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🐯', label: 'Tiger' },
];

function setupCards(difficulty: Difficulty): CardItem[] {
  let pairCount = 3; // easy: 3 pairs (6 cards)
  if (difficulty === 'medium') pairCount = 6; // medium: 6 pairs (12 cards)
  if (difficulty === 'hard') pairCount = 8; // hard: 8 pairs (16 cards)

  const selected = [...MEMORY_ITEMS].sort(() => Math.random() - 0.5).slice(0, pairCount);
  const deck: CardItem[] = [];

  selected.forEach((item, index) => {
    deck.push({
      id: `${item.label}-1-${index}`,
      emoji: item.emoji,
      label: item.label,
      matched: false
    });
    deck.push({
      id: `${item.label}-2-${index}`,
      emoji: item.emoji,
      label: item.label,
      matched: false
    });
  });

  return deck.sort(() => Math.random() - 0.5);
}

interface MemoryGameScreenProps {
  user: User;
  difficulty: Difficulty;
  onFinish: (scoreEarned: number, starsEarned: number) => void;
  onQuit: () => void;
}

export const MemoryGameScreen: React.FC<MemoryGameScreenProps> = ({
  user,
  difficulty,
  onFinish,
  onQuit
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const totalPairs = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : 8;

  useEffect(() => {
    setCards(setupCards(difficulty));
  }, [difficulty]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.rate = 0.95;
      utter.pitch = 1.1;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (flippedIndices.includes(index) || cards[index].matched) return;

    playPopSound();
    speakWord(cards[index].label);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [idx1, idx2] = newFlipped;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.label === card2.label) {
        // Matched!
        setTimeout(() => {
          playCorrectSound();
          try {
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore
          }

          setCards(prev =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, matched: true } : c))
          );
          setMatches(m => {
            const newM = m + 1;
            if (newM >= totalPairs) {
              setTimeout(() => {
                setIsCompleted(true);
                playFanfareSound();
                try {
                  confetti({
                    particleCount: 70,
                    spread: 80,
                    origin: { y: 0.5 }
                  });
                } catch (e) {}
              }, 600);
            }
            return newM;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          playIncorrectSound();
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const calculateScore = () => {
    const base = totalPairs * 25;
    const efficiencyBonus = Math.max(0, (totalPairs * 2 - moves) * 5);
    return base + efficiencyBonus;
  };

  const calculateStars = () => {
    return totalPairs >= 6 ? 3 : 2;
  };

  if (isCompleted) {
    const scoreEarned = calculateScore();
    const starsEarned = calculateStars();

    return (
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-800 dark:text-slate-100">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-purple-300 dark:border-purple-500 max-w-md w-full text-center shadow-xl space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/60 border-4 border-purple-300 flex items-center justify-center text-4xl shadow-inner">
            🃏
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Memory Master!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-bold text-sm sm:text-base">
            You matched all {totalPairs} pairs in only {moves} moves! Your brain is super sharp!
          </p>

          <div className="bg-purple-50 dark:bg-slate-700/60 rounded-2xl p-4 border-2 border-purple-200 dark:border-slate-600 flex justify-around items-center">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Score</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">+{scoreEarned}</div>
            </div>
            <div className="w-0.5 h-10 bg-purple-200 dark:bg-slate-600" />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Stars</div>
              <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">+{starsEarned} ⭐</div>
            </div>
          </div>

          <button
            onClick={() => onFinish(scoreEarned, starsEarned)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-[0_4px_0_#15803D] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-5 h-5" />
            <span>Save & View Leaderboard</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="h-16 sm:h-20 bg-white dark:bg-slate-800 border-b-4 border-blue-200 dark:border-slate-700 flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onQuit}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
            title="Exit game"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="font-black text-base sm:text-xl flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🃏</span>
            <span>Memory Match</span>
            <span className="text-xs uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-bold">
              {difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white dark:bg-slate-700 rounded-full px-3 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-purple-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Pairs:</span>
            <span className="text-purple-600 dark:text-purple-400 font-black">{matches}/{totalPairs}</span>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-full px-3 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-slate-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Moves:</span>
            <span className="text-slate-700 dark:text-slate-200">{moves}</span>
          </div>
        </div>
      </nav>

      {/* Main Board */}
      <main className="flex-1 flex flex-col items-center justify-between p-3.5 sm:p-6 max-w-2xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="w-full text-center mb-2">
          <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden w-full shadow-inner">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(matches / totalPairs) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 my-1 text-center">
          Tap 2 cards to find the matching pair!
        </p>

        {/* Card Grid */}
        <div
          className={`w-full grid gap-2.5 sm:gap-3.5 my-auto max-w-lg ${
            difficulty === 'easy'
              ? 'grid-cols-3'
              : difficulty === 'medium'
              ? 'grid-cols-3 sm:grid-cols-4'
              : 'grid-cols-4'
          }`}
        >
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || card.matched;

            return (
              <motion.button
                key={card.id}
                whileHover={!card.matched && !isFlipped ? { scale: 1.04 } : {}}
                whileTap={!card.matched && !isFlipped ? { scale: 0.96 } : {}}
                onClick={() => handleCardClick(idx)}
                disabled={card.matched || flippedIndices.includes(idx)}
                className={`aspect-square rounded-2xl sm:rounded-3xl border-3 sm:border-4 flex flex-col items-center justify-center p-2 transition-all select-none shadow-sm cursor-pointer ${
                  card.matched
                    ? 'bg-green-100 dark:bg-green-950/60 border-green-400 dark:border-green-600 opacity-90'
                    : isFlipped
                    ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-[0_4px_0_#9333EA]'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-700 text-white shadow-[0_4px_0_#4338CA] hover:brightness-105'
                }`}
              >
                {isFlipped ? (
                  <motion.div
                    initial={{ scale: 0.6, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl sm:text-4xl leading-none">{card.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase text-slate-700 dark:text-slate-200 mt-1 truncate max-w-full">
                      {card.label}
                    </span>
                  </motion.div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-black opacity-40">
                    ❓
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer spacing */}
        <div className="pt-2"></div>
      </main>

      <FooterMarquee />
    </div>
  );
};
