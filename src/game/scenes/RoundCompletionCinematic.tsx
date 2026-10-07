import type { AnimationEvent, CSSProperties } from 'react'
import { useGame } from '../GameContext'
import excavationMap from '../../assets/round1/environment/excavation-map.png'
import coLoaMap from '../../assets/round2/coloa/round2-co-loa-map.png'
import timelineMap from '../../assets/round3/backgrounds/game2-timeline-bg.png'
import bachDangRiver from '../../assets/round4/backgrounds/river-dry.png'

type CinematicConfig = { fragment: number; background: string; message: string; className: string; continueAction: 'SHOW_ROUND_ONE_REWARD' | 'SHOW_ROUND_TWO_REWARD' | 'SHOW_ROUND_THREE_REWARD' | 'SHOW_ROUND_FOUR_REWARD' }

const cinematics: Record<string, CinematicConfig> = {
  'chapter-01': { fragment: 1, background: excavationMap, className: 'round-completion-one', message: 'DẤU TÍCH CỦA MỘT NỀN VĂN MINH\nĐÃ ĐƯỢC ĐÁNH THỨC', continueAction: 'SHOW_ROUND_ONE_REWARD' },
  'chapter-02': { fragment: 2, background: coLoaMap, className: 'round-completion-two', message: 'NHỮNG KÝ ỨC ĐẦU TIÊN\nĐÃ TÌM LẠI ĐƯỢC DÒNG CHẢY', continueAction: 'SHOW_ROUND_TWO_REWARD' },
  'chapter-03': { fragment: 3, background: timelineMap, className: 'round-completion-three', message: 'NHỮNG DẤU CHÂN\nĐÃ TRỞ LẠI TRÊN BẢN ĐỒ ĐẠI VIỆT', continueAction: 'SHOW_ROUND_THREE_REWARD' },
  'chapter-04': { fragment: 4, background: bachDangRiver, className: 'round-completion-four', message: 'NON SÔNG ĐÃ GHI LẠI\nMỘT THỜI KHẮC QUYẾT ĐỊNH', continueAction: 'SHOW_ROUND_FOUR_REWARD' },
}

export function RoundCompletionCinematic() {
  const { state, dispatch } = useGame()
  const config = state.currentChapter ? cinematics[state.currentChapter] : null
  if (!config) return null
  const finish = (event: AnimationEvent<HTMLElement>) => {
    if (event.currentTarget === event.target && event.animationName === 'roundCompletionExit') dispatch({ type: config.continueAction })
  }
  return <section className={`round-completion-cinematic ${config.className}`} style={{ '--round-completion-background': `url(${config.background})` } as CSSProperties} onAnimationEnd={finish}>
    <div className="round-completion-environment"/><div className="round-completion-wash"/>
    <div className="round-completion-memory" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <div className="round-completion-copy"><p>{config.message.split('\n').map((line) => <span key={line}>{line}</span>)}</p></div>
    <div className="round-completion-fragment"><small>MẢNH SỬ #{String(config.fragment).padStart(2, '0')}</small><strong>ĐÃ ĐƯỢC KHÔI PHỤC</strong></div>
  </section>
}
