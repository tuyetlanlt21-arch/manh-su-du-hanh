import { useEffect, useRef, useState } from 'react'
import { useGame } from '../GameContext'
import { chapters } from '../data/chapters'
import { travelers } from '../data/travelers'
import { getChapterStatus } from '../systems/progression'
import mapArtwork from '../../assets/map/historical-map.png'
import { TravelerPortrait } from '../components/TravelerPortrait'
import { FragmentCounter } from '../components/FragmentCounter'
import { MapNode } from '../components/MapNode'
import { MapRoutes } from '../components/MapRoutes'
import { BackButton } from '../components/BackButton'

export function HistoricalMapScene() {
  const { state, dispatch } = useGame()
  const [lockedMessage, setLockedMessage] = useState(false)
  const lockedTimer = useRef<number | null>(null)
  const traveler = travelers.find((item) => item.id === state.selectedTraveler)!
  useEffect(() => () => { if (lockedTimer.current !== null) window.clearTimeout(lockedTimer.current) }, [])
  const visit = (chapterId: string) => { const status = getChapterStatus(chapterId, state); if (status === 'LOCKED') { setLockedMessage(true); if (lockedTimer.current !== null) window.clearTimeout(lockedTimer.current); lockedTimer.current = window.setTimeout(() => setLockedMessage(false), 2200); return }; dispatch({ type: 'ENTER_CHAPTER', chapterId }) }
  return <section className="map-scene" style={{ backgroundImage: `url(${mapArtwork})` }}>
    <div className="map-vignette"/>
    <BackButton onClick={() => dispatch({ type: 'RETURN_TO_SELECTION' })}/>
    <header className="map-header"><div className="map-identity"><TravelerPortrait traveler={traveler} compact/><div><b>{state.playerName || traveler.name}</b><small>{traveler.title}</small></div></div><div className="map-title"><span>BẢN ĐỒ KÝ ỨC</span><h1>MẢNH SỬ DU HÀNH</h1></div><FragmentCounter count={state.collectedFragments.length}/></header>
    <MapRoutes state={state}/>
    <div className="map-nodes">{chapters.map((chapter) => <MapNode key={chapter.id} number={chapter.number} title={chapter.title} position={chapter.mapPosition} status={getChapterStatus(chapter.id, state)} onClick={() => visit(chapter.id)}/>)}</div>
    <aside className="map-archives"><button onClick={() => dispatch({ type: 'OPEN_CHARACTER_ARCHIVE' })}><span>✦</span>KHO NHÂN VẬT</button><button onClick={() => dispatch({ type: 'OPEN_ARTIFACT_ARCHIVE' })}><span>⌁</span>KHO HIỆN VẬT</button></aside>
    {lockedMessage && <div className="map-message">HOÀN THÀNH CỘT MỐC TRƯỚC ĐỂ MỞ KHÓA</div>}
    {import.meta.env.DEV && <DevControls />}
  </section>
}
function DevControls() { const { state, dispatch } = useGame(); const current = chapters.find((chapter) => getChapterStatus(chapter.id, state) === 'AVAILABLE'); return <div className="dev-controls"><span>ĐIỀU PHỐI THỬ</span><button disabled={!current} onClick={() => current && dispatch({ type: 'COMPLETE_CHAPTER', chapterId: current.id })}>Hoàn thành cột mốc</button><button onClick={() => dispatch({ type: 'RESET_GAME' })}>Làm lại</button><em>{state.completedChapters.length}/6 đã hoàn thành</em></div> }
