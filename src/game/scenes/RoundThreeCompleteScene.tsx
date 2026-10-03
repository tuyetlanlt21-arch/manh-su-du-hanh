import { useGame } from '../GameContext'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import fragment from '../../assets/round3/rewards/fragment-03.png'
import mapArtwork from '../../assets/round3/game1/map/vietnam-map.png'
export function RoundThreeCompleteScene() { const { dispatch } = useGame(); return <FragmentRewardScene className="round-three-reward" background={mapArtwork} fragmentNumber={3} fragmentAsset={fragment} title="ĐÃ ĐƯỢC KHÔI PHỤC" description="Mảnh Sử thứ ba đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_THREE' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })}/> }
