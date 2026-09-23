export type Scene = 'HOME' | 'TRAVELER_SELECTION' | 'MAP' | 'CHARACTER_ARCHIVE' | 'ARTIFACT_ARCHIVE' | 'ARTIFACT_DETAIL' | 'CHAPTER' | 'EXCAVATION' | 'PUZZLE' | 'ARTIFACT_REVEAL' | 'ROUND_COMPLETE' | 'ROUND_TWO_COMPLETE' | 'MEMORY_GAME' | 'CO_LOA_ENTRY' | 'REWARD'
export type TravelerId = 'male' | 'female'
export type ChapterStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED'
export type GameState = { currentScene: Scene; playerName: string; selectedTraveler: TravelerId | null; currentChapter: string | null; currentArtifact: string | null; reconstructedArtifacts: string[]; completedChapters: string[]; completedActivities: string[]; collectedArtifacts: string[]; collectedCharacters: string[]; collectedFragments: string[] }
export type GameAction =
  | { type: 'START_JOURNEY' }
  | { type: 'SET_PLAYER_NAME'; playerName: string }
  | { type: 'OPEN_CHARACTER_ARCHIVE' }
  | { type: 'OPEN_ARTIFACT_ARCHIVE' }
  | { type: 'OPEN_ARTIFACT_DETAIL'; artifactId: string }
  | { type: 'RETURN_TO_ARTIFACT_ARCHIVE' }
  | { type: 'RETURN_TO_SELECTION' }
  | { type: 'RETURN_HOME' }
  | { type: 'SELECT_TRAVELER'; traveler: TravelerId }
  | { type: 'CONFIRM_TRAVELER' }
  | { type: 'ENTER_CHAPTER'; chapterId: string }
  | { type: 'START_EXCAVATION' }
  | { type: 'START_MEMORY_GAME' }
  | { type: 'COMPLETE_MEMORY_GAME' }
  | { type: 'RETURN_TO_CHAPTER' }
  | { type: 'ENTER_CO_LOA' }
  | { type: 'COMPLETE_ROUND_TWO' }
  | { type: 'RETURN_TO_EXCAVATION' }
  | { type: 'DISCOVER_ARTIFACT'; artifactId: string }
  | { type: 'COMPLETE_RECONSTRUCTION'; artifactId: string }
  | { type: 'COLLECT_ARTIFACT'; artifactId: string }
  | { type: 'COMPLETE_ROUND_ONE' }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'RESET_GAME' }
