import React from 'react';
import { Delete, Check, Lock, Unlock, AlertTriangle, Zap, Volume2 } from 'lucide-react';
import { SparksOverlay } from './StorybookIllustrations';

interface CombinationLockProps {
  currentDigits: string[];
  maxDigits?: number;
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  onSubmitPress: () => void;
  isSuccess?: boolean;
  isError?: boolean;
  isLockedOut?: boolean;
  lockoutSecondsRemaining?: number;
  maxLockoutSeconds?: number;
  lockTitle?: string;
  displayQuestion?: string;
}

export const CombinationLock: React.FC<CombinationLockProps> = ({
  currentDigits,
  maxDigits = 4,
  onDigitPress,
  onDeletePress,
  onSubmitPress,
  isSuccess = false,
  isError = false,
  isLockedOut = false,
  lockoutSecondsRemaining = 0,
  maxLockoutSeconds = 3,
  lockTitle = 'COMBINATION LOCK',
  displayQuestion = ''
}) => {
  // Dynamic grid columns based on maxDigits
  const gridCols = maxDigits <= 4 ? 'grid-cols-4' : maxDigits <= 6 ? 'grid-cols-6' : maxDigits <= 8 ? 'grid-cols-8' : 'grid-cols-10';
  
  // Pad digits array to maxDigits
  const slots = Array.from({ length: maxDigits }).map((_, idx) => currentDigits[idx] || '');

  return (
    <div className="relative flex flex-col items-center justify-center max-w-2xl w-full mx-auto select-none">
      {/* Sparks Overlay if error */}
      {isError && <SparksOverlay />}

      {/* Display Question (for Math/English modes) */}
      {displayQuestion && (
        <div className="mb-4 px-6 py-3 rounded-2xl bg-amber-900/90 border-2 border-amber-500 shadow-lg max-w-full">
          <p className="text-center text-amber-100 font-bold text-lg sm:text-xl break-words">
            {displayQuestion}
          </p>
        </div>
      )}

      {/* Lock Shackle (top of padlock) */}
      <div className="relative -mb-3 z-0 flex justify-center">
        <div
          className={`w-32 h-20 rounded-t-full border-[14px] transition-all duration-500 ${
            isSuccess
              ? 'border-emerald-400 translate-x-4 -translate-y-4 rotate-12 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]'
              : isError
              ? 'border-red-600 animate-pulse'
              : 'border-amber-700'
          }`}
        />
      </div>

      {/* Wooden Lock Body */}
      <div
        className={`relative z-10 w-full rounded-3xl p-5 shadow-2xl transition-all duration-300 border-4 ${
          isSuccess
            ? 'bg-gradient-to-b from-emerald-800 to-emerald-950 border-emerald-400 animate-glow-green'
            : isError
            ? 'bg-gradient-to-b from-red-900 to-amber-950 border-red-500 animate-glow-red animate-shake'
            : 'bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 border-amber-600'
        }`}
      >
        {/* Brass corner studs */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner" />

        {/* Lock Title Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            {isSuccess ? (
              <Unlock className="w-5 h-5 text-emerald-300 animate-bounce" />
            ) : isError ? (
              <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
            ) : (
              <Lock className="w-4 h-4 text-amber-300 opacity-90" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {lockTitle}
            </span>
          </div>

          {/* Status indicators */}
          {isSuccess && (
            <span className="text-xs bg-emerald-500 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> UNLOCKED
            </span>
          )}
          {isError && (
            <span className="text-xs bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> WRONG CODE
            </span>
          )}
        </div>

        {/* DIGIT SLOTS (flexible 1-10) */}
        <div className={`grid ${gridCols} gap-1.5 sm:gap-2 mb-4 p-2 sm:p-2.5 bg-black/40 rounded-2xl border-2 border-black/30 shadow-inner`}>
          {slots.map((digit, index) => {
            const hasValue = digit !== '';
            return (
              <div
                key={index}
                className={`relative h-14 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center font-['Lilita_One',sans-serif] text-2xl sm:text-3xl shadow-inner transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-900/90 text-emerald-200 border-2 border-emerald-400 animate-bounce'
                    : isError
                    ? 'bg-red-950 text-red-200 border-2 border-red-500'
                    : hasValue
                    ? 'bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-md transform -translate-y-0.5'
                    : 'bg-amber-950/60 text-amber-600/40 border-2 border-dashed border-amber-700/50'
                }`}
              >
                {hasValue ? (
                  <span>{digit}</span>
                ) : (
                  <span className="text-base sm:text-lg opacity-30 select-none">•</span>
                )}

                {/* Tumbler tick marks */}
                <div className="absolute top-1 left-1 right-1 h-0.5 bg-white/20 rounded-full" />
                <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-black/20 rounded-full" />
              </div>
            );
          })}
        </div>

        {/* 0-9 KEYPAD */}
        <div className="relative">
          {/* Lockout overlay (when locked for 3s or 15s) */}
          {isLockedOut && (
            <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-red-500 shadow-2xl animate-fade-in">
              {/* Radial countdown ring */}
              <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#451a03"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#ef4444"
                    strokeWidth="6"
                    strokeDasharray="213"
                    strokeDashoffset={213 - (213 * lockoutSecondsRemaining) / (maxLockoutSeconds || 3)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-['Lilita_One',sans-serif] text-red-400">
                    {lockoutSecondsRemaining}s
                  </span>
                </div>
              </div>

              {/* Buzzer icon + Locked badge */}
              <div className="flex items-center gap-1.5 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span>LOCKED {lockoutSecondsRemaining}s</span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-1.5 font-medium text-center">
                Keypad temporarily disabled
              </p>
            </div>
          )}

          {/* Keypad Buttons (0-9, Backspace, Submit) */}
          <div className={`grid grid-cols-3 gap-2 ${isLockedOut ? 'opacity-30 filter grayscale pointer-events-none' : ''}`}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => onDigitPress(digit)}
                disabled={isLockedOut || isSuccess || currentDigits.length >= maxDigits}
                className="h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-600 active:to-amber-700 active:translate-y-1 text-white font-['Lilita_One',sans-serif] text-xl sm:text-2xl shadow-md border-b-4 border-amber-800 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {digit}
              </button>
            ))}

            {/* Clear / Backspace button */}
            <button
              type="button"
              onClick={onDeletePress}
              disabled={isLockedOut || isSuccess || currentDigits.length === 0}
              className="h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 active:translate-y-1 text-white font-bold shadow-md border-b-4 border-rose-900 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Backspace"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Zero button */}
            <button
              type="button"
              onClick={() => onDigitPress('0')}
              disabled={isLockedOut || isSuccess || currentDigits.length >= maxDigits}
              className="h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:translate-y-1 text-white font-['Lilita_One',sans-serif] text-xl sm:text-2xl shadow-md border-b-4 border-amber-800 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              0
            </button>

            {/* Submit / Unlock button */}
            <button
              type="button"
              onClick={onSubmitPress}
              disabled={isLockedOut || isSuccess || currentDigits.length < maxDigits}
              className={`h-12 sm:h-13 rounded-xl sm:rounded-2xl font-['Lilita_One',sans-serif] text-base sm:text-lg font-bold shadow-md border-b-4 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-1 ${
                currentDigits.length === maxDigits
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white border-emerald-900 animate-pulse'
                  : 'bg-gradient-to-b from-slate-600 to-slate-700 text-slate-300 border-slate-900'
              }`}
              title="Submit code"
            >
              <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
