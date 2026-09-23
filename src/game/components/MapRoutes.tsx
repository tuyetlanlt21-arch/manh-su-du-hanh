import { chapterRoutes } from '../data/routes'
import { getChapterStatus } from '../systems/progression'
import type { GameState } from '../gameTypes'
export function MapRoutes({ state }: { state: GameState }) { return <svg className="map-route-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{chapterRoutes.map((route) => { const from = getChapterStatus(route.from, state); const to = getChapterStatus(route.to, state); const status = from === 'COMPLETED' && to === 'COMPLETED' ? 'completed' : from === 'COMPLETED' && to === 'AVAILABLE' ? 'available' : 'locked'; return <path key={route.from} className={`map-route ${status}`} d={route.path} pathLength="1"/> })}</svg> }
