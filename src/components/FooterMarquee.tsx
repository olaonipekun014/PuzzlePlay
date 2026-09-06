import React from 'react';
import { motion } from 'motion/react';

export const FooterMarquee: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 dark:bg-black text-amber-300 dark:text-amber-200 font-extrabold py-2.5 overflow-hidden border-t-4 border-slate-700 dark:border-slate-800 shrink-0 select-none shadow-md z-10">
      <motion.div
        animate={{ x: ["100vw", "-100%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="whitespace-nowrap inline-block text-sm sm:text-base tracking-wide font-black"
      >
        🌟 Powered by Habib and Basil innovators. 🌟
      </motion.div>
    </footer>
  );
};
