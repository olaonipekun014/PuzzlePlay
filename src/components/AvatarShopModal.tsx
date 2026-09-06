import React from 'react';
import { motion } from 'motion/react';
import { X, Store, Lock, Check } from 'lucide-react';
import { User } from '../types';
import { EMOJI_AVATARS, PREMIUM_AVATARS } from '../data';

interface Props {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}

export function AvatarShopModal({ user, onClose, onUpdateUser }: Props) {
  const handleSelectAvatar = (avatar: string) => {
    onUpdateUser({ ...user, avatar });
  };

  const handleBuyAvatar = (avatar: string, price: number) => {
    if (user.coins >= price && !user.purchasedAvatars.includes(avatar)) {
      onUpdateUser({ 
        ...user, 
        coins: user.coins - price,
        purchasedAvatars: [...user.purchasedAvatars, avatar],
        avatar
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 bg-yellow-50 dark:bg-slate-700 border-b-4 border-slate-200 dark:border-slate-600 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-2xl border-2 border-yellow-200 dark:border-yellow-700">
              <Store className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-yellow-900 dark:text-yellow-100">Avatar Shop</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Coins: {user.coins}
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

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-wider">Free Avatars</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {EMOJI_AVATARS.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => handleSelectAvatar(avatar)}
                  className={`relative w-full aspect-square rounded-2xl flex items-center justify-center text-4xl border-2 transition-transform hover:scale-105 ${user.avatar === avatar ? 'bg-sky-100 dark:bg-sky-900 border-sky-400 shadow-md scale-105' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                >
                  {avatar}
                  {user.avatar === avatar && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-800">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-wider">Premium Avatars</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {PREMIUM_AVATARS.map(({ emoji, price }) => {
                const isOwned = user.purchasedAvatars.includes(emoji);
                const isSelected = user.avatar === emoji;
                const canAfford = user.coins >= price;
                
                return (
                  <button
                    key={emoji}
                    onClick={() => isOwned ? handleSelectAvatar(emoji) : handleBuyAvatar(emoji, price)}
                    disabled={!isOwned && !canAfford}
                    className={`relative w-full rounded-2xl p-2 flex flex-col items-center justify-center text-4xl border-2 transition-all ${
                      isSelected ? 'bg-sky-100 dark:bg-sky-900 border-sky-400 shadow-md scale-105' 
                      : isOwned ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-700'
                      : canAfford ? 'bg-slate-100 dark:bg-slate-800 border-yellow-300 hover:bg-yellow-50 dark:hover:bg-slate-700 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed grayscale'
                    }`}
                  >
                    <div className="my-2">{emoji}</div>
                    
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-800 z-10">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    
                    {!isOwned && (
                      <div className={`mt-2 text-sm font-bold flex items-center justify-center gap-1 w-full rounded-lg py-1 ${canAfford ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>
                        {!canAfford && <Lock className="w-3 h-3" />}
                        {price}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
