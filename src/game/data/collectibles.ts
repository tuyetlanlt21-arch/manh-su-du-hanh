import drumImage from '../../assets/round1/artifacts/dong-son-drum.png'
import arrowImage from '../../assets/round1/artifacts/bronze-arrowhead.png'
import ploughImage from '../../assets/round1/artifacts/bronze-plowshare.png'

export type HistoricalArtifact = { id: string; name: string; chapterId: string; era: string; shortDescription: string; image: string }
export type HistoricalCharacter = { id: string; chapterId: string }

export const historicalArtifacts: HistoricalArtifact[] = [
  { id: 'dong-son-drum', name: 'Trống đồng Đông Sơn', chapterId: 'chapter-01', era: 'Văn hóa Đông Sơn · Nhạc khí nghi lễ', shortDescription: 'Hoa văn trên mặt trống lưu giữ nhịp sống, nghi lễ và sức mạnh cộng đồng của cư dân Việt cổ.', image: drumImage },
  { id: 'bronze-arrowhead', name: 'Mũi tên đồng', chapterId: 'chapter-01', era: 'Thời đại kim khí · Vũ khí', shortDescription: 'Mảnh đồng nhỏ cho thấy kỹ nghệ đúc và ý thức bảo vệ cộng đồng từ buổi đầu dựng nước.', image: arrowImage },
  { id: 'bronze-ploughshare', name: 'Lưỡi cày đồng', chapterId: 'chapter-01', era: 'Thời đại kim khí · Nông cụ', shortDescription: 'Dấu vết của bàn tay khai phá, gợi về những mùa màng đã nuôi lớn các cộng đồng đầu tiên.', image: ploughImage },
]

export const historicalCharacters: HistoricalCharacter[] = [
  { id: 'unknown-memory-01', chapterId: 'chapter-01' },
  { id: 'unknown-memory-02', chapterId: 'chapter-02' },
  { id: 'unknown-memory-03', chapterId: 'chapter-03' },
]
