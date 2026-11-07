/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface StatutoryAdviceTickerProps {
  currentTip?: string;
}

export const StatutoryAdviceTicker: React.FC<StatutoryAdviceTickerProps> = ({ currentTip }) => {
  const defaultAdvice = [
    '⚠️ STATUTORY SAFETY ADVICE: Always ignite fireworks in open outdoor spaces under direct adult supervision.',
    'Maintain a safe viewing distance of at least 5 meters behind the spectator boundary line.',
    'Never hold burning fireworks, flower pots (anaar), or rockets in your hand while lighting.',
    'Always use an incense stick (agarbatti) at arm’s length to light fuses safely.',
    'Keep buckets of water and sand ready at your celebration zone.',
    'Immediately immerse burnt sparkler wires into water to prevent accidental burns.',
    'Never place crackers inside bottles, tins, or under stones.',
    'If a cracker fails to ignite, wait 15 minutes at a safe distance and douse with water—never inspect closely.',
    'Celebrate with light. Celebrate with care. Happy and Safe Diwali!',
  ].join(' • ');

  const displayText = currentTip ? `⚡ NOTICE: ${currentTip} • ${defaultAdvice}` : defaultAdvice;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-auto bg-slate-950/80 backdrop-blur-md border-t border-amber-500/30 text-amber-200 text-xs py-1.5 px-3 flex items-center overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold uppercase text-[10px] shrink-0 border border-amber-500/30 mr-2">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Statutory Advice</span>
      </div>

      <div className="relative overflow-hidden w-full whitespace-nowrap flex">
        <div className="inline-block animate-[marquee_35s_linear_infinite] font-semibold text-[11px] sm:text-xs tracking-wide">
          <span>{displayText}</span>
          <span className="ml-8">{displayText}</span>
        </div>
      </div>
    </div>
  );
};
