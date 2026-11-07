/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
  Droplets,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Level3CourtyardProps {
  onCourtyardReady: () => void;
  onCharacterSpeaking: (charId: string | null) => void;
}

export const Level3Courtyard: React.FC<Level3CourtyardProps> = ({
  onCourtyardReady,
  onCharacterSpeaking,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    pad: false,
    water: false,
    boundary: false,
    adults: false,
  });

  const safetySteps = [
    {
      id: 'pad',
      title: 'Flat Brick Launch Pad',
      description: 'Confirm launch pad is placed on flat stone, away from dry leaves, doors, and clothes.',
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      rule: 'Never place crackers on uneven ground or near flammable decor.',
    },
    {
      id: 'water',
      title: 'Water & Sand Buckets Station',
      description: 'Place 2 buckets filled with clean water and sand beside the celebration zone.',
      icon: <Droplets className="w-4 h-4 text-blue-400" />,
      rule: 'Essential for immediately quenching hot sparkler wires and unexpected duds.',
    },
    {
      id: 'boundary',
      title: '5-Meter Spectator Boundary',
      description: 'Erect golden safety stanchions and rope 5 meters back from the launch spot.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      rule: 'Keeps young children, elders, and pets at a secure observation distance.',
    },
    {
      id: 'adults',
      title: 'Adult Supervision Ready',
      description: 'Appa and Amma standing by to supervise and light all high-heat fireworks.',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      rule: 'Fireworks must NEVER be lit by young children without an adult present.',
    },
  ];

  const handleToggleStep = (stepId: string) => {
    soundManager.playCoin();
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      return next;
    });

    if (stepId === 'adults') onCharacterSpeaking('amma');
    else if (stepId === 'boundary') onCharacterSpeaking('appa');
    else onCharacterSpeaking('aarav');
  };

  const allCompleted = Object.values(completedSteps).every(Boolean);

  const handleProceed = () => {
    soundManager.playCorrect();
    onCharacterSpeaking(null);
    onCourtyardReady();
  };

  return (
    <div className="absolute inset-x-0 bottom-8 p-3 sm:p-5 flex flex-col items-center justify-end z-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md pointer-events-auto text-slate-100"
      >
        {/* Header Title Lockup */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-lg">🪔</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Level 3</span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">Prepare Your Diwali Courtyard</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {Object.values(completedSteps).filter(Boolean).length}/4 Safety Checkpoints
          </div>
        </div>

        {/* Dialogue instruction */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center shrink-0 text-xl">
            🥻
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
            <p className="font-bold text-emerald-300 mb-0.5">
              Amma:{' '}
              <span className="font-normal text-white">
                "Welcome home, children! Before we touch any firework, we must set up our safety zones in the courtyard. Tap each safety station below to verify it!"
              </span>
            </p>
          </div>
        </div>

        {/* 4 Interactive Safety Setup Tasks */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {safetySteps.map((step) => {
            const isDone = completedSteps[step.id];
            return (
              <button
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-500/20 text-white'
                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                    {step.icon}
                    {step.title}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{step.description}</p>
                  <p className="text-[10px] text-amber-300/80 mt-1 italic">Rule: {step.rule}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-slate-400">
            {allCompleted
              ? '✨ All safety zones verified & approved!'
              : 'Tap all 4 stations to complete safety preparations.'}
          </span>

          <button
            onClick={handleProceed}
            disabled={!allCompleted}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Courtyard Ready! Take Safety Challenge (Level 4)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
