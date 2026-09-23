import landscape from '../../assets/map/opening-landscape.png'
import { useGame } from '../GameContext'
import { GameButton } from '../components/GameButton'
export function HomeScene() { const { dispatch } = useGame(); return <section className="home-scene" style={{ backgroundImage: `url(${landscape})` }}><div className="home-mist"/><div className="home-vignette"/><div className="home-content"><p className="home-kicker">MỘT HÀNH TRÌNH GIỮA DÒNG THỜI GIAN</p><h1>MẢNH SỬ <i>DU HÀNH</i></h1><div className="home-rule"/><p className="home-subtitle">DU HÀNH QUA THỜI GIAN<br/>KHÔI PHỤC KÝ ỨC LỊCH SỬ</p><GameButton onClick={() => dispatch({ type: 'START_JOURNEY' })}>BẮT ĐẦU HÀNH TRÌNH <span>→</span></GameButton></div></section> }
