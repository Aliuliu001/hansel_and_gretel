# Hansel & Gretel Escape v2.0 — Implementation Plan

## Goal
Upgrade the 2-level puzzle escape game into an **Endless Math & English Escape Game (up to 200 rounds, passcode length 1–10, 3 distinct game modes)**.

## Core Features & Modes
1. **Mode 1 (Classic Passcode):** Enter raw numeric passcodes (1 to 10 digits).
2. **Mode 2 (Math Solver):** Displays arithmetic equations (e.g. `68 - 24 = ?`). Students calculate the numeric result to enter as the passcode.
3. **Mode 3 (Math in English):** Displays word problems in English (e.g. `Twenty-five plus twelve equals ?`). Students calculate the numeric result to enter.
4. **Endless Rounds (1 to 200):** Configurable total rounds in Teacher Settings. The game cycles through rounds smoothly.
5. **Dynamic Lock:** Lock input boxes automatically scale from 1 to 10 digits based on the current passcode length.
6. **Robust State Engine:** Replaces brittle remaining-code filtering with explicit `currentRoundIndex` to eliminate all "entered code not recognized" bugs.
7. **Teacher Paste Format Guide:** Clear instructions inside the settings modal explaining how teachers can paste custom equations or passcodes.

---

## Step-by-Step Implementation Tasks
- [ ] Task 1: Create `plan.md` & `tasks.md` in the repo root for progress tracking.
- [ ] Task 2: Update `types/game.ts` to support `gameMode` ('CLASSIC' | 'MATH' | 'MATH_EN'), `totalRounds`, and flexible `codeLength` / round data structure.
- [ ] Task 3: Enhance `TeacherSettingsModal.tsx` with Mode selector, Total Rounds input, and a well-documented Paste Textarea with syntax examples.
- [ ] Task 4: Refactor `CombinationLock.tsx` to dynamically render 1 to 10 digit slots.
- [ ] Task 5: Refactor `GamePlayView.tsx` to handle multi-round progression, equation display for Mode 2 & 3, and bug-free round verification.
- [ ] Task 6: Build (`npm run build`), QA test locally, and push to GitHub (`main` + `gh-pages`).
