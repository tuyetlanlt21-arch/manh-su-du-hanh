import { useGame } from '../GameContext'
import { travelers } from '../data/travelers'
import { GameButton } from '../components/GameButton'
import { BackButton } from '../components/BackButton'
import landscape from '../../assets/map/opening-landscape.png'

export function TravelerSelectionScene() {
  const { state, dispatch } = useGame()
  const canConfirm = Boolean(state.selectedTraveler && state.playerName.trim())
  return <section className="selection-scene" style={{ backgroundImage: `url(${landscape})` }}>
    <div className="selection-wash"/>
    <BackButton onClick={() => dispatch({ type: 'RETURN_HOME' })}/>
    <header className="game-wordmark">MẢNH SỬ <i>DU HÀNH</i></header>
    <div className="selection-copy"><p>HÀNH TRÌNH BẮT ĐẦU TỪ ĐÂY</p><h1>CHỌN NHÀ DU HÀNH</h1><span>Chọn người sẽ cùng bạn lần theo những mảnh ký ức của non sông.</span></div>
    <div className={`traveler-choices ${state.selectedTraveler ? `has-${state.selectedTraveler}` : ''}`}><img className="traveler-pair-art" src={travelers[0].image} alt="Hai nhà du hành"/>{travelers.map((traveler) => <button key={traveler.id} className={`traveler-choice ${traveler.id}`} onClick={() => dispatch({ type: 'SELECT_TRAVELER', traveler: traveler.id })} aria-label={`Chọn nhà du hành ${traveler.name}`} aria-pressed={state.selectedTraveler === traveler.id}/>)}</div>
    <div className="selection-footer"><div className="identity-row">{travelers.map((traveler) => <button key={traveler.id} className={`identity-card ${state.selectedTraveler === traveler.id ? 'selected' : ''}`} onClick={() => dispatch({ type: 'SELECT_TRAVELER', traveler: traveler.id })}><b>{traveler.name}</b><small>NHÀ DU HÀNH</small></button>)}</div><div className="name-confirm"><label className="name-field"><span>TÊN NHÀ DU HÀNH</span><input value={state.playerName} maxLength={24} onChange={(event) => dispatch({ type: 'SET_PLAYER_NAME', playerName: event.target.value })} placeholder="Nhập tên của bạn..." autoComplete="name" /></label><GameButton disabled={!canConfirm} onClick={() => dispatch({ type: 'CONFIRM_TRAVELER' })}>XÁC NHẬN <i>→</i></GameButton></div></div>
  </section>
}
