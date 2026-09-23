import { chapters } from '../data/chapters'
import type { ChapterStatus, GameState } from '../gameTypes'
export function getChapterStatus(chapterId: string, state: GameState): ChapterStatus {
  if (state.completedChapters.includes(chapterId)) return 'COMPLETED'
  const index = chapters.findIndex((chapter) => chapter.id === chapterId)
  const previous = chapters[index - 1]
  return index === 0 || Boolean(previous && state.completedChapters.includes(previous.id)) ? 'AVAILABLE' : 'LOCKED'
}
