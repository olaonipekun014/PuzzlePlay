import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sparkles, Check, Star, RefreshCw, Trophy, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Difficulty } from '../types';
import { playCorrectSound, playIncorrectSound, playPopSound, playFanfareSound } from '../utils/audio';
import { FooterMarquee } from './FooterMarquee';

interface MathQuestion {
  questionText: string;
  speechText: string;
  numA: number;
  numB: number;
  operator: '+' | '-' | '×';
  emoji: string;
  correctAnswer: number;
  options: number[];
  visualItemsA: string[];
  visualItemsB: string[];
}

const EMOJIS = ['🍎', '🍌', '🌟', '🐶', '🚗', '🚀', '🍓', '🐸', '🦁', '🎈'];

function generateMathQuestion(difficulty: Difficulty): MathQuestion {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  let numA = 1;
  let numB = 1;
  let operator: '+' | '-' | '×' = '+';
  let correctAnswer = 2;

  if (difficulty === 'easy') {
    // Small addition up to 10
    numA = Math.floor(Math.random() * 5) + 1; // 1 to 5
    numB = Math.floor(Math.random() * 5) + 1; // 1 to 5
    operator = '+';
    correctAnswer = numA + numB;
  } else if (difficulty === 'medium') {
    // Addition & subtraction up to 20
    const isSub = Math.random() > 0.5;
    if (isSub) {
      numA = Math.floor(Math.random() * 10) + 5; // 5 to 14
      numB = Math.floor(Math.random() * (numA - 1)) + 1; // 1 to numA-1
      operator = '-';
      correctAnswer = numA - numB;
    } else {
      numA = Math.floor(Math.random() * 10) + 2; // 2 to 11
      numB = Math.floor(Math.random() * 10) + 2; // 2 to 11
      operator = '+';
      correctAnswer = numA + numB;
    }
  } else {
    // Multiplication (2 to 6) or two-digit addition
    const isMult = Math.random() > 0.4;
    if (isMult) {
      numA = Math.floor(Math.random() * 5) + 2; // 2 to 6
      numB = Math.floor(Math.random() * 6) + 2; // 2 to 7
      operator = '×';
      correctAnswer = numA * numB;
    } else {
      numA = Math.floor(Math.random() * 20) + 10;
      numB = Math.floor(Math.random() * 20) + 10;
      operator = '+';
      correctAnswer = numA + numB;
    }
  }

  // Generate 3 unique wrong options
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const val = correctAnswer + offset;
    if (val >= 0 && val !== correctAnswer) {
      wrongOptions.add(val);
    }
  }

  const options = Array.from(wrongOptions);
  options.push(correctAnswer);
  options.sort(() => Math.random() - 0.5);

  const visualItemsA = Array(Math.min(numA, 12)).fill(emoji);
  const visualItemsB = Array(Math.min(numB, 12)).fill(emoji);

  const opWord = operator === '+' ? 'plus' : operator === '-' ? 'minus' : 'times';
  const speechText = `What is ${numA} ${opWord} ${numB}?`;

  return {
    questionText: `${numA} ${operator} ${numB} = ?`,
    speechText,
    numA,
    numB,
    operator,
    emoji,
    correctAnswer,
    options,
    visualItemsA,
    visualItemsB
  };
}

interface MathGameScreenProps {
  user: User;
  difficulty: Difficulty;
  onFinish: (scoreEarned: number, starsEarned: number) => void;
  onQuit: () => void;
}

export const MathGameScreen: React.FC<MathGameScreenProps> = ({
  user,
  difficulty,
  onFinish,
  onQuit
}) => {
  const TOTAL_ROUNDS = 5;
  const [round, setRound] = useState(0);
  const [currentQ, setCurrentQ] = useState<MathQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCounterHelper, setShowCounterHelper] = useState(difficulty === 'easy');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setCurrentQ(generateMathQuestion(difficulty));
  }, [difficulty]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.pitch = 1.1;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSelectAnswer = (choice: number) => {
    if (feedback !== null || !currentQ) return;
    setSelectedAnswer(choice);
    playPopSound();

    if (choice === currentQ.correctAnswer) {
      setFeedback('correct');
      playCorrectSound();
      const points = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;
      setScore(s => s + points);
      setStars(st => st + 1);

      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      speakText("Awesome! That is correct!");

      setTimeout(() => {
        if (round + 1 >= TOTAL_ROUNDS) {
          setIsCompleted(true);
          playFanfareSound();
          try {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.5 }
            });
          } catch (e) {
            // ignore
          }
        } else {
          setRound(r => r + 1);
          setCurrentQ(generateMathQuestion(difficulty));
          setSelectedAnswer(null);
          setFeedback(null);
        }
      }, 1400);
    } else {
      setFeedback('incorrect');
      playIncorrectSound();
      speakText(`Not quite! Try counting again.`);

      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 1200);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-800 dark:text-slate-100">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-amber-300 dark:border-amber-500 max-w-md w-full text-center shadow-xl space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/60 border-4 border-amber-300 flex items-center justify-center text-4xl shadow-inner">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Math Safari Champion!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-bold text-sm sm:text-base">
            Fantastic job! You solved all {TOTAL_ROUNDS} math puzzles like a superstar!
          </p>

          <div className="bg-amber-50 dark:bg-slate-700/60 rounded-2xl p-4 border-2 border-amber-200 dark:border-slate-600 flex justify-around items-center">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Score</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">+{score}</div>
            </div>
            <div className="w-0.5 h-10 bg-amber-200 dark:bg-slate-600" />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Stars</div>
              <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">+{stars} ⭐</div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onFinish(score, stars)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-[0_4px_0_#15803D] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Save & View Leaderboard</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-x-hidden">
      {/* Navigation */}
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
            <span className="text-xl sm:text-2xl">🧮</span>
            <span>Math Safari</span>
            <span className="text-xs uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
              {difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="bg-white dark:bg-slate-700 rounded-full px-3 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-blue-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Score:</span>
            <span className="text-blue-600 dark:text-blue-400">{score}</span>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-full px-3 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-yellow-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>{stars}</span>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-full px-3 py-1 sm:py-1.5 flex items-center gap-1 shadow-sm border-2 border-slate-200 dark:border-slate-600 font-extrabold text-xs sm:text-sm">
            <span>{round + 1}/{TOTAL_ROUNDS}</span>
          </div>
        </div>
      </nav>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-between p-3.5 sm:p-6 max-w-2xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="w-full text-center">
          <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden w-full shadow-inner">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${((round) / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>
        </div>

        {/* Feedback Badge */}
        <div className="h-10 flex items-center justify-center my-1">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2 text-base sm:text-lg font-black text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-4 py-1.5 rounded-full border-2 border-green-300 dark:border-green-700 shadow-sm"
              >
                <Check className="w-5 h-5" /> Super Math Whiz!
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: [0, -8, 8, -8, 8, 0], opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-4 py-1.5 rounded-full border-2 border-rose-300 dark:border-rose-700 shadow-sm"
              >
                Count carefully and try again!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Math Question Board */}
        {currentQ && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 border-4 border-slate-200 dark:border-slate-700 shadow-md text-center space-y-5">
            {/* Audio Button & Instruction */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Solve the Math Puzzle
              </span>
              <button
                onClick={() => speakText(currentQ.speechText)}
                className="p-2 bg-blue-100 dark:bg-slate-700 hover:bg-blue-200 text-blue-600 dark:text-blue-300 rounded-full transition-transform active:scale-95"
                title="Read question aloud"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Big Math Expression */}
            <div className="text-4xl sm:text-6xl font-black text-blue-600 dark:text-blue-400 tracking-wider select-none">
              {currentQ.numA} {currentQ.operator} {currentQ.numB} = <span className="text-amber-500">?</span>
            </div>

            {/* Visual Counter representation for kids */}
            {showCounterHelper && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/70 dark:bg-slate-700/50 rounded-2xl p-3 sm:p-4 border-2 border-amber-200 dark:border-slate-600"
              >
                <div className="text-xs font-extrabold text-amber-700 dark:text-amber-300 mb-2">
                  Touch & Count:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl select-none">
                  <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-600 shadow-sm">
                    {currentQ.visualItemsA.map((it, idx) => (
                      <span key={`a-${idx}`} className="hover:scale-125 transition-transform cursor-pointer" onClick={() => playPopSound()}>
                        {it}
                      </span>
                    ))}
                  </div>

                  <span className="text-2xl font-black text-slate-500">{currentQ.operator}</span>

                  <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-600 shadow-sm">
                    {currentQ.visualItemsB.map((it, idx) => (
                      <span key={`b-${idx}`} className="hover:scale-125 transition-transform cursor-pointer" onClick={() => playPopSound()}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Helper toggle */}
            <button
              onClick={() => setShowCounterHelper(!showCounterHelper)}
              className="text-xs font-extrabold text-slate-500 hover:text-blue-500 dark:text-slate-400 underline cursor-pointer"
            >
              {showCounterHelper ? 'Hide visual counter' : 'Need help? Show visual counter'}
            </button>
          </div>
        )}

        {/* 4 Large Choice Buttons */}
        {currentQ && (
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 my-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              
              let btnStyle = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-blue-400 shadow-[0_4px_0_#CBD5E1] dark:shadow-[0_4px_0_#334155]";
              
              if (feedback && isSelected) {
                if (isCorrect) {
                  btnStyle = "bg-green-500 text-white border-green-600 shadow-[0_4px_0_#15803D]";
                } else {
                  btnStyle = "bg-rose-500 text-white border-rose-600 shadow-[0_4px_0_#BE123C]";
                }
              }

              const colors = [
                'hover:border-blue-400',
                'hover:border-amber-400',
                'hover:border-purple-400',
                'hover:border-green-400'
              ];

              return (
                <motion.button
                  key={idx}
                  whileHover={!feedback ? { scale: 1.03 } : {}}
                  whileTap={!feedback ? { scale: 0.97 } : {}}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={feedback !== null}
                  className={`h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-2xl sm:text-4xl font-black border-4 transition-all flex items-center justify-center cursor-pointer active:translate-y-[2px] active:shadow-none select-none ${btnStyle} ${colors[idx % colors.length]}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2"></div>
      </main>

      <FooterMarquee />
    </div>
  );
};
