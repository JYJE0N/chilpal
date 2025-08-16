"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DrawnCard } from "@/types/tarot";
import { SpreadType } from "@/types/spreads";
import { getCardBlurDataUrl } from "@/lib/image-utils";
import { getSuitColors } from "@/styles/unified-design-system";

// 수트별 색상 매핑 (통합 디자인 시스템 사용)
const getSuitColor = (suit: string) => {
  const suitColors = getSuitColors(suit);
  return `border-[${suitColors.border}] shadow-[${suitColors.shadow}]`;
};

// 스프레드별 위치 레이블 가져오기
const getPositionLabel = (index: number, spreadType: SpreadType): string => {
  switch (spreadType) {
    case "three-card":
      return ["과거", "현재", "미래"][index] || "";
    case "one-card":
      return "답변";
    case "love-spread":
      return ["현재 감정", "상대의 마음", "관계의 장애물", "필요한 것", "연애운"][index] || "";
    case "career-path":
      return ["현재 위치", "강점", "약점", "기회", "조언"][index] || "";
    case "relationship":
      return ["당신", "상대방", "당신의 감정", "상대의 감정", "관계의 현재", "관계의 미래"][index] || "";
    case "yes-no":
      return ["현재 상황", "선택의 결과", "고려할 점", "최선의 길"][index] || "";
    default:
      return `카드 ${index + 1}`;
  }
};

interface TarotCardDisplayProps {
  card: DrawnCard;
  index: number;
  spreadType: SpreadType;
  isResult?: boolean;
}

export default function TarotCardDisplay({ 
  card, 
  index, 
  spreadType, 
  isResult = false 
}: TarotCardDisplayProps) {
  const positionLabel = getPositionLabel(index, spreadType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      {/* 위치 레이블 */}
      {positionLabel && spreadType !== "one-card" && (
        <div className="mb-3">
          <span className="text-sm font-medium text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
            {positionLabel}
          </span>
        </div>
      )}

      {/* 카드 이미지 */}
      <div className="relative group">
        <motion.div
          whileHover={isResult ? { scale: 1.05 } : {}}
          className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 ${getSuitColor(
            card.suit
          )} shadow-lg mx-auto max-w-[200px]`}
        >
          <Image
            src={card.image_url}
            alt={card.name}
            fill
            className={`object-cover ${
              card.position === "reversed" ? "rotate-180" : ""
            }`}
            placeholder="blur"
            blurDataURL={getCardBlurDataUrl(card.suit)}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
          
          {/* 역방향 표시 */}
          {card.position === "reversed" && (
            <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
              역방향
            </div>
          )}
        </motion.div>

        {/* 카드 정보 */}
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-white text-lg">{card.name}</h4>
          
          {isResult && (
            <div className="text-sm text-gray-400 space-y-1">
              <p className="leading-relaxed">{card.current_meaning}</p>
              
              {card.current_keywords && card.current_keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-2">
                  {card.current_keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}