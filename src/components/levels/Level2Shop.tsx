/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Volume2,
  Sparkles,
  Info,
} from 'lucide-react';
import { CRACKERS } from '../../data/gameData';
import { CartItem, CrackerItem } from '../../types/game';
import { soundManager } from '../../audio/soundManager';

interface Level2ShopProps {
  budget: number;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  onProceedToCourtyard: () => void;
  onCharacterSpeaking: (charId: string | null) => void;
}

export const Level2Shop: React.FC<Level2ShopProps> = ({
  budget,
  cart,
  onUpdateCart,
  onProceedToCourtyard,
  onCharacterSpeaking,
}) => {
  const [selectedCracker, setSelectedCracker] = useState<CrackerItem>(CRACKERS[0]);

  // Cart calculations
  const totalSpent = cart.reduce((sum, item) => sum + item.cracker.price * item.quantity, 0);
  const remainingBudget = budget - totalSpent;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (crackerId: string) => {
    const found = cart.find((c) => c.cracker.id === crackerId);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (cracker: CrackerItem) => {
    if (remainingBudget < cracker.price) {
      soundManager.playWarning();
      return;
    }

    soundManager.playCoin();
    const existing = cart.find((item) => item.cracker.id === cracker.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map((item) =>
        item.cracker.id === cracker.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { cracker, quantity: 1 }];
    }
    onUpdateCart(newCart);
  };

  const handleRemoveFromCart = (crackerId: string) => {
    soundManager.playClick();
    const existing = cart.find((item) => item.cracker.id === crackerId);
    if (!existing) return;

    let newCart: CartItem[];
    if (existing.quantity <= 1) {
      newCart = cart.filter((item) => item.cracker.id !== crackerId);
    } else {
      newCart = cart.map((item) =>
        item.cracker.id === crackerId ? { ...item, quantity: item.quantity - 1 } : item
      );
    }
    onUpdateCart(newCart);
  };

  // Practical audio preview of what this cracker sounds like when lit
  const handlePreviewSound = (cracker: CrackerItem) => {
    soundManager.playClick();
    if (cracker.category === 'flowerpot') {
      soundManager.playFountainShower(2.5);
    } else if (cracker.category === 'chakra') {
      soundManager.playChakraSpin(2.5);
    } else if (cracker.category === 'sparkler') {
      soundManager.playSparklerCrackle(2);
    } else if (cracker.category === 'aerial') {
      soundManager.playAerialRocket();
    } else {
      soundManager.playLadiPop(6);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-8 top-14 flex flex-col justify-end p-2 sm:p-4 z-20 pointer-events-none">
      {/* Top Floating Budget Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2 pointer-events-auto mb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-lg backdrop-blur-md">
          <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center text-sm">
            🏪
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-200 block">Murugan Uncle's Cracker Shop</span>
            <span className="text-[10px] text-amber-300">Choose your crackers to experience bursting!</span>
          </div>
        </div>

        {/* Budget Real-time pill */}
        <div className="flex items-center gap-2 sm:gap-4 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md text-xs sm:text-sm">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Budget</span>
            <span className="font-extrabold text-amber-300 tabular-nums">₹{budget}</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Spent</span>
            <span className="font-extrabold text-white tabular-nums">₹{totalSpent}</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Remaining</span>
            <span
              className={`font-extrabold tabular-nums ${
                remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              ₹{remainingBudget}
            </span>
          </div>
        </div>
      </div>

      {/* Main Cracker Catalog & Cart Shelf */}
      <div className="w-full max-w-4xl mx-auto bg-slate-900/95 border border-amber-500/30 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md pointer-events-auto text-slate-100 max-h-[64vh] overflow-y-auto">
        {/* Cracker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {CRACKERS.map((cracker) => {
            const qty = getItemQuantity(cracker.id);
            const isSelected = selectedCracker.id === cracker.id;
            const canAfford = remainingBudget >= cracker.price;

            return (
              <div
                key={cracker.id}
                onClick={() => {
                  setSelectedCracker(cracker);
                  soundManager.playClick();
                }}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{cracker.icon}</span>
                    <span className="text-xs font-extrabold text-amber-300 tabular-nums">
                      ₹{cracker.price}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{cracker.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{cracker.hindiName}</p>
                </div>

                {/* Counter buttons */}
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCart(cracker.id);
                    }}
                    disabled={qty === 0}
                    className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 flex items-center justify-center text-xs font-bold text-white transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-white tabular-nums">{qty}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(cracker);
                    }}
                    disabled={!canAfford}
                    className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center text-xs font-bold text-slate-950 transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Cracker Detail & Burst Preview */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            {selectedCracker.referenceImg ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-400/50 shrink-0 bg-slate-950 flex items-center justify-center p-0.5">
                <img
                  src={selectedCracker.referenceImg}
                  alt={selectedCracker.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <span className="text-3xl p-1 rounded-lg bg-slate-700/60 shrink-0">{selectedCracker.icon}</span>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{selectedCracker.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                  ₹{selectedCracker.price}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {selectedCracker.safetyRating}
                </span>
                <button
                  onClick={() => handlePreviewSound(selectedCracker)}
                  className="px-2 py-0.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold text-[10px] flex items-center gap-1 transition"
                  title="Listen to burst sound effect"
                >
                  <Volume2 className="w-3 h-3 text-purple-400" />
                  Preview Sound
                </button>
              </div>
              <p className="text-slate-300 mt-0.5">{selectedCracker.description}</p>
            </div>
          </div>

          {/* Quick Buy Button */}
          <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
            <button
              onClick={() => handleAddToCart(selectedCracker)}
              disabled={remainingBudget < selectedCracker.price}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Festival Pack
            </button>
          </div>
        </div>

        {/* Action Bar: Cart summary & Proceed to Courtyard */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">
              {totalItemsCount} fireworks ready for celebration (₹{totalSpent})
            </span>
          </div>

          <button
            onClick={onProceedToCourtyard}
            disabled={totalItemsCount === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Go to Courtyard to Light Crackers (Level 3)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
