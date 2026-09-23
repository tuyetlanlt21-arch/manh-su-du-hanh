import { useGame } from '../GameContext'
import { GameButton } from '../components/GameButton'
export function RewardScene() { const { dispatch } = useGame(); return <section className="reward-scene"><div className="reward-glow"/><div className="reward-panel"><p>MỘT MẢNH KÝ ỨC ĐÃ THỨC GIẤC</p><div className="reward-relic">◈</div><h1>HÀNH TRÌNH TIẾP DIỄN</h1><span>Con đường mới đang mở ra trên bản đồ ký ức.</span><GameButton onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}>TRỞ LẠI BẢN ĐỒ</GameButton></div></section> }
