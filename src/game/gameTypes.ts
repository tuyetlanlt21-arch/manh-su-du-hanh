export type Scene = 'HOME' | 'TRAVELER_SELECTION' | 'MAP' | 'CHARACTER_ARCHIVE' | 'ARTIFACT_ARCHIVE' | 'ARTIFACT_DETAIL' | 'CHAPTER' | 'ROUND_INTRO' | 'EXCAVATION' | 'PUZZLE' | 'ARTIFACT_REVEAL' | 'ROUND_COMPLETION_CINEMATIC' | 'ROUND_COMPLETE' | 'ROUND_TWO_COMPLETE' | 'MEMORY_GAME' | 'CO_LOA_ENTRY' | 'ROUND_THREE_INTRO' | 'ROUND_THREE_GAME1' | 'ROUND_THREE_GAME2' | 'ROUND_THREE_COMPLETE' | 'ROUND_THREE_GAME1_COMPLETE' | 'ROUND_FOUR' | 'ROUND_FOUR_COMPLETE' | 'ROUND_FIVE' | 'REWARD'
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
  | { type: 'START_ROUND_INTRO' }
  | { type: 'SHOW_ROUND_COMPLETION' }
  | { type: 'START_MEMORY_GAME' }
  | { type: 'START_ROUND_THREE' }
  | { type: 'START_ROUND_THREE_GAME1' }
  | { type: 'COMPLETE_ROUND_THREE_GAME1' }
  | { type: 'SHOW_ROUND_THREE_REWARD' }
  | { type: 'COMPLETE_ROUND_THREE' }
  | { type: 'START_ROUND_FOUR' }
  | { type: 'COMPLETE_ROUND_FOUR' }
  | { type: 'SHOW_ROUND_FOUR_REWARD' }
  | { type: 'START_ROUND_FIVE' }
  | { type: 'COMPLETE_ROUND_FIVE' }
  | { type: 'COMPLETE_MEMORY_GAME' }
  | { type: 'RETURN_TO_CHAPTER' }
  | { type: 'ENTER_CO_LOA' }
  | { type: 'COMPLETE_ROUND_TWO' }
  | { type: 'SHOW_ROUND_TWO_REWARD' }
  | { type: 'RETURN_TO_EXCAVATION' }
  | { type: 'DISCOVER_ARTIFACT'; artifactId: string }
  | { type: 'COMPLETE_RECONSTRUCTION'; artifactId: string }
  | { type: 'COLLECT_ARTIFACT'; artifactId: string }
  | { type: 'COMPLETE_ROUND_ONE' }
  | { type: 'SHOW_ROUND_ONE_REWARD' }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'RESET_GAME' }
