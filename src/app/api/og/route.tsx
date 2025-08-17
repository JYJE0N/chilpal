import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // URL 파라미터에서 데이터 추출
    const title = searchParams.get('title') || '칠팔 타로 리딩';
    const cards = searchParams.get('cards') || '';
    const question = searchParams.get('question') || '';
    const spreadType = searchParams.get('spreadType') || 'one-card';
    
    // 카드 이름들을 배열로 변환
    const cardArray = cards ? cards.split(',').slice(0, 3) : [];
    
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
            background: 'linear-gradient(45deg, #1a0b2e 0%, #2d1b69 25%, #5b21b6 50%, #be185d 75%, #f91880 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)',
            }}
          />
          
          {/* 헤더 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              칠팔 타로
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '900px',
              padding: '0 40px',
            }}
          >
            {/* 타이틀 */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '30px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              }}
            >
              {title}
            </div>

            {/* 질문 */}
            {question && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#e2e8f0',
                  textAlign: 'center',
                  marginBottom: '40px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '20px 30px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  maxWidth: '800px',
                }}
              >
&ldquo;{question}&rdquo;
              </div>
            )}

            {/* 카드 섹션 */}
            {cardArray.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    color: '#f3e8ff',
                    marginBottom: '20px',
                  }}
                >
                  뽑힌 카드
                </div>
                
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                  }}
                >
                  {cardArray.map((card, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* 카드 모양 */}
                      <div
                        style={{
                          width: '120px',
                          height: '180px',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          borderRadius: '12px',
                          border: '3px solid #a855f7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px',
                          boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '60px',
                          }}
                        >
                          ✨
                        </div>
                      </div>
                      
                      {/* 카드 이름 */}
                      <div
                        style={{
                          fontSize: '16px',
                          color: 'white',
                          textAlign: 'center',
                          fontWeight: '600',
                          maxWidth: '140px',
                        }}
                      >
                        {card.trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: '#d1d5db',
              }}
            >
              78장의 완전한 타로 덱으로 당신의 운명을 확인하세요
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}