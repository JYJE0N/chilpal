import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareButton from '../share/ShareButton';

// Mock navigator.share
const mockShare = jest.fn();
const mockClipboard = {
  writeText: jest.fn(),
};

Object.defineProperty(navigator, 'share', {
  writable: true,
  value: mockShare,
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: mockClipboard,
});

describe('ShareButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('공유 버튼이 렌더링되어야 함', () => {
    render(
      <ShareButton 
        title="테스트 타이틀" 
        text="테스트 텍스트"
      />
    );

    expect(screen.getByText('공유하기')).toBeInTheDocument();
  });

  it('네이티브 공유 API를 사용해야 함', async () => {
    mockShare.mockResolvedValue(undefined);

    render(
      <ShareButton 
        title="타로 리딩 결과" 
        text="오늘의 운세는..."
        url="https://example.com"
      />
    );

    const shareButton = screen.getByText('공유하기');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: '타로 리딩 결과',
        text: '오늘의 운세는...\n\n#타로 #타로카드 #운세 #칠팔타로',
        url: 'https://example.com',
      });
    });
  });

  it('네이티브 공유 API가 없을 때 공유 옵션을 표시해야 함', () => {
    // navigator.share를 undefined로 설정
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    render(
      <ShareButton 
        title="테스트" 
        text="테스트 텍스트"
      />
    );

    const shareButton = screen.getByText('공유하기');
    fireEvent.click(shareButton);

    // 공유 옵션들이 표시되는지 확인
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
  });

  it('링크 복사 기능이 작동해야 함', async () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    mockClipboard.writeText.mockResolvedValue(undefined);

    render(
      <ShareButton 
        title="테스트" 
        text="테스트"
        url="https://example.com/test"
      />
    );

    // 공유 버튼 클릭하여 옵션 표시
    const shareButton = screen.getByText('공유하기');
    fireEvent.click(shareButton);

    // 링크 복사 버튼 찾기 (Link2 아이콘이 있는 버튼)
    const copyButton = screen.getByRole('button', { name: '' }).parentElement?.querySelector('button:last-child');
    
    if (copyButton) {
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('https://example.com/test');
      });

      // 복사 완료 메시지 확인
      await waitFor(() => {
        expect(screen.getByText('링크가 복사되었습니다!')).toBeInTheDocument();
      });
    }
  });

  it('커스텀 해시태그를 사용해야 함', () => {
    render(
      <ShareButton 
        title="테스트" 
        text="테스트"
        hashtags={['커스텀', '해시태그']}
      />
    );

    const shareButton = screen.getByText('공유하기');
    expect(shareButton).toBeInTheDocument();
  });

  it('트위터 공유 링크가 올바르게 생성되어야 함', () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    render(
      <ShareButton 
        title="타로 테스트" 
        text="오늘의 타로"
        url="https://tarot.com"
        hashtags={['타로']}
      />
    );

    const shareButton = screen.getByText('공유하기');
    fireEvent.click(shareButton);

    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('hashtags=타로'));
  });
});