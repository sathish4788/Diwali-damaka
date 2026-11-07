/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Character {
  id: 'aarav' | 'ananya' | 'appa' | 'amma' | 'uncle';
  name: string;
  role: string;
  avatarColor: string;
  description: string;
}

export interface CrackerItem {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  description: string;
  category: 'sparkler' | 'flowerpot' | 'chakra' | 'fountain' | 'aerial' | 'bomb' | 'saram' | 'pack';
  safetyRating: 'Safe' | 'Adult Supervised Only' | 'Requires Launch Pad';
  instructions: string;
  particleColors: string[];
  duration: number; // in seconds
  icon: string;
  funFact: string;
  referenceImg?: string;
}

export interface CartItem {
  cracker: CrackerItem;
  quantity: number;
}

export interface MathChallenge {
  id: string;
  question: string;
  characterSpeaker: 'ananya' | 'uncle';
  options: number[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  rewardCoins: number;
}

export interface SafetyScenario {
  id: string;
  title: string;
  scenario: string;
  options: {
    text: string;
    isSafe: boolean;
    feedback: string;
  }[];
  criticalRule: string;
}

export interface GameAnalytics {
  startingBudget: number;
  approvedBudget: number;
  totalSpent: number;
  remainingSavings: number;
  mathQuestionsAttempted: number;
  mathQuestionsCorrect: number;
  safetyMistakesMade: number;
  safetyCorrectCount: number;
  crackersBought: number;
  crackersSafelyLit: number;
  crackersConfiscated: number;
  badges: string[];
}

export interface AudioSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  reducedFlashing: boolean;
}
