import React, { useState, useEffect, useMemo } from 'react';
import {
  ScreenId,
  DifficultyMode,
  GameSettings
} from '../types/game';
import {
  CandyHouseBackground,
  IronGateNightBackground,
  ForestEscapeBackground,
  VignetteOverlay
} from './StorybookIllustrations';
import { CombinationLock } from './CombinationLock';
import { GameHUD } from './GameHUD';
import { playSound } from '../utils/audio';
import {
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  PartyPopper
} from 'lucide-react';

interface GamePlayViewProps {
  settings: GameSettings;
  onOpenTeacherSettings: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

/** What happens when a lockout countdown finishes */
type AfterLockout = 'RESUME' | 'HARD_RESET' | null;

const CONFETTI_COLORS = ['#f43f5e', '#3b82f6', '#eab308', '#10b981', '#ec4899', '#a855f7', '#f97316'];

export const GamePlayView: React.FC<GamePlayViewProps> = ({
  settings,
  onOpenTeacherSettings,
  onUpdateSettings
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('TITLE');
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('NORMAL');

  // Core round tracking — explicit index (no filtering!)
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  
  // Input state
  const [enteredDigits, setEnteredDigits] = useState<string[]>([]);
  
  // Fail counters
  const [consecutiveFails, setConsecutiveFails] = useState<number>(0);
  const [roundFails, setRoundFails] = useState<number>(0);

  // Lockout states
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(0);
  const [maxLockoutSeconds, setMaxLockoutSeconds] = useState<number>(3);
  const [afterLockout, setAfterLockout] = useState<AfterLockout>(null);

  // Win stats
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Falling confetti for the win screen (stable per mount)
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        left: `${(i * 3.7 + 2) % 97}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: `${2.6 + (i % 5) * 0.5}s`,
        delay: `${(i % 7) * 0.18}s`,
        size: 8 + (i % 4) * 3
      })),
    []
  );

  // Current round data
  const currentRound = settings.rounds[currentRoundIndex] || settings.rounds[0];
  const currentCodeLength = currentRound?.codeLength || 4;
  const currentAnswer = currentRound?.answer || '0';
  const currentQuestion = currentRound?.question || '';

  // Calculate progress
  const completedRounds = currentRoundIndex;
  const totalRounds = Math.min(settings.totalRounds, settings.rounds.length);
  const progressPercent = totalRounds > 0 ? (completedRounds / totalRounds) * 100 : 0;

  // Lockout countdown
  useEffect(() => {
    if (!isLockedOut) return;
    if (lockoutSecondsRemaining <= 0) {
      setIsLockedOut(false);
      if (afterLockout === 'HARD_RESET') {
        setAfterLockout(null);
        setCurrentScreen('HARD_MODE_RESET');
      } else if (afterLockout === 'RESUME') {
        setAfterLockout(null);
        setCurrentScreen('PLAYING');
      } else if (currentScreen === 'WRONG_5_TIMES') {
        setConsecutiveFails(0);
        setRoundFails(0);
        setCurrentScreen('PLAYING');
      }
      return;
    }
    const timer = setTimeout(() => {
      setLockoutSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLockedOut, lockoutSecondsRemaining, afterLockout, currentScreen]);

  // Auto-advance: ROUND SUCCESS -> next round or WIN
  useEffect(() => {
    if (currentScreen !== 'ROUND_SUCCESS') return;
    const timer = setTimeout(() => {
      setEnteredDigits([]);
      
      // Check if all rounds completed
      if (currentRoundIndex + 1 >= totalRounds) {
        // WIN!
        triggerSound(() => playSound.victory());
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
        setCurrentScreen('WIN');
      } else {
        // Next round
        setCurrentRoundIndex(currentRoundIndex + 1);
        setCurrentScreen('PLAYING');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [currentScreen, currentRoundIndex, totalRounds, startTime]);

  // Sound wrapper
  const triggerSound = (fn: () => void) => {
    if (settings.soundEnabled) {
      try {
        fn();
      } catch {
        // audio context handling
      }
    }
  };

  const startLockout = (seconds: number, after: AfterLockout) => {
    setIsLockedOut(true);
    setMaxLockoutSeconds(seconds);
    setLockoutSecondsRemaining(seconds);
    setAfterLockout(after);
  };

  const handleDigitPress = (digit: string) => {
    if (enteredDigits.length < currentCodeLength && !isLockedOut) {
      triggerSound(() => playSound.keypad(digit));
      setEnteredDigits((prev) => [...prev, digit]);
    }
  };

  const handleDeletePress = () => {
    if (enteredDigits.length > 0 && !isLockedOut) {
      triggerSound(() => playSound.delete());
      setEnteredDigits((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmitPress = () => {
    if (enteredDigits.length !== currentCodeLength || isLockedOut) return;

    const enteredCode = enteredDigits.join('');
    setEnteredDigits([]);

    if (enteredCode === currentAnswer) {
      // SUCCESS!
      setConsecutiveFails(0);
      setRoundFails(0);
      triggerSound(() => playSound.success());
      setCurrentScreen('ROUND_SUCCESS');
      return;
    }

    // WRONG CODE
    const newTotalFails = consecutiveFails + 1;
    setConsecutiveFails(newTotalFails);
    const newRoundFails = roundFails + 1;
    setRoundFails(newRoundFails);

    if (newTotalFails >= 5) {
      // Too many wrong codes overall: screen shake + big 15s lockout
      triggerSound(() => playSound.lockout());
      startLockout(settings.fiveWrongPenaltySeconds, null);
      setCurrentScreen('WRONG_5_TIMES');
      return;
    }

    // Electric shock + 3s lockout
    triggerSound(() => playSound.buzzer());
    const hardResetPending = difficultyMode === 'HARD' && newRoundFails >= 3;
    startLockout(
      settings.normalPenaltySeconds,
      hardResetPending ? 'HARD_RESET' : 'RESUME'
    );
    setCurrentScreen('WRONG_CODE');
  };

  const resetRun = () => {
    setCurrentRoundIndex(0);
    setEnteredDigits([]);
    setConsecutiveFails(0);
    setRoundFails(0);
    setIsLockedOut(false);
    setAfterLockout(null);
  };

  const handleStartGame = (selectedDifficulty: DifficultyMode) => {
    setDifficultyMode(selectedDifficulty);
    resetRun();
    setCurrentScreen('PLAYING');
    setStartTime(Date.now());
    triggerSound(() => playSound.keypad('5'));
  };

  const handleHardModeResetConfirm = () => {
    // Back to round 1
    setCurrentRoundIndex(0);
    setRoundFails(0);
    setEnteredDigits([]);
    setIsLockedOut(false);
    setAfterLockout(null);
    setCurrentScreen('PLAYING');
  };

  const handlePlayAgain = () => {
    resetRun();
    setCurrentScreen('TITLE');
  };

  // Determine background based on progress
  const getBackground = () => {
    if (progressPercent < 50) {
      return <CandyHouseBackground />;
    } else if (progressPercent < 100) {
      return <IronGateNightBackground />;
    } else {
      return <ForestEscapeBackground />;
    }
  };

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-screen overflow-hidden flex flex-col bg-stone-950 font-['Fredoka',sans-serif] select-none">
      {/* Top HUD */}
      <GameHUD
        padlock1={progressPercent > 0 ? 'open' : 'closed'}
        padlock2={progressPercent >= 100 ? 'open' : 'closed'}
        mode={difficultyMode === 'HARD' ? 'HARD' : 'NORMAL'}
        onOpenTeacherSettings={onOpenTeacherSettings}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        hideTitle={currentScreen === 'TITLE'}
      />

      {/* Main Game Shell Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-2 sm:p-4">
        {/* ===================== TITLE SCREEN ===================== */}
        {currentScreen === 'TITLE' && (
          <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 animate-fade-in">
            <CandyHouseBackground />

            {/* Compact title pill at the very top */}
            <div className="relative z-10 pt-1 sm:pt-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-amber-950/85 border-2 border-amber-500/80 shadow-lg max-w-[94vw]">
                <span className="text-lg sm:text-xl shrink-0">🍭</span>
                <h1 className="font-['Lilita_One',sans-serif] text-sm sm:text-2xl tracking-wide text-amber-100 drop-shadow text-center leading-tight whitespace-nowrap">
                  Hansel &amp; Gretel
                  <span className="text-pink-300"> · Candy House Escape</span>
                </h1>
                <span className="text-lg sm:text-xl shrink-0">🍬</span>
              </div>
            </div>

            {/* Game info badge */}
            <div className="relative z-10 px-4 py-2 rounded-xl bg-amber-900/80 border border-amber-500/60 text-amber-100 text-sm font-bold shadow">
              {settings.gameMode === 'CLASSIC' && '🔢 Classic Number Mode'}
              {settings.gameMode === 'MATH' && '➕ Math Solver Mode'}
              {settings.gameMode === 'MATH_EN' && '🔤 Math in English Mode'}
              <span className="text-amber-300 mx-2">·</span>
              <span className="text-amber-200">{totalRounds} Rounds</span>
            </div>

            {/* Start button at the bottom */}
            <div className="relative z-10 w-full flex justify-center pb-6 gap-3">
              {settings.modeSetting === 'BOTH' ? (
                <>
                  <button
                    onClick={() => handleStartGame('NORMAL')}
                    className="w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl border-b-6 border-amber-800 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>🎀 Play — Normal</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleStartGame('HARD')}
                    className="w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl border-b-6 border-purple-950 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>⚡ Play — Hard</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStartGame(settings.difficultyMode)}
                  className={`w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                    settings.difficultyMode === 'HARD'
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 border-b-6 border-purple-950'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 border-b-6 border-amber-800'
                  }`}
                >
                  <span>{settings.difficultyMode === 'HARD' ? '⚡' : '🎀'} Start Game</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================== PLAYING (main game screen) ===================== */}
        {currentScreen === 'PLAYING' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            {getBackground()}

            {/* Progress indicator */}
            <div className="relative z-10 mb-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 bg-amber-950/90 px-4 py-1.5 rounded-full border border-amber-600 text-xs text-amber-200 shadow">
                <span className="text-base">🎯</span>
                <span className="font-bold">Round {currentRoundIndex + 1} / {totalRounds}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-64 h-2 bg-amber-950/60 rounded-full overflow-hidden border border-amber-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <CombinationLock
              currentDigits={enteredDigits}
              maxDigits={currentCodeLength}
              onDigitPress={handleDigitPress}
              onDeletePress={handleDeletePress}
              onSubmitPress={handleSubmitPress}
              lockTitle={`Round ${currentRoundIndex + 1}`}
              displayQuestion={currentQuestion}
            />
          </div>
        )}

        {/* ===================== ROUND SUCCESS (auto-advances) ===================== */}
        {currentScreen === 'ROUND_SUCCESS' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {getBackground()}

            <div className="relative z-20 flex flex-col items-center max-w-lg w-full animate-fade-in">
              <CombinationLock
                currentDigits={Array(currentCodeLength).fill('✓')}
                maxDigits={currentCodeLength}
                onDigitPress={() => {}}
                onDeletePress={() => {}}
                onSubmitPress={() => {}}
                isSuccess={true}
                lockTitle="Correct!"
              />

              <div className="mt-4 flex flex-col items-center gap-2 animate-pulse">
                <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-['Lilita_One',sans-serif] text-2xl tracking-wide shadow-2xl border-b-6 border-emerald-900 flex items-center gap-3">
                  <span>Next round...</span>
                  <ArrowRight className="w-8 h-8 stroke-[3]" />
                </div>
                <span className="text-xs text-emerald-200 font-bold bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-500/60 shadow">
                  Round {currentRoundIndex + 1} complete! {totalRounds - currentRoundIndex - 1} remaining.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== WRONG CODE (3s shock lockout) ===================== */}
        {currentScreen === 'WRONG_CODE' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            {getBackground()}
            <VignetteOverlay intensity="medium" />

            <div className="relative z-20 flex flex-col items-center max-w-sm w-full">
              <div className="mb-3 px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>Wrong Code! Keypad Locked</span>
              </div>

              <CombinationLock
                currentDigits={Array(currentCodeLength).fill('-')}
                maxDigits={currentCodeLength}
                onDigitPress={() => {}}
                onDeletePress={() => {}}
                onSubmitPress={() => {}}
                isError={true}
                isLockedOut={true}
                lockoutSecondsRemaining={lockoutSecondsRemaining}
                maxLockoutSeconds={maxLockoutSeconds}
                lockTitle="Electric Shock!"
              />
            </div>
          </div>
        )}

        {/* ===================== WRONG 5 TIMES (15s lockout) ===================== */}
        {currentScreen === 'WRONG_5_TIMES' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 animate-shake">
            {getBackground()}
            <VignetteOverlay intensity="high" />

            <div className="relative z-30 flex flex-col items-center max-w-md w-full bg-black/85 border-4 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 text-white font-black text-sm uppercase tracking-wider shadow-lg mb-4">
                <ShieldAlert className="w-5 h-5 animate-bounce" />
                <span>Too Many Wrong Codes!</span>
              </div>

              {/* Huge central countdown ring */}
              <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#450a0a" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * lockoutSecondsRemaining) / (settings.fiveWrongPenaltySeconds || 15)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Lilita_One',sans-serif] text-5xl text-red-400 font-black">
                    {lockoutSecondsRemaining}s
                  </span>
                  <span className="text-[10px] text-red-200 uppercase font-bold tracking-widest mt-1">
                    Lockout
                  </span>
                </div>
              </div>

              <p className="text-amber-200 text-sm mt-3 font-medium">
                Stop guessing! Think carefully and try again.
              </p>
            </div>
          </div>
        )}

        {/* ===================== HARD MODE RESET ===================== */}
        {currentScreen === 'HARD_MODE_RESET' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {getBackground()}

            <div className="relative z-30 flex flex-col items-center max-w-lg w-full bg-gradient-to-b from-purple-950 via-slate-950 to-stone-950 border-4 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-fade-in">
              <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white font-['Lilita_One',sans-serif] text-2xl sm:text-3xl uppercase tracking-wider shadow-xl mb-4 border-2 border-red-400 animate-pulse">
                Wrong! Back to the start.
              </div>

              <div className="my-3 flex items-center justify-center gap-4 text-amber-200">
                <RotateCcw className="w-12 h-12 text-red-400 animate-spin" />
                <span className="text-[11px] font-black text-red-300 uppercase tracking-widest">
                  Hard Mode Reset
                </span>
              </div>

              <p className="text-amber-100 text-sm mb-5 font-medium max-w-sm">
                You entered 3 wrong codes. Restarting from Round 1!
              </p>

              <button
                onClick={handleHardModeResetConfirm}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-['Lilita_One',sans-serif] text-xl tracking-wide shadow-xl border-b-4 border-amber-800 cursor-pointer transition-all active:translate-y-0.5"
              >
                Back to Round 1
              </button>
            </div>
          </div>
        )}

        {/* ===================== WIN SCREEN ===================== */}
        {currentScreen === 'WIN' && (
          <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in">
            <ForestEscapeBackground />

            {/* Falling confetti */}
            <div className="absolute inset-0 z-[15] overflow-hidden pointer-events-none">
              {confettiPieces.map((piece, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: piece.left,
                    backgroundColor: piece.color,
                    width: piece.size,
                    height: piece.size * 0.65,
                    animationDuration: piece.duration,
                    animationDelay: piece.delay
                  }}
                />
              ))}
            </div>

            <div className="relative z-20 pt-4 flex flex-col items-center text-center">
              <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-4 border-yellow-200 shadow-2xl text-amber-950 font-['Lilita_One',sans-serif] text-4xl sm:text-6xl tracking-wide drop-shadow-md animate-bounce">
                🎉 You did it! 🎉
              </div>
              <p className="text-base sm:text-xl font-bold text-amber-100 drop-shadow mt-2">
                Hansel and Gretel ran free into the moonlit forest!
              </p>
            </div>

            <div className="relative z-20 w-full max-w-sm bg-black/75 backdrop-blur-xs border-2 border-amber-500/80 rounded-3xl p-5 text-center shadow-2xl mb-4">
              <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-700/60">
                  <span className="text-amber-400 block font-semibold">Mode</span>
                  <span className="font-['Lilita_One',sans-serif] text-lg text-amber-100">
                    {difficultyMode}
                  </span>
                </div>
                <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-700/60">
                  <span className="text-amber-400 block font-semibold">Rounds</span>
                  <span className="font-['Lilita_One',sans-serif] text-lg text-amber-100">
                    {totalRounds}
                  </span>
                </div>
                <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-700/60">
                  <span className="text-amber-400 block font-semibold">Time</span>
                  <span className="font-['Lilita_One',sans-serif] text-lg text-amber-100">
                    {elapsedSeconds}s
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlayAgain}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-['Lilita_One',sans-serif] text-2xl tracking-wide shadow-xl border-b-4 border-emerald-900 cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <PartyPopper className="w-6 h-6" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
