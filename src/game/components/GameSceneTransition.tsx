import type { ReactNode } from 'react'

export function GameSceneTransition({ children }: { sceneKey: string; children: ReactNode }) {
  return <div className="scene-transition">{children}</div>
}
