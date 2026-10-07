import { useState } from 'react'
import { useGame } from '../GameContext'
import { GameButton } from '../components/GameButton'
import { BackButton } from '../components/BackButton'
import openingLandscape from '../../assets/map/opening-landscape.png'
import roundThreeLandscape from '../../assets/round3/backgrounds/round3-intro-bg.png'
import roundFourLandscape from '../../assets/round4/backgrounds/river-mid.png'
import roundFiveLandscape from '../../assets/round5/backgrounds/excavation-site.png'

export function ChapterEntryScene() {
  const { state, dispatch } = useGame()
  const [leaving, setLeaving] = useState(false)
  const roundTwo = state.currentChapter === 'chapter-02'
  const roundThree = state.currentChapter === 'chapter-03'
  const roundFour = state.currentChapter === 'chapter-04'
  const roundFive = state.currentChapter === 'chapter-05'
  const begin = () => {
    if (roundTwo || roundThree || roundFour || roundFive) setLeaving(true)
    else dispatch({ type: 'START_EXCAVATION' })
  }
  const beginNextRound = () => {
    if (roundFive) dispatch({ type: 'START_ROUND_FIVE' })
    else if (roundFour) dispatch({ type: 'START_ROUND_FOUR' })
    else if (roundThree) dispatch({ type: 'START_ROUND_THREE' })
    else dispatch({ type: 'START_MEMORY_GAME' })
  }
  const kicker = roundFive ? 'ROUND V' : roundFour ? 'ROUND IV' : roundThree ? 'ROUND III' : roundTwo ? 'MẢNH SỬ II' : 'MẢNH SỬ I'
  const title = roundFive ? 'KHAI QUẬT LỊCH SỬ' : roundFour ? 'NON SÔNG DẬY SÓNG' : roundThree ? 'DẤU CHÂN KINH ĐÔ' : roundTwo ? 'DỰNG NƯỚC' : 'KHỞI NGUYÊN'
  const subtitle = roundFive ? 'Những trang sử đang chờ được đánh thức.' : roundFour ? 'Khi lịch sử được quyết định trên chiến trường' : roundThree ? 'Những dấu chân tạo nên bản đồ Đại Việt' : roundTwo ? 'NHỮNG CÂU CHUYỆN ĐẦU TIÊN CỦA LỊCH SỬ' : 'VĂN LANG – ÂU LẠC'
  const copy = roundThree ? '' : roundTwo ? 'Những ký ức đầu tiên về thời dựng nước đã bị thời gian làm xáo trộn. Hãy nối lại những câu chuyện còn sót lại để tìm đường đến một kinh đô cổ.' : 'Dấu tích của một thời đại đang nằm dưới lớp đất. Hãy tìm và phục dựng những hiện vật để khôi phục ký ức đầu tiên.'
  return <section className={`chapter-scene chapter-entry-scene ${roundTwo ? 'chapter-two-entry' : ''} ${roundThree ? 'chapter-three-entry' : ''} ${roundFour ? 'chapter-four-entry' : ''} ${leaving ? 'chapter-departing' : ''}`} onAnimationEnd={(event) => { if (leaving && event.animationName === 'chapterToMemory') beginNextRound() }}>
    {roundTwo && <img className="chapter-two-landscape" src={openingLandscape} alt=""/>}
    {roundThree && <img className="chapter-two-landscape" src={roundThreeLandscape} alt=""/>}
    {roundFour && <img className="chapter-two-landscape" src={roundFourLandscape} alt=""/>}
    {roundFive && <img className="chapter-two-landscape" src={roundFiveLandscape} alt=""/>}
    <div className="chapter-entry-landscape"/><div className="chapter-entry-mist"/><div className="chapter-page-mist"/>
    <BackButton onClick={() => !leaving && dispatch({ type: 'RETURN_TO_MAP' })}/>
    <div className="chapter-panel chapter-entry-panel"><p>{kicker}</p><h1>{title}</h1><b>{subtitle}</b>{copy && <span>{copy}</span>}<div><GameButton disabled={leaving} onClick={begin}>{leaving ? 'ĐANG MỞ HÀNH TRÌNH' : roundTwo || roundThree || roundFour || roundFive ? 'BẮT ĐẦU HÀNH TRÌNH' : 'BẮT ĐẦU KHÁM PHÁ'}</GameButton><button className="chapter-return" disabled={leaving} onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}>QUAY LẠI</button></div></div>
  </section>
}
