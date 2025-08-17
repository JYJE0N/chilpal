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
          background: 'linear-gradient(45deg, #5b21b6, #be185d)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
          }}
        >
          칠팔 타로
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#f3e8ff',
          }}
        >
          카카오톡 이미지 테스트
        </div>
        <div
          style={{
            fontSize: '16px',
            color: '#e2e8f0',
            marginTop: '20px',
          }}
        >
          {new Date().toLocaleString('ko-KR')}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}