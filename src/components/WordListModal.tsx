import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, WordItem } from '../types';
import { WORD_BANK, CATEGORIES } from '../data';
import { X, BookOpen, Volume2 } from 'lucide-react';

interface Props {
  user: User;
  onClose: () => void;
}

export function WordListModal({ user, onClose }: Props) {
  const [selectedWord, setSelectedWord] = useState<{ word: string, hint: string, color: string } | null>(null);

  // Group learned words by category
  const wordsByCategory = useMemo(() => {
    const grouped: Record<string, { word: string, hint: string }[]> = {};
    const learnedSet = new Set(user.learnedWords || []);

    CATEGORIES.forEach(cat => {
      if (cat.id === 'daily') return;
      grouped[cat.id] = [];
      
      // Look through all difficulties for this category
      ['easy', 'medium', 'hard'].forEach(diff => {
        const bankWords = WORD_BANK[cat.id as keyof typeof WORD_BANK][diff as keyof typeof WORD_BANK[typeof cat.id]];
        bankWords.forEach(w => {
          if (learnedSet.has(w.word) && !grouped[cat.id].find(gw => gw.word === w.word)) {
            grouped[cat.id].push({ word: w.word, hint: w.hint });
          }
        });
      });
    });
    return grouped;
  }, [user.learnedWords]);

  const handleSpeakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl border-4 border-slate-200 shadow-2xl flex flex-col overflow-hidden relative"
      >
        <div className="p-6 bg-blue-50 border-b-4 border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-2xl border-2 border-blue-200">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-blue-900">My Word List</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {(user.learnedWords || []).length} Words Learned
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-slate-100 transition-colors border-2 border-slate-200"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {(user.learnedWords || []).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-slate-600 mb-2">Your book is empty!</h3>
              <p className="text-slate-400 font-medium max-w-sm">Play some puzzles to fill your word list with awesome new words.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {CATEGORIES.filter(c => c.id !== 'daily').map(cat => {
                const words = wordsByCategory[cat.id];
                if (!words || words.length === 0) return null;
                
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="text-xl font-extrabold text-slate-700">{cat.label}</h3>
                      <span className="ml-2 bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                        {words.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {words.map(w => (
                        <button 
                          key={w.word}
                          onClick={() => setSelectedWord({ word: w.word, hint: w.hint, color: cat.color })}
                          className={`px-4 py-2 rounded-xl text-lg font-bold border-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${cat.color.replace('bg-', 'bg-opacity-20 bg-').replace('border-', 'border-opacity-50 border-')}`}
                          style={{ backgroundColor: 'white' }} // override just in case
                        >
                          <span className={cat.color.split(' ').find(c => c.startsWith('text-'))}>{w.word}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedWord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setSelectedWord(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl border-4 border-slate-200 shadow-2xl p-6 max-w-sm w-full text-center relative"
              >
                <button
                  onClick={() => setSelectedWord(null)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className={`text-3xl font-black mb-2 ${selectedWord.color.split(' ').find(c => c.startsWith('text-'))}`}>
                  {selectedWord.word}
                </h3>
                <p className="text-lg font-bold text-slate-600 mb-6 px-4">
                  "{selectedWord.hint}"
                </p>
                <button
                  onClick={() => handleSpeakWord(selectedWord.word)}
                  className="mx-auto w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-[0_4px_0_#1D4ED8] transition-all active:translate-y-[4px] active:shadow-[0_0px_0_#1D4ED8]"
                  title="Speak Word"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
