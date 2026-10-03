import { useState, type AnimationEvent, type CSSProperties } from 'react'

type FragmentRewardSceneProps = {
  fragmentNumber: number
  fragmentAsset: string
  title: string
  description: string
  buttonLabel: string
  onCollect: () => void
  onFinished: () => void
  className?: string
  style?: CSSProperties
  background?: string
  actionInsideCopy?: boolean
}

export function FragmentRewardScene({ fragmentNumber, fragmentAsset, title, description, buttonLabel, onCollect, onFinished, className = '', style, background, actionInsideCopy = true }: FragmentRewardSceneProps) {
  const [leaving, setLeaving] = useState(false)
  const collect = () => {
    if (leaving) return
    onCollect()
    setLeaving(true)
  }
  const finish = (event: AnimationEvent<HTMLElement>) => {
    if (leaving && event.animationName === 'rewardToMap') onFinished()
  }
  const action = <button className="game-button fragment-return" disabled={leaving} onClick={collect}>{buttonLabel}</button>

  return <section className={`fragment-reward-scene ${className} ${leaving ? 'reward-leaving' : ''}`} style={style} onAnimationEnd={finish}><div className="reward-stage" style={background ? { '--fragment-reward-background': `url(${background})` } as CSSProperties : undefined}>
    <div className="reward-settle"/><div className="reward-particles"/><div className="reward-mist-wipe"/><div className="fragment-reward-copy reward-content"><p>MẢNH SỬ #{String(fragmentNumber).padStart(2, '0')}</p><h1>{title}</h1><span>{description}</span>{actionInsideCopy && action}</div><img className="fragment-reward-art fragment-visual" src={fragmentAsset} alt={`Mảnh Sử số ${String(fragmentNumber).padStart(2, '0')}`}/>{!actionInsideCopy && action}
  </div></section>
}
