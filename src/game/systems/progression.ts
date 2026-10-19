import { chapters } from '../data/chapters'
import type { ChapterStatus, GameState } from '../gameTypes'
const round6ChapterIds = ['chapter-01', 'chapter-02', 'chapter-03', 'chapter-04', 'chapter-05']
const round6FragmentIds = ['fragment-01', 'fragment-02', 'fragment-03', 'fragment-04', 'fragment-05']
const round6ChapterNames = ['Round 1 · Khởi nguyên', 'Round 2 · Dựng nước', 'Round 3 · Kinh đô', 'Round 4 · Non sông', 'Round 5 · Thức tỉnh']
const round6FragmentNames = ['Mảnh Sử 1 · Khởi nguyên', 'Mảnh Sử 2 · Dựng nước', 'Mảnh Sử 3 · Kinh đô', 'Mảnh Sử 4 · Non sông', 'Mảnh Sử 5 · Thức tỉnh']
export function getChapterStatus(chapterId: string, state: GameState): ChapterStatus {
  if (state.completedChapters.includes(chapterId)) return 'COMPLETED'
  const index = chapters.findIndex((chapter) => chapter.id === chapterId)
  const previous = chapters[index - 1]
  return index === 0 || Boolean(previous && state.completedChapters.includes(previous.id)) ? 'AVAILABLE' : 'LOCKED'
}

export function getRound6UnlockMissing(state: GameState): string[] {
  return round6ChapterIds.flatMap((id, index) => state.completedChapters.includes(id) ? [] : [round6ChapterNames[index]])
    // A completed legacy chapter is authoritative when an older save predates
    // the separate fragment list. This avoids asking players to replay a round
    // that is already recorded as complete.
    .concat(round6FragmentIds.flatMap((id, index) => state.collectedFragments.includes(id) || state.completedChapters.includes(round6ChapterIds[index]) ? [] : [round6FragmentNames[index]]))
}
