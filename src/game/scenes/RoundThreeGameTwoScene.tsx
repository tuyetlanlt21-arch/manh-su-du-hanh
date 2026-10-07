import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { useGame } from '../GameContext'
import timelineBackground from '../../assets/round3/backgrounds/game2-timeline-bg.png'

type Phase = 'intro' | 'playing' | 'incorrect' | 'correct-animation' | 'timeout'
type EventId = 'bach-dang' | 'dai-co-viet' | 'thang-long' | 'le-so' | 'ngoc-hoi'
const YEARS = [938, 968, 1010, 1428, 1789] as const
const EVENTS: Array<{ id: EventId; year: number; text: string }> = [
  { id: 'bach-dang', year: 938, text: 'Ngô Quyền chiến thắng quân Nam Hán trên sông Bạch Đằng.' },
  { id: 'dai-co-viet', year: 968, text: 'Đinh Bộ Lĩnh lên ngôi Hoàng đế, đặt quốc hiệu Đại Cồ Việt, đóng đô tại Hoa Lư.' },
  { id: 'thang-long', year: 1010, text: 'Lý Công Uẩn dời đô từ Hoa Lư về Đại La, đổi tên thành Thăng Long.' },
  { id: 'le-so', year: 1428, text: 'Lê Lợi lên ngôi Hoàng đế, mở đầu triều Lê sơ sau thắng lợi của khởi nghĩa Lam Sơn.' },
  { id: 'ngoc-hoi', year: 1789, text: 'Quang Trung đại phá quân Thanh, chiến thắng Ngọc Hồi – Đống Đa.' },
]
const shuffled = () => {
  let copy: typeof EVENTS
  do {
    copy = [...EVENTS]
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
    }
  } while (copy.every((event, index) => event.id === EVENTS[index].id))
  return copy
}
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export function RoundThreeGameTwoScene() {
  const { dispatch } = useGame()
  const timers = useRef<number[]>([])
  const timer = useRef<number | null>(null)
  const deadline = useRef(0)
  const drag = useRef<EventId | null>(null)
  const completionStarted = useRef(false)
  const [phase, setPhase] = useState<Phase>('intro')
  const [cards, setCards] = useState(shuffled)
  const [placed, setPlaced] = useState<Partial<Record<number, EventId>>>({})
  const [seconds, setSeconds] = useState(90)
  const [dragId, setDragId] = useState<EventId | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [over, setOver] = useState<number | null>(null)
  const [lit, setLit] = useState(-1)
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  const stopTimer = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }
  const startTimer = () => {
    stopTimer()
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setSeconds(remaining)
      if (!remaining) {
        stopTimer()
        setPhase('timeout')
      }
    }
    tick()
    timer.current = window.setInterval(tick, 250)
  }
  useEffect(() => () => {
    stopTimer()
    timers.current.forEach(clearTimeout)
  }, [])
  const start = () => {
    setCards(shuffled())
    deadline.current = Date.now() + 90000
    setSeconds(90)
    setPhase('playing')
    startTimer()
  }
  const restart = () => {
    setCards(shuffled())
    setPlaced({})
    setSeconds(90)
    setLit(-1)
    completionStarted.current = false
    deadline.current = Date.now() + 90000
    setPhase('playing')
    startTimer()
  }
  const item = (id: EventId) => EVENTS.find((event) => event.id === id)!
  const assigned = new Set(Object.values(placed))
  const available = cards.filter((event) => !assigned.has(event.id))
  const beginDrag = (event: PointerEvent<HTMLElement>, id: EventId) => {
    if (phase !== 'playing') return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = id
    setDragId(id)
    setPointer({ x: event.clientX, y: event.clientY })
  }
  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    setPointer({ x: event.clientX, y: event.clientY })
    const target = (document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null)?.closest<HTMLElement>('[data-round3-year]')
    setOver(target ? Number(target.dataset.round3Year) : null)
  }
  const endDrag = (event: PointerEvent<HTMLElement>) => {
    const id = drag.current
    if (!id) return
    drag.current = null
    setDragId(null)
    const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
    const target = element?.closest<HTMLElement>('[data-round3-year]')
    const tray = element?.closest<HTMLElement>('[data-round3-tray]')
    if (!target && !tray) {
      setOver(null)
      return
    }
    setPlaced((old) => {
      const source = Number(Object.entries(old).find(([, value]) => value === id)?.[0])
      if (tray) {
        const next = { ...old }
        if (Number.isFinite(source)) delete next[source]
        return next
      }
      const year = Number(target!.dataset.round3Year)
      const displaced = old[year]
      const next = { ...old }
      if (Number.isFinite(source)) delete next[source]
      next[year] = id
      if (displaced && Number.isFinite(source) && displaced !== id) next[source] = displaced
      return next
    })
    setOver(null)
  }
  const runCompletion = () => {
    if (completionStarted.current) return
    completionStarted.current = true
    stopTimer()
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('correct-animation')
    setLit(0)
    YEARS.slice(1).forEach((_, index) => later(() => setLit(index + 1), 160 + index * 260))
    later(() => dispatch({ type: 'SHOW_ROUND_COMPLETION' }), 4050)
  }
  const confirm = () => {
    if (phase !== 'playing' || YEARS.some((year) => !placed[year])) return
    if (YEARS.some((year) => item(placed[year]!).year !== year)) {
      setPhase('incorrect')
      later(() => setPhase('playing'), 1800)
      return
    }
    runCompletion()
  }
  const card = (id: EventId, compact = false) => <article key={id} className={`round3-event-card ${dragId === id ? 'is-drag-source' : ''} ${compact ? 'is-placed' : ''}`} onPointerDown={(event) => beginDrag(event, id)} onPointerMove={moveDrag} onPointerUp={endDrag}><p>{item(id).text}</p></article>
  return <><section className={`round3-game2 phase-${phase}`} style={{ backgroundImage: `url(${timelineBackground})` }}><div className="round3-game2-shade"/>{phase === 'intro' ? <div className="round3-game2-intro"><p>ROUND III</p><h1>XẾP LẠI DÒNG CHẢY</h1><span>Khôi phục những mắt xích của lịch sử.</span><b>01:30</b><button className="game-button" onClick={start}>BẮT ĐẦU</button></div> : <><div className="round3-game2-content"><header className="round3-game2-header"><p>ROUND III</p><h1>XẾP LẠI DÒNG CHẢY</h1><strong className={seconds <= 10 ? 'urgent' : seconds <= 30 ? 'warning' : ''}>{formatTime(seconds)}</strong></header><main className="round3-timeline"><div className="round3-timeline-line"/>{YEARS.map((year, index) => <section key={year} className={`round3-year ${over === year ? 'is-over' : ''} ${lit >= index ? 'is-lit' : ''}`} data-round3-year={year}><b>{year}</b><i/>{placed[year] ? card(placed[year]!, true) : <span className="round3-year-drop">THẢ SỰ KIỆN</span>}</section>)}</main><section className="round3-event-tray" data-round3-tray><h2>CÁC MẮT XÍCH ĐANG THẤT LẠC</h2><div>{available.map((event) => card(event.id))}</div></section></div>{phase === 'incorrect' && <div className="round3-game2-feedback">MỘT MẮT XÍCH ĐANG NẰM SAI VỊ TRÍ.</div>}{phase === 'timeout' && <div className="round3-game2-timeout"><b>THỜI GIAN ĐÃ KHÉP LẠI.</b><span>Những mắt xích lịch sử vẫn chưa được nối liền.</span><button className="game-button" onClick={restart}>THỬ LẠI</button></div>}{dragId && <article className="round3-drag-card" style={{ left: pointer.x, top: pointer.y }}><p>{item(dragId).text}</p></article>}</>}</section>{phase !== 'intro' && createPortal(<button className="game-button round3-confirm" disabled={phase !== 'playing' || YEARS.some((year) => !placed[year])} onClick={confirm}>KHÔI PHỤC DÒNG THỜI GIAN</button>, document.body)}</>
}
