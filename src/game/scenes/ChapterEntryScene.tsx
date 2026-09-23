import { useState } from 'react'
import { useGame } from '../GameContext'
import { GameButton } from '../components/GameButton'
import { BackButton } from '../components/BackButton'
import openingLandscape from '../../assets/map/opening-landscape.png'

export function ChapterEntryScene() {
  const { state, dispatch } = useGame(); const [leaving, setLeaving] = useState(false); const roundTwo = state.currentChapter === 'chapter-02'
  const begin = () => { if (roundTwo) setLeaving(true); else dispatch({ type: 'START_EXCAVATION' }) }
  return <section className={`chapter-scene chapter-entry-scene ${roundTwo ? 'chapter-two-entry' : ''} ${leaving ? 'chapter-departing' : ''}`} onAnimationEnd={(event) => { if (leaving && event.animationName === 'chapterToMemory') dispatch({ type: 'START_MEMORY_GAME' }) }}>
    {roundTwo && <img className="chapter-two-landscape" src={openingLandscape} alt=""/>}<div className="chapter-entry-landscape"/><div className="chapter-entry-mist"/><div className="chapter-page-mist"/>
    <BackButton onClick={() => !leaving && dispatch({ type: 'RETURN_TO_MAP' })}/>
    <div className="chapter-panel chapter-entry-panel"><p>{roundTwo ? 'MẢNH SỬ II' : 'MẢNH SỬ I'}</p><h1>{roundTwo ? 'DỰNG NƯỚC' : 'KHỞI NGUYÊN'}</h1><b>{roundTwo ? 'NHỮNG CÂU CHUYỆN ĐẦU TIÊN CỦA LỊCH SỬ' : 'VĂN LANG – ÂU LẠC'}</b><span>{roundTwo ? 'Những ký ức đầu tiên về thời dựng nước đã bị thời gian làm xáo trộn. Hãy nối lại những câu chuyện còn sót lại để tìm đường đến một kinh đô cổ.' : 'Dấu tích của một thời đại đang nằm dưới lớp đất. Hãy tìm và phục dựng những hiện vật để khôi phục ký ức đầu tiên.'}</span><div><GameButton disabled={leaving} onClick={begin}>{leaving ? 'ĐANG MỞ KÝ ỨC' : roundTwo ? 'BẮT ĐẦU HÀNH TRÌNH' : 'BẮT ĐẦU KHÁM PHÁ'}</GameButton><button className="chapter-return" disabled={leaving} onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}>QUAY LẠI</button></div></div>
  </section>
}
