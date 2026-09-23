import { useState } from 'react'
import { useGame } from '../GameContext'
import fragment from '../../assets/round1/rewards/fragment-01.png'

export function RoundCompleteScene() {
  const { dispatch } = useGame(); const [leaving, setLeaving] = useState(false)
  return <section className={`fragment-reward-scene ${leaving ? 'reward-leaving' : ''}`} onAnimationEnd={(event) => { if (leaving && event.animationName === 'rewardToMap') dispatch({ type: 'RETURN_TO_MAP' }) }}>
    <div className="reward-settle"/><div className="reward-particles"/><div className="reward-mist-wipe"/>
    <div className="fragment-reward-copy"><p>MẢNH SỬ #01</p><h1>KHỞI NGUYÊN</h1><span>MẢNH SỬ #01 ĐÃ ĐƯỢC KHÔI PHỤC</span></div>
    <img className="fragment-reward-art" src={fragment} alt="Mảnh Sử số 01 — Khởi Nguyên"/>
    <button className="game-button fragment-return" disabled={leaving} onClick={() => setLeaving(true)}>TRỞ VỀ BẢN ĐỒ</button>
  </section>
}
