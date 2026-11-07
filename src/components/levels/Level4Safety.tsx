/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Droplets,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Level4SafetyProps {
  onSafetyCompleted: () => void;
  onTriggerFirework: (type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram') => void;
  onPlaceCracker: (category: string) => void;
  onLightCracker: (category: string, onDetonated?: () => void) => void;
  onClearBurntRemnants: () => void;
  onCharacterSpeaking: (charId: string | null) => void;
}

export const Level4Safety: React.FC<Level4SafetyProps> = ({
  onSafetyCompleted,
  onTriggerFirework,
  onPlaceCracker,
  onLightCracker,
  onClearBurntRemnants,
  onCharacterSpeaking,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isFuseBurning, setIsFuseBurning] = useState<boolean>(false);
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const [hasBurst, setHasBurst] = useState<boolean>(false);

  // Automatically place the 3D flowerpot on launch pad
  useEffect(() => {
    onClearBurntRemnants();
    onPlaceCracker('flowerpot');
  }, []);

  const handlePlaceOnPad = () => {
    soundManager.playClick();
    onClearBurntRemnants();
    onPlaceCracker('flowerpot');
    setCurrentStep(2);
    onCharacterSpeaking('aarav');
  };

  const handleLightFuse = () => {
    if (isFuseBurning || isBursting) return;
    setIsFuseBurning(true);

    // Call 3D agarbatti animation and ignition
    onLightCracker('flowerpot', () => {
      setIsFuseBurning(false);
      setIsBursting(true);
      setCurrentStep(3);
      setHasBurst(true);
      onCharacterSpeaking('amma');

      setTimeout(() => {
        setIsBursting(false);
      }, 3400);
    });
  };

  const handleQuenchInWater = () => {
    soundManager.playWaterQuench();
    onClearBurntRemnants();
    setCurrentStep(4);
    onCharacterSpeaking('appa');
  };

  const isAutoHidden = isFuseBurning || isBursting;

  return (
    <>
      {/* Floating status when card is hidden for 100% visible cracker bursting */}
      <AnimatePresence>
        {isAutoHidden && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 sm:top-20 inset-x-0 mx-auto w-fit max-w-[90vw] pointer-events-none z-30 flex flex-col items-center"
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/80 border border-amber-500/50 backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.35)] text-slate-100 text-xs sm:text-sm font-bold">
              {isFuseBurning ? (
                <>
                  <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                  <span className="text-amber-200">
                    Touching Fuse with Agarbatti... Keep arm extended!
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span className="text-amber-300">
                    💥 Flower Pot Sparkling in 3D! Step 5 meters back!
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300/80 mt-1 font-medium bg-black/40 px-3 py-0.5 rounded-full">
              Full screen 3D view • Controls will re-appear post-burst
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute inset-x-0 bottom-9 flex flex-col items-center z-30 px-2 sm:px-4 transition-all duration-700 ease-out transform ${
          isAutoHidden
            ? 'translate-y-[150%] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        <div className="w-full max-w-2xl bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md p-3 sm:p-4 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🌋</span>
              <span className="font-bold text-amber-300 font-heading">
                Safety Ignition Practice
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Step {currentStep} of 4:{' '}
              {currentStep === 1
                ? 'Position on Pad'
                : currentStep === 2
                ? 'Light Fuse'
                : currentStep === 3
                ? 'Burst & Observe Burnt Remnants'
                : 'Quench in Water'}
            </div>
          </div>

          {/* 4 Compact Interactive Steps */}
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Step 1 */}
            <button
              onClick={handlePlaceOnPad}
              disabled={currentStep !== 1}
              className={`p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                currentStep === 1
                  ? 'border-amber-400 bg-amber-500/25 text-white ring-2 ring-amber-400/40'
                  : currentStep > 1
                  ? 'border-slate-800 bg-slate-800/40 text-emerald-400'
                  : 'border-slate-800 bg-slate-800/30 opacity-40'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Place on Pad</span>
                {currentStep > 1 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-300 mt-1">Flat on stone</span>
            </button>

            {/* Step 2 */}
            <button
              onClick={handleLightFuse}
              disabled={currentStep !== 2 || isFuseBurning}
              className={`p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                currentStep === 2
                  ? 'border-orange-400 bg-orange-500/25 text-white ring-2 ring-orange-400/40'
                  : currentStep > 2
                  ? 'border-slate-800 bg-slate-800/40 text-emerald-400'
                  : 'border-slate-800 bg-slate-800/30 opacity-40'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Light with Agarbatti</span>
                {currentStep > 2 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-300 mt-1">
                {isFuseBurning ? '🔥 Sizzling...!' : 'At arm’s length'}
              </span>
            </button>

            {/* Step 3 */}
            <div
              className={`p-2 rounded-xl border flex flex-col justify-between ${
                currentStep === 3
                  ? 'border-emerald-400 bg-emerald-500/25 text-white ring-2 ring-emerald-400/40'
                  : currentStep > 3
                  ? 'border-slate-800 bg-slate-800/40 text-emerald-400'
                  : 'border-slate-800 bg-slate-800/30 opacity-40'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. 5m Safe Retreat</span>
                {currentStep > 3 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-300 mt-1">
                {hasBurst ? '✨ Burnt Remnant on Pad' : 'Watch 3D burst'}
              </span>
            </div>

            {/* Step 4 */}
            <button
              onClick={handleQuenchInWater}
              disabled={currentStep !== 3}
              className={`p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                currentStep === 3
                  ? 'border-blue-400 bg-blue-500/30 text-white ring-2 ring-blue-400/40 animate-pulse'
                  : currentStep === 4
                  ? 'border-emerald-400 bg-slate-800/40 text-emerald-400'
                  : 'border-slate-800 bg-slate-800/30 opacity-40'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Water Quench</span>
                {currentStep === 4 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-300 mt-1">Cool burnt residue</span>
            </button>
          </div>

          {/* Action bar to advance */}
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {currentStep === 4
                ? '✨ Mastered safe lighting procedure! Notice the quenched casing.'
                : 'Deck auto-hides while lighting & bursting for clear view of cracker changes.'}
            </span>

            {currentStep === 4 && (
              <button
                onClick={onSafetyCompleted}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                Burst All Crackers (Level 5)
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
