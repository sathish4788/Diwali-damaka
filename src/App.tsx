/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { DiwaliScene, DiwaliSceneHandle } from './components/3d/DiwaliScene';
import { TitleScreen } from './components/ui/TitleScreen';
import { GameHeader } from './components/ui/GameHeader';
import { Level1Budget } from './components/levels/Level1Budget';
import { Level2Shop } from './components/levels/Level2Shop';
import { Level3Courtyard } from './components/levels/Level3Courtyard';
import { Level4Safety } from './components/levels/Level4Safety';
import { Level5Celebration } from './components/levels/Level5Celebration';
import { Level6Finale } from './components/levels/Level6Finale';
import { ParentDashboard } from './components/ui/ParentDashboard';
import { PWAInstallButton } from './components/ui/PWAInstallButton';
import { StatutoryAdviceTicker } from './components/ui/StatutoryAdviceTicker';
import { GameLevel, CartItem, GameAnalytics, AudioSettings } from './types/game';
import { soundManager } from './audio/soundManager';

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'playing'>('title');
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(1);
  const [budget, setBudget] = useState<number>(500);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    soundEnabled: true,
    musicEnabled: false,
    volume: 0.8,
    reducedFlashing: false,
  });

  const [analytics, setAnalytics] = useState<GameAnalytics>({
    startingBudget: 500,
    approvedBudget: 500,
    totalSpent: 0,
    remainingSavings: 500,
    mathQuestionsAttempted: 0,
    mathQuestionsCorrect: 0,
    safetyMistakesMade: 0,
    safetyCorrectCount: 0,
    crackersBought: 0,
    crackersSafelyLit: 0,
    crackersConfiscated: 0,
    badges: ['budget_master'],
  });

  const sceneRef = useRef<DiwaliSceneHandle>(null);

  // Sync Audio Toggles
  const handleToggleSound = () => {
    setAudioSettings((prev) => {
      const next = !prev.soundEnabled;
      soundManager.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  };

  const handleToggleMusic = () => {
    setAudioSettings((prev) => {
      const next = !prev.musicEnabled;
      soundManager.toggleMusic(next);
      return { ...prev, musicEnabled: next };
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDashboard) setShowDashboard(false);
        else if (gameState === 'playing') setGameState('title');
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMusic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showDashboard]);

  // Level Handlers
  const handleBudgetApproved = (approvedAmount: number) => {
    setBudget(approvedAmount);
    setAnalytics((prev) => ({
      ...prev,
      approvedBudget: approvedAmount,
      remainingSavings: approvedAmount,
    }));
    setCurrentLevel(2);
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    const spent = newCart.reduce((sum, item) => sum + item.cracker.price * item.quantity, 0);
    const count = newCart.reduce((sum, item) => sum + item.quantity, 0);
    setAnalytics((prev) => ({
      ...prev,
      totalSpent: spent,
      remainingSavings: budget - spent,
      crackersBought: count,
    }));
  };

  const handleMathSolved = (isCorrect: boolean) => {
    setAnalytics((prev) => ({
      ...prev,
      mathQuestionsAttempted: prev.mathQuestionsAttempted + 1,
      mathQuestionsCorrect: isCorrect ? prev.mathQuestionsCorrect + 1 : prev.mathQuestionsCorrect,
    }));
  };

  const handleConfiscateCracker = () => {
    setAnalytics((prev) => ({
      ...prev,
      safetyMistakesMade: prev.safetyMistakesMade + 1,
      crackersConfiscated: prev.crackersConfiscated + 1,
    }));
  };

  const handleSafetyCompleted = (safetyStats: { correct: number; mistakes: number }) => {
    setAnalytics((prev) => ({
      ...prev,
      safetyCorrectCount: safetyStats.correct,
      safetyMistakesMade: prev.safetyMistakesMade + safetyStats.mistakes,
    }));
    setCurrentLevel(5);
  };

  const handleTriggerFirework = (
    type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram'
  ) => {
    sceneRef.current?.triggerFirework(type);
    setAnalytics((prev) => ({
      ...prev,
      crackersSafelyLit: prev.crackersSafelyLit + 1,
    }));
  };

  const handleRestartGame = () => {
    setCurrentLevel(1);
    setCart([]);
    setBudget(500);
    setGameState('title');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. Underlying 3D WebGL Canvas Viewport */}
      <DiwaliScene
        ref={sceneRef}
        currentLevel={gameState === 'title' ? 3 : currentLevel}
        reducedFlashing={audioSettings.reducedFlashing}
      />

      {/* 2. Top Perimeter HUD Header (Visible during gameplay) */}
      {gameState === 'playing' && (
        <GameHeader
          currentLevel={currentLevel}
          budget={budget}
          spent={analytics.totalSpent}
          audioSettings={audioSettings}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onOpenDashboard={() => setShowDashboard(true)}
          onGoHome={() => setGameState('title')}
          onSelectLevel={(lvl) => setCurrentLevel(lvl)}
        />
      )}

      {/* 3. Title Screen Shell */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={() => {
            setGameState('playing');
            setCurrentLevel(1);
          }}
          onOpenDashboard={() => setShowDashboard(true)}
          audioSettings={audioSettings}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* 4. Active Level UI Overlay */}
      {gameState === 'playing' && (
        <>
          {currentLevel === 1 && (
            <Level1Budget
              onBudgetApproved={handleBudgetApproved}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
            />
          )}

          {currentLevel === 2 && (
            <Level2Shop
              budget={budget}
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onProceedToCourtyard={() => setCurrentLevel(3)}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
            />
          )}

          {currentLevel === 3 && (
            <Level3Courtyard
              onCourtyardReady={() => setCurrentLevel(4)}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
            />
          )}

          {currentLevel === 4 && (
            <Level4Safety
              onSafetyCompleted={() => setCurrentLevel(5)}
              onTriggerFirework={handleTriggerFirework}
              onPlaceCracker={(cat) => sceneRef.current?.placeCracker(cat)}
              onLightCracker={(cat, onDetonated) =>
                sceneRef.current?.lightPlacedCracker(cat, onDetonated)
              }
              onClearBurntRemnants={() => sceneRef.current?.clearBurntRemnants()}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
            />
          )}

          {currentLevel === 5 && (
            <Level5Celebration
              cart={cart}
              onTriggerFirework={handleTriggerFirework}
              onPlaceCracker={(cat) => sceneRef.current?.placeCracker(cat)}
              onLightCracker={(cat, onDetonated) =>
                sceneRef.current?.lightPlacedCracker(cat, onDetonated)
              }
              onClearBurntRemnants={() => sceneRef.current?.clearBurntRemnants()}
              onProceedToFinale={() => setCurrentLevel(6)}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
              onCharacterCelebrating={(celebrating) =>
                sceneRef.current?.setCelebrating(celebrating)
              }
            />
          )}

          {currentLevel === 6 && (
            <Level6Finale
              onTriggerFirework={handleTriggerFirework}
              onOpenParentDashboard={() => setShowDashboard(true)}
              onRestartGame={handleRestartGame}
              onCharacterSpeaking={(charId) => sceneRef.current?.setSpeakingCharacter(charId)}
              onCharacterCelebrating={(celebrating) =>
                sceneRef.current?.setCelebrating(celebrating)
              }
            />
          )}
        </>
      )}

      {/* 5. In-App PWA Install Badge (Floating in top right) */}
      <div className="absolute top-3 right-3 sm:right-6 z-40 pointer-events-auto">
        <PWAInstallButton />
      </div>

      {/* 6. Continuous Statutory Safety Advice Ticker beneath for gamer to read */}
      <StatutoryAdviceTicker />

      {/* 7. Parent Analytics Dashboard Modal */}
      <ParentDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        analytics={analytics}
      />
    </main>
  );
}
