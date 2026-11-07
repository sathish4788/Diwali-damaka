/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Droplets,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { CartItem, CrackerItem } from '../../types/game';
import { CRACKERS } from '../../data/gameData';
import { soundManager } from '../../audio/soundManager';

interface Level5CelebrationProps {
  cart: CartItem[];
  onTriggerFirework: (type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram') => void;
  onPlaceCracker: (category: string) => void;
  onLightCracker: (category: string, onDetonated?: () => void) => void;
  onClearBurntRemnants: () => void;
  onProceedToFinale: () => void;
  onCharacterSpeaking: (charId: string | null) => void;
  onCharacterCelebrating: (celebrating: boolean) => void;
}

export const Level5Celebration: React.FC<Level5CelebrationProps> = ({
  cart,
  onTriggerFirework,
  onPlaceCracker,
  onLightCracker,
  onClearBurntRemnants,
  onProceedToFinale,
  onCharacterSpeaking,
  onCharacterCelebrating,
}) => {
  const [crackerList] = useState<CrackerItem[]>(() => {
    if (cart.length > 0) {
      return cart.map((c) => c.cracker);
    }
    return CRACKERS;
  });

  const [selectedCracker, setSelectedCracker] = useState<CrackerItem>(() => {
    const bomb = CRACKERS.find((c) => c.category === 'bomb');
    return bomb || CRACKERS[0];
  });

  const [isLighting, setIsLighting] = useState<boolean>(false);
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [quenchAvailable, setQuenchAvailable] = useState<boolean>(false);
  const [totalBurstCount, setTotalBurstCount] = useState<number>(0);
  const [lastBurstCracker, setLastBurstCracker] = useState<CrackerItem | null>(null);
  const [hasBurntRemnant, setHasBurntRemnant] = useState<boolean>(false);

  // Automatically place the selected 3D cracker on the launch pad when selected
  useEffect(() => {
    onClearBurntRemnants();
    setHasBurntRemnant(false);
    onPlaceCracker(selectedCracker.category);
  }, [selectedCracker]);

  const handleSelectCracker = (cracker: CrackerItem) => {
    if (isLighting || isBursting) return;
    soundManager.playClick();
    onClearBurntRemnants();
    setHasBurntRemnant(false);
    setSelectedCracker(cracker);
    onPlaceCracker(cracker.category);
  };

  // Practical lighting sequence:
  // Agarbatti moves to fuse, fuse sizzles, deck slides down out of view, cracker bursts in 3D!
  const handleLightFuseWithAgarbatti = () => {
    if (isLighting || isBursting) return;

    setIsLighting(true);
    setLastBurstCracker(selectedCracker);

    onLightCracker(selectedCracker.category, () => {
      // Detonation has started
      setIsLighting(false);
      setIsBursting(true);
      onCharacterCelebrating(true);
      setTotalBurstCount((prev) => prev + 1);

      if (selectedCracker.category === 'bomb') {
        onCharacterSpeaking('aarav');
      } else if (selectedCracker.category === 'saram') {
        onCharacterSpeaking('ananya');
      } else {
        onCharacterSpeaking('appa');
      }

      // Burst duration matching physical explosion length
      const burstDuration =
        selectedCracker.category === 'bomb'
          ? 1400
          : selectedCracker.category === 'saram'
          ? 4400
          : selectedCracker.category === 'aerial'
          ? 4800
          : 3400;

      setTimeout(() => {
        // Burst finished: burnt remnants are now settling on the pad
        setIsBursting(false);
        setHasBurntRemnant(true);
        setQuenchAvailable(true);
        onCharacterCelebrating(false);
        onCharacterSpeaking(null);
      }, burstDuration);
    });
  };

  // Quench burnt residue in water bucket and clear the pad
  const handleQuench = () => {
    soundManager.playWaterQuench();
    onClearBurntRemnants();
    setHasBurntRemnant(false);
    setQuenchAvailable(false);
  };

  // Rapid Multi-Cracker Burst Combo (Atom Bomb + Saram + Fountains) – fast & loud!
  const handleRapidChainBurst = () => {
    if (isLighting || isBursting) return;
    setIsBursting(true);
    onCharacterCelebrating(true);
    setLastBurstCracker(selectedCracker);

    // Sequence of intense bursts with louder, faster cadence
    soundManager.playLadiPop(36);
    onTriggerFirework('saram');

    setTimeout(() => {
      onTriggerFirework('flowerpot');
      soundManager.playFountainShower(6);
    }, 900);

    setTimeout(() => {
      onTriggerFirework('bomb');
      soundManager.playAtomBombExplosion();
    }, 1900);

    setTimeout(() => {
      onTriggerFirework('aerial');
      soundManager.playAerialRocket();
    }, 2800);

    setTotalBurstCount((prev) => prev + 4);

    setTimeout(() => {
      setIsBursting(false);
      setHasBurntRemnant(true);
      setQuenchAvailable(true);
      onCharacterCelebrating(false);
    }, 5500);
  };

  // Is the UI currently auto-hidden to give unobstructed 3D view?
  const isAutoHidden = isLighting || isBursting;

  return (
    <>
      {/* 1. Cinematic Minimal Floating Status Pill (Visible when deck is hidden) */}
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
              {isLighting ? (
                <>
                  <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                  <span className="text-amber-200">
                    Agarbatti Touching Fuse: <strong className="text-white">{selectedCracker.name}</strong>... Stand back!
                  </span>
                </>
              ) : selectedCracker.category === 'aerial' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span className="text-amber-300">
                    🚀 Rocket Shooting into the Sky & Bursting into Stars: <strong className="text-white">{selectedCracker.name}</strong>! Look up!
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span className="text-amber-300">
                    💥 Bursting in 3D: <strong className="text-white">{selectedCracker.name}</strong>! Enjoy the display!
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300/80 mt-1 font-medium bg-black/40 px-3 py-0.5 rounded-full">
              Full screen 3D view • Controls will re-appear when cracker finishes bursting
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Cracker Burster Deck (Translates down off-screen when lighting/bursting) */}
      <div
        className={`absolute inset-x-0 bottom-9 flex flex-col items-center z-30 px-2 sm:px-4 transition-all duration-700 ease-out transform ${
          isAutoHidden
            ? 'translate-y-[150%] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        <div className="w-full max-w-3xl bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md p-2.5 sm:p-3 text-slate-100">
          {/* Post-Burst Satisfaction Callout (Shows when cracker has burnt out effectively) */}
          {hasBurntRemnant && lastBurstCracker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-2 p-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-amber-950/80 border border-emerald-500/50 flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-emerald-300">{lastBurstCracker.name}</strong>{' '}
                  {lastBurstCracker.category === 'aerial'
                    ? 'burst spectacularly across the night sky! Charred launch stick on pad.'
                    : 'burnt out effectively! Charred remains on pad.'}
                </span>
              </div>
              <button
                onClick={handleQuench}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                title="Quench hot burnt casing in water bucket and clean pad"
              >
                <Droplets className="w-3.5 h-3.5 text-blue-200" />
                <span>Dip in Water Bucket 🪣</span>
              </button>
            </motion.div>
          )}

          {/* Dock Header & Minimize Bar */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🪔</span>
              <span className="font-bold text-amber-300 font-heading">
                Cracker Bursting Deck
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {selectedCracker.name} Ready on Pad
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
                Total Bursts: <span className="text-amber-300">{totalBurstCount}</span>
              </span>

              {/* Collapse / Expand Toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title={isCollapsed ? 'Show Controls' : 'Hide Controls'}
              >
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* Cracker Selector Carousel Buttons */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {CRACKERS.map((cracker) => {
                  const isSelected = selectedCracker.id === cracker.id;
                  return (
                    <button
                      key={cracker.id}
                      onClick={() => handleSelectCracker(cracker)}
                      className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 transition text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/25 text-white ring-2 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {cracker.referenceImg ? (
                        <img src={cracker.referenceImg} alt="" className="w-4 h-4 object-contain rounded shrink-0" />
                      ) : (
                        <span className="text-base">{cracker.icon}</span>
                      )}
                      <span className="line-clamp-1">{cracker.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Action Controllers: Light Fuse with Agarbatti + Quench + Rapid Chain */}
              <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                {/* Left quick actions */}
                <div className="flex items-center gap-2">
                  {quenchAvailable && (
                    <button
                      onClick={handleQuench}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                      title="Cool hot burnt casing in water bucket"
                    >
                      <Droplets className="w-4 h-4 text-blue-200" />
                      <span className="hidden sm:inline">Dip in</span> Water Bucket
                    </button>
                  )}

                  <button
                    onClick={handleRapidChainBurst}
                    disabled={isLighting || isBursting}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                    title="Burst Atom Bomb, Saram & Fountains together!"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Chain Blast!</span>
                  </button>
                </div>

                {/* Main Glowing Ignition Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLightFuseWithAgarbatti}
                    disabled={isLighting || isBursting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-2 cursor-pointer transition transform active:scale-95 disabled:opacity-40"
                  >
                    <Flame className="w-4 h-4 text-slate-950" />
                    <span>Light Fuse with Agarbatti!</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playCrowdExcitement();
                      onProceedToFinale();
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                    title="View Grand Finale Sky Fireworks"
                  >
                    <span className="hidden sm:inline">Finale</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
