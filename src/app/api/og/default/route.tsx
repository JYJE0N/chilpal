import { ImageResponse } from 'next/og';

export async function GET() {
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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #6b21a8 75%, #7c3aed 100%)',
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
        
        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* 제목 */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
              marginBottom: '30px',
              letterSpacing: '-0.02em',
            }}
          >
            칠팔 타로
          </div>
          
          {/* 부제목 */}
          <div
            style={{
              fontSize: '36px',
              color: '#f3e8ff',
              fontWeight: '600',
              textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
              marginBottom: '40px',
            }}
          >
            78장 완전한 타로 카드 리딩
          </div>
          
          {/* 카드 뒷면 스타일 */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '120px',
                  height: '180px',
                  background: 'linear-gradient(135deg, #4c1d95, #6b21a8)',
                  borderRadius: '15px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 40px rgba(76, 29, 149, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* 장식적 테두리 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '8px',
                    bottom: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                  }}
                />
                
                {/* 중앙 신비로운 패턴 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {/* 상단 별 */}
                  <div style={{ fontSize: '14px' }}>*</div>
                  
                  {/* 중앙 원형 패턴 */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '2px solid rgba(255,255,255,0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 하단 별 */}
                  <div style={{ fontSize: '14px' }}>*</div>
                </div>
                
                {/* 모서리 장식 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  +
                </div>
              </div>
            ))}
          </div>
          
          {/* 설명 텍스트 */}
          <div
            style={{
              fontSize: '24px',
              color: '#e2e8f0',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            과거, 현재, 미래의 메시지를 78장의 타로 카드로 확인하세요
          </div>
        </div>

        {/* 푸터 */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '18px',
            color: '#d1d5db',
            textAlign: 'center',
          }}
        >
          무료 온라인 타로 점술 서비스
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}