import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, Star, Sparkles, BookOpen, MessageCircle, Phone, Copy, Check, ExternalLink } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function HelpCenterModal({ onClose }: Props) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const supportPhone = "07070322351";
  const whatsappUrl = "https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20need%20support%20with%20PuzzlePlay!";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(supportPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 bg-blue-50 dark:bg-slate-700 border-b-4 border-slate-200 dark:border-slate-600 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-2xl border-2 border-blue-200 dark:border-blue-700">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-blue-900 dark:text-blue-100">Help Center</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                How to Play & Support
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-2 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 space-y-6">
          <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="text-blue-500" /> Getting Started
            </h3>
            <p>Welcome to PuzzlePlay! Choose a difficulty level and click on a category like "Animals", "Space", or try the new "Math Safari" and "Memory Match" games to learn while playing.</p>
          </section>
          
          <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Star className="text-yellow-500" /> Earning Coins & Stars
            </h3>
            <p>Every time you complete a round, you earn stars and coins based on your difficulty level. Easy gives 3-4 coins, Medium gives 5-7 coins, and Hard gives 10-12 coins. Spend coins in the Avatar Shop to unlock cool new profiles!</p>
          </section>

          <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="text-green-500" /> My Word List
            </h3>
            <p>Check out "My Word List" from the dashboard to review all the words you have learned. You can even click on words to hear how they are pronounced and read their definitions!</p>
          </section>

          {/* Contact Support Section */}
          <section className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                Contact Support on WhatsApp
              </h3>
              <span className="text-xs font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full">
                WhatsApp: 07070322351
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              Need assistance, have feedback, or want to report an issue? Reach out to Habib and Basil directly on WhatsApp!
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_3px_0_#15803D] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Open WhatsApp (07070322351)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleCopyPhone}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 border-2 border-emerald-300 dark:border-emerald-700 transition-all shadow-sm"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPhone ? 'Copied 07070322351!' : 'Copy Number'}</span>
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
