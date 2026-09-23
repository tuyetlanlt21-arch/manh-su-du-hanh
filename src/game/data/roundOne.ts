import drumImage from '../../assets/round1/artifacts/dong-son-drum.png'
import arrowheadImage from '../../assets/round1/artifacts/bronze-arrowhead.png'
import ploughshareImage from '../../assets/round1/artifacts/bronze-plowshare.png'

export type RoundOneArtifact = { id: string; name: string; pieces: number; description: string; image: string; artClass: string; discovery: string; aspectRatio: number }

export const roundOneArtifacts: RoundOneArtifact[] = [
  { id: 'dong-son-drum', name: 'TRỐNG ĐỒNG ĐÔNG SƠN', pieces: 3, image: drumImage, artClass: 'drum-art', discovery: 'Gò đất phía bắc', aspectRatio: 1, description: 'Biểu tượng của văn hóa Đông Sơn, ghi dấu kỹ nghệ đúc đồng và đời sống vật chất, tinh thần của cộng đồng Việt cổ.' },
  { id: 'bronze-arrowhead', name: 'MŨI TÊN ĐỒNG', pieces: 4, image: arrowheadImage, artClass: 'arrow-art', discovery: 'Bờ hố thành cũ', aspectRatio: 287 / 627, description: 'Dấu tích kỹ nghệ luyện đồng và vũ khí, gợi nhắc không gian Văn Lang – Âu Lạc cùng thành Cổ Loa.' },
  { id: 'bronze-ploughshare', name: 'LƯỠI CÀY ĐỒNG', pieces: 5, image: ploughshareImage, artClass: 'plough-art', discovery: 'Ruộng bậc ven suối', aspectRatio: 480 / 673, description: 'Chứng tích của sản xuất nông nghiệp và kỹ thuật chế tác đồng của các cộng đồng cư dân cổ.' },
]

export const requiredArtifactIds = roundOneArtifacts.map((artifact) => artifact.id)
export const getRoundOneArtifact = (id: string | null) => roundOneArtifacts.find((artifact) => artifact.id === id)
