/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Volume2,
  VolumeX,
  HelpCircle,
  ShieldCheck,
  Coins,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { AudioSettings } from '../../types/game';
import { PWAInstallButton } from './PWAInstallButton';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenDashboard: () => void;
  audioSettings: AudioSettings;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenDashboard,
  audioSettings,
  onToggleSound,
  onToggleMusic,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const handleStart = () => {
    soundManager.playCoin();
    soundManager.startFestiveMusic();
    onStartGame();
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 pb-12 pointer-events-none">
      {/* Top Bar Navigation */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        {/* Brand Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 backdrop-blur-md shadow-lg">
          <span className="text-xl">🪔</span>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            Diwali Dhamaka 3D
          </span>
        </div>

        {/* Audio & Settings Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 backdrop-blur-md transition shadow"
            title="Toggle Festive Sitar Music"
          >
            {audioSettings.musicEnabled ? (
              <span className="text-sm font-bold flex items-center gap-1">🎵 ON</span>
            ) : (
              <span className="text-sm font-bold flex items-center gap-1 text-slate-500">🎵 OFF</span>
            )}
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 backdrop-blur-md transition shadow"
            title="Toggle Fireworks SFX"
          >
            {audioSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 hover:text-white hover:border-amber-400 backdrop-blur-md text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">How to Play</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece & Title Lockup */}
      <div className="max-w-xl mx-auto text-center pointer-events-auto my-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Bespoke Diwali Lockup SVG */}
          <div className="relative mb-2">
            <svg viewBox="0 0 420 100" className="w-72 sm:w-96 max-w-full drop-shadow-[0_10px_20px_rgba(245,158,11,0.4)]">
              <defs>
                <linearGradient id="titleGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fef08a" />
                  <stop offset="45%" stop-color="#f59e0b" />
                  <stop offset="85%" stop-color="#ea580c" />
                  <stop offset="100%" stop-color="#db2777" />
                </linearGradient>
              </defs>
              <text
                x="210"
                y="55"
                textAnchor="middle"
                fontFamily="'Fredoka', system-ui, sans-serif"
                fontWeight="900"
                fontSize="42"
                fill="url(#titleGold)"
                stroke="#4a044e"
                strokeWidth="2.5"
                letterSpacing="4"
              >
                DIWALI DHAMAKA
              </text>
              <text
                x="210"
                y="85"
                textAnchor="middle"
                fontFamily="'Nunito', sans-serif"
                fontWeight="800"
                fontSize="16"
                fill="#fde047"
                letterSpacing="6"
              >
                THE GREAT FESTIVAL OF LIGHTS
              </text>
            </svg>
          </div>

          <p className="text-xs sm:text-sm text-amber-200/90 font-medium max-w-md mx-auto leading-relaxed drop-shadow">
            Join Aarav & Ananya in a 3D animated Diwali adventure! Experience the thrill of lighting and bursting colourful crackers with safe practices and statutory guidance.
          </p>

          {/* 3 Core Pillars Pill */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4 text-[11px] font-bold text-slate-200">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Budgeting</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>3D Fireworks</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Safety</span>
            </div>
          </div>

          {/* Main Play CTA Button & Install Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2.5 cursor-pointer transition transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              Start Festival Adventure
            </button>

            <PWAInstallButton variant="hero" />

            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700/80 backdrop-blur-md flex items-center justify-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Parent Dashboard
            </button>
          </div>
        </motion.div>
      </div>

      {/* Control Hint Line at Bottom */}
      <div className="w-full text-center pointer-events-auto">
        <span className="text-[11px] font-medium text-slate-400/90 tracking-wide bg-slate-950/60 px-4 py-1 rounded-full border border-slate-800/80 backdrop-blur-sm">
          Interactive Touch / Mouse · Web Audio API · Family Friendly
        </span>
      </div>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪔</span>
                  <h3 className="text-base font-bold font-heading text-white">How to Play Diwali Dhamaka</h3>
                </div>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="font-bold text-amber-300 block mb-0.5">Level 1 – Budget Planning:</span>
                  Negotiate your allowance with Appa (₹500, ₹600, or ₹700) by calculating your shopping needs.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="font-bold text-purple-300 block mb-0.5">Level 2 – Cracker Market & Maths:</span>
                  Visit Murugan Uncle’s store, select sparklers, flower pots, and chakras, and solve arithmetic challenges.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="font-bold text-emerald-300 block mb-0.5">Level 3 & 4 – Safety Standards:</span>
                  Set up the safe courtyard boundary, water buckets, and adult supervision. Learn critical firework safety rules!
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="font-bold text-pink-300 block mb-0.5">Level 5 & 6 – Grand Celebration:</span>
                  Safely light fireworks on the launch pad and unlock the spectacular 3D sky finale!
                </div>
              </div>

              <button
                onClick={() => setShowHowToPlay(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
              >
                Got It! Let's Celebrate
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
