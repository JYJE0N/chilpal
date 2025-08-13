"use client";

import { useState } from "react";

// 타입 정의
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

// 카드 이미지 컴포넌트 (실제 이미지 + 플레이스홀더)
interface CardImageProps {
  card: TarotCard;
  isReversed?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

function CardImage({
  card,
  isReversed = false,
  className = "",
  size = "medium",
}: CardImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // 수트별 플레이스홀더 디자인
  const getSuitDesign = (suit: string) => {
    switch (suit) {
      case "major":
        return {
          gradient: "from-purple-600 via-indigo-600 to-purple-800",
          symbol: "✨",
          border: "border-yellow-400",
        };
      case "cups":
        return {
          gradient: "from-blue-500 via-cyan-500 to-blue-700",
          symbol: "💧",
          border: "border-blue-400",
        };
      case "pentacles":
        return {
          gradient: "from-green-500 via-emerald-500 to-green-700",
          symbol: "💰",
          border: "border-green-400",
        };
      case "swords":
        return {
          gradient: "from-gray-500 via-slate-500 to-gray-700",
          symbol: "⚔️",
          border: "border-gray-400",
        };
      case "wands":
        return {
          gradient: "from-red-500 via-orange-500 to-red-700",
          symbol: "🔥",
          border: "border-red-400",
        };
      default:
        return {
          gradient: "from-purple-600 to-purple-800",
          symbol: "✨",
          border: "border-purple-400",
        };
    }
  };

  const design = getSuitDesign(card.suit);

  // 이미지 로딩 실패시 플레이스홀더
  if (imageError) {
    return (
      <div
        className={`relative ${className} ${isReversed ? "rotate-180" : ""}`}
      >
        <div
          className={`w-full h-full bg-gradient-to-br ${design.gradient} rounded-lg ${design.border} border-2 shadow-lg overflow-hidden flex flex-col`}
        >
          {/* 카드 헤더 */}
          <div className="p-2 bg-black/20 text-center">
            <h3 className="text-white text-xs font-bold truncate">
              {card.name}
            </h3>
            {card.number && (
              <div className="text-yellow-300 text-xs">{card.number}</div>
            )}
          </div>

          {/* 메인 영역 */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-pulse">
                {design.symbol}
              </div>
              <div className="text-white text-xs font-semibold bg-black/30 px-2 py-1 rounded">
                {card.suit.toUpperCase()}
              </div>
            </div>
          </div>

          {/* 의미 미리보기 */}
          <div className="p-2 bg-black/20 text-center">
            <div className="text-white text-xs truncate">
              {card.upright_meaning}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 실제 이미지 표시 (로딩 중이거나 로드 완료)
  return (
    <div
      className={`relative ${className} ${
        isReversed ? "rotate-180" : ""
      } overflow-hidden rounded-lg`}
    >
      {/* 로딩 중일 때 플레이스홀더 표시 */}
      {imageLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${design.gradient} rounded-lg ${design.border} border-2 shadow-lg overflow-hidden flex items-center justify-center z-10`}
        >
          <div className="text-center text-white">
            <div className="animate-spin text-2xl mb-2">🔄</div>
            <div className="text-xs">Loading...</div>
          </div>
        </div>
      )}

      <img
        src={card.image_url}
        alt={card.name}
        className="w-full h-full object-cover rounded-lg"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />

      {/* 역방향 오버레이 */}
      {isReversed && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          역방향
        </div>
      )}
    </div>
  );
}

// 테스트용 Fool 카드 데이터
const foolCard: TarotCard = {
  id: 0,
  name: "The Fool",
  suit: "major",
  upright_meaning: "새로운 시작, 순수함, 모험, 신뢰",
  upright_interpretation:
    "새로운 여정이 당신을 기다리고 있습니다. 두려움을 내려놓고 순수한 마음으로 첫 발을 내딛으세요.",
  upright_keywords: ["새로운 시작", "모험", "순수함", "신뢰", "자유", "가능성"],
  reversed_meaning: "무모함, 경솔함, 준비 부족, 위험한 선택",
  reversed_interpretation:
    "성급한 결정을 피하세요. 충분한 준비 없이 시작하면 위험할 수 있습니다.",
  reversed_keywords: ["무모함", "경솔함", "준비부족", "위험", "충동", "실수"],
  has_reversal: true,
  image_url: "/images/cards/major/00-fool.png", // 여기에 실제 이미지 경로
  description:
    "절벽 끝에 서 있는 젊은이. 새로운 모험을 향한 순수한 마음을 상징합니다.",
};

export default function RealImageCardDemo() {
  const [isReversed, setIsReversed] = useState(false);
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "w-24 h-36";
      case "medium":
        return "w-32 h-48";
      case "large":
        return "w-48 h-72";
      default:
        return "w-32 h-48";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎨 실제 타로 이미지 테스트 🎨
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">
            The Fool 카드
          </h2>

          {/* 컨트롤 */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setIsReversed(!isReversed)}
              className={`px-4 py-2 rounded-full transition-all ${
                isReversed
                  ? "bg-red-600 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isReversed ? "역방향" : "정방향"}
            </button>

            <select
              value={size}
              onChange={(e) =>
                setSize(e.target.value as "small" | "medium" | "large")
              }
              className="px-4 py-2 rounded-full bg-white/20 text-white border border-white/30"
            >
              <option
                value="small"
                className="text-black"
              >
                Small
              </option>
              <option
                value="medium"
                className="text-black"
              >
                Medium
              </option>
              <option
                value="large"
                className="text-black"
              >
                Large
              </option>
            </select>
          </div>

          {/* 카드 표시 */}
          <div className="flex justify-center mb-8">
            <div className={getSizeClasses(size)}>
              <CardImage
                card={foolCard}
                isReversed={isReversed}
                size={size}
                className="w-full h-full shadow-2xl"
              />
            </div>
          </div>

          {/* 카드 정보 */}
          <div className="max-w-md mx-auto bg-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-3">
              {foolCard.name}
              {isReversed && (
                <span className="text-red-400 ml-2">(역방향)</span>
              )}
            </h3>

            <p className="text-purple-200 mb-4">
              {isReversed
                ? foolCard.reversed_meaning
                : foolCard.upright_meaning}
            </p>

            <p className="text-purple-100 text-sm mb-4">
              {isReversed
                ? foolCard.reversed_interpretation
                : foolCard.upright_interpretation}
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {(isReversed
                ? foolCard.reversed_keywords
                : foolCard.upright_keywords
              )?.map((keyword, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 사용법 안내 */}
          <div className="mt-8 text-purple-200 text-sm">
            <p className="mb-2">
              📁 이미지 경로:{" "}
              <code className="bg-black/30 px-2 py-1 rounded">
                public/images/cards/major/00-fool.png
              </code>
            </p>
            <p>💡 이미지가 없으면 자동으로 플레이스홀더가 표시됩니다!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
