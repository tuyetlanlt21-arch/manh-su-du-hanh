import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { useGame } from '../GameContext'
import { round6Memories, type Round6Memory, type Round6Option } from '../data/round6'
import openingVideo from '../../assets/round6/videos/Ancient_chronicle_book_opening_1080p_20261019211020.mp4'
import unlockingVideo from '../../assets/round6/videos/Ancient_chronicle_book_unlocking_1080p_20261019211555.mp4'
import '../../styles/round6-v2.css'

type Phase = 'intro' | 'start' | 'memory' | 'unlocking' | 'achievement'
type MemoryStatus = 'idle' | 'wrong' | 'correct'

function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function RoundSixSceneV2() {
  const { state, dispatch } = useGame()
  const restoredIds = state.round6PlacedFragments
  const initialPhase: Phase = state.round6VictoryCompleted ? 'achievement' : restoredIds.length === round6Memories.length ? 'unlocking' : state.round6PuzzleStarted ? 'memory' : 'intro'
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [memoryIndex, setMemoryIndex] = useState(Math.min(restoredIds.length, round6Memories.length - 1))
  const [memoryOptions, setMemoryOptions] = useState<Round6Option[]>(() => shuffle(round6Memories[Math.min(restoredIds.length, round6Memories.length - 1)].options))
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus>('idle')
  const [mediaError, setMediaError] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ambientVideoRef = useRef<HTMLVideoElement>(null)
  const videoHandled = useRef(false)
  const startHandled = useRef(false)
  const currentMemory = round6Memories[memoryIndex]
  const videoSrc = phase === 'intro' ? openingVideo : unlockingVideo
  const videoLabel = phase === 'intro' ? 'Mở Cuốn Sử Ký' : 'Mở khóa Cuốn Sử Ký'

  useEffect(() => {
    if (phase !== 'intro' && phase !== 'unlocking') return
    const video = videoRef.current
    const ambient = ambientVideoRef.current
    if (!video || !ambient) return
    setMediaError(false)
    setAudioMuted(false)
    videoHandled.current = false
    video.src = videoSrc
    video.muted = false
    video.volume = 1
    video.load()
    ambient.src = videoSrc
    ambient.muted = true
    ambient.volume = 0
    ambient.load()
    const syncAmbient = () => {
      if (ambient.readyState >= 1 && Math.abs(ambient.currentTime - video.currentTime) > 0.08) ambient.currentTime = video.currentTime
    }
    const playAmbient = () => {
      syncAmbient()
      void ambient.play().catch(() => undefined)
    }
    video.addEventListener('play', playAmbient)
    video.addEventListener('timeupdate', syncAmbient)
    video.addEventListener('seeking', syncAmbient)
    ambient.addEventListener('canplay', playAmbient, { once: true })
    const play = () => {
      playAmbient()
      void video.play().then(() => setAudioMuted(false)).catch(() => {
        video.muted = true
        setAudioMuted(true)
        void video.play().catch(() => setMediaError(true))
      })
    }
    if (video.readyState >= 3) play()
    else video.addEventListener('canplay', play, { once: true })
    return () => {
      video.removeEventListener('canplay', play)
      video.removeEventListener('play', playAmbient)
      video.removeEventListener('timeupdate', syncAmbient)
      video.removeEventListener('seeking', syncAmbient)
      ambient.removeEventListener('canplay', playAmbient)
      ambient.pause()
    }
  }, [phase, videoSrc])

  const enterMemoryPhase = () => {
    if (startHandled.current) return
    startHandled.current = true
    dispatch({ type: 'START_ROUND_SIX_PUZZLE' })
    setMemoryIndex(restoredIds.length)
    setMemoryOptions(shuffle(round6Memories[restoredIds.length].options))
    setMemoryStatus('idle')
    setPhase('memory')
  }

  const finishCinematic = () => {
    if (videoHandled.current) return
    videoHandled.current = true
    if (phase === 'intro') setPhase('start')
    else {
      dispatch({ type: 'COMPLETE_ROUND_SIX' })
      setPhase('achievement')
    }
  }

  const skipCinematic = () => {
    if (!videoHandled.current) finishCinematic()
  }

  const enableAudio = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    void video.play().then(() => setAudioMuted(false)).catch(() => setAudioMuted(true))
  }

  const chooseMemoryOption = (option: Round6Option) => {
    if (memoryStatus === 'correct') return
    if (option.id === currentMemory.answerId) {
      setMemoryStatus('correct')
      dispatch({ type: 'PLACE_ROUND_SIX_FRAGMENT', fragmentId: currentMemory.id })
    } else setMemoryStatus('wrong')
  }

  const continueMemory = () => {
    if (memoryStatus !== 'correct') return
    const nextIndex = memoryIndex + 1
    if (nextIndex >= round6Memories.length) {
      setPhase('unlocking')
      return
    }
    setMemoryIndex(nextIndex)
    setMemoryOptions(shuffle(round6Memories[nextIndex].options))
    setMemoryStatus('idle')
  }

  if (phase === 'achievement') return <AchievementScreen onReturn={() => dispatch({ type: 'RETURN_TO_MAP' })} />

  if (phase === 'intro' || phase === 'unlocking') {
    const cinematic = <section className="round6-cinematic-root" aria-label={videoLabel}>
      <video ref={ambientVideoRef} className="round6-cinematic-ambient" muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
      <div className="round6-cinematic-ambient-shade" aria-hidden="true" />
      <div className="round6-cinematic-edge-fill" aria-hidden="true" />
      <div className="round6-cinematic-video-frame"><video ref={videoRef} className="round6-cinematic-video" playsInline preload="auto" aria-label={videoLabel} onEnded={finishCinematic} onError={() => setMediaError(true)} /><div className="round6-cinematic-letterbox" aria-hidden="true" /></div>
      <div className="round6-cinematic-brand-mask" aria-hidden="true" />
      <div className="round6-cinematic-vignette" />
      <div className="round6-cinematic-controls">
        <button className="round6-skip" onClick={skipCinematic}>BỎ QUA</button>
        {audioMuted && <button className="round6-audio-toggle" onClick={enableAudio}>BẬT TIẾNG</button>}
      </div>
      {mediaError && <div className="round6-media-recovery"><p>Không thể tải đoạn phim này.</p><button className="game-button" onClick={skipCinematic}>TIẾP TỤC</button></div>}
    </section>
    return createPortal(cinematic, document.body)
  }

  if (phase === 'start') return <section className="round6 round6-start" aria-labelledby="round6-start-title">
    <div className="round6-start-content">
      <span className="round6-start-line" aria-hidden="true" />
      <p className="round6-start-kicker">CHƯƠNG VI · HỒI KẾT</p>
      <h1 id="round6-start-title">GIẢI MÃ KÝ ỨC</h1>
      <p className="round6-start-description">Năm mảnh ký ức cuối cùng đang chờ được đánh thức.<br />Hãy lần theo dấu vết lịch sử để hoàn thành hành trình.</p>
      <button className="round6-start-button" onClick={enterMemoryPhase} disabled={startHandled.current}>BẮT ĐẦU GIẢI MÃ</button>
      <p className="round6-start-footer">05 MẢNH KÝ ỨC · 01 HÀNH TRÌNH CUỐI</p>
    </div>
  </section>

  return <section className={`round6 round6-gameplay phase-${phase}`}>
    <div className="round6-ornament" />
    <header className="round6-header"><div><span>CHƯƠNG VI · TRANG SỬ CUỐI CÙNG</span><h1>GIẢI MÃ KÝ ỨC</h1></div><div className="round6-progress"><b>{String(Math.min(memoryIndex + (memoryStatus === 'correct' ? 1 : 0), 5)).padStart(2, '0')}<small>/05</small></b><span>KÝ ỨC ĐÃ KHÔI PHỤC</span><i><em style={{ width: `${Math.min(memoryIndex + (memoryStatus === 'correct' ? 1 : 0), 5) * 20}%` }} /></i></div></header>
    <main className="round6-memory-layout"><MemoryArtwork memory={currentMemory} restored={memoryStatus === 'correct'} /><MemoryQuestion memory={currentMemory} options={memoryOptions} status={memoryStatus} onSelect={chooseMemoryOption} onContinue={continueMemory} /></main>
  </section>
}

function AchievementScreen({ onReturn }: { onReturn: () => void }) {
  return <section className="round6 round6-achievement-v2" aria-labelledby="round6-achievement-title">
    <nav className="round6-achievement-nav" aria-label="Điều hướng thành tựu"><span>MẢNH SỬ DU HÀNH</span><span>CHƯƠNG VI · HỒI KẾT</span></nav>
    <main className="round6-achievement-content">
      <span className="round6-achievement-line" aria-hidden="true" />
      <p className="round6-achievement-eyebrow">HÀNH TRÌNH ĐÃ HOÀN THÀNH</p>
      <h1 id="round6-achievement-title">NHÀ DU HÀNH<br />LỊCH SỬ</h1>
      <span className="round6-achievement-divider" aria-hidden="true" />
      <blockquote>“Quá khứ không biến mất.<br />Nó chỉ chờ được chúng ta nhớ lại.”</blockquote>
      <button className="round6-achievement-return" onClick={onReturn}>TRỞ VỀ BẢN ĐỒ</button>
    </main>
    <p className="round6-achievement-footer">MỘT HÀNH TRÌNH KHÉP LẠI · LỊCH SỬ CÒN MÃI</p>
  </section>
}

function MemoryArtwork({ memory, restored }: { memory: Round6Memory; restored: boolean }) {
  return <figure className={`round6-artwork ${restored ? 'is-restored' : ''}`}><div><img src={memory.image} alt={memory.name} /></div><figcaption><span>{memory.chapter}</span><strong>{memory.name}</strong></figcaption></figure>
}

function MemoryQuestion({ memory, options, status, onSelect, onContinue }: { memory: Round6Memory; options: Round6Option[]; status: MemoryStatus; onSelect: (option: Round6Option) => void; onContinue: () => void }) {
  return <section className="round6-question"><p className="round6-kicker">MANH MỐI {memory.chapter}</p><h2>{memory.name}</h2><blockquote>“{memory.clue}”</blockquote><h3>{memory.question}</h3><div className="round6-options">{options.map((option, index) => <button key={option.id} disabled={status === 'correct'} className={status === 'correct' && option.id === memory.answerId ? 'is-correct' : ''} onClick={() => onSelect(option)}><b>{String.fromCharCode(65 + index)}</b><span>{option.label}</span></button>)}</div><div className={`round6-action-space ${status}`} aria-live="polite">{status === 'wrong' && <p className="is-wrong">Chưa đúng. Hãy đọc lại manh mối và thử lại.</p>}{status === 'correct' && <><p className="is-correct">KÝ ỨC ĐÃ ĐƯỢC KHÔI PHỤC</p><button className="game-button" onClick={onContinue}>{memory.id === 'fragment-05' ? 'MỞ KHÓA TRANG SỬ' : 'TIẾP TỤC'}</button></>}</div></section>
}
