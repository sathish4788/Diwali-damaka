/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coins, ShieldCheck, Home, Volume2, VolumeX, BarChart2, Sparkles } from 'lucide-react';
import { GameLevel, AudioSettings } from '../../types/game';
import { soundManager } from '../../audio/soundManager';

interface GameHeaderProps {
  currentLevel: GameLevel;
  budget: number;
  spent: number;
  audioSettings: AudioSettings;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenDashboard: () => void;
  onGoHome: () => void;
  onSelectLevel: (lvl: GameLevel) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentLevel,
  budget,
  spent,
  audioSettings,
  onToggleSound,
  onToggleMusic,
  onOpenDashboard,
  onGoHome,
  onSelectLevel,
}) => {
  const remaining = budget - spent;

  const levelNames: Record<GameLevel, string> = {
    1: 'Budgeting',
    2: 'Cracker Shop',
    3: 'Courtyard Setup',
    4: 'Safety Rules',
    5: 'Celebration',
    6: 'Grand Finale',
  };

  return (
    <header className="absolute top-0 inset-x-0 p-2 sm:p-4 z-30 pointer-events-none flex items-center justify-between">
      {/* Left: Home + Level Selector */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onGoHome}
          className="p-2 rounded-xl bg-slate-900/85 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 backdrop-blur-md shadow-md transition"
          title="Return to Title Screen"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Level Pills */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-md shadow-md text-xs">
          {([1, 2, 3, 4, 5, 6] as GameLevel[]).map((lvl) => {
            const isActive = currentLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                L{lvl}: {levelNames[lvl]}
              </button>
            );
          })}
        </div>

        {/* Compact Level badge for mobile */}
        <div className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-amber-500/40 backdrop-blur-md text-xs font-bold text-amber-300">
          <span>Level {currentLevel}:</span>
          <span className="text-white">{levelNames[currentLevel]}</span>
        </div>
      </div>

      {/* Right: Currency + Audio + Dashboard */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Money Display */}
        {budget > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-md text-xs font-bold shadow-md">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">Balance:</span>
            <span className="text-amber-300 tabular-nums">₹{remaining}</span>
          </div>
        )}

        {/* Music Toggle */}
        <button
          onClick={onToggleMusic}
          className="p-2 rounded-xl bg-slate-900/85 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 backdrop-blur-md transition shadow"
          title="Toggle Festive Sitar Music"
        >
          {audioSettings.musicEnabled ? (
            <span className="text-xs font-bold">🎵 ON</span>
          ) : (
            <span className="text-xs font-bold text-slate-500">🎵 OFF</span>
          )}
        </button>

        {/* SFX Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-slate-900/85 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 backdrop-blur-md transition shadow"
          title="Toggle Sound Effects"
        >
          {audioSettings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Parent Dashboard Button */}
        <button
          onClick={onOpenDashboard}
          className="px-3 py-1.5 rounded-xl bg-purple-900/80 border border-purple-500/40 hover:bg-purple-800 text-purple-200 text-xs font-bold backdrop-blur-md transition flex items-center gap-1.5 shadow"
          title="Open Learning Analytics"
        >
          <BarChart2 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>
    </header>
  );
};
