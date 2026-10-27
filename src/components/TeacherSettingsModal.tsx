import React, { useState } from 'react';
import { X, Settings, Volume2, RotateCcw, Check, Gamepad2, ListOrdered, BookOpen } from 'lucide-react';
import { GameSettings, GameMode, ModeSetting, DifficultyMode, DEFAULT_SETTINGS, parseTeacherPaste } from '../types/game';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSaveSettings: (settings: GameSettings) => void;
}

const GAME_MODE_OPTIONS: { value: GameMode; label: string; hint: string; emoji: string }[] = [
  { value: 'CLASSIC', label: 'Classic Numbers', hint: 'Students enter passcode digits directly', emoji: '🔢' },
  { value: 'MATH', label: 'Math Solver', hint: 'Display equations like "68 - 24 = ?"', emoji: '➕' },
  { value: 'MATH_EN', label: 'Math in English', hint: 'Word problems: "Twenty plus five equals ?"', emoji: '🔤' }
];

const DIFFICULTY_OPTIONS: { value: DifficultyMode; label: string; hint: string; emoji: string }[] = [
  { value: 'NORMAL', label: 'Normal', hint: 'Wrong code? 3s lock, then try again', emoji: '🍭' },
  { value: 'HARD', label: 'Hard', hint: '3 wrong codes = back to start', emoji: '⚡' }
];

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [gameMode, setGameMode] = useState<GameMode>(settings.gameMode);
  const [totalRounds, setTotalRounds] = useState<number>(settings.totalRounds);
  const [pasteText, setPasteText] = useState<string>('');
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>(settings.difficultyMode);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [savedNotice, setSavedNotice] = useState(false);
  const [parseError, setParseError] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse pasted data if provided
    let rounds = settings.rounds;
    if (pasteText.trim()) {
      const parsed = parseTeacherPaste(pasteText, gameMode);
      if (parsed.length === 0) {
        setParseError('Could not parse the pasted data. Please check the format.');
        return;
      }
      rounds = parsed;
      setParseError('');
    }

    // Validate total rounds
    const validTotalRounds = Math.min(200, Math.max(1, totalRounds));

    onSaveSettings({
      gameMode,
      totalRounds: validTotalRounds,
      rounds,
      difficultyMode,
      modeSetting: difficultyMode, // Simplified: use difficulty as mode setting
      normalPenaltySeconds: settings.normalPenaltySeconds,
      fiveWrongPenaltySeconds: settings.fiveWrongPenaltySeconds,
      soundEnabled
    });

    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setGameMode(DEFAULT_SETTINGS.gameMode);
    setTotalRounds(DEFAULT_SETTINGS.totalRounds);
    setPasteText('');
    setDifficultyMode(DEFAULT_SETTINGS.difficultyMode);
    setSoundEnabled(DEFAULT_SETTINGS.soundEnabled);
    setParseError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-6 shadow-2xl text-amber-50 max-h-[90vh] overflow-y-auto">
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
              Configure game mode, rounds, and paste your custom questions. Saved on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          {/* Game Mode Selection */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Game Mode</span>
            </div>
            <div className="space-y-2">
              {GAME_MODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    gameMode === opt.value
                      ? 'bg-amber-700/70 border-amber-400 shadow'
                      : 'bg-amber-900/50 border-amber-800/70 hover:bg-amber-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="gameMode"
                    value={opt.value}
                    checked={gameMode === opt.value}
                    onChange={() => setGameMode(opt.value)}
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

          {/* Total Rounds */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>Total Rounds (1-200)</span>
            </div>
            <input
              type="number"
              min="1"
              max="200"
              value={totalRounds}
              onChange={(e) => setTotalRounds(Number(e.target.value))}
              className="w-full bg-amber-900/80 border border-amber-600 rounded-xl px-3 py-2 font-['Lilita_One',sans-serif] text-xl text-amber-100 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-[10px] text-amber-400/80 mt-1 block">
              Default: {DEFAULT_SETTINGS.totalRounds} rounds. Set how many challenges students must solve.
            </span>
          </div>

          {/* Paste Area with Instructions */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Paste Your Questions & Answers</span>
            </div>
            
            {/* Format Guide */}
            <div className="mb-3 p-2.5 bg-amber-900/50 rounded-xl border border-amber-700/50 text-[11px] text-amber-200/90 space-y-1">
              <p className="font-bold text-amber-300">📝 Format Guide (one per line):</p>
              <p><strong>Classic:</strong> Just the answer digits: <code className="bg-black/30 px-1 rounded">2301</code></p>
              <p><strong>Math:</strong> Equation = Answer: <code className="bg-black/30 px-1 rounded">68 - 24 = 42</code></p>
              <p><strong>English:</strong> Word problem answer: <code className="bg-black/30 px-1 rounded">Twenty plus five equals ? 25</code></p>
              <p className="text-amber-400/90 mt-1">💡 Answers can be 1-10 digits long. The lock adjusts automatically!</p>
            </div>

            <textarea
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                setParseError('');
              }}
              placeholder={
                gameMode === 'CLASSIC' 
                  ? '2301\n2906\n12345'
                  : gameMode === 'MATH'
                  ? '68 - 24 = 42\n15 + 30 = 45\n100 / 4 = 25'
                  : 'Twenty plus five equals ? 25\nSixty minus ten = 50\nThree times eight ? 24'
              }
              rows={6}
              className="w-full bg-amber-900/80 border border-amber-600 rounded-xl px-3 py-2 text-sm text-amber-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
            
            {parseError && (
              <p className="text-[11px] text-red-300 mt-2 font-bold flex items-center gap-1">
                <X className="w-3 h-3" /> {parseError}
              </p>
            )}
            
            <span className="text-[10px] text-amber-400/80 mt-2 block">
              Leave empty to keep existing {settings.rounds.length} round(s). Paste new data to replace them.
            </span>
          </div>

          {/* Difficulty Mode */}
          <div className="bg-amber-950/70 p-3.5 rounded-2xl border border-amber-800/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Difficulty</span>
            </div>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    difficultyMode === opt.value
                      ? 'bg-amber-700/70 border-amber-400 shadow'
                      : 'bg-amber-900/50 border-amber-800/70 hover:bg-amber-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficultyMode"
                    value={opt.value}
                    checked={difficultyMode === opt.value}
                    onChange={() => setDifficultyMode(opt.value)}
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-['Lilita_One',sans-serif] tracking-wide text-base shadow-lg border-b-2 border-emerald-900 flex items-center gap-1.5 cursor-pointer"
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
