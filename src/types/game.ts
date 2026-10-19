export type ScreenId =
  | 'TITLE'
  | 'LEVEL1'
  | 'CODE_ACCEPTED'
  | 'LEVEL2'
  | 'GATE_OPEN'
  | 'WRONG_CODE'
  | 'WRONG_5_TIMES'
  | 'HARD_MODE_RESET'
  | 'WIN';

export type GameMode = 'NORMAL' | 'HARD';

/** How the title screen offers modes:
 *  NORMAL — teacher plays the class in Normal mode (default)
 *  HARD   — teacher switched the whole game to Hard mode in settings
 *  BOTH   — students pick on the title screen
 */
export type ModeSetting = 'NORMAL' | 'HARD' | 'BOTH';

export interface GameSettings {
  level1Code: string;
  level2Code: string;
  normalPenaltySeconds: number;
  fiveWrongPenaltySeconds: number;
  soundEnabled: boolean;
  modeSetting: ModeSetting;
}

export const DEFAULT_SETTINGS: GameSettings = {
  level1Code: '2301',
  level2Code: '2906',
  normalPenaltySeconds: 3,
  fiveWrongPenaltySeconds: 15,
  soundEnabled: true,
  modeSetting: 'NORMAL'
};

export const SETTINGS_STORAGE_KEY = 'hanselGretelSettings';

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      level1Code: String(parsed.level1Code ?? DEFAULT_SETTINGS.level1Code).replace(/\D/g, '').slice(0, 4).padEnd(4, '0'),
      level2Code: String(parsed.level2Code ?? DEFAULT_SETTINGS.level2Code).replace(/\D/g, '').slice(0, 4).padEnd(4, '0')
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable (private mode) — game still works for this session
  }
}
