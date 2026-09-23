import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { gameReducer, initialGameState } from './gameReducer'
import type { GameAction, GameState } from './gameTypes'
const GameContext = createContext<{ state: GameState; dispatch: Dispatch<GameAction> } | null>(null)
export function GameProvider({ children }: { children: ReactNode }) { const [state, dispatch] = useReducer(gameReducer, initialGameState); return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider> }
export function useGame() { const value = useContext(GameContext); if (!value) throw new Error('useGame must be used within GameProvider'); return value }
