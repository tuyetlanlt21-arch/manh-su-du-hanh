import pairArtwork from '../../assets/travelers/travelers-pair.png'
import type { TravelerId } from '../gameTypes'

export type Traveler = { id: TravelerId; name: string; title: string; image: string; artPosition: 'left' | 'right' }
export const travelers: Traveler[] = [
  { id: 'male', name: 'NAM', title: 'Nhà du hành', image: pairArtwork, artPosition: 'left' },
  { id: 'female', name: 'NỮ', title: 'Nhà du hành', image: pairArtwork, artPosition: 'right' },
]
