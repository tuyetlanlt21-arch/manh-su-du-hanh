import { useEffect, useState } from 'react'
import { useGame } from '../GameContext'
import { requiredArtifactIds, roundOneArtifacts } from '../data/roundOne'
import { BackButton } from '../components/BackButton'
import excavationMap from '../../assets/round1/environment/excavation-map.png'

export function ExcavationScene() {
  const { state, dispatch } = useGame()
  const [digging, setDigging] = useState<string | null>(null)
  const collected = requiredArtifactIds.filter((id) => state.collectedArtifacts.includes(id))
  const complete = collected.length === requiredArtifactIds.length
  useEffect(() => { if (!digging) return; const timer = window.setTimeout(() => dispatch({ type: 'DISCOVER_ARTIFACT', artifactId: digging }), 900); return () => window.clearTimeout(timer) }, [digging, dispatch])
  return <section className="excavation-scene">
    <img className="excavation-map-art" src={excavationMap} alt=""/><div className="excavation-haze"/>
    <BackButton onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}/>
    <header className="excavation-header"><div><p>MẢNH SỬ I · VĂN LANG – ÂU LẠC</p><h1>KHỞI NGUYÊN</h1></div><div className="excavation-progress"><span>DẤU TÍCH ĐÃ PHỤC DỰNG</span><strong>{collected.length} / 3</strong></div></header>
    <div className="excavation-copy"><p>Chạm vào một dấu tích để bắt đầu khai quật.</p></div>
    <div className="dig-sites">{roundOneArtifacts.map((artifact, index) => {
      const done = state.collectedArtifacts.includes(artifact.id)
      return <button key={artifact.id} className={`dig-site site-${index + 1} ${done ? 'is-found' : ''} ${digging === artifact.id ? 'is-digging' : ''}`} disabled={done || Boolean(digging) || complete} onClick={() => setDigging(artifact.id)}><span className="site-glow"/><span className="site-marker">{done ? 'ĐÃ PHỤC DỰNG' : artifact.discovery}</span><i/></button>
    })}</div>
    {digging && <div className="digging-caption"><span>ĐẤT ĐANG MỞ LỐI</span><b>Những mảnh vỡ đang lộ diện…</b></div>}
    {complete && <div className="excavation-complete"><p>ĐÃ KHÔI PHỤC DẤU TÍCH</p><h2>3 / 3</h2><button className="game-button" onClick={() => dispatch({ type: 'COMPLETE_ROUND_ONE' })}>NHẬN MẢNH SỬ I</button></div>}
  </section>
}
