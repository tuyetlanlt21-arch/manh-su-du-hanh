import { useState, type AnimationEvent } from 'react'
import { useGame } from '../GameContext'
import { BackButton } from '../components/BackButton'
import coLoaMap from '../../assets/round2/coloa/round2-co-loa-map.png'
type PlaceId = 'outer-ring' | 'citadel-gate' | 'central-mound'
const places: Array<{ id: PlaceId; label: string; x: number; y: number; note: string; correct?: boolean }> = [
  { id: 'citadel-gate', label: 'CỔNG THÀNH', x: 29, y: 57, note: 'Cổng thành gợi ra một không gian được tổ chức và bảo vệ, nhưng chưa phải dấu tích cần tìm.' },
  { id: 'central-mound', label: 'TRUNG TÂM THÀNH', x: 57, y: 43, note: 'Khu trung tâm là nơi hội tụ, song bí mật phòng thủ của Cổ Loa nằm ở một cấu trúc bao quanh rộng hơn.' },
  { id: 'outer-ring', label: 'VÒNG THÀNH PHÒNG THỦ', x: 70, y: 69, correct: true, note: 'Các vòng thành và hào lũy cho thấy tư duy tổ chức, phòng thủ của cư dân Cổ Loa. Kinh đô cổ không chỉ là nơi ở, mà còn là một công trình bảo vệ cộng đồng.' },
]
export function CoLoaEntryScene() {
  const { dispatch } = useGame(); const [selected, setSelected] = useState<PlaceId | null>(null); const [mode, setMode] = useState<'entering' | 'exploration'>('entering'); const selectedPlace = places.find((place) => place.id === selected); const solved = selectedPlace?.correct === true
  const activate = (event: AnimationEvent<HTMLElement>) => { if (event.animationName === 'coLoaGameplayIn') setMode('exploration') }
  return <section className={`co-loa-entry co-loa-${mode}`} onAnimationEnd={activate}><img src={coLoaMap} alt="Không gian kinh đô Cổ Loa"/><div className="co-loa-mist"/><BackButton onClick={() => dispatch({ type: 'RETURN_TO_CHAPTER' })}/><header className="co-loa-copy"><p>KÝ ỨC CỔ LOA</p><h1>GIẢI MÃ CỔ LOA</h1><span>Một dấu tích của Âu Lạc đang chờ được giải mã.</span></header>{mode === 'exploration' && <><section className="co-loa-clue" aria-live="polite"><b>MANH MỐI</b><p>Một công trình phòng thủ đặc biệt với cấu trúc nhiều vòng thành.</p></section><div className="co-loa-hotspots" aria-label="Các địa điểm trên bản đồ Cổ Loa">{places.map((place) => <button key={place.id} className={`co-loa-hotspot ${selected === place.id ? 'selected' : ''}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => setSelected(place.id)} aria-label={place.label}><i/><span>{place.label}</span></button>)}</div>{selectedPlace && <aside className={`co-loa-feedback ${solved ? 'is-solved' : 'is-wrong'}`}><p>{solved ? 'DẤU TÍCH ĐÃ ĐƯỢC NHẬN RA' : 'HÃY QUAN SÁT THÊM'}</p><span>{selectedPlace.note}</span>{solved && <button className="game-button" onClick={() => dispatch({ type: 'COMPLETE_ROUND_TWO' })}>KHÔI PHỤC MẢNH SỬ #02</button>}</aside>}</>}</section>
}
