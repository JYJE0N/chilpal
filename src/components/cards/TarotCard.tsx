"use client";

import { useState } from "react";

// CSS 스타일 추가
const cardFlipStyles = {
  container: {
    perspective: "1000px",
    transformStyle: "preserve-3d" as const,
  },
  card: {
    transformStyle: "preserve-3d" as const,
    transition: "transform 0.6s ease-in-out",
  },
  cardFace: {
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
  },
  cardBack: {
    transform: "rotateY(0deg)",
  },
  cardFront: {
    transform: "rotateY(180deg)",
  },
  flipped: {
    transform: "rotateY(180deg)",
  },
  notFlipped: {
    transform: "rotateY(0deg)",
  },
};

// 임시 타입 정의 (실제로는 @/types/tarot에서 import)
interface TarotCard {
  id: number;
  name: string;
  suit: "major" | "cups" | "pentacles" | "swords" | "wands";
  number?: number | string;
  upright_meaning: string;
  upright_interpretation: string;
  upright_keywords: string[];
  reversed_meaning?: string;
  reversed_interpretation?: string;
  reversed_keywords?: string[];
  has_reversal: boolean;
  image_url: string;
  description?: string;
}

interface DrawnCard extends TarotCard {
  position: "upright" | "reversed";
  is_reversed: boolean;
  current_meaning: string;
  current_interpretation: string;
  current_keywords: string[];
}

interface TarotCardProps {
  card?: TarotCard | DrawnCard;
  isFlipped?: boolean;
  isRevealed?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  className?: string;
}

// 샘플 카드 데이터
const sampleCard: DrawnCard = {
  id: 0,
  name: "The Fool",
  suit: "major",
  number: undefined,
  upright_meaning: "새로운 시작, 순수함, 모험, 신뢰",
  upright_interpretation:
    "새로운 여정이 당신을 기다리고 있습니다. 두려움을 내려놓고 순수한 마음으로 첫 발을 내딛으세요.",
  upright_keywords: ["새로운 시작", "모험", "순수함", "신뢰", "자유", "가능성"],
  reversed_meaning: "무모함, 경솔함, 준비 부족, 위험한 선택",
  reversed_interpretation:
    "성급한 결정을 피하세요. 충분한 준비 없이 시작하면 위험할 수 있습니다.",
  reversed_keywords: ["무모함", "경솔함", "준비부족", "위험", "충동", "실수"],
  has_reversal: true,
  image_url: "/images/cards/major/00-fool.jpg",
  description:
    "절벽 끝에 서 있는 젊은이. 새로운 모험을 향한 순수한 마음을 상징합니다.",
  position: "upright",
  is_reversed: false,
  current_meaning: "새로운 시작, 순수함, 모험, 신뢰",
  current_interpretation:
    "새로운 여정이 당신을 기다리고 있습니다. 두려움을 내려놓고 순수한 마음으로 첫 발을 내딛으세요.",
  current_keywords: ["새로운 시작", "모험", "순수함", "신뢰", "자유", "가능성"],
};

const sampleReversedCard: DrawnCard = {
  ...sampleCard,
  id: 1,
  position: "reversed",
  is_reversed: true,
  current_meaning: "무모함, 경솔함, 준비 부족, 위험한 선택",
  current_interpretation:
    "성급한 결정을 피하세요. 충분한 준비 없이 시작하면 위험할 수 있습니다.",
  current_keywords: ["무모함", "경솔함", "준비부족", "위험", "충동", "실수"],
};

// 수트별 색상 매핑
const getSuitColor = (suit: string) => {
  switch (suit) {
    case "major":
      return "text-purple-600 border-purple-300";
    case "cups":
      return "text-blue-600 border-blue-300";
    case "pentacles":
      return "text-green-600 border-green-300";
    case "swords":
      return "text-gray-600 border-gray-300";
    case "wands":
      return "text-red-600 border-red-300";
    default:
      return "text-purple-600 border-purple-300";
  }
};

// 수트별 이모지
const getSuitEmoji = (suit: string) => {
  switch (suit) {
    case "major":
      return "✨";
    case "cups":
      return "💧";
    case "pentacles":
      return "💰";
    case "swords":
      return "⚔️";
    case "wands":
      return "🔥";
    default:
      return "✨";
  }
};

// 크기별 스타일
const getSizeClasses = (size: string) => {
  switch (size) {
    case "small":
      return "w-24 h-36";
    case "medium":
      return "w-32 h-48";
    case "large":
      return "w-40 h-60";
    default:
      return "w-32 h-48";
  }
};

export default function TarotCard({
  card,
  isFlipped = false,
  isRevealed = false,
  size = "medium",
  onClick,
  className = "",
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayCard = card || sampleCard;
  const suitColor = getSuitColor(displayCard.suit);
  const suitEmoji = getSuitEmoji(displayCard.suit);
  const sizeClasses = getSizeClasses(size);

  // 역방향인지 확인
  const isReversed = (displayCard as DrawnCard).is_reversed || false;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* 카드 - 3D 뒤집기 효과 */}
      <div
        className={`relative ${sizeClasses} cursor-pointer transition-all duration-300 ${
          isHovered ? "scale-105" : ""
        } ${className}`}
        style={{
          ...cardFlipStyles.container,
          ...cardFlipStyles.card,
          ...(isFlipped || isRevealed
            ? cardFlipStyles.flipped
            : cardFlipStyles.notFlipped),
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 카드 뒷면 */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            ...cardFlipStyles.cardFace,
            ...cardFlipStyles.cardBack,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl border-2 border-yellow-400 flex items-center justify-center relative overflow-hidden">
            {/* 마법진 패턴 */}
            <div className="absolute inset-4 border border-yellow-400 rounded-full opacity-60">
              <div className="absolute inset-2 border border-yellow-400 rounded-full">
                <div className="absolute inset-4 border border-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-2xl">🌙</span>
                </div>
              </div>
            </div>
            {/* 별들 */}
            <div className="absolute top-2 left-2 text-yellow-400 text-xs">
              ✦
            </div>
            <div className="absolute top-4 right-3 text-yellow-400 text-xs">
              ✦
            </div>
            <div className="absolute bottom-3 left-3 text-yellow-400 text-xs">
              ✦
            </div>
            <div className="absolute bottom-2 right-2 text-yellow-400 text-xs">
              ✦
            </div>
          </div>
        </div>

        {/* 카드 앞면 */}
        <div
          className={`absolute inset-0 rounded-xl ${
            isReversed ? "rotate-180" : ""
          }`}
          style={{
            ...cardFlipStyles.cardFace,
            ...cardFlipStyles.cardFront,
          }}
        >
          <div
            className={`w-full h-full bg-white rounded-xl border-2 ${suitColor} shadow-lg flex flex-col relative`}
          >
            {/* 카드 헤더 */}
            <div className="p-2 text-center border-b border-gray-200">
              <div className={`text-xs font-semibold ${suitColor}`}>
                {suitEmoji} {displayCard.name}
              </div>
              {displayCard.number && (
                <div className="text-xs text-gray-600 mt-1">
                  {displayCard.number}
                </div>
              )}
            </div>

            {/* 이미지 영역 (플레이스홀더) */}
            <div className="flex-1 p-2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-4xl mb-2">{suitEmoji}</div>
                <div className="text-xs text-gray-600 font-medium">
                  {displayCard.suit.toUpperCase()}
                </div>
              </div>
            </div>

            {/* 역방향 표시 */}
            {isReversed && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                역방향
              </div>
            )}

            {/* 의미 미리보기 */}
            <div className="p-2 bg-gray-50 rounded-b-xl">
              <div className="text-[10px] text-gray-700 text-center leading-tight">
                {(displayCard as DrawnCard).current_meaning ||
                  displayCard.upright_meaning}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카드 정보 (상세) */}
      {(isFlipped || isRevealed) && (
        <div className="max-w-sm bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            {displayCard.name}
            {isReversed && <span className="text-red-500 ml-2">(역방향)</span>}
          </h3>

          <div className="mb-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {(displayCard as DrawnCard).current_interpretation ||
                displayCard.upright_interpretation}
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {(
              (displayCard as DrawnCard).current_keywords ||
              displayCard.upright_keywords
            ).map((keyword, index) => (
              <span
                key={index}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 데모 컴포넌트
function TarotCardDemo() {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleCard = (cardId: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🔮 칠팔 타로 카드 UI 🔮
        </h1>

        {/* 상호작용 데모 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            클릭해서 뒤집기 테스트
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {[0, 1, 2].map((id) => (
              <div
                key={id}
                className="text-center"
              >
                <TarotCard
                  card={id === 1 ? sampleReversedCard : sampleCard}
                  isFlipped={flippedCards[id]}
                  onClick={() => toggleCard(id)}
                />
                <p className="text-white mt-2 text-sm">
                  카드 {id + 1}: {flippedCards[id] ? "앞면" : "뒷면"}
                </p>
                <button
                  onClick={() => toggleCard(id)}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  {flippedCards[id] ? "뒤집기" : "공개하기"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TarotCardDemo };
