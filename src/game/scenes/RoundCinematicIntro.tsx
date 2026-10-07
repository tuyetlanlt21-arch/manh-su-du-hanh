import { useEffect, type CSSProperties } from 'react'
import { useGame } from '../GameContext'
import openingLandscape from '../../assets/map/opening-landscape.png'
import roundThreeLandscape from '../../assets/round3/backgrounds/round3-intro-bg.png'
import roundFourLandscape from '../../assets/round4/backgrounds/river-mid.png'
import roundFiveLandscape from '../../assets/round5/backgrounds/excavation-site.png'

type IntroData = { numeral: string; title: string; subtitle: string; background: string; start: 'START_EXCAVATION' | 'START_MEMORY_GAME' | 'START_ROUND_THREE' | 'START_ROUND_FOUR' | 'START_ROUND_FIVE' }
const intros: Record<string, IntroData> = {
  'chapter-01': { numeral: 'ROUND I', title: 'KHỞI NGUYÊN', subtitle: 'Văn Lang – Âu Lạc', background: openingLandscape, start: 'START_EXCAVATION' },
  'chapter-02': { numeral: 'ROUND II', title: 'DỰNG NƯỚC', subtitle: 'Những câu chuyện đầu tiên của lịch sử.', background: openingLandscape, start: 'START_MEMORY_GAME' },
  'chapter-03': { numeral: 'ROUND III', title: 'DẤU CHÂN KINH ĐÔ', subtitle: 'Những dấu chân tạo nên bản đồ Đại Việt.', background: roundThreeLandscape, start: 'START_ROUND_THREE' },
  'chapter-04': { numeral: 'ROUND IV', title: 'NON SÔNG DẬY SÓNG', subtitle: 'Khi lịch sử được quyết định trên chiến trường.', background: roundFourLandscape, start: 'START_ROUND_FOUR' },
  'chapter-05': { numeral: 'ROUND V', title: 'KHAI QUẬT LỊCH SỬ', subtitle: 'Những trang sử đang chờ được đánh thức.', background: roundFiveLandscape, start: 'START_ROUND_FIVE' },
}

export function RoundCinematicIntro() {
  const { state, dispatch } = useGame()
  const intro = state.currentChapter ? intros[state.currentChapter] : null
  useEffect(() => {
    if (!intro) return
    const timer = window.setTimeout(() => dispatch({ type: intro.start }), 2100)
    return () => window.clearTimeout(timer)
  }, [dispatch, intro])
  if (!intro) return null
  return <section className="round-cinematic-intro" style={{ '--round-intro-background': `url(${intro.background})` } as CSSProperties}><div className="round-cinematic-intro-wash"/><div className="round-cinematic-intro-copy"><p>{intro.numeral}</p><h1>{intro.title}</h1><span>{intro.subtitle}</span></div></section>
}
