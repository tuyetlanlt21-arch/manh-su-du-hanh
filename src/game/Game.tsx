import { useGame } from './GameContext'
import { GameSceneTransition } from './components/GameSceneTransition'
import { TravelerSelectionScene } from './scenes/TravelerSelectionScene'
import { HistoricalMapScene } from './scenes/HistoricalMapScene'
import { ChapterEntryScene } from './scenes/ChapterEntryScene'
import { RewardScene } from './scenes/RewardScene'
import { HomeScene } from './scenes/HomeScene'
import { CollectionArchiveScene } from './scenes/CollectionArchiveScene'
import { ExcavationScene } from './scenes/ExcavationScene'
import { ReconstructionScene } from './scenes/ReconstructionScene'
import { ArtifactRevealScene } from './scenes/ArtifactRevealScene'
import { RoundCompleteScene } from './scenes/RoundCompleteScene'
import { RoundTwoCompleteScene } from './scenes/RoundTwoCompleteScene'
import { RoundThreeGameOneScene, RoundThreeGameOneCompleteScene } from './scenes/RoundThreeGameOneScene'
import { RoundThreeGameTwoScene } from './scenes/RoundThreeGameTwoScene'
import { RoundThreeCompleteScene } from './scenes/RoundThreeCompleteScene'
import { RoundFourScene } from './scenes/RoundFourScene'
import { RoundFourCompleteScene } from './scenes/RoundFourCompleteScene'
import { RoundFiveScene } from './scenes/RoundFiveScene'
import { MemoryGameScene } from './scenes/MemoryGameScene'
import { CoLoaEntryScene } from './scenes/CoLoaEntryScene'
import { RoundCinematicIntro } from './scenes/RoundCinematicIntro'
import { RoundCompletionCinematic } from './scenes/RoundCompletionCinematic'
import { RoundSixSceneV2 as RoundSixScene } from './scenes/RoundSixSceneV2'

export function Game() {
  const { state } = useGame()
  const isRoundSix = state.currentScene === 'ROUND_SIX'
  const scene = state.currentScene === 'HOME' ? <HomeScene /> : state.currentScene === 'TRAVELER_SELECTION' ? <TravelerSelectionScene /> : state.currentScene === 'MAP' ? <HistoricalMapScene /> : state.currentScene === 'CHARACTER_ARCHIVE' ? <CollectionArchiveScene kind="CHARACTER" /> : state.currentScene === 'ARTIFACT_ARCHIVE' || state.currentScene === 'ARTIFACT_DETAIL' ? <CollectionArchiveScene kind="ARTIFACT" detailId={state.currentScene === 'ARTIFACT_DETAIL' ? state.currentArtifact : null} /> : state.currentScene === 'CHAPTER' ? <ChapterEntryScene /> : state.currentScene === 'ROUND_INTRO' ? <RoundCinematicIntro /> : state.currentScene === 'EXCAVATION' ? <ExcavationScene /> : state.currentScene === 'PUZZLE' ? <ReconstructionScene /> : state.currentScene === 'ARTIFACT_REVEAL' ? <ArtifactRevealScene /> : state.currentScene === 'ROUND_COMPLETION_CINEMATIC' ? <RoundCompletionCinematic /> : state.currentScene === 'ROUND_COMPLETE' ? <RoundCompleteScene /> : state.currentScene === 'ROUND_TWO_COMPLETE' ? <RoundTwoCompleteScene /> : state.currentScene === 'MEMORY_GAME' ? <MemoryGameScene /> : state.currentScene === 'CO_LOA_ENTRY' ? <CoLoaEntryScene /> : state.currentScene === 'ROUND_THREE_INTRO' || state.currentScene === 'ROUND_THREE_GAME1' ? <RoundThreeGameOneScene /> : state.currentScene === 'ROUND_THREE_GAME2' ? <RoundThreeGameTwoScene /> : state.currentScene === 'ROUND_THREE_COMPLETE' ? <RoundThreeCompleteScene /> : state.currentScene === 'ROUND_THREE_GAME1_COMPLETE' ? <RoundThreeGameOneCompleteScene /> : state.currentScene === 'ROUND_FOUR' ? <RoundFourScene /> : state.currentScene === 'ROUND_FOUR_COMPLETE' ? <RoundFourCompleteScene /> : state.currentScene === 'ROUND_FIVE' ? <RoundFiveScene /> : state.currentScene === 'ROUND_SIX' ? <RoundSixScene /> : <RewardScene />
  return <main className={`game-shell${isRoundSix ? ' round6-shell' : ''}`}><div className={`game-stage${isRoundSix ? ' round6-stage' : ''}`}><GameSceneTransition sceneKey={state.currentScene}>{scene}</GameSceneTransition></div></main>
}
