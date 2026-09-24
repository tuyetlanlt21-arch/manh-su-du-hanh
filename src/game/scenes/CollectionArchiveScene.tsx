import { useState } from 'react'
import { useGame } from '../GameContext'
import { historicalArtifacts, historicalCharacters } from '../data/collectibles'
import { BackButton } from '../components/BackButton'
import fragmentOne from '../../assets/round1/rewards/fragment-01.png'
import fragmentTwo from '../../assets/round1/rewards/fragment-01.png'

type ArchiveKind = 'CHARACTER' | 'ARTIFACT'
type ArtifactTab = 'artifacts' | 'fragments'

const fragments = [
  { id: 'fragment-01', image: fragmentOne, name: 'MẢNH SỬ #01', chapter: 'KHỞI NGUYÊN' },
  { id: 'fragment-02', image: fragmentTwo, name: 'MẢNH SỬ #02', chapter: 'DỰNG NƯỚC' },
]

const LockedMark = () => <span className="archive-mark" aria-hidden="true"/>

export function CollectionArchiveScene({ kind, detailId }: { kind: ArchiveKind; detailId?: string | null }) {
  const { state, dispatch } = useGame()
  const [tab, setTab] = useState<ArtifactTab>('artifacts')
  const isArtifact = kind === 'ARTIFACT'
  const selected = detailId ? historicalArtifacts.find((item) => item.id === detailId) : null

  if (selected) return <section className="archive-scene artifact-archive artifact-detail"><BackButton onClick={() => dispatch({ type: 'RETURN_TO_ARTIFACT_ARCHIVE' })}/><div className="detail-light"/><div className="artifact-detail-layout"><div className="artifact-detail-art"><img src={selected.image} alt={selected.name}/></div><article><p>HIỆN VẬT ĐÃ PHỤC DỰNG</p><h1>{selected.name}</h1><b>{selected.era}</b><span>{selected.shortDescription}</span><button className="game-button" onClick={() => dispatch({ type: 'RETURN_TO_ARTIFACT_ARCHIVE' })}>QUAY LẠI KHO</button></article></div></section>

  if (!isArtifact) return <section className="archive-scene character-archive"><div className="archive-ambient"/><BackButton onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}/><header className="archive-heading"><p>BẢO TÀNG KÝ ỨC</p><h1>KÝ ỨC NHÂN VẬT</h1><span>Những chân dung lịch sử đang chờ được khôi phục.</span></header><div className="archive-shelf">{historicalCharacters.map((entry) => <div className="archive-entry locked" key={entry.id}><LockedMark/><div><b>CHƯA KHÔI PHỤC</b><small>Ký ức vẫn còn bị phong kín</small></div></div>)}</div></section>

  return <section className="archive-scene artifact-archive"><div className="archive-ambient"/><BackButton onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}/><header className="archive-heading"><p>BẢO TÀNG KÝ ỨC</p><h1>KHO CỔ VẬT</h1><span>Hiện vật và Mảnh Sử được lưu giữ trong hai bộ sưu tập riêng.</span></header><div className="archive-tabs" role="tablist"><button className={tab === 'artifacts' ? 'active' : ''} onClick={() => setTab('artifacts')} role="tab" aria-selected={tab === 'artifacts'}>CỔ VẬT</button><button className={tab === 'fragments' ? 'active' : ''} onClick={() => setTab('fragments')} role="tab" aria-selected={tab === 'fragments'}>MẢNH SỬ</button></div>{tab === 'artifacts' ? <div className="archive-shelf artifact-grid">{historicalArtifacts.map((artifact) => { const unlocked = state.collectedArtifacts.includes(artifact.id); return <button className={`archive-entry artifact-entry ${unlocked ? 'unlocked' : 'locked'}`} key={artifact.id} disabled={!unlocked} onClick={() => dispatch({ type: 'OPEN_ARTIFACT_DETAIL', artifactId: artifact.id })}><div className="artifact-image-wrapper">{unlocked ? <img src={artifact.image} alt={artifact.name}/> : <LockedMark/>}</div><div className="artifact-info"><b>{unlocked ? artifact.name : 'CHƯA KHÔI PHỤC'}</b><small>{unlocked ? artifact.era : 'Ký ức vẫn còn bị phong kín'}</small>{unlocked && <em>{artifact.shortDescription}</em>}</div></button> })}</div> : <div className="archive-shelf fragment-grid">{fragments.map((item) => { const unlocked = state.collectedFragments.includes(item.id); return <article className={`archive-fragment ${unlocked ? 'unlocked' : 'locked'}`} key={item.id}><div className="fragment-image-wrapper">{unlocked ? <img src={item.image} alt={item.name}/> : <LockedMark/>}</div><div><b>{item.name}</b><small>{unlocked ? `${item.chapter} · ĐÃ KHÔI PHỤC` : 'CHƯA KHÔI PHỤC'}</small></div></article> })}</div>}</section>
}
