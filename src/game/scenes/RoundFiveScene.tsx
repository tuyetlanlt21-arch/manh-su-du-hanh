import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import { useGame } from '../GameContext'
import excavationSite from '../../assets/round5/backgrounds/excavation-site.png'
import chestImage from '../../assets/round5/gameplay/excavation-hook.png'
import hookImage from '../../assets/round5/gameplay/ancient-chest.png'
import fragment from '../../assets/round5/rewards/fragment-05.png'
import declaration from '../../assets/round5/artifacts/declaration-1945.png'
import dienBienPhu from '../../assets/round5/artifacts/dien-bien-phu-1954.png'
import tetOffensive from '../../assets/round5/artifacts/tet-offensive-1968.png'
import b52 from '../../assets/round5/artifacts/b52-1972.png'
import parisNegotiation from '../../assets/round5/artifacts/paris-negotiation.png'
import parisAgreement from '../../assets/round5/artifacts/paris-agreement-1973.png'
import liberation from '../../assets/round5/artifacts/liberation-1975.png'

type ExcavationPhase = 'intro' | 'dig' | 'cinematic' | 'reward'
type HookMotion = 'idle' | 'aiming' | 'dropping' | 'attached' | 'pulling' | 'question'
type Artifact = { id: string; year: string; title: string; question: string; options: string[]; correctAnswer: string; explanation: string; asset: string; chestPosition: { x: number; y: number }; scale: number; rotation: number }
type Trajectory = { targetChestId: string; dx: number; dy: number; angle: number; distance: number; startLength: number; endLength: number }

const artifacts: Artifact[] = [
  { id: 'declaration-1945', year: '02/09/1945', title: 'Tuyên ngôn Độc lập', question: 'Ngày 02/09/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đã đọc văn kiện nào?', options: ['Tuyên ngôn Độc lập', 'Hiệp định Paris', 'Lời kêu gọi toàn quốc kháng chiến', 'Cương lĩnh đầu tiên'], correctAnswer: 'Tuyên ngôn Độc lập', explanation: 'Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.', asset: declaration, chestPosition: { x: 18, y: 49 }, scale: .78, rotation: -6 },
  { id: 'dien-bien-phu-1954', year: '1954', title: 'Chiến thắng Điện Biên Phủ', question: 'Chiến thắng Điện Biên Phủ năm 1954 buộc Pháp phải ký kết văn kiện nào?', options: ['Hiệp định Genève', 'Hiệp định Paris', 'Hiệp định Sơ bộ', 'Hiệp ước Versailles'], correctAnswer: 'Hiệp định Genève', explanation: 'Chiến thắng Điện Biên Phủ tạo điều kiện đi đến Hiệp định Genève năm 1954.', asset: dienBienPhu, chestPosition: { x: 35, y: 59 }, scale: .87, rotation: 4 },
  { id: 'tet-1968', year: '1968', title: 'Tổng tiến công Tết Mậu Thân', question: 'Cuộc tổng tiến công và nổi dậy năm 1968 diễn ra vào dịp nào?', options: ['Tết Mậu Thân', 'Tết Độc lập', 'Tết Trung thu', 'Tết Đoan Ngọ'], correctAnswer: 'Tết Mậu Thân', explanation: 'Tết Mậu Thân 1968 tạo bước ngoặt quan trọng về chính trị và chiến lược.', asset: tetOffensive, chestPosition: { x: 24, y: 72 }, scale: .98, rotation: -4 },
  { id: 'b52-1972', year: '12/1972', title: 'Điện Biên Phủ trên không', question: 'Trong 12 ngày đêm cuối năm 1972, quân dân miền Bắc đã đánh bại cuộc tập kích chiến lược bằng loại máy bay nào?', options: ['B-52', 'F-4', 'A-37', 'C-130'], correctAnswer: 'B-52', explanation: 'Chiến thắng “Điện Biên Phủ trên không” đã đánh bại cuộc tập kích B-52 của Mỹ.', asset: b52, chestPosition: { x: 49, y: 78 }, scale: 1, rotation: 3 },
  { id: 'paris-negotiation', year: '1972-1973', title: 'Đàm phán Paris', question: 'Đàm phán Paris là quá trình thương lượng nhằm chấm dứt chiến tranh, lập lại hòa bình ở đâu?', options: ['Việt Nam', 'Lào', 'Campuchia', 'Đông Dương'], correctAnswer: 'Việt Nam', explanation: 'Các cuộc đàm phán tại Paris hướng tới chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam.', asset: parisNegotiation, chestPosition: { x: 65, y: 69 }, scale: .95, rotation: -4 },
  { id: 'paris-agreement', year: '27/01/1973', title: 'Hiệp định Paris', question: 'Hiệp định Paris được ký kết vào ngày nào?', options: ['27/01/1973', '30/04/1975', '02/09/1945', '07/05/1954'], correctAnswer: '27/01/1973', explanation: 'Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký ngày 27/01/1973.', asset: parisAgreement, chestPosition: { x: 78, y: 55 }, scale: .83, rotation: 5 },
  { id: 'liberation-1975', year: '30/04/1975', title: 'Giải phóng miền Nam', question: 'Sự kiện ngày 30/04/1975 đánh dấu điều gì?', options: ['Giải phóng miền Nam, thống nhất đất nước', 'Ký Hiệp định Paris', 'Thành lập Đảng Cộng sản Việt Nam', 'Chiến thắng Điện Biên Phủ'], correctAnswer: 'Giải phóng miền Nam, thống nhất đất nước', explanation: 'Ngày 30/04/1975 là mốc toàn thắng, đất nước bước vào kỷ nguyên độc lập, thống nhất.', asset: liberation, chestPosition: { x: 83, y: 43 }, scale: .72, rotation: -5 },
]

const letters = ['A', 'B', 'C', 'D']
function shuffledOptions(item: Artifact) { return [...item.options].sort(() => Math.random() - .5) }

export function RoundFiveScene() {
  const { dispatch } = useGame()
  const sceneRef = useRef<HTMLElement>(null)
  const pivotRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  const timer = useRef<number | null>(null)
  const runId = useRef(0)
  const angle = useRef(0)
  const trajectoryRef = useRef<Trajectory | null>(null)
  const [phase, setPhase] = useState<ExcavationPhase>('intro')
  const [motion, setMotion] = useState<HookMotion>('idle')
  const [solved, setSolved] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [wrong, setWrong] = useState(false)
  const wait = (ms: number, run: number) => new Promise<boolean>((resolve) => { timer.current = window.setTimeout(() => resolve(run === runId.current), ms) })
  const nextPaint = (run: number) => new Promise<boolean>((resolve) => requestAnimationFrame(() => resolve(run === runId.current)))
  const clearMotion = () => { runId.current += 1; if (timer.current !== null) window.clearTimeout(timer.current); timer.current = null }
  const active = artifacts.find((item) => item.id === activeId) ?? null
  const unlockedFinal = solved.length >= 6

  useEffect(() => {
    const introTimer = window.setTimeout(() => setPhase('dig'), 2300)
    return () => { window.clearTimeout(introTimer); clearMotion(); if (frame.current !== null) cancelAnimationFrame(frame.current) }
  }, [])

  useEffect(() => {
    if (phase !== 'dig' || motion !== 'idle') return
    const start = performance.now()
    const swing = (time: number) => {
      angle.current = Math.sin((time - start) / 1550) * 60
      sceneRef.current?.style.setProperty('--hook-angle', `${angle.current}deg`)
      frame.current = requestAnimationFrame(swing)
    }
    frame.current = requestAnimationFrame(swing)
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null }
  }, [phase, motion])

  const catchChest = async (item: Artifact, element: HTMLButtonElement) => {
    if (phase !== 'dig' || motion !== 'idle' || (item.id === 'liberation-1975' && !unlockedFinal)) return
    const battlefieldBox = sceneRef.current?.getBoundingClientRect()
    const pivotBox = pivotRef.current?.getBoundingClientRect()
    const chestBox = element.getBoundingClientRect()
    if (!battlefieldBox || !pivotBox) return
    const target = {
      x: chestBox.left - battlefieldBox.left + chestBox.width / 2,
      y: chestBox.top - battlefieldBox.top + chestBox.height / 2,
    }
    const pivot = {
      x: pivotBox.left - battlefieldBox.left + pivotBox.width / 2,
      y: pivotBox.top - battlefieldBox.top + pivotBox.height / 2,
    }
    const dx = target.x - pivot.x
    const dy = target.y - pivot.y
    // CSS rotate() turns a downward-facing arm left for a positive angle.
    // Negate the screen-space angle so dx < 0 stays left and dx > 0 stays right.
    const targetAngle = -Math.atan2(dx, dy) * 180 / Math.PI
    const distance = Math.hypot(dx, dy)
    const dropDuration = Math.round(Math.min(750, Math.max(450, distance * 1.25)))
    const pullDuration = Math.round(Math.min(1000, Math.max(650, distance * 1.65)))
    const run = ++runId.current
    const startLength = 70
    const trajectory: Trajectory = { targetChestId: item.id, dx, dy, angle: targetAngle, distance, startLength, endLength: startLength }
    trajectoryRef.current = trajectory
    sceneRef.current?.style.setProperty('--travel-time', `${dropDuration}ms`)
    sceneRef.current?.style.setProperty('--return-time', `${pullDuration}ms`)
    setActiveId(item.id)
    setMotion('aiming')
    if (!await nextPaint(run)) return
    sceneRef.current?.style.setProperty('--hook-angle', `${trajectory.angle}deg`)
    if (!await wait(210, run)) return
    trajectory.endLength = trajectory.distance
    setMotion('dropping')
    if (!await nextPaint(run)) return
    sceneRef.current?.style.setProperty('--rope-length', `${trajectory.endLength}px`)
    if (!await wait(dropDuration, run)) return
    setMotion('attached')
    if (!await wait(140, run)) return
    setMotion('pulling')
    if (!await nextPaint(run)) return
    if (trajectoryRef.current !== trajectory) return
    sceneRef.current?.style.setProperty('--rope-length', `${trajectory.startLength}px`)
    if (!await wait(pullDuration, run)) return
    setOptions(shuffledOptions(item))
    setMotion('question')
  }

  const answer = (choice: string) => {
    if (!active || motion !== 'question') return
    setSelected(choice)
    if (choice !== active.correctAnswer) { setWrong(true); return }
    setWrong(false)
    const run = ++runId.current
    wait(1150, run).then((valid) => { if (!valid) return
      setSolved((previous) => [...previous, active.id])
      setSelected(null)
      if (active.id === 'liberation-1975') { setPhase('cinematic'); timer.current = window.setTimeout(() => setPhase('reward'), 3500) }
      else { trajectoryRef.current = null; setActiveId(null); setMotion('idle') }
    })
  }

  const retryAnswer = () => { setWrong(false); setSelected(null) }
  const sceneStyle = { '--hook-angle': '0deg', '--rope-length': '70px' } as CSSProperties
  const solvedItems = useMemo(() => artifacts.filter((item) => solved.includes(item.id)), [solved])

  return <section ref={sceneRef} className={`round5 round5-${phase}`} style={sceneStyle}>
    <img className="round5-background" src={excavationSite} alt="Khu khai quật tư liệu lịch sử" />
    <div className="round5-sepia" />
    {phase === 'intro' && <div className="round5-intro"><p>ROUND V</p><h1>KHAI QUẬT LỊCH SỬ</h1><span>“Những trang sử đang chờ được đánh thức.”</span></div>}
    {phase === 'dig' && <>
      <header className="round5-hud"><div><p>HIỆN VẬT ĐÃ KHÔI PHỤC</p><strong>{solved.length} / 7</strong></div><div className="round5-timeline" aria-label="Dòng thời gian lịch sử">{artifacts.map((item) => <div key={item.id} className={solved.includes(item.id) ? 'restored' : ''}><small>{item.year}</small>{solved.includes(item.id) && <img src={item.asset} alt="" />}</div>)}</div></header>
      <div ref={pivotRef} className={`round5-hook-pivot motion-${motion}`} aria-hidden="true"><div className="round5-arm"><div className="round5-rope"><div className="round5-endpoint"><div className="round5-hook-image"><img src={hookImage} alt="" /></div>{active && ['attached', 'pulling'].includes(motion) && <div className="round5-carried-chest" style={{ '--attached-scale': active.scale, '--attached-rotation': `${active.rotation}deg` } as CSSProperties}><img src={chestImage} alt="" /></div>}</div></div></div></div>
      <div className="round5-chests">{artifacts.map((item) => { const isFinal = item.id === 'liberation-1975'; const isSolved = solved.includes(item.id); const isActive = activeId === item.id; return !isSolved && <button key={item.id} className={`round5-chest ${isActive && ['attached', 'pulling', 'question'].includes(motion) ? 'is-caught' : ''} ${isFinal && !unlockedFinal ? 'is-locked' : ''}`} style={{ left: `${item.chestPosition.x}%`, top: `${item.chestPosition.y}%`, '--chest-scale': item.scale, '--chest-rotation': `${item.rotation}deg` } as CSSProperties} onClick={(event) => catchChest(item, event.currentTarget)} disabled={motion !== 'idle' || (isFinal && !unlockedFinal)}><img src={chestImage} alt={isFinal && !unlockedFinal ? 'Rương bị khóa' : `Rương chứa ${item.title}`} />{isFinal && !unlockedFinal && <span>KHÓA</span>}</button> })}</div>
      {motion === 'question' && active && <div className={`round5-document ${wrong ? 'answer-wrong' : ''}`} role="dialog" aria-modal="true" aria-labelledby="round5-question"><div className="round5-document-art"><img className={selected === active.correctAnswer ? 'restored' : ''} src={active.asset} alt="Hiện vật vừa khai quật" /></div><div className="round5-document-copy"><p>{active.year} · HỒ SƠ VỪA KHAI QUẬT</p><h2 id="round5-question">{active.question}</h2><div className="round5-options">{options.map((option, index) => <button key={option} disabled={Boolean(selected)} className={`${selected === option ? (option === active.correctAnswer ? 'correct' : 'incorrect') : ''}`} onClick={() => answer(option)}><b>{letters[index]}</b>{option}</button>)}</div>{wrong ? <div className="round5-retry"><strong>HIỆN VẬT CHƯA THỂ KHÔI PHỤC</strong><span>Hãy xem lại và thử lại.</span><button onClick={retryAnswer}>THỬ LẠI</button></div> : selected === active.correctAnswer ? <div className="round5-explanation">{active.explanation}</div> : null}</div></div>}
    </>}
    {phase === 'cinematic' && <div className="round5-cinematic"><header><p>HIỆN VẬT ĐÃ KHÔI PHỤC</p><strong>7 / 7</strong></header><div className="round5-cinematic-artifacts">{solvedItems.map((item, index) => <figure key={item.id} style={{ '--order': index } as CSSProperties}><img src={item.asset} alt="" /><figcaption>{item.year}</figcaption></figure>)}</div><i/><p>LỊCH SỬ KHÔNG CHỈ ĐƯỢC<br/>TẠO NÊN BỞI NHỮNG TRẬN CHIẾN</p><strong>MẢNH SỬ ĐÃ ĐƯỢC KHÔI PHỤC</strong></div>}
    {phase === 'reward' && <FragmentRewardScene className="round5-reward" background={excavationSite} fragmentNumber={5} fragmentAsset={fragment} title="ĐÃ ĐƯỢC KHÔI PHỤC" description="Mảnh Sử thứ năm đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_FIVE' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })} />}
  </section>
}
