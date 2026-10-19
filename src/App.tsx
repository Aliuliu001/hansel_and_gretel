import React, { useState } from 'react';
import { GameMode, GameSettings, loadSettings, saveSettings } from './types/game';
import { GamePlayView } from './components/GamePlayView';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';

export default function App() {
  // Teacher / facilitator puzzle settings (persisted in localStorage)
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [isTeacherSettingsOpen, setIsTeacherSettingsOpen] = useState(false);

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveSettings(merged);
      return merged;
    });
  };

  return (
    <div className="w-full min-h-screen bg-stone-950 text-amber-50 selection:bg-amber-500 selection:text-white">
      <GamePlayView
        settings={settings}
        onOpenTeacherSettings={() => setIsTeacherSettingsOpen(true)}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Global Teacher & Settings Modal */}
      <TeacherSettingsModal
        key={isTeacherSettingsOpen ? 'settings-open' : 'settings-closed'}
        isOpen={isTeacherSettingsOpen}
        onClose={() => setIsTeacherSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(updated) => {
          saveSettings(updated);
          setSettings(updated);
        }}
      />
    </div>
  );
}

// Re-exported types kept for compatibility with older imports
export type { GameMode };
