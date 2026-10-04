import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import { useGame } from '../GameContext'
import riverLow from '../../assets/round4/backgrounds/river-low.png'
import riverHigh from '../../assets/round4/backgrounds/river-high.png'
import riverMid from '../../assets/round4/backgrounds/river-mid.png'
import riverDry from '../../assets/round4/backgrounds/river-dry.png'
import stake from '../../assets/round4/battlefield/wooden-stake.png'
import daiVietBoat from '../../assets/round4/battlefield/dai-viet-boat.png'
import yuanWarship from '../../assets/round4/battlefield/yuan-warship.png'
import fragment from '../../assets/round4/rewards/fragment-04.png'

type Phase = 'place' | 'tide-rise' | 'lure-ready' | 'luring' | 'waiting' | 'golden' | 'cinematic' | 'game-one-exit' | 'failure-exit' | 'strategy' | 'restoring' | 'reward'
type Failure = 'early' | 'late' | 'timeout' | null
const STAKE_SITES = [{ x: 30, y: 62, r: -8 }, { x: 38, y: 55, r: 5 }, { x: 46, y: 65, r: -4 }, { x: 55, y: 52, r: 7 }, { x: 62, y: 61, r: -6 }, { x: 70, y: 48, r: 4 }, { x: 76, y: 57, r: -5 }, { x: 51, y: 44, r: 3 }, { x: 66, y: 68, r: 6 }]
const DAI_VIET_PATHS = [{ id: 'boat-1' }, { id: 'boat-2' }, { id: 'boat-3' }] as const
const YUAN_PATHS = [{ id: 'boat-1' }, { id: 'boat-2' }, { id: 'boat-3' }, { id: 'boat-4' }] as const
const STRATEGIES = [
  ['A', 'ĐỐI ĐẦU TRỰC DIỆN', 'Tương quan lực lượng quá chênh lệch. Đối đầu trực diện sẽ khiến Đại Việt đánh mất lợi thế chiến trường.'],
  ['B', 'TẬN DỤNG ĐỊA HÌNH VÀ CHỚP THỜI CƠ', 'Tận dụng thủy triều để che giấu trận địa cọc, địa hình sông Bạch Đằng và lực lượng mai phục hai bên bờ; khi nước rút, chiến thuyền đối phương mắc vào trận địa và rơi vào thế bị động.'],
  ['C', 'RÚT LUI BẢO TOÀN LỰC LƯỢNG', 'Rút lui có thể bảo toàn lực lượng trước mắt, nhưng đồng nghĩa với việc bỏ lỡ thời cơ quyết định để phá tan thủy quân đối phương.'],
] as const

export function RoundFourScene() {
  const { dispatch } = useGame()
  const timers = useRef<number[]>([])
  const deadline = useRef(0)
  const interval = useRef<number | null>(null)
  const [phase, setPhase] = useState<Phase>('place')
  const [stakes, setStakes] = useState<number[]>([])
  const [seconds, setSeconds] = useState(90)
  const [failure, setFailure] = useState<Failure>(null)
  const [choice, setChoice] = useState<string | null>(null)
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clearTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = []; if (interval.current !== null) { window.clearInterval(interval.current); interval.current = null } }
  useEffect(() => { startClock(); return () => clearTimers() }, [])
  const startClock = () => {
    deadline.current = Date.now() + 90000
    interval.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setSeconds(remaining)
      if (!remaining) fail('timeout')
    }, 250)
  }
  const fail = (reason: Failure) => { if (failure || phase === 'cinematic' || phase === 'reward') return; clearTimers(); if (phase === 'luring' || phase === 'waiting' || phase === 'golden') { setPhase('failure-exit'); later(() => setFailure(reason), 850) } else setFailure(reason) }
  const retry = () => { clearTimers(); setStakes([]); setSeconds(90); setFailure(null); setChoice(null); setPhase('place'); startClock() }
  const placeStake = (index: number) => { if (phase === 'place' && !stakes.includes(index)) setStakes((old) => [...old, index]) }
  const finishPlacement = () => { if (stakes.length < 5) return; setPhase('tide-rise'); later(() => setPhase('lure-ready'), 4500) }
  const lure = () => { if (phase !== 'lure-ready') return; setPhase('luring'); later(() => setPhase('waiting'), 8800); later(() => setPhase('golden'), 11200); later(() => fail('late'), 14800) }
  const ambush = () => { if (phase === 'waiting') { fail('early'); return }; if (phase !== 'golden') return; clearTimers(); setPhase('cinematic'); later(() => setPhase('game-one-exit'), 2200); later(() => setPhase('strategy'), 2550) }
  const beginRestore = () => { if (!choice) return; setPhase('restoring'); later(() => setPhase('reward'), 2700) }
  const selected = STRATEGIES.find(([id]) => id === choice)
  const tideScene = phase === 'place' ? 'low' : phase === 'tide-rise' || phase === 'lure-ready' || phase === 'luring' ? 'high' : phase === 'waiting' || phase === 'golden' || phase === 'failure-exit' ? 'mid' : 'dry'
  const reason = failure === 'early' ? 'Nước chưa rút, cọc chưa lộ, địch còn có thể thoát.' : failure === 'late' ? 'Nước đã rút quá sâu, địch kịp thoát khỏi trận địa.' : 'Thời cơ không chờ đợi ai.'
  return <section className={`round4 phase-${phase}`} style={{ backgroundImage: `url(${riverMid})` }}>
    <div className="round4-wash" />
    {['place', 'tide-rise', 'lure-ready', 'luring', 'waiting', 'golden', 'cinematic', 'game-one-exit', 'failure-exit'].includes(phase) && <><header className="round4-hud"><div><p>ROUND IV · TRẬN ĐỊA BẠCH ĐẰNG</p><b>{phase === 'place' ? '01 · ĐẶT CỌC' : phase === 'tide-rise' ? '02 · THỦY TRIỀU DÂNG' : phase === 'lure-ready' || phase === 'luring' ? '03 · NHỬ ĐỊCH' : '04 · MAI PHỤC'}</b></div><strong>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</strong></header><div className={`round4-battlefield tide-${tideScene} ${stakes.length ? 'has-stakes' : ''}`}>
      <img className="round4-tide-background tide-low" src={riverLow} alt=""/><img className="round4-tide-background tide-high" src={riverHigh} alt=""/><img className="round4-tide-background tide-mid" src={riverMid} alt=""/><img className="round4-tide-background tide-dry" src={riverDry} alt=""/>
      {STAKE_SITES.map((site, index) => <button key={index} className={`round4-stake-site ${stakes.includes(index) ? 'is-placed' : ''}`} style={{ left: `${site.x}%`, top: `${site.y}%`, '--stake-rotation': `${site.r}deg` } as CSSProperties} onClick={() => placeStake(index)} disabled={phase !== 'place'} aria-label={`Vị trí cọc ${index + 1}`}>{stakes.includes(index) && <img src={stake} alt="Cọc gỗ" />}</button>)}
      {(phase === 'luring' || phase === 'waiting' || phase === 'golden' || phase === 'cinematic' || phase === 'game-one-exit' || phase === 'failure-exit') && <>{DAI_VIET_PATHS.map(({ id }) => <div key={id} className={`round4-boat-motion dai-viet ${id}`}><span className="round4-boat-drift"><img className="round4-boat" src={daiVietBoat} alt="Thuyền Đại Việt"/></span></div>)}{YUAN_PATHS.map(({ id }) => <div key={id} className={`round4-boat-motion yuan ${id}`}><span className="round4-boat-drift"><img className="round4-boat" src={yuanWarship} alt="Chiến thuyền quân Nguyên"/></span></div>)}</>}
    </div><aside className={`round4-gauge ${phase === 'golden' ? 'is-golden' : ''}`}><span>THỦY TRIỀU</span><i className={`gauge-${phase}`} /><small>{phase === 'tide-rise' ? 'Thủy triều đang che giấu trận địa...' : phase === 'waiting' ? 'Chờ nước rút...' : phase === 'golden' ? 'THỜI CƠ!' : ''}</small></aside>
      <footer className="round4-actions">{phase === 'place' && <button className="game-button" disabled={stakes.length < 5} onClick={finishPlacement}>HOÀN TẤT TRẬN ĐỊA · {stakes.length}/5</button>}{phase === 'lure-ready' && <button className="game-button" onClick={lure}>NHỬ ĐỊCH</button>}{(phase === 'waiting' || phase === 'golden') && <button className="game-button ambush" onClick={ambush}>KÍCH HOẠT MAI PHỤC</button>}</footer>
      {phase === 'cinematic' || phase === 'game-one-exit' ? <div className="round4-cinematic"><p>THỦY TRIỀU RÚT</p><strong>TRẬN ĐỊA ĐÃ KÍCH HOẠT</strong></div> : null}</>}
    {failure && <div className="round4-fail"><div><p>TRẬN ĐỊA CHƯA PHÁT HUY TÁC DỤNG.</p><span>{reason}</span><button className="game-button" onClick={retry}>CHƠI LẠI</button></div></div>}
    {phase === 'strategy' && <div className="round4-strategy"><header><p>ROUND IV · CHỌN CHIẾN LƯỢC</p><h1>Quân đối phương đông hơn.<br/>Bạn sẽ lựa chọn cách nào?</h1></header><div className="round4-choices">{STRATEGIES.map(([id, title]) => <button key={id} className={`round4-choice ${choice === id ? `selected choice-${id}` : ''}`} onClick={() => setChoice(id)}><em>{id}</em><b>{title}</b></button>)}</div>{selected && <div className={`round4-explanation choice-${selected[0]}`}><p>{selected[2]}</p><div><button onClick={() => setChoice(null)}>XEM LỰA CHỌN KHÁC</button><button className="game-button" onClick={beginRestore}>TIẾP TỤC</button></div></div>}</div>}
    {phase === 'restoring' && <div className="round4-restoring"><p>MẢNH SỬ</p><strong>ĐÃ ĐƯỢC KHÔI PHỤC</strong></div>}
    {phase === 'reward' && <FragmentRewardScene className="round4-reward" background={riverMid} fragmentNumber={4} fragmentAsset={fragment} title="NON SÔNG" description="Mảnh Sử thứ tư đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_FOUR' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })} />}
  </section>
}
