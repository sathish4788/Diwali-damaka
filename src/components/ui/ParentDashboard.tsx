/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  CheckCircle,
  Coins,
  ShieldCheck,
  TrendingUp,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { BADGES } from '../../data/gameData';
import { GameAnalytics } from '../../types/game';
import { soundManager } from '../../audio/soundManager';

interface ParentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: GameAnalytics;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  isOpen,
  onClose,
  analytics,
}) => {
  if (!isOpen) return null;

  const mathAccuracy =
    analytics.mathQuestionsAttempted > 0
      ? Math.round((analytics.mathQuestionsCorrect / analytics.mathQuestionsAttempted) * 100)
      : 100;

  const safetyScore = Math.max(
    60,
    100 - analytics.safetyMistakesMade * 10
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 text-xl">👨‍👩‍👧‍👦</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Educational Analytics
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                Parent & Educator Learning Dashboard
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Learning Metric Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Money & Budgeting */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
              <Coins className="w-4 h-4" />
              <span>Budgeting</span>
            </div>
            <div className="text-xl font-black text-white tabular-nums">
              ₹{analytics.totalSpent} <span className="text-xs text-slate-400 font-normal">/ ₹{analytics.approvedBudget}</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">
              Saved ₹{analytics.remainingSavings} change!
            </p>
          </div>

          {/* 2. Practical Experience */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Safe Ignitions</span>
            </div>
            <div className="text-xl font-black text-white tabular-nums">
              {analytics.crackersSafelyLit}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Lit with incense stick at arm’s length
            </p>
          </div>

          {/* 3. Safety Score */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety Compliance</span>
            </div>
            <div className="text-xl font-black text-emerald-300 tabular-nums">
              100%
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Followed all statutory guidelines
            </p>
          </div>

          {/* 4. Fireworks Celebrated */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Bursts Experienced</span>
            </div>
            <div className="text-xl font-black text-white tabular-nums">
              {analytics.crackersSafelyLit}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Anaar, Chakras & Rockets
            </p>
          </div>
        </div>

        {/* Badges Earned Section */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Badges & Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded-xl bg-slate-800/90 border border-amber-500/20 flex items-start gap-2"
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Diwali Maths & Safety Certificate */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border-2 border-amber-400/40 text-center relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">
            ★ Official Diwali Dhamaka Certificate ★
          </div>
          <h4 className="text-base sm:text-lg font-bold font-heading text-white mt-0.5">
            Junior Festival Maths & Firework Safety Master
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Awarded for demonstrating exemplary budgeting acumen, mental addition & subtraction skills, and adherence to manufacturer firework safety guidelines!
          </p>
          <div className="mt-2 inline-flex items-center gap-4 text-xs font-bold text-amber-300">
            <span>Score: {safetyScore + analytics.mathQuestionsCorrect * 10} Pts</span>
            <span>•</span>
            <span>Safety Rank: Certified 🛡️</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
          >
            Close Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
