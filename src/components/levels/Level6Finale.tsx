/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Share2, Award, Heart } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Level6FinaleProps {
  onTriggerFirework: (type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram') => void;
  onOpenParentDashboard: () => void;
  onRestartGame: () => void;
  onCharacterSpeaking: (charId: string | null) => void;
  onCharacterCelebrating: (celebrating: boolean) => void;
}

export const Level6Finale: React.FC<Level6FinaleProps> = ({
  onTriggerFirework,
  onOpenParentDashboard,
  onRestartGame,
  onCharacterSpeaking,
  onCharacterCelebrating,
}) => {
  useEffect(() => {
    // Trigger grand sky text in 3D scene
    onTriggerFirework('text');
    onTriggerFirework('aerial');
    onCharacterCelebrating(true);
    soundManager.playCelebratoryBoom();
    soundManager.playCrowdExcitement();

    // Canvas confetti burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
    });

    const timer = setInterval(() => {
      onTriggerFirework('aerial');
      soundManager.playCelebratoryBoom();
    }, 3800);

    return () => {
      clearInterval(timer);
      onCharacterCelebrating(false);
    };
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-8 top-14 flex flex-col justify-end p-3 sm:p-5 z-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto bg-slate-900/95 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md pointer-events-auto text-slate-100 text-center"
      >
        {/* Panoramic Sky Reference Display Banner from User Upload */}
        <div className="relative w-full h-24 sm:h-28 rounded-2xl overflow-hidden mb-3 border border-amber-500/40 shadow-inner">
          <img
            src="/assets/aistudio/images_230560f1.jpeg"
            alt="Panoramic Grand Sky Celebration"
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-2.5">
            <span className="text-[11px] font-bold text-amber-300 drop-shadow flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              World-Class Panoramic Sky Fireworks
            </span>
          </div>
        </div>

        {/* Sky Message Title lockup */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Grand Diwali Sky Finale
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400">
          HAPPY DIWALI!
        </h1>
        <p className="text-sm sm:text-base font-bold text-amber-200 mt-1">
          Celebrate with Light. Celebrate with Care.
        </p>

        {/* Family dialogue recap */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">👦</span>
            <div>
              <span className="font-bold text-orange-400">Aarav:</span>{' '}
              <span className="text-slate-200">"This was the best Diwali ever! Look at the golden sparkles in the sky!"</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl">👧</span>
            <div>
              <span className="font-bold text-pink-400">Ananya:</span>{' '}
              <span className="text-slate-200">"And we saved money because we planned our budget mathematically!"</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl">👨</span>
            <div>
              <span className="font-bold text-blue-400">Appa:</span>{' '}
              <span className="text-slate-200">"The best celebration is one where everyone stays safe and happy."</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl">🥻</span>
            <div>
              <span className="font-bold text-amber-400">Amma:</span>{' '}
              <span className="text-slate-200">"Happy, prosperous and safe Diwali to everyone!"</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              onTriggerFirework('aerial');
              soundManager.playCelebratoryBoom();
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Launch More Sky Fireworks!
          </button>

          <button
            onClick={onOpenParentDashboard}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Parent Dashboard & Certificate
          </button>

          <button
            onClick={onRestartGame}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
};
