import { useGame } from '../GameContext'
import { FragmentRewardScene } from '../components/FragmentRewardScene'
import fragment from '../../assets/round2/rewards/fragment-02.png'
import coLoaMap from '../../assets/round2/coloa/round2-co-loa-map.png'

export function RoundTwoCompleteScene() {
  const { dispatch } = useGame()
  return <FragmentRewardScene fragmentNumber={2} fragmentAsset={fragment} title="ĐÃ ĐƯỢC KHÔI PHỤC" description="Mảnh Sử thứ hai đã được lưu vào hành trang." buttonLabel="THU THẬP MẢNH SỬ" onCollect={() => dispatch({ type: 'COMPLETE_ROUND_TWO' })} onFinished={() => dispatch({ type: 'RETURN_TO_MAP' })} className="round-fragment-reward round-two-reward" background={coLoaMap}/>
}
