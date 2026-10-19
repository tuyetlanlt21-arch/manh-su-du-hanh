import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { gameReducer, initialGameState } from './gameReducer'
import type { GameAction, GameState } from './gameTypes'
const GameContext = createContext<{ state: GameState; dispatch: Dispatch<GameAction> } | null>(null)
const SAVE_KEY = 'manh-su-du-hanh-save-v1'
function loadGameState(): GameState {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return initialGameState
    const saved = JSON.parse(raw) as Partial<GameState>
    return {
      ...initialGameState,
      ...saved,
      completedChapters: Array.isArray(saved.completedChapters) ? saved.completedChapters : [],
      completedActivities: Array.isArray(saved.completedActivities) ? saved.completedActivities : [],
      collectedArtifacts: Array.isArray(saved.collectedArtifacts) ? saved.collectedArtifacts : [],
      collectedCharacters: Array.isArray(saved.collectedCharacters) ? saved.collectedCharacters : [],
      collectedFragments: Array.isArray(saved.collectedFragments) ? saved.collectedFragments : [],
      round6PuzzleStarted: saved.round6PuzzleStarted === true,
      round6PlacedFragments: Array.isArray(saved.round6PlacedFragments) ? saved.round6PlacedFragments : [],
      round6VictoryCompleted: saved.round6VictoryCompleted === true,
    }
  } catch { return initialGameState }
}
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState, loadGameState)
  useEffect(() => { try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(state)) } catch { /* Saving is best effort. */ } }, [state])
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}
export function useGame() { const value = useContext(GameContext); if (!value) throw new Error('useGame must be used within GameProvider'); return value }
