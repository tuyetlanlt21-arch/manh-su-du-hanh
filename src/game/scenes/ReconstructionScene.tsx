import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useGame } from '../GameContext'
import { getRoundOneArtifact } from '../data/roundOne'
import { BackButton } from '../components/BackButton'

const offsets = [[-168, -112], [164, -96], [-176, 122], [148, 132], [-48, 176], [202, 38], [-212, 12]]
const horizontalEdge = (index: number, count: number) => [0, 21, 43, 68, 100].map((x, point) => `${x}% ${(index === 0 || index === count ? index * 100 / count : index * 100 / count + ((((index * 17) + (point * 11)) % 9) - 4))}%`).join(', ')
const verticalEdge = (index: number, count: number) => [0, 18, 43, 68, 100].map((y, point) => `${index === 0 || index === count ? index * 100 / count : index * 100 / count + ((((index * 13) + (point * 7)) % 9) - 4)}% ${y}%`).join(', ')
const fragmentMask = (index: number, count: number, vertical: boolean) => {
  const start = (vertical ? verticalEdge : horizontalEdge)(index, count).split(', ')
  const end = (vertical ? verticalEdge : horizontalEdge)(index + 1, count).split(', ').reverse()
  return `polygon(${[...start, ...end].join(', ')})`
}

export function ReconstructionScene() {
  const { state, dispatch } = useGame()
  const artifact = getRoundOneArtifact(state.currentArtifact)
  const board = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState(() => offsets.slice(0, artifact?.pieces ?? 0).map(([x, y]) => ({ x, y })))
  const [locked, setLocked] = useState<number[]>([])
  const [dragging, setDragging] = useState<number | null>(null)
  const [restoring, setRestoring] = useState(false)
  const completionTimer = useRef<number | null>(null)
  const origin = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 })
  useEffect(() => () => { if (completionTimer.current !== null) window.clearTimeout(completionTimer.current) }, [])
  if (!artifact) return null
  const move = (event: React.PointerEvent) => {
    if (dragging === null || !board.current) return
    const rect = board.current.getBoundingClientRect()
    const x = Math.max(-rect.width * .48, Math.min(rect.width * .48, origin.current.x + event.clientX - origin.current.pointerX))
    const y = Math.max(-rect.height * .48, Math.min(rect.height * .48, origin.current.y + event.clientY - origin.current.pointerY))
    setPositions((all) => all.map((position, index) => index === dragging ? { x, y } : position))
  }
  const release = () => {
    if (dragging === null) return
    const index = dragging
    const position = positions[index]
    if (Math.hypot(position.x, position.y) < 38) {
      const next = locked.includes(index) ? locked : [...locked, index]
      setPositions((all) => all.map((part, partIndex) => partIndex === index ? { x: 0, y: 0 } : part))
      setLocked(next)
      if (next.length === artifact.pieces && !restoring) { setRestoring(true); completionTimer.current = window.setTimeout(() => dispatch({ type: 'COMPLETE_RECONSTRUCTION', artifactId: artifact.id }), 2200) }
    } else setPositions((all) => all.map((part, partIndex) => partIndex === index ? { x: offsets[index][0], y: offsets[index][1] } : part))
    setDragging(null)
  }
  return <section className="puzzle-scene" onPointerMove={move} onPointerUp={release} onPointerCancel={release}>
    <BackButton onClick={() => dispatch({ type: 'RETURN_TO_EXCAVATION' })}/>
    <header className="puzzle-header"><div><p>PHỤC DỰNG HIỆN VẬT</p><h1>MẢNH VỠ TRONG LÒNG ĐẤT</h1></div><div><span>PHỤC DỰNG</span><strong>{locked.length} / {artifact.pieces}</strong></div></header>
    <div ref={board} className={`puzzle-board ${restoring ? 'is-restoring' : ''}`}>
      <div className="puzzle-canvas" style={{ '--artifact-ratio': artifact.aspectRatio } as CSSProperties}>
        <img className="puzzle-reference" src={artifact.image} alt=""/>
        {Array.from({ length: artifact.pieces }, (_, index) => <button key={index} className={`puzzle-fragment ${locked.includes(index) ? 'is-locked' : ''} ${dragging === index ? 'is-dragging' : ''}`} style={{ transform: `translate(${positions[index].x}px, ${positions[index].y}px)`, clipPath: fragmentMask(index, artifact.pieces, artifact.id === 'bronze-ploughshare'), backgroundImage: `url(${artifact.image})` }} onPointerDown={(event) => { if (locked.includes(index) || restoring) return; event.currentTarget.setPointerCapture(event.pointerId); origin.current = { pointerX: event.clientX, pointerY: event.clientY, ...positions[index] }; setDragging(index) }} aria-label={`Mảnh phục dựng ${index + 1}`}/>) }
        {restoring && <img className="restored-artifact" src={artifact.image} alt=""/>}
      </div>
    </div>
    <p className="puzzle-instruction">Kéo từng mảnh về vùng phục dựng. Khi đường gãy khớp, mảnh sẽ ổn định vào đúng vị trí.</p>
  </section>
}
