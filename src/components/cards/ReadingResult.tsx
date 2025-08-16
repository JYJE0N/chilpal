"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowUp, 
  RotateCcw, 
  Clock, 
  Zap, 
  Heart, 
  Lightbulb,
  Sparkles,
  AtomIcon,
  BadgeCheckIcon,
  StarIcon,
  BookAIcon 
} from "lucide-react";
import { DrawnCard } from "@/types/tarot";
import { SPREADS, SpreadType } from "@/types/spreads";
import { ReadingDispatch } from "@/hooks/useReadingState";
import { getCardBlurDataUrl } from "@/lib/image-utils";
import { 
  classifyQuestion,
  generateOverallInterpretation,
  generateKeywordInsights
} from "@/lib/tarot-interpretation";
import { generateComprehensiveInterpretation } from "@/lib/contextual-interpretation";
import { 
  generatePersonalMessage, 
  generateEncouragementByQuestionType, 
  generateContextualKeywordMessage 
} from "@/lib/personal-messages";
import { cardDescriptions } from "@/data/card-descriptions";
import TarotCardDisplay from "./TarotCardDisplay";
import ShareButton from "@/components/share/ShareButton";

// 수트별 색상 매핑
const getSuitColor = (suit: string) => {
  switch (suit) {
    case "major":
      return "border-purple-400 shadow-purple-500/30";
    case "cups":
      return "border-blue-400 shadow-blue-500/30";
    case "pentacles":
      return "border-green-400 shadow-green-500/30";
    case "swords":
      return "border-gray-400 shadow-gray-500/30";
    case "wands":
      return "border-red-400 shadow-red-500/30";
    default:
      return "border-purple-400 shadow-purple-500/30";
  }
};

interface ReadingResultProps {
  question: string;
  spreadType: SpreadType;
  selectedCards: DrawnCard[];
  showTopButton: boolean;
  dispatch: ReadingDispatch;
}

export default function ReadingResult({
  question,
  spreadType,
  selectedCards,
  showTopButton,
  dispatch
}: ReadingResultProps) {
  const selectedSpread = SPREADS.find((s) => s.id === spreadType);

  // 페이지 상단으로 부드럽게 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 다시 시작
  const resetReading = () => {
    dispatch({ type: 'RESET_READING' });
  };

  if (selectedCards.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* TOP 버튼 */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-4xl">✨</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {selectedSpread?.name} 결과
          </h1>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-medium text-white mb-2">질문</h2>
          <p className="text-gray-300">{question}</p>
        </div>

        <div className="flex gap-4 justify-center">
          <ShareButton
            title={`${selectedSpread?.name} 타로 리딩 결과`}
            text={`질문: ${question}\n\n${selectedCards.map(card => 
              `${card.name} (${card.position === 'reversed' ? '역방향' : '정방향'})`
            ).join(', ')}`}
          />
          <button
            onClick={resetReading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            다시 시작
          </button>
        </div>
      </motion.div>

      {/* 선택된 카드들 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          선택된 카드
        </h3>
        
        <div className={`grid ${
          selectedCards.length === 1 
            ? "grid-cols-1 max-w-sm mx-auto" 
            : selectedCards.length === 3 
              ? "grid-cols-1 md:grid-cols-3 gap-6" 
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        }`}>
          {selectedCards.map((card, index) => (
            <TarotCardDisplay
              key={`${card.id}-result`}
              card={card}
              index={index}
              spreadType={spreadType}
              isResult={true}
            />
          ))}
        </div>
      </motion.div>

      {/* 종합 해석 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {(() => {
          const comprehensiveResult = generateComprehensiveInterpretation(
            selectedCards,
            classifyQuestion(question),
            question
          );

          return (
            <div className="space-y-8">
              {/* 카드별 해석 */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                  카드별 해석
                </h4>
                <div className="space-y-4">
                  {comprehensiveResult.cardInterpretations.map((card, idx) => {
                    const selectedCard = selectedCards[idx];
                    return (
                      <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        {/* 현재 상황 (스프레드 위치) */}
                        {card.position && (
                          <div className="text-sm font-medium text-purple-300 mb-3 bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
                            {card.position}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-18 relative rounded-md overflow-hidden border border-gray-600">
                            <Image
                              src={selectedCard.image_url}
                              alt={selectedCard.name}
                              fill
                              className="object-cover"
                              placeholder="blur"
                              blurDataURL={getCardBlurDataUrl(selectedCard.suit)}
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <h5 className="font-semibold text-white">{card.cardName}</h5>
                            <p className="text-sm text-gray-400">
                              {selectedCard.position === 'reversed' ? '역방향' : '정방향'}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">{card.interpretation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 카드 시너지 */}
              {comprehensiveResult.synergies.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    카드 조합의 시너지
                  </h4>
                  <div className="space-y-3">
                    {comprehensiveResult.synergies.map((synergy, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                        <div className="text-yellow-100 text-base leading-relaxed">
                          {synergy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 조언 */}
              {comprehensiveResult.advice && (
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-green-300" />
                    조언
                  </h4>
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-6 border border-green-500/20">
                    <p className="text-green-100 text-lg leading-relaxed">
                      {comprehensiveResult.advice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 개별 카드 상세 정보 */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BookAIcon className="w-5 h-5 text-purple-300" />
            카드 상세 정보
          </h4>
          <div className="grid gap-6">
            {selectedCards.map((card, index) => {
              const description = cardDescriptions[card.name];
              
              return (
                <motion.div
                  key={`detail-${card.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`rounded-xl p-6 border-2 ${getSuitColor(card.suit)} bg-white/5`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                      <div className="w-32 h-48 relative rounded-lg overflow-hidden">
                        <Image
                          src={card.image_url}
                          alt={card.name}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={getCardBlurDataUrl(card.suit)}
                          sizes="128px"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h5 className="text-xl font-bold text-white mb-2">
                          {card.name}
                          <span className="ml-3 text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                            {card.position === 'reversed' ? '역방향' : '정방향'}
                          </span>
                        </h5>
                        
                        {description && (
                          <p className="text-gray-400 text-sm mb-4">
                            {description}
                          </p>
                        )}
                      </div>

                      <div>
                        <h6 className="font-semibold text-white mb-2">현재 의미</h6>
                        <p className="text-gray-300 leading-relaxed">
                          {card.current_meaning}
                        </p>
                      </div>

                      {card.current_keywords && card.current_keywords.length > 0 && (
                        <div>
                          <h6 className="font-semibold text-white mb-2">키워드</h6>
                          <div className="flex flex-wrap gap-2">
                            {card.current_keywords.map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 개인 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-6 border border-pink-500/20"
        >
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-300" />
            개인 메시지
          </h4>
          <div className="space-y-4">
            <p className="text-pink-100 text-lg leading-relaxed">
              {generatePersonalMessage(selectedCards[0])}
            </p>
            
            <div className="border-t border-pink-500/20 pt-4">
              <p className="text-pink-200 leading-relaxed">
                {generateEncouragementByQuestionType(classifyQuestion(question))}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}