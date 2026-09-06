import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Copy, Check, Sparkles, Gift, MessageCircle, Phone, ExternalLink } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function SupportModal({ onClose }: Props) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const accountNumber = "7070322351";
  const bankName = "Palmpay";
  const accountName = "Ogunsolu Habib Olaonipekun";
  const supportPhone = "07070322351";
  const whatsappUrl = "https://wa.me/2347070322351?text=Hello%20Habib%20and%20Basil,%20I%20am%20contacting%20you%20regarding%20PuzzlePlay!";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(supportPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleCopyAll = () => {
    const text = `Bank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}\nWhatsApp Support: ${supportPhone}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl border-4 border-rose-200 dark:border-rose-900/50 shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-slate-800 dark:via-rose-950/30 dark:to-slate-800 border-b-4 border-rose-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-[0_4px_0_#BE123C] shrink-0">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 leading-tight">
                Support Our Mission
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                A Little Love from Your Heart
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border-2 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Sweet message */}
          <div className="bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl p-4 sm:p-5 border-2 border-rose-200 dark:border-rose-900/40 text-center">
            <div className="flex justify-center mb-2 text-rose-500">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 mb-2">
              Every Child Deserves to Learn with Joy
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              PuzzlePlay was crafted with pure passion by <strong>Habib and Basil</strong> to give every child free, friendly, and engaging spelling education without intrusive ads.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium mt-2">
              Your kind donation—even a token as small as a warm smile—fuels our servers, unlocks new learning levels, and lights the torch of knowledge for young minds.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-400">
                Official Donation Details
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
                <Gift className="w-3 h-3" /> Direct Support
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Bank / Platform</div>
                  <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">{bankName}</div>
                </div>
                <span className="text-xl">💳</span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Account Number</div>
                  <div className="text-lg sm:text-xl font-mono font-black text-rose-600 dark:text-rose-400 tracking-wider">
                    {accountNumber}
                  </div>
                </div>
                <button
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-rose-200 dark:border-rose-800"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Account Name</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {accountName}
                  </div>
                </div>
                <span className="text-xl">👤</span>
              </div>
            </div>

            <button
              onClick={handleCopyAll}
              className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-100 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {copiedAll ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'All Details Copied to Clipboard!' : 'Copy All Bank Details'}
            </button>
          </div>

          {/* WhatsApp Support Box */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-sm sm:text-base">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <span>Contact Support on WhatsApp</span>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Fast Reply 🟢
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Have a question, feedback, suggestion, or want to confirm a donation? Reach Habib and Basil directly on WhatsApp:
            </p>

            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Number</div>
                  <div className="text-base sm:text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {supportPhone}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopyPhone}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-emerald-200 dark:border-emerald-800"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3px_0_#15803D] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat With Us on WhatsApp (07070322351)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Heartfelt closing */}
          <div className="text-center py-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
              "Whoever brings joy and knowledge to a child plants a blessing that never fades."
            </p>
            <p className="text-xs font-bold text-rose-500 mt-1">
              Thank you for having a heart of gold! Habib & Basil 🙏
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-200 dark:border-slate-700 text-center">
          <button
            onClick={onClose}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-[0_4px_0_#BE123C] transition-all active:translate-y-[2px] active:shadow-[0_2px_0_#BE123C]"
          >
            Done & Thank You!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
