import { useState, type AnimationEvent } from 'react'
import { useGame } from '../GameContext'
import fragment from '../../assets/round2/rewards/fragment-02.png'
import coLoaMap from '../../assets/round2/coloa/round2-co-loa-map.png'

export function RoundTwoCompleteScene() {
  const { dispatch } = useGame()
  const [leaving, setLeaving] = useState(false)
  const finish = (event: AnimationEvent<HTMLElement>) => { if (leaving && event.animationName === 'rewardToMap') dispatch({ type: 'RETURN_TO_MAP' }) }
  return <section className={'fragment-reward-scene round-two-reward '+(leaving ? 'reward-leaving' : '')} onAnimationEnd={finish} style={{ '--round-two-reward-map': 'url('+coLoaMap+')' } as React.CSSProperties}>
    <div className="reward-settle"/><div className="reward-particles"/><div className="reward-mist-wipe"/>
    <div className="fragment-reward-copy"><p>MẢNH SỬ #02</p><h1>DỰNG NƯỚC</h1><span>Ký ức đã trở lại. Mảnh Sử này được lưu vào hành trang của bạn.</span><button className="game-button fragment-return" onClick={() => setLeaving(true)}>LƯU VÀO KHO KÝ ỨC</button></div>
    <img className="fragment-reward-art" src={fragment} alt="Mảnh Sử số 02"/>
  </section>
}
