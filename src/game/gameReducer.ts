import type { GameAction, GameState } from './gameTypes'
export const initialGameState: GameState = { currentScene: 'HOME', playerName: '', selectedTraveler: null, currentChapter: null, currentArtifact: null, reconstructedArtifacts: [], completedChapters: [], completedActivities: [], collectedArtifacts: [], collectedCharacters: [], collectedFragments: [] }
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_JOURNEY': return { ...state, currentScene: 'TRAVELER_SELECTION', playerName: '', selectedTraveler: null }
    case 'SET_PLAYER_NAME': return { ...state, playerName: action.playerName.slice(0, 24) }
    case 'OPEN_CHARACTER_ARCHIVE': return { ...state, currentScene: 'CHARACTER_ARCHIVE' }
    case 'OPEN_ARTIFACT_ARCHIVE': return { ...state, currentScene: 'ARTIFACT_ARCHIVE' }
    case 'OPEN_ARTIFACT_DETAIL': return state.collectedArtifacts.includes(action.artifactId) ? { ...state, currentScene: 'ARTIFACT_DETAIL', currentArtifact: action.artifactId } : state
    case 'RETURN_TO_ARTIFACT_ARCHIVE': return { ...state, currentScene: 'ARTIFACT_ARCHIVE', currentArtifact: null }
    case 'RETURN_TO_SELECTION': return { ...state, currentScene: 'TRAVELER_SELECTION' }
    case 'RETURN_HOME': return { ...state, currentScene: 'HOME' }
    case 'SELECT_TRAVELER': return { ...state, selectedTraveler: action.traveler }
    case 'CONFIRM_TRAVELER': return state.selectedTraveler && state.playerName.trim() ? { ...state, playerName: state.playerName.trim(), currentScene: 'MAP' } : state
    case 'ENTER_CHAPTER': return { ...state, currentScene: 'CHAPTER', currentChapter: action.chapterId }
    case 'START_EXCAVATION': return state.currentChapter === 'chapter-01' ? { ...state, currentScene: 'EXCAVATION', currentArtifact: null } : state
    case 'START_MEMORY_GAME': return state.currentChapter === 'chapter-02' ? { ...state, currentScene: 'MEMORY_GAME' } : state
    case 'START_ROUND_THREE': return state.currentChapter === 'chapter-03' ? { ...state, currentScene: 'ROUND_THREE_GAME1' } : state
    case 'START_ROUND_THREE_GAME1': return state.currentChapter === 'chapter-03' ? { ...state, currentScene: 'ROUND_THREE_GAME1' } : state
    case 'COMPLETE_ROUND_THREE_GAME1': return state.currentScene === 'ROUND_THREE_GAME1' ? { ...state, currentScene: 'ROUND_THREE_GAME2' } : state
    case 'SHOW_ROUND_THREE_REWARD': return state.currentScene === 'ROUND_THREE_GAME2' ? { ...state, currentScene: 'ROUND_THREE_COMPLETE' } : state
    case 'COMPLETE_ROUND_THREE': return state.currentScene === 'ROUND_THREE_COMPLETE' && !state.completedChapters.includes('chapter-03') ? { ...state, completedChapters: [...state.completedChapters, 'chapter-03'], collectedFragments: state.collectedFragments.includes('fragment-03') ? state.collectedFragments : [...state.collectedFragments, 'fragment-03'], collectedCharacters: [...new Set([...state.collectedCharacters, 'trung-vuong', 'dinh-bo-linh', 'ly-cong-uan', 'ho-quy-ly', 'quang-trung'])] } : state
    case 'START_ROUND_FOUR': return state.currentChapter === 'chapter-04' ? { ...state, currentScene: 'ROUND_FOUR' } : state
    case 'COMPLETE_ROUND_FOUR': return state.currentScene === 'ROUND_FOUR' && !state.completedChapters.includes('chapter-04') ? { ...state, completedChapters: [...state.completedChapters, 'chapter-04'], collectedFragments: state.collectedFragments.includes('fragment-04') ? state.collectedFragments : [...state.collectedFragments, 'fragment-04'] } : state
    case 'START_ROUND_FIVE': return state.currentChapter === 'chapter-05' ? { ...state, currentScene: 'ROUND_FIVE' } : state
    case 'COMPLETE_ROUND_FIVE': return state.currentScene === 'ROUND_FIVE' && !state.completedChapters.includes('chapter-05') ? { ...state, completedChapters: [...state.completedChapters, 'chapter-05'], collectedFragments: state.collectedFragments.includes('fragment-05') ? state.collectedFragments : [...state.collectedFragments, 'fragment-05'] } : state
    case 'COMPLETE_MEMORY_GAME': return state.currentChapter === 'chapter-02' && !state.completedActivities.includes('chapter-02-memory') ? { ...state, completedActivities: [...state.completedActivities, 'chapter-02-memory'] } : state
    case 'RETURN_TO_CHAPTER': return state.currentChapter ? { ...state, currentScene: 'CHAPTER' } : state
    case 'ENTER_CO_LOA': return state.currentChapter === 'chapter-02' && state.completedActivities.includes('chapter-02-memory') ? { ...state, currentScene: 'CO_LOA_ENTRY' } : state
    case 'COMPLETE_ROUND_TWO': return (state.currentScene === 'CO_LOA_ENTRY' || state.currentScene === 'MEMORY_GAME') && state.currentChapter === 'chapter-02' && !state.completedChapters.includes('chapter-02') ? { ...state, currentScene: 'ROUND_TWO_COMPLETE', completedActivities: state.completedActivities.includes('chapter-02-memory') ? state.completedActivities : [...state.completedActivities, 'chapter-02-memory'], completedChapters: [...state.completedChapters, 'chapter-02'], collectedFragments: state.collectedFragments.includes('fragment-02') ? state.collectedFragments : [...state.collectedFragments, 'fragment-02'] } : state
    case 'RETURN_TO_EXCAVATION': return { ...state, currentScene: 'EXCAVATION', currentArtifact: null }
    case 'DISCOVER_ARTIFACT': return state.currentChapter === 'chapter-01' && !state.collectedArtifacts.includes(action.artifactId) ? { ...state, currentScene: 'PUZZLE', currentArtifact: action.artifactId } : state
    case 'COMPLETE_RECONSTRUCTION': return state.currentArtifact === action.artifactId ? { ...state, currentScene: 'ARTIFACT_REVEAL', reconstructedArtifacts: state.reconstructedArtifacts.includes(action.artifactId) ? state.reconstructedArtifacts : [...state.reconstructedArtifacts, action.artifactId] } : state
    case 'COLLECT_ARTIFACT': return state.currentArtifact === action.artifactId ? { ...state, currentScene: 'EXCAVATION', currentArtifact: null, collectedArtifacts: state.collectedArtifacts.includes(action.artifactId) ? state.collectedArtifacts : [...state.collectedArtifacts, action.artifactId] } : state
    case 'COMPLETE_ROUND_ONE': return state.collectedArtifacts.filter((id) => ['dong-son-drum', 'bronze-arrowhead', 'bronze-ploughshare'].includes(id)).length === 3 ? { ...state, currentScene: 'ROUND_COMPLETE', currentArtifact: null, completedChapters: state.completedChapters.includes('chapter-01') ? state.completedChapters : [...state.completedChapters, 'chapter-01'], collectedFragments: state.collectedFragments.includes('fragment-01') ? state.collectedFragments : [...state.collectedFragments, 'fragment-01'] } : state
    case 'COMPLETE_CHAPTER': return { ...state, completedChapters: state.completedChapters.includes(action.chapterId) ? state.completedChapters : [...state.completedChapters, action.chapterId], currentScene: 'REWARD' }
    case 'RETURN_TO_MAP': return { ...state, currentScene: 'MAP', currentChapter: null }
    case 'RESET_GAME': return initialGameState
  }
}
