"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Link2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { designTokens } from "@/styles/design-tokens";
import { useKakao } from "@/hooks/useKakao";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  image?: string;
  hashtags?: string[];
  readingId?: string;
  cards?: Array<{ name: string; position: string }>;
  question?: string;
  spreadType?: string;
}

export default function ShareButton({ 
  title, 
  text, 
  url = typeof window !== 'undefined' ? window.location.href : '',
  hashtags = ['타로', '타로카드', '운세', '칠팔타로'],
  readingId,
  cards,
  question,
  spreadType
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isLoaded: isKakaoLoaded, Kakao } = useKakao();

  // 동적 OG 이미지 URL 생성
  const generateOGImageUrl = () => {
    if (readingId && cards && question && spreadType) {
      // 특정 리딩 결과용 OG 이미지 (URL 파라미터로 데이터 전달)
      const cardNames = cards.map(card => card.name).join(',');
      const params = new URLSearchParams({
        title: title,
        cards: cardNames,
        question: question,
        spreadType: spreadType
      });
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/api/og/reading/${readingId}?${params.toString()}`;
    } else if (cards && question && spreadType) {
      // 일반적인 동적 OG 이미지
      const cardNames = cards.map(card => card.name).join(',');
      const params = new URLSearchParams({
        title: title,
        cards: cardNames,
        question: question,
        spreadType: spreadType
      });
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/api/og?${params.toString()}`;
    }
    return '/og-image.png'; // 기본 이미지
  };

  const ogImageUrl = generateOGImageUrl();

  // 공유 URL 생성
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(text);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

  // 공유 링크들
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&hashtags=${hashtags.join(',')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    kakao: () => {
      if (isKakaoLoaded && Kakao) {
        // 절대 URL 생성
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const fullImageUrl = ogImageUrl.startsWith('http') ? 
          ogImageUrl : 
          `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : '/' + ogImageUrl}`;
        
        console.log('카카오톡 공유 이미지 URL:', fullImageUrl); // 디버깅용
        
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: title,
            description: text,
            imageUrl: fullImageUrl,
            imageWidth: 1200,
            imageHeight: 630,
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          social: {
            likeCount: 0,
            commentCount: 0,
            sharedCount: 0,
          },
          buttons: [
            {
              title: '타로 보기',
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
      }
    },
  };

  // 링크 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 네이티브 공유 API 사용 (모바일)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${text}\n\n${hashtagString}`,
          url: url,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      {/* 메인 공유 버튼 */}
      <motion.button
        onClick={handleNativeShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold transition-all"
        style={{
          background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.accent[500]})`,
          boxShadow: designTokens.shadows.glow.sm,
        }}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-base">공유하기</span>
      </motion.button>

      {/* 데스크톱 공유 옵션 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
            style={{
              background: designTokens.colors.background.glass,
              backdropFilter: 'blur(12px)',
              borderRadius: designTokens.borderRadius.lg,
              border: `1px solid ${designTokens.colors.primary[300]}20`,
              boxShadow: designTokens.shadows.xl,
            }}
          >
            <div className="flex items-center gap-1 p-2">
              {/* 트위터 */}
              <motion.a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Twitter className="w-5 h-5 text-sky-400" />
              </motion.a>

              {/* 페이스북 */}
              <motion.a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Facebook className="w-5 h-5 text-blue-500" />
              </motion.a>

              {/* 카카오톡 */}
              <motion.button
                onClick={() => {
                  shareLinks.kakao();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${!isKakaoLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isKakaoLoaded}
              >
                <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center text-xs font-bold text-black">
                  K
                </div>
              </motion.button>

              {/* 링크 복사 */}
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Link2 className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>
            </div>

            {/* 복사 완료 메시지 */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  style={{
                    background: designTokens.colors.semantic.success,
                    padding: '4px 12px',
                    borderRadius: designTokens.borderRadius.md,
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: 500,
                  }}
                >
                  링크가 복사되었습니다!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

