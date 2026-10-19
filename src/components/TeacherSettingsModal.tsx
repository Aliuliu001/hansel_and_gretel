import React, { useState } from 'react';
import { X, Settings, Key, Volume2, RotateCcw, Check, Gamepad2 } from 'lucide-react';
import { GameSettings, ModeSetting, DEFAULT_SETTINGS } from '../types/game';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSaveSettings: (settings: GameSettings) => void;
}

const MODE_OPTIONS: { value: ModeSetting; label: string; hint: string; emoji: string }[] = [
  { value: 'NORMAL', label: 'Normal (default)', hint: 'Wrong code? 3s lock, then try again', emoji: '🍭' },
  { value: 'HARD', label: 'Hard', hint: '3 wrong codes at the gate = back to start', emoji: '⚡' },
  { value: 'BOTH', label: 'Players choose', hint: 'Show both buttons on the start screen', emoji: '🎯' }
];

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [level1Code, setLevel1Code] = useState(settings.level1Code);
  const [level2Code, setLevel2Code] = useState(settings.level2Code);
  const [modeSetting, setModeSetting] = useState<ModeSetting>(settings.modeSetting);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const codesReady = level1Code.length === 4 && level2Code.length === 4;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codesReady) return;
    onSaveSettings({
      level1Code,
      level2Code,
      modeSetting,
      soundEnabled,
      normalPenaltySeconds: settings.normalPenaltySeconds,
      fiveWrongPenaltySeconds: settings.fiveWrongPenaltySeconds
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setLevel1Code(DEFAULT_SETTINGS.level1Code);
    setLevel2Code(DEFAULT_SETTINGS.level2Code);
    setModeSetting(DEFAULT_SETTINGS.modeSetting);
    setSoundEnabled(DEFAULT_SETTINGS.soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-6 shadow-2xl text-amber-50 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-800/80 hover:bg-amber-700 text-amber-200 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-amber-700/60 pb-3 pr-10">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center shadow">
            <Settings className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h2 className="text-lg font-['Lilita_One',sans-serif] text-amber-200 tracking-wide">
              Teacher Settings
            </h2>
            <p className="text-xs text-amber-300/80">
              Change the secret codes and the game mode. Saved on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          {/* Secret Codes */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Secret Codes (4 digits each)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-amber-200/90 mb-1">
                  Code 1 — Candy House
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={level1Code}
                  onChange={(e) => setLevel1Code(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-amber-900/80 border border-amber-600 rounded-xl px-3 py-1.5 font-['Lilita_One',sans-serif] text-xl tracking-widest text-amber-100 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-[10px] text-amber-400/80 mt-0.5 block">
                  Default: {DEFAULT_SETTINGS.level1Code}
                </span>
              </div>
              <div>
                <label className="block text-xs text-amber-200/90 mb-1">
                  Code 2 — Iron Gate
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={level2Code}
                  onChange={(e) => setLevel2Code(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-amber-900/80 border border-amber-600 rounded-xl px-3 py-1.5 font-['Lilita_One',sans-serif] text-xl tracking-widest text-amber-100 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-[10px] text-amber-400/80 mt-0.5 block">
                  Default: {DEFAULT_SETTINGS.level2Code}
                </span>
              </div>
            </div>
            {!codesReady && (
              <p className="text-[11px] text-red-300 mt-2 font-bold">
                Each code needs exactly 4 digits.
              </p>
            )}
          </div>

          {/* Game Mode */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Game Mode</span>
            </div>
            <div className="space-y-2">
              {MODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    modeSetting === opt.value
                      ? 'bg-amber-700/70 border-amber-400 shadow'
                      : 'bg-amber-900/50 border-amber-800/70 hover:bg-amber-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="modeSetting"
                    value={opt.value}
                    checked={modeSetting === opt.value}
                    onChange={() => setModeSetting(opt.value)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-amber-100">{opt.label}</span>
                    <span className="block text-[10px] text-amber-300/80">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sound toggle */}
          <label className="flex items-center gap-2 p-3 bg-amber-950/60 rounded-xl border border-amber-800/70 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-200 font-medium">Sound effects on</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <button
              type="submit"
              disabled={!codesReady}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-['Lilita_One',sans-serif] tracking-wide text-base shadow-lg border-b-2 border-emerald-900 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savedNotice ? <Check className="w-4 h-4" /> : null}
              {savedNotice ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
