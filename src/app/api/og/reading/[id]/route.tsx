import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Edge runtime에서는 MongoDB 연결을 사용할 수 없으므로 
// 데이터는 URL 파라미터로 받도록 변경
// export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // URL 파라미터에서 리딩 데이터 추출
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || '타로 리딩 결과';
    const question = searchParams.get('question') || '';
    const cards = searchParams.get('cards') || '';
    const spreadType = searchParams.get('spreadType') || 'one-card';
    
    // 카드 이름들을 배열로 변환
    const cardArray = cards ? cards.split(',').slice(0, 3) : [];
    
    // 스프레드 타입에 따른 제목
    const getSpreadTitle = (spreadType: string) => {
      switch (spreadType) {
        case 'one-card': return '원카드 리딩';
        case 'three-card': return '쓰리카드 리딩';
        case 'celtic-cross': return '켈틱 크로스';
        case 'love-spread': return '연애운 리딩';
        case 'career-path': return '직업운 리딩';
        default: return '타로 리딩';
      }
    };

    // 카드 위치 레이블
    const getPositionLabels = (spreadType: string) => {
      switch (spreadType) {
        case 'three-card': return ['과거', '현재', '미래'];
        case 'love-spread': return ['현재 감정', '상대의 마음', '관계의 장애물'];
        case 'career-path': return ['현재 위치', '강점', '약점'];
        default: return ['카드 1', '카드 2', '카드 3'];
      }
    };

    const positionLabels = getPositionLabels(spreadType);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 20%, #5b21b6 40%, #be185d 60%, #f91880 80%, #fbbf24 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* 배경 패턴 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)
              `,
            }}
          />
          
          {/* 상단 헤더 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                marginBottom: '10px',
              }}
            >
              칠팔 타로
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#f3e8ff',
                fontWeight: '600',
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
              }}
            >
              {getSpreadTitle(spreadType)} 결과
            </div>
          </div>

          {/* 질문 섹션 */}
          <div
            style={{
              fontSize: '20px',
              color: '#e2e8f0',
              textAlign: 'center',
              marginBottom: '40px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '20px 40px',
              borderRadius: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              maxWidth: '900px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
&ldquo;{question}&rdquo;
          </div>

          {/* 카드 섹션 */}
          <div
            style={{
              display: 'flex',
              gap: cardArray.length === 1 ? '0' : '30px',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            {cardArray.map((cardName: string, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                {/* 위치 라벨 (쓰리카드 이상일 때만) */}
                {cardArray.length > 1 && (
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#ddd6fe',
                      fontWeight: '600',
                      backgroundColor: 'rgba(139, 92, 246, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                    }}
                  >
                    {positionLabels[index] || `카드 ${index + 1}`}
                  </div>
                )}
                
                {/* 카드 */}
                <div
                  style={{
                    width: cardArray.length === 1 ? '160px' : '130px',
                    height: cardArray.length === 1 ? '240px' : '195px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '15px',
                    border: '3px solid #a855f7',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 40px rgba(168, 85, 247, 0.4)',
                    position: 'relative',
                    // 카드 회전은 임의로 설정 (실제 데이터 없음)
                    transform: 'rotate(0deg)',
                  }}
                >
                  {/* 카드 내용 */}
                  <div
                    style={{
                      fontSize: cardArray.length === 1 ? '72px' : '48px',
                      marginBottom: '8px',
                    }}
                  >
                    ✨
                  </div>
                  <div
                    style={{
                      fontSize: cardArray.length === 1 ? '18px' : '14px',
                      color: '#4c1d95',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      // 카드 회전은 임의로 설정 (실제 데이터 없음)
                    transform: 'rotate(0deg)',
                    }}
                  >
                    {cardName.length > 12 ? cardName.substring(0, 12) + '...' : cardName}
                  </div>
                </div>
                
                {/* 카드명과 방향 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      color: 'white',
                      fontWeight: '700',
                      textAlign: 'center',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                    }}
                  >
                    {cardName}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#10b981',
                      fontWeight: '600',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                    }}
                  >
                    정방향
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 푸터 */}
          <div
            style={{
              position: 'absolute',
              bottom: '25px',
              fontSize: '16px',
              color: '#d1d5db',
              textAlign: 'center',
            }}
          >
            78장의 완전한 타로 덱으로 당신의 운명을 확인하세요
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}