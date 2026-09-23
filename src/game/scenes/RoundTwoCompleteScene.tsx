import { useState, type AnimationEvent } from 'react'
import { useGame } from '../GameContext'
import fragment from '../../assets/round2/rewards/fragment-02.png'

export function RoundTwoCompleteScene() {
  const { dispatch } = useGame()
  const [leaving, setLeaving] = useState(false)
  const finish = (event: AnimationEvent<HTMLElement>) => {
    if (leaving && event.animationName === 'rewardToMap') dispatch({ type: 'RETURN_TO_MAP' })
  }

  return <section className={`fragment-reward-scene round-two-reward ${leaving ? 'reward-leaving' : ''}`} onAnimationEnd={finish}>
    <div className="reward-settle"/><div className="reward-particles"/><div className="reward-mist-wipe"/>
    <div className="fragment-reward-copy"><p>MẢNH SỬ #02</p><h1>DỰNG NƯỚC</h1><span>MẢNH SỬ #02 ĐÃ ĐƯỢC KHÔI PHỤC</span></div>
    <img className="fragment-reward-art" src={fragment} alt="Mảnh Sử số 02 — Dựng Nước"/>
    <button className="game-button fragment-return" disabled={leaving} onClick={() => setLeaving(true)}>TRỞ VỀ BẢN ĐỒ</button>
  </section>
}
