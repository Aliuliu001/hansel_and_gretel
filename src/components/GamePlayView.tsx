import React, { useState, useEffect, useMemo } from 'react';
import {
  ScreenId,
  GameMode,
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
type AfterLockout = 'LEVEL1' | 'LEVEL2' | 'HARD_RESET' | null;

const CONFETTI_COLORS = ['#f43f5e', '#3b82f6', '#eab308', '#10b981', '#ec4899', '#a855f7', '#f97316'];

export const GamePlayView: React.FC<GamePlayViewProps> = ({
  settings,
  onOpenTeacherSettings,
  onUpdateSettings
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('TITLE');
  const [mode, setMode] = useState<GameMode>('NORMAL');

  // Input state
  const [enteredDigits, setEnteredDigits] = useState<string[]>([]);
  // Total wrong codes this run (across both levels) — 5 triggers the big lockout
  const [consecutiveFails, setConsecutiveFails] = useState<number>(0);
  // Wrong codes at Level 2 only — in Hard mode, 3 of these sends you back to Level 1
  const [level2Fails, setLevel2Fails] = useState<number>(0);

  // Unlocked progress (explicit flags — robust across every screen)
  const [unlockedL1, setUnlockedL1] = useState<boolean>(false);
  const [unlockedL2, setUnlockedL2] = useState<boolean>(false);

  // Lockout states
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(0);
  const [maxLockoutSeconds, setMaxLockoutSeconds] = useState<number>(3);
  const [afterLockout, setAfterLockout] = useState<AfterLockout>(null);

  // Gate opening sequence stage: green "code accepted" flash -> chain falls ->
  // gate swings open -> children run out happily -> WIN
  const [gateStage, setGateStage] = useState<'accepted' | 'chain-fall' | 'open' | 'children-run'>('accepted');

  // The two secret codes — EITHER code opens EITHER lock, whichever the
  // team enters first opens lock 1; the other code then opens lock 2.
  const [remainingCodes, setRemainingCodes] = useState<string[]>([
    settings.level1Code,
    settings.level2Code
  ]);

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

  // Lockout countdown
  useEffect(() => {
    if (!isLockedOut) return;
    if (lockoutSecondsRemaining <= 0) {
      // Countdown finished — decide where the player goes next
      setIsLockedOut(false);
      if (afterLockout === 'HARD_RESET') {
        setAfterLockout(null);
        setCurrentScreen('HARD_MODE_RESET');
      } else if (afterLockout === 'LEVEL1' || afterLockout === 'LEVEL2') {
        setAfterLockout(null);
        setCurrentScreen(afterLockout);
      } else if (currentScreen === 'WRONG_5_TIMES') {
        setConsecutiveFails(0);
        setLevel2Fails(0);
        setCurrentScreen(unlockedL1 ? 'LEVEL2' : 'LEVEL1');
      }
      return;
    }
    const timer = setTimeout(() => {
      setLockoutSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLockedOut, lockoutSecondsRemaining, afterLockout, currentScreen, unlockedL1]);

  // Auto-advance: CODE ACCEPTED -> LEVEL 2 (keeps the green check visible ~2s)
  useEffect(() => {
    if (currentScreen !== 'CODE_ACCEPTED') return;
    const timer = setTimeout(() => {
      setEnteredDigits([]);
      setCurrentScreen('LEVEL2');
    }, 2200);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Gate opening sequence: green check flash -> chain drops -> gate swings open -> children escape -> WIN
  useEffect(() => {
    if (currentScreen !== 'GATE_OPEN') return;
    const chainTimer = setTimeout(() => {
      setGateStage('chain-fall');
      triggerSound(() => playSound.chainUnlock());
    }, 1400);
    const openTimer = setTimeout(() => setGateStage('open'), 2450);
    const runTimer = setTimeout(() => setGateStage('children-run'), 4150);
    const winTimer = setTimeout(() => {
      triggerSound(() => playSound.victory());
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      setCurrentScreen('WIN');
    }, 6800);
    return () => {
      clearTimeout(chainTimer);
      clearTimeout(openTimer);
      clearTimeout(runTimer);
      clearTimeout(winTimer);
    };
  }, [currentScreen, startTime]);

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
    if (enteredDigits.length < 4 && !isLockedOut) {
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
    if (enteredDigits.length !== 4 || isLockedOut) return;

    const isLevel1 = currentScreen === 'LEVEL1';
    const enteredCode = enteredDigits.join('');
    const matchedIdx = remainingCodes.indexOf(enteredCode);
    setEnteredDigits([]);

    if (matchedIdx !== -1) {
      // SUCCESS! Consume whichever secret code was entered
      const newRemaining = remainingCodes.filter((_, i) => i !== matchedIdx);
      setRemainingCodes(newRemaining);
      setConsecutiveFails(0);
      setLevel2Fails(0);
      triggerSound(() => playSound.success());

      if (newRemaining.length === 0) {
        // Both locks opened -> gate opening sequence -> WIN
        setUnlockedL1(true);
        setUnlockedL2(true);
        setGateStage('accepted');
        setCurrentScreen('GATE_OPEN');
      } else {
        // One code left -> the other lock awaits
        setUnlockedL1(true);
        setCurrentScreen('CODE_ACCEPTED');
      }
      return;
    }

    // WRONG CODE
    const newTotalFails = consecutiveFails + 1;
    setConsecutiveFails(newTotalFails);
    const newLevel2Fails = isLevel1 ? level2Fails : level2Fails + 1;
    if (!isLevel1) setLevel2Fails(newLevel2Fails);

    if (newTotalFails >= 5) {
      // Too many wrong codes overall: screen shake + big 15s lockout
      triggerSound(() => playSound.lockout());
      startLockout(settings.fiveWrongPenaltySeconds, null);
      setCurrentScreen('WRONG_5_TIMES');
      return;
    }

    // Electric shock + 3s lockout
    triggerSound(() => playSound.buzzer());
    const hardResetPending = mode === 'HARD' && !isLevel1 && newLevel2Fails >= 3;
    startLockout(
      settings.normalPenaltySeconds,
      hardResetPending ? 'HARD_RESET' : isLevel1 ? 'LEVEL1' : 'LEVEL2'
    );
    setCurrentScreen('WRONG_CODE');
  };

  const resetRun = () => {
    setRemainingCodes([settings.level1Code, settings.level2Code]);
    setEnteredDigits([]);
    setConsecutiveFails(0);
    setLevel2Fails(0);
    setUnlockedL1(false);
    setUnlockedL2(false);
    setIsLockedOut(false);
    setAfterLockout(null);
    setGateStage('accepted');
  };

  const handleStartGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    resetRun();
    setCurrentScreen('LEVEL1');
    setStartTime(Date.now());
    triggerSound(() => playSound.keypad('5'));
  };

  const handleHardModeResetConfirm = () => {
    // Back to Level 1: both padlocks re-locked, both codes active again
    setRemainingCodes([settings.level1Code, settings.level2Code]);
    setUnlockedL1(false);
    setUnlockedL2(false);
    setLevel2Fails(0);
    setEnteredDigits([]);
    setIsLockedOut(false);
    setAfterLockout(null);
    setCurrentScreen('LEVEL1');
  };

  const handlePlayAgain = () => {
    resetRun();
    setCurrentScreen('TITLE');
  };

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-screen overflow-hidden flex flex-col bg-stone-950 font-['Fredoka',sans-serif] select-none">
      {/* Top HUD */}
      <GameHUD
        padlock1={unlockedL1 ? 'open' : 'closed'}
        padlock2={unlockedL2 ? 'open' : 'closed'}
        mode={mode}
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

            {/* Compact title pill at the very top — never covers the house */}
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

            {/* Single-line rescue button at the bottom */}
            <div className="relative z-10 w-full flex justify-center pb-6">
              {settings.modeSetting === 'BOTH' ? (
                <>
                  <button
                    onClick={() => handleStartGame('NORMAL')}
                    className="w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl border-b-6 border-amber-800 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>🎀 Rescue — Normal</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleStartGame('HARD')}
                    className="w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl border-b-6 border-purple-950 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>⚡ Rescue — Hard</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStartGame(settings.modeSetting === 'HARD' ? 'HARD' : 'NORMAL')}
                  className={`w-fit px-7 sm:px-9 py-3 sm:py-3.5 rounded-3xl text-white font-['Lilita_One',sans-serif] text-lg sm:text-2xl tracking-wide shadow-2xl active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                    settings.modeSetting === 'HARD'
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 border-b-6 border-purple-950'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 border-b-6 border-amber-800'
                  }`}
                >
                  <span>{settings.modeSetting === 'HARD' ? '⚡' : '🎀'} Rescue Hansel &amp; Gretel</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================== LEVEL 1: CANDY HOUSE LOCK ===================== */}
        {currentScreen === 'LEVEL1' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            <CandyHouseBackground />

            <div className="relative z-10 mb-2 flex items-center gap-2 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-600 text-xs text-amber-200 shadow">
              <span className="text-base">🍬</span>
              <span className="font-bold">Level 1: Candy House Door</span>
              <span className="text-amber-400">·</span>
              <span>Enter one of the two secret codes</span>
            </div>

            <CombinationLock
              currentDigits={enteredDigits}
              onDigitPress={handleDigitPress}
              onDeletePress={handleDeletePress}
              onSubmitPress={handleSubmitPress}
              lockTitle="Candy House Lock"
            />
          </div>
        )}

        {/* ===================== CODE ACCEPTED (auto-advances) ===================== */}
        {currentScreen === 'CODE_ACCEPTED' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <CandyHouseBackground dimmed />

            <div className="relative z-20 flex flex-col items-center max-w-sm w-full animate-fade-in">
              <CombinationLock
                currentDigits={['✓', '✓', '✓', '✓']}
                onDigitPress={() => {}}
                onDeletePress={() => {}}
                onSubmitPress={() => {}}
                isSuccess={true}
                lockTitle="Door Unlatched!"
              />

              <div className="mt-4 flex flex-col items-center gap-2 animate-pulse">
                <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-['Lilita_One',sans-serif] text-2xl tracking-wide shadow-2xl border-b-6 border-emerald-900 flex items-center gap-3">
                  <span>Running to the gate...</span>
                  <ArrowRight className="w-8 h-8 stroke-[3]" />
                </div>
                <span className="text-xs text-emerald-200 font-bold bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-500/60 shadow">
                  Lock 1 is open! Next: the rusty iron gate.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== LEVEL 2: IRON GATE AT NIGHT ===================== */}
        {currentScreen === 'LEVEL2' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            <IronGateNightBackground />

            <div className="relative z-10 mb-2 flex items-center gap-2 bg-slate-950/85 px-4 py-1.5 rounded-full border border-slate-600 text-xs text-slate-200 shadow">
              <span className="text-base">🌙</span>
              <span className="font-bold text-amber-300">Level 2: The Rusty Iron Gate</span>
              <span className="text-slate-400">·</span>
              <span>Enter the other secret code to break the chain</span>
            </div>

            <CombinationLock
              currentDigits={enteredDigits}
              onDigitPress={handleDigitPress}
              onDeletePress={handleDeletePress}
              onSubmitPress={handleSubmitPress}
              lockTitle="Gate Chain Padlock"
              isLevel2={true}
            />
          </div>
        )}

        {/* ===================== GATE OPENING SEQUENCE ===================== */}
        {currentScreen === 'GATE_OPEN' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 animate-fade-in">
            <IronGateNightBackground stage={gateStage} />

            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
              {gateStage === 'accepted' ? (
                <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 border-4 border-emerald-200 shadow-2xl text-white font-['Lilita_One',sans-serif] text-2xl sm:text-3xl tracking-wide animate-bounce flex items-center gap-2">
                  <span>✓</span>
                  <span>CODE ACCEPTED!</span>
                </div>
              ) : (
                <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-4 border-yellow-200 shadow-2xl text-amber-950 font-['Lilita_One',sans-serif] text-2xl sm:text-3xl tracking-wide animate-bounce">
                  {gateStage === 'chain-fall'
                    ? '⛓️ The chain is falling...'
                    : gateStage === 'open'
                    ? '🚪 The gate is opening!'
                    : '🎉 Hansel & Gretel run free!'}
                </div>
              )}
              <span className="text-sm font-bold text-amber-100 drop-shadow bg-black/50 px-4 py-1 rounded-full">
                {gateStage === 'children-run' ? '🎉 Free at last!' : 'Hansel & Gretel are about to run!'}
              </span>
            </div>
          </div>
        )}

        {/* ===================== WRONG CODE (3s shock lockout) ===================== */}
        {currentScreen === 'WRONG_CODE' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            {unlockedL1 ? <IronGateNightBackground dimmed /> : <CandyHouseBackground dimmed />}

            <div className="relative z-20 flex flex-col items-center max-w-sm w-full">
              <div className="mb-3 px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>Wrong Code! Keypad Locked</span>
              </div>

              <CombinationLock
                currentDigits={['-', '-', '-', '-']}
                onDigitPress={() => {}}
                onDeletePress={() => {}}
                onSubmitPress={() => {}}
                isError={true}
                isLockedOut={true}
                lockoutSecondsRemaining={lockoutSecondsRemaining}
                maxLockoutSeconds={maxLockoutSeconds}
                lockTitle="Electric Shock!"
                isLevel2={unlockedL1}
              />
            </div>
          </div>
        )}

        {/* ===================== WRONG 5 TIMES (15s lockout) ===================== */}
        {currentScreen === 'WRONG_5_TIMES' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 animate-shake">
            {unlockedL1 ? <IronGateNightBackground dimmed /> : <CandyHouseBackground dimmed />}
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
            <IronGateNightBackground dimmed />

            <div className="relative z-30 flex flex-col items-center max-w-lg w-full bg-gradient-to-b from-purple-950 via-slate-950 to-stone-950 border-4 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-fade-in">
              <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white font-['Lilita_One',sans-serif] text-2xl sm:text-3xl uppercase tracking-wider shadow-xl mb-4 border-2 border-red-400 animate-pulse">
                Wrong! Back to the start.
              </div>

              <div className="my-3 flex items-center justify-center gap-4 text-amber-200">
                <div className="p-3 bg-purple-900/80 rounded-2xl border border-purple-500 text-center">
                  <span className="text-2xl block">🏰</span>
                  <span className="text-xs font-bold">Iron Gate</span>
                </div>

                <div className="flex flex-col items-center">
                  <RotateCcw className="w-12 h-12 text-red-400 animate-spin" />
                  <span className="text-[11px] font-black text-red-300 uppercase tracking-widest mt-1">
                    Hard Mode Reset
                  </span>
                </div>

                <div className="p-3 bg-amber-900/80 rounded-2xl border border-amber-500 text-center">
                  <span className="text-2xl block">🍭</span>
                  <span className="text-xs font-bold">Candy House</span>
                </div>
              </div>

              <p className="text-amber-100 text-sm mb-5 font-medium max-w-sm">
                You entered 3 wrong codes at the gate. Both locks are closed again (🔒 🔒) — enter code 1 to start over!
              </p>

              <button
                onClick={handleHardModeResetConfirm}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-['Lilita_One',sans-serif] text-xl tracking-wide shadow-xl border-b-4 border-amber-800 cursor-pointer transition-all active:translate-y-0.5"
              >
                Back to Level 1
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
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-700/60">
                  <span className="text-amber-400 block font-semibold">Mode</span>
                  <span className="font-['Lilita_One',sans-serif] text-lg text-amber-100">
                    {mode === 'HARD' ? 'HARD' : 'NORMAL'}
                  </span>
                </div>
                <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-700/60">
                  <span className="text-amber-400 block font-semibold">Escape Time</span>
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
