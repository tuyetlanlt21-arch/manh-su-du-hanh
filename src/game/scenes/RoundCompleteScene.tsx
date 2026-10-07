import { useGame } from '../GameContext'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import fragment from '../../assets/round1/rewards/fragment-01.png'
import excavationMap from '../../assets/round1/environment/excavation-map.png'

export function RoundCompleteScene() {
  const { dispatch } = useGame()
  return <FragmentRewardScene className="round-fragment-reward round-one-reward" background={excavationMap} fragmentNumber={1} fragmentAsset={fragment} title="ĐÃ ĐƯỢC KHÔI PHỤC" description="Mảnh Sử thứ nhất đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_ONE' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })}/>
}
