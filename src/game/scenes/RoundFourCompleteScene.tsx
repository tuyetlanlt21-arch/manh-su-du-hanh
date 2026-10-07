import { useGame } from '../GameContext'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import riverMid from '../../assets/round4/backgrounds/river-mid.png'
import fragment from '../../assets/round4/rewards/fragment-04.png'

export function RoundFourCompleteScene() {
  const { dispatch } = useGame()
  return <FragmentRewardScene className="round-fragment-reward round4-reward" background={riverMid} fragmentNumber={4} fragmentAsset={fragment} title="ĐÃ ĐƯỢC KHÔI PHỤC" description="Mảnh Sử thứ tư đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_FOUR' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })}/>
}
