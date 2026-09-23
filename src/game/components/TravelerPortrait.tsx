import type { Traveler } from '../data/travelers'
export function TravelerPortrait({ traveler, compact = false }: { traveler: Traveler; compact?: boolean }) { return <span className={`traveler-art ${traveler.artPosition} ${compact ? 'compact' : ''}`} aria-label={traveler.name}><img src={traveler.image} alt="" /></span> }
