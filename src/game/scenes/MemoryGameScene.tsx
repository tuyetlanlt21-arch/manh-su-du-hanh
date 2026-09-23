import { useEffect, useRef, useState, type AnimationEvent, type PointerEvent } from 'react'
import { useGame } from '../GameContext'
import { BackButton } from '../components/BackButton'
import hungVuong from '../../assets/round2/memories/hung-vuong.png'
import thanhGiong from '../../assets/round2/memories/thang-giong.png'
import banhChung from '../../assets/round2/memories/banh-chung-banh-giay.png'
import coLoa from '../../assets/round2/memories/an-duong-vuong-co-loa.png'
import coLoaMap from '../../assets/round2/environment/co-loa-map.png'

const memories = [
  { id: 'hung-vuong', title: 'THỜI ĐẠI HÙNG VƯƠNG', image: hungVuong, note: 'Thời Hùng Vương mở đầu ký ức về thời kỳ dựng nước Văn Lang và những cộng đồng cư dân đầu tiên.' },
  { id: 'thanh-giong', title: 'THÁNH GIÓNG ĐÁNH GIẶC ÂN', image: thanhGiong, note: 'Hình tượng Thánh Gióng kể về ý chí cùng nhau đứng lên bảo vệ xóm làng.' },
  { id: 'banh-chung', title: 'SỰ TÍCH BÁNH CHƯNG, BÁNH GIẦY', image: banhChung, note: 'Bánh chưng, bánh giầy nhắc về hạt gạo, đất trời và lòng hiếu thảo.' },
  { id: 'co-loa', title: 'AN DƯƠNG VƯƠNG XÂY THÀNH CỔ LOA', image: coLoa, note: 'Cổ Loa đưa dòng ký ức đến một kinh đô cổ, nơi thành quách và truyền thuyết giao hòa.' },
]
const shuffled = [memories[2], memories[0], memories[3], memories[1]]
type Point = { x: number; y: number }
type Phase = 'game1' | 'completing' | 'darkness' | 'completionText' | 'mistReveal' | 'coLoaIntro' | 'awaitingStart' | 'exploration'

export function MemoryGameScene() {
  const { dispatch } = useGame()
  const [placed, setPlaced] = useState<string[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [origin, setOrigin] = useState<Point | null>(null)
  const [delta, setDelta] = useState<Point>({ x: 0, y: 0 })
  const [wrong, setWrong] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('game1')
  const slots = useRef<Record<string, HTMLElement | null>>({})
  useEffect(() => { [coLoaMap, coLoa].forEach((source) => { const image = new Image(); image.src = source; void image.decode?.().catch(() => undefined) }) }, [])
  useEffect(() => { const next = memories.find((memory) => !placed.includes(memory.id)); if (next) slots.current[next.id]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [placed])
  const release = (event: PointerEvent<HTMLButtonElement>, memory: typeof memories[number]) => { if (!dragging || phase !== 'game1') return; const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-slot]'); setDragging(null); setOrigin(null); setDelta({ x: 0, y: 0 }); if (target?.dataset.slot === memory.id) setPlaced((current) => current.includes(memory.id) ? current : [...current, memory.id]); else setWrong(memory.id) }
  const begin = (event: PointerEvent<HTMLButtonElement>, id: string) => { if (phase !== 'game1') return; event.currentTarget.setPointerCapture(event.pointerId); setDragging(id); setOrigin({ x: event.clientX, y: event.clientY }) }
  const move = (event: PointerEvent<HTMLButtonElement>) => { if (origin) setDelta({ x: event.clientX - origin.x, y: event.clientY - origin.y }) }
  const advance = (event: AnimationEvent<HTMLElement>) => { if (phase === 'completing' && event.animationName === 'timelineIlluminate') setPhase('darkness'); else if (phase === 'darkness' && event.animationName === 'screenToDark') setPhase('completionText'); else if (phase === 'completionText' && event.animationName === 'completionTitle') setPhase('mistReveal'); else if (phase === 'mistReveal' && event.animationName === 'mistReveal') setPhase('coLoaIntro'); else if (phase === 'coLoaIntro' && event.animationName === 'coLoaIntro') setPhase('awaitingStart') }
  const startExploration = () => { setPhase('exploration'); dispatch({ type: 'COMPLETE_MEMORY_GAME' }); dispatch({ type: 'ENTER_CO_LOA' }) }
  return <section className={`memory-game-scene vertical-memory-game phase-${phase}`} onAnimationEnd={advance}>
    <div className="co-loa-preload" style={{ backgroundImage: `url(${coLoaMap})` }}/><div className="memory-landscape"/><div className="memory-mist"/><BackButton onClick={() => !dragging && phase === 'game1' && dispatch({ type: 'RETURN_TO_CHAPTER' })}/>
    <div className="game-one-layer"><header className="memory-header"><div><p>MẢNH SỬ II · DỰNG NƯỚC</p><h1>XẾP LẠI KÝ ỨC</h1><span>Những câu chuyện đã bị thời gian làm xáo trộn...</span></div><strong>{placed.length} / 4</strong></header><div className="memory-columns"><section className="chronicle-column"><h2>DÒNG KÝ ỨC</h2><div className="chronicle-flow">{memories.map((memory, index) => <article className={`chronicle-stage ${placed.includes(memory.id) ? 'restored' : ''}`} key={memory.id} ref={(node) => { slots.current[memory.id] = node }}><div className="chronicle-index"><b>0{index + 1}</b><i/></div><div className="chronicle-slot" data-slot={memory.id}>{placed.includes(memory.id) ? <StoryPanel memory={memory} onSettled={() => memory.id === 'co-loa' && setPhase('completing')}/> : <span>ĐẶT KÝ ỨC TẠI ĐÂY</span>}</div></article>)}</div></section><aside className="fragment-tray"><h2>CÁC MẢNH KÝ ỨC</h2><div>{shuffled.filter((memory) => !placed.includes(memory.id)).map((memory, index) => <FragmentCard key={memory.id} memory={memory} enteringIndex={index} dragging={dragging === memory.id} wrong={wrong === memory.id} delta={dragging === memory.id ? delta : undefined} onAnimationEnd={(event) => event.animationName === 'memoryShake' && setWrong(null)} onPointerDown={(event) => begin(event, memory.id)} onPointerMove={move} onPointerUp={(event) => release(event, memory)} onPointerCancel={(event) => release(event, memory)}/>)}</div></aside></div></div>
    <div className="transition-dark"/>{phase === 'completionText' && <div className="memory-restored-message"><p>DÒNG KÝ ỨC ĐÃ ĐƯỢC KHÔI PHỤC</p><b>AN DƯƠNG VƯƠNG<br/>VÀ KINH ĐÔ CỔ LOA</b></div>}<div className="co-loa-mist transition-mist"/>{(phase === 'coLoaIntro' || phase === 'awaitingStart') && <div className="co-loa-intro"><p>KÝ ỨC CỔ LOA</p><h1>GIẢI MÃ<br/>CỔ LOA</h1><span>Một dấu tích của Âu Lạc đang chờ được giải mã.</span>{phase === 'awaitingStart' && <button className="game-button" onClick={startExploration}>BẮT ĐẦU KHÁM PHÁ</button>}</div>}
  </section>
}
function StoryPanel({ memory, onSettled }: { memory: typeof memories[number]; onSettled: () => void }) { return <div className="story-panel" onAnimationEnd={(event) => event.animationName === 'storyRestore' && onSettled()}><div className="story-art"><img src={memory.image} alt=""/></div><div className="story-copy"><b>{memory.title}</b><i/><p>{memory.note}</p></div></div> }
function FragmentCard({ memory, dragging = false, wrong = false, enteringIndex = 0, delta, onAnimationEnd, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }: { memory: typeof memories[number]; dragging?: boolean; wrong?: boolean; enteringIndex?: number; delta?: Point; onAnimationEnd?: (event: AnimationEvent<HTMLButtonElement>) => void; onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void; onPointerMove?: (event: PointerEvent<HTMLButtonElement>) => void; onPointerUp?: (event: PointerEvent<HTMLButtonElement>) => void; onPointerCancel?: (event: PointerEvent<HTMLButtonElement>) => void }) { const style = dragging ? { transform: `translate3d(${delta?.x ?? 0}px, ${delta?.y ?? 0}px, 0) scale(1.04)` } : { animationDelay: `${enteringIndex * 90 + 300}ms` }; return <button style={style} className={`fragment-card ${dragging ? 'dragging' : ''} ${wrong ? 'wrong' : ''}`} onAnimationEnd={onAnimationEnd} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}><img src={memory.image} alt="" draggable={false}/><b>{memory.title}</b></button> }
