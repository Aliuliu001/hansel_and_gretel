import React from 'react';
import { Lock, Unlock, Settings, Volume2, VolumeX } from 'lucide-react';
import { DifficultyMode } from '../types/game';

interface GameHUDProps {
  padlock1: 'closed' | 'open';
  padlock2: 'closed' | 'open';
  mode: DifficultyMode;
  onOpenTeacherSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  /** Hide the left-side brand title (used on the title screen, which shows its own title pill) */
  hideTitle?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  padlock1,
  padlock2,
  mode,
  onOpenTeacherSettings,
  soundEnabled,
  onToggleSound,
  hideTitle = false
}) => {
  return (
    <header className="relative z-40 w-full px-3 sm:px-4 py-2.5 bg-gradient-to-b from-black/80 via-black/50 to-transparent flex items-center justify-between gap-2 pointer-events-auto">
      {/* LEFT: Game Title */}
      <div className="flex items-center gap-2 min-w-0">
        {!hideTitle && (
          <>
            <span className="text-xl">🍭</span>
            <span className="font-['Lilita_One',sans-serif] text-sm sm:text-base md:text-lg tracking-wide text-amber-200 drop-shadow truncate">
              Candy House Escape
            </span>
          </>
        )}
      </div>

      {/* CENTER: THE TWO PADLOCK ICONS */}
      <div className="flex items-center gap-2 sm:gap-3 bg-amber-950/80 backdrop-blur-xs px-3 sm:px-4 py-1.5 rounded-2xl border-2 border-amber-600/70 shadow-lg">
        {/* Padlock 1 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
              padlock1 === 'open'
                ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.8)] scale-105'
                : 'bg-amber-900/90 text-amber-300 border border-amber-700'
            }`}
            title={`Lock 1 (Candy House): ${padlock1 === 'open' ? 'UNLOCKED' : 'LOCKED'}`}
          >
            {padlock1 === 'open' ? (
              <Unlock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] animate-bounce" />
            ) : (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/80 mt-0.5 tracking-tight">
            Level 1
          </span>
        </div>

        {/* Chain Connector */}
        <div
          className={`w-5 sm:w-6 h-1 rounded-full transition-colors ${
            padlock1 === 'open' ? 'bg-emerald-400' : 'bg-amber-700/60'
          }`}
        />

        {/* Padlock 2 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
              padlock2 === 'open'
                ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.8)] scale-105'
                : 'bg-amber-900/90 text-amber-300 border border-amber-700'
            }`}
            title={`Lock 2 (Iron Gate): ${padlock2 === 'open' ? 'UNLOCKED' : 'LOCKED'}`}
          >
            {padlock2 === 'open' ? (
              <Unlock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] animate-bounce" />
            ) : (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/80 mt-0.5 tracking-tight">
            Level 2
          </span>
        </div>
      </div>

      {/* RIGHT: Mode badge, mute & teacher settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span
          className={`hidden md:inline-flex px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm ${
            mode === 'HARD'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-purple-100 border border-purple-400/50'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 text-amber-50 border border-amber-400/50'
          }`}
        >
          {mode} MODE
        </span>

        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-200 flex items-center justify-center transition-all cursor-pointer shadow"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        <button
          onClick={onOpenTeacherSettings}
          className="w-8 h-8 rounded-full bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow hover:rotate-45"
          title="Teacher Settings (codes & game mode)"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
