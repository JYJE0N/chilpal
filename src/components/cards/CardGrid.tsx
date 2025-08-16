"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { DrawnCard } from "@/types/tarot";
import { SPREADS, SpreadType } from "@/types/spreads";
import { ReadingDispatch } from "@/hooks/useReadingState";
import { CARD_BACK_BLUR_DATA_URL, getCardBlurDataUrl } from "@/lib/image-utils";
import { classifyQuestion } from "@/lib/tarot-interpretation";
import { generateSpreadInterpretation } from "@/lib/spread-interpretation";

interface CardGridProps {
  question: string;
  spreadType: SpreadType;
  availableCards: DrawnCard[];
  selectedCards: DrawnCard[];
  revealedCards: Set<number>;
  isShuffling: boolean;
  shuffleKey: number;
  dispatch: ReadingDispatch;
  onComplete?: (selectedCards: DrawnCard[]) => void;
  saveReadingOnce: (readingData: any) => Promise<void>;
}

export default function CardGrid({
  question,
  spreadType,
  availableCards,
  selectedCards,
  revealedCards,
  isShuffling,
  shuffleKey,
  dispatch,
  onComplete,
  saveReadingOnce
}: CardGridProps) {
  const selectedSpread = SPREADS.find((s) => s.id === spreadType);
  const maxCards = selectedSpread?.cardCount || 1;

  // 카드 선택 처리
  const handleCardClick = (card: DrawnCard) => {
    if (selectedCards.length >= maxCards) return;

    dispatch({ type: 'ADD_REVEALED_CARD', payload: card.id });

    setTimeout(() => {
      // 이미 결정된 역방향 상태를 그대로 사용
      dispatch({ type: 'ADD_SELECTED_CARD', payload: card });

      // 1카드 스프레드는 즉시 결과 표시
      if (maxCards === 1 && selectedCards.length === 0) {
        setTimeout(async () => {
          // 결과 표시
          dispatch({ type: 'SET_PHASE', payload: 'result' });

          // 리딩 저장 (비동기 처리)
          const interpretation = generateSpreadInterpretation(
            spreadType,
            [card],
            question,
            classifyQuestion(question)
          );

          const readingData = {
            question,
            spreadType,
            cards: [card],
            interpretation,
            questionType: classifyQuestion(question),
          };

          // 1카드 전용 저장 (중복 방지)
          await saveReadingOnce(readingData);

          // 카드 영역이 보이도록 스크롤 (애니메이션 관찰 가능)
          setTimeout(scrollToCards, 200);
        }, 1000);
      }
    }, 500);
  };

  // 카드 선택 영역으로 부드럽게 스크롤 (애니메이션이 보이도록)
  const scrollToCards = () => {
    const cardSection = document.querySelector('.card-selection-area');
    if (cardSection) {
      cardSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // 리딩 완료 시에도 스크롤 조정
  const completeReading = async () => {
    dispatch({ type: 'SET_PHASE', payload: 'result' });
    if (onComplete) {
      onComplete(selectedCards);
    }

    // 리딩 저장 (비동기 처리)
    const interpretation = generateSpreadInterpretation(
      spreadType,
      selectedCards,
      question,
      classifyQuestion(question)
    );

    const readingData = {
      question,
      spreadType,
      cards: selectedCards,
      interpretation,
      questionType: classifyQuestion(question),
    };

    // 1카드가 아닐 때만 저장 (1카드는 이미 handleCardClick에서 저장됨)
    if (maxCards > 1) {
      await saveReadingOnce(readingData);
    }

    // 결과 영역이 보이도록 스크롤
    setTimeout(scrollToTop, 200);
  };

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

  // 뒤로 가기
  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'question' });
    dispatch({ type: 'SET_AVAILABLE_CARDS', payload: [] });
    dispatch({ type: 'RESET_SELECTED_CARDS' });
  };

  // 카드 그리드 레이아웃 계산
  const getGridCols = () => {
    if (maxCards === 1) return "grid-cols-4"; // 4열×4줄
    if (maxCards === 3) return "grid-cols-7"; // 7열×2줄
    if (maxCards === 4) return "grid-cols-4 md:grid-cols-6"; // 모바일 4열, 데스크톱 6열
    if (maxCards === 5) return "grid-cols-5"; // 5열×3줄
    if (spreadType === "celtic-cross") return "grid-cols-6"; // 6열×5줄
    return "grid-cols-5"; // 기본 5열×4줄
  };

  return (
    <div className="min-h-screen p-4 relative">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedSpread?.name}
          </h2>
          <p className="text-gray-400">
            {selectedCards.length}/{maxCards} 카드 선택됨
          </p>
        </div>

        <button
          onClick={resetReading}
          className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* 질문 표시 */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-2">질문</h3>
          <p className="text-gray-300">{question}</p>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="card-selection-area">
        <AnimatePresence mode="wait">
          {isShuffling ? (
            <motion.div
              key={`shuffling-${shuffleKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"></div>
              </motion.div>
              <p className="text-xl text-white">카드를 섞고 있습니다...</p>
            </motion.div>
          ) : (
            <motion.div
              key={`cards-${shuffleKey}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`grid ${getGridCols()} gap-4 max-w-6xl mx-auto`}
            >
              {availableCards.map((card, index) => (
                <motion.div
                  key={`${card.id}-${shuffleKey}`}
                  initial={{ opacity: 0, y: 50, rotateY: 180 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateY: revealedCards.has(card.id) ? 0 : 180 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="relative group cursor-pointer"
                  onClick={() => handleCardClick(card)}
                  style={{ perspective: "1000px" }}
                >
                  <div className="relative w-full aspect-[2/3] transform-style-preserve-3d transition-transform duration-600">
                    {revealedCards.has(card.id) ? (
                      // 앞면 (선택된 카드)
                      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-purple-400 shadow-lg shadow-purple-500/30">
                        <Image
                          src={card.image_url}
                          alt={card.name}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={getCardBlurDataUrl(card.suit)}
                          sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                        />
                      </div>
                    ) : (
                      // 뒷면
                      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-600 shadow-lg group-hover:border-purple-400 transition-colors">
                        <Image
                          src="/images/cards/card-back.png"
                          alt="카드 뒷면"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL={CARD_BACK_BLUR_DATA_URL}
                          sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 완료 버튼 */}
      {selectedCards.length === maxCards && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            onClick={completeReading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            리딩 완료
          </button>
        </motion.div>
      )}
    </div>
  );
}