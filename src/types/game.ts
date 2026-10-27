export type ScreenId =
  | 'TITLE'
  | 'PLAYING'
  | 'ROUND_SUCCESS'
  | 'WRONG_CODE'
  | 'WRONG_5_TIMES'
  | 'HARD_MODE_RESET'
  | 'WIN';

/** Difficulty setting (how strict the penalty system is) */
export type DifficultyMode = 'NORMAL' | 'HARD';

/** How the title screen offers difficulty modes */
export type ModeSetting = 'NORMAL' | 'HARD' | 'BOTH';

/** Game mode determines what the player sees and enters */
export type GameMode = 'CLASSIC' | 'MATH' | 'MATH_EN';

/** A single round's challenge data */
export interface RoundData {
  /** For CLASSIC: empty. For MATH/MATH_EN: the equation or word problem to display */
  question: string;
  /** The numeric answer (passcode) the player must enter */
  answer: string;
  /** Length of the answer (1-10 digits) */
  codeLength: number;
}

export interface GameSettings {
  /** Which game mode: Classic number entry, Math equations, or Math in English */
  gameMode: GameMode;
  /** Total number of rounds (1-200) */
  totalRounds: number;
  /** Round data: questions and answers */
  rounds: RoundData[];
  /** Difficulty (Normal = 3s lockout, Hard = back to start after 3 fails at any round) */
  difficultyMode: DifficultyMode;
  /** How difficulty is presented on title screen */
  modeSetting: ModeSetting;
  /** Penalty durations */
  normalPenaltySeconds: number;
  fiveWrongPenaltySeconds: number;
  soundEnabled: boolean;
}

/** Default 2-round classic game (backward compatible with old 2-level game) */
export const DEFAULT_SETTINGS: GameSettings = {
  gameMode: 'CLASSIC',
  totalRounds: 2,
  rounds: [
    { question: '', answer: '2301', codeLength: 4 },
    { question: '', answer: '2906', codeLength: 4 }
  ],
  difficultyMode: 'NORMAL',
  modeSetting: 'NORMAL',
  normalPenaltySeconds: 3,
  fiveWrongPenaltySeconds: 15,
  soundEnabled: true
};

export const SETTINGS_STORAGE_KEY = 'hanselGretelSettings';

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, rounds: [...DEFAULT_SETTINGS.rounds] };
    const parsed = JSON.parse(raw);
    
    // Migrate old format (level1Code/level2Code) to new rounds structure
    if (parsed.level1Code || parsed.level2Code) {
      return {
        ...DEFAULT_SETTINGS,
        gameMode: parsed.gameMode || 'CLASSIC',
        totalRounds: 2,
        rounds: [
          { 
            question: '', 
            answer: String(parsed.level1Code || '2301').replace(/\D/g, '').slice(0, 10) || '2301',
            codeLength: String(parsed.level1Code || '2301').replace(/\D/g, '').slice(0, 10).length || 4
          },
          { 
            question: '', 
            answer: String(parsed.level2Code || '2906').replace(/\D/g, '').slice(0, 10) || '2906',
            codeLength: String(parsed.level2Code || '2906').replace(/\D/g, '').slice(0, 10).length || 4
          }
        ],
        difficultyMode: parsed.modeSetting === 'HARD' ? 'HARD' : 'NORMAL',
        modeSetting: parsed.modeSetting || 'NORMAL',
        normalPenaltySeconds: parsed.normalPenaltySeconds ?? DEFAULT_SETTINGS.normalPenaltySeconds,
        fiveWrongPenaltySeconds: parsed.fiveWrongPenaltySeconds ?? DEFAULT_SETTINGS.fiveWrongPenaltySeconds,
        soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled
      };
    }

    // Validate rounds structure
    const rounds = Array.isArray(parsed.rounds) ? parsed.rounds : DEFAULT_SETTINGS.rounds;
    const validRounds = rounds.map((r: any) => ({
      question: String(r.question || ''),
      answer: String(r.answer || '0').replace(/\D/g, '').slice(0, 10) || '0',
      codeLength: Math.min(10, Math.max(1, Number(r.codeLength) || String(r.answer || '0').replace(/\D/g, '').length))
    }));

    return {
      ...DEFAULT_SETTINGS,
      gameMode: parsed.gameMode || DEFAULT_SETTINGS.gameMode,
      totalRounds: Math.min(200, Math.max(1, Number(parsed.totalRounds) || validRounds.length)),
      rounds: validRounds.length > 0 ? validRounds : DEFAULT_SETTINGS.rounds,
      difficultyMode: parsed.difficultyMode === 'HARD' || parsed.modeSetting === 'HARD' ? 'HARD' : 'NORMAL',
      modeSetting: parsed.modeSetting || DEFAULT_SETTINGS.modeSetting,
      normalPenaltySeconds: parsed.normalPenaltySeconds ?? DEFAULT_SETTINGS.normalPenaltySeconds,
      fiveWrongPenaltySeconds: parsed.fiveWrongPenaltySeconds ?? DEFAULT_SETTINGS.fiveWrongPenaltySeconds,
      soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled
    };
  } catch {
    return { ...DEFAULT_SETTINGS, rounds: [...DEFAULT_SETTINGS.rounds] };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable (private mode) — game still works for this session
  }
}

/**
 * Parse teacher's pasted round data.
 * Supports these formats:
 * - Math: "68 - 24 = 42" or "68 - 24 = ? 42"
 * - English: "Twenty plus five equals ? 25" or "Twenty plus five = 25"
 * - Classic: just "1234" (answer only)
 * 
 * Returns array of RoundData, or empty array on parse failure.
 */
export function parseTeacherPaste(text: string, gameMode: GameMode): RoundData[] {
  const lines = text.trim().split('\n').filter(line => line.trim().length > 0);
  const rounds: RoundData[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (gameMode === 'CLASSIC') {
      // Classic mode: just extract digits
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length >= 1 && digits.length <= 10) {
        rounds.push({
          question: '',
          answer: digits,
          codeLength: digits.length
        });
      }
    } else {
      // Math or English mode: extract question and answer
      // Match patterns: "question = answer" or "question = ? answer" or "question answer"
      const match = trimmed.match(/^(.+?)(?:\s*=\s*\??\s*|\s+)(\d{1,10})$/);
      if (match) {
        const question = match[1].trim();
        const answer = match[2].trim();
        if (answer.length >= 1 && answer.length <= 10) {
          rounds.push({
            question: question,
            answer: answer,
            codeLength: answer.length
          });
        }
      }
    }
  }

  return rounds;
}
