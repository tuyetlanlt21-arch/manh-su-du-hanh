import { useState } from 'react'
import { useGame } from '../GameContext'
import { getRoundOneArtifact } from '../data/roundOne'

export function ArtifactRevealScene() {
  const { state, dispatch } = useGame(); const [collecting, setCollecting] = useState(false); const artifact = getRoundOneArtifact(state.currentArtifact)
  if (!artifact) return null
  const finishCollection = () => { if (collecting) dispatch({ type: 'COLLECT_ARTIFACT', artifactId: artifact.id }) }
  return <section className={`artifact-reveal-scene ${collecting ? 'artifact-collecting' : ''}`} onAnimationEnd={(event) => event.animationName === 'artifactSettleAway' && finishCollection()}><div className="reveal-dust"/><div className="reveal-stage"><div className={`artifact-showcase ${artifact.artClass}`} style={{ backgroundImage: `url(${artifact.image})` }}/><div className="reveal-copy"><p>HIỆN VẬT ĐÃ ĐƯỢC PHỤC DỰNG</p><h1>{artifact.name}</h1><span>{artifact.description}</span><button className="game-button" disabled={collecting} onClick={() => setCollecting(true)}>{collecting ? 'ĐÃ LƯU GIỮ' : 'THU THẬP'}</button></div></div>{collecting && <div className="collection-confirmation">HIỆN VẬT ĐÃ ĐƯỢC LƯU GIỮ</div>}</section>
}
