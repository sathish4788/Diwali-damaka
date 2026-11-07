/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Level1BudgetProps {
  onBudgetApproved: (budget: number) => void;
  onCharacterSpeaking: (charId: string | null) => void;
}

export const Level1Budget: React.FC<Level1BudgetProps> = ({
  onBudgetApproved,
  onCharacterSpeaking,
}) => {
  const [selectedBudget, setSelectedBudget] = useState<number>(500);
  const [justificationStep, setJustificationStep] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('balanced');
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const budgetOptions = [
    {
      amount: 500,
      label: '₹500 (Appa’s Base Offer)',
      status: 'Easily Approved',
      color: 'border-blue-500/40 bg-blue-950/40 text-blue-200',
      description: 'Ideal for sparklers, flower pots, and chakras!',
      mathNote: '2 Sparklers (₹80) + 2 Chakras (₹120) + 1 Flower Pot (₹80) + 1 Fountain (₹100) = ₹380. Remaining Savings: ₹120!',
    },
    {
      amount: 600,
      label: '₹600 (Bargaining Request)',
      status: 'Explain Your Plan',
      color: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
      description: 'Add the Safe Celebration Pack for the whole family!',
      mathNote: 'Base items + Celebration Pack (₹150) = ₹530. Remaining Savings: ₹70 for Diwali sweets!',
    },
    {
      amount: 700,
      label: '₹700 (Grand Festival Budget)',
      status: 'Make a Convincing Plan',
      color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200',
      description: 'Includes Aerial Rockets + Ear protection & sparklers!',
      mathNote: 'All favourites + Aerial Fireworks (₹120) = ₹650. Remaining Savings: ₹50 in the piggy bank!',
    },
  ];

  const handleSelectBudget = (amount: number) => {
    soundManager.playClick();
    setSelectedBudget(amount);
    if (amount > 500) {
      setJustificationStep(true);
      onCharacterSpeaking('ananya');
    } else {
      setJustificationStep(false);
      onCharacterSpeaking('appa');
    }
  };

  const handleConfirmPlan = () => {
    soundManager.playCoin();
    soundManager.playCorrect();
    setIsApproved(true);
    onCharacterSpeaking('appa');

    setTimeout(() => {
      onBudgetApproved(selectedBudget);
    }, 1800);
  };

  const activeOption = budgetOptions.find((b) => b.amount === selectedBudget)!;

  return (
    <div className="absolute inset-x-0 bottom-8 p-3 sm:p-5 flex flex-col items-center justify-end z-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md pointer-events-auto text-slate-100"
      >
        {/* Header Title Lockup */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 text-lg">💰</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Level 1</span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">Negotiate Your Diwali Budget</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-extrabold text-amber-300 tabular-nums">₹{selectedBudget}</span>
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 text-xl">
            👨‍👧‍👦
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
            <p className="font-bold text-amber-300 mb-0.5">
              Appa:{' '}
              <span className="font-normal text-white">
                "Happy Diwali, Aarav and Ananya! Here is your festival shopping allowance. Select your budget below, plan your purchases, and let's go experience the excitement of cracker shopping!"
              </span>
            </p>
          </div>
        </div>

        {/* Budget Selection Options */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {budgetOptions.map((opt) => {
            const isSelected = selectedBudget === opt.amount;
            return (
              <button
                key={opt.amount}
                onClick={() => handleSelectBudget(opt.amount)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-white tabular-nums">₹{opt.amount}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 text-amber-400 border border-amber-400/20">
                    {opt.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{opt.description}</p>
              </button>
            );
          })}
        </div>

        {/* Math Planning breakdown */}
        <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-300 block mb-0.5">Ananya's Budget Calculation:</span>
            <span className="text-slate-200">{activeOption.mathNote}</span>
          </div>
        </div>

        {/* Approve CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            {selectedBudget > 500
              ? 'Appa approved your budget plan!'
              : 'Base allowance ready for shopping!'}
          </div>

          <button
            onClick={handleConfirmPlan}
            disabled={isApproved}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
          >
            {isApproved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-950" />
                Budget Approved! Entering Market...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                Approve ₹{selectedBudget} & Start Shopping
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
