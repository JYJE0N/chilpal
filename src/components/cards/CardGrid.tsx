"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, RotateCcw, Eye } from "lucide-react";
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

  // 카드만 다시 섞기
  const reshuffleCards = async () => {
    // 선택된 카드가 있으면 확인
    if (selectedCards.length > 0) {
      if (!confirm('선택한 카드가 초기화됩니다. 계속하시겠습니까?')) {
        return;
      }
    }

    // 고유한 셔플 키 생성 (중복 방지)
    const newShuffleKey = Date.now();
    dispatch({ type: 'SET_SHUFFLE_KEY', payload: newShuffleKey });
    dispatch({ type: 'SET_SHUFFLING', payload: true });

    // 기존 상태 초기화
    dispatch({ type: 'RESET_SELECTED_CARDS' });
    dispatch({ type: 'RESET_REVEALED_CARDS' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 기존과 동일한 카드 수로 다시 섞기
    const cardCount = availableCards.length;
    const { drawRandomCards } = await import('@/data/all-tarot-cards');
    const randomCards = await drawRandomCards(cardCount);
    
    // 카드에 역방향 여부 미리 결정
    const cardsWithPosition: DrawnCard[] = randomCards.map(card => {
      const isReversed = card.has_reversal ? Math.random() < 0.5 : false;
      return {
        ...card,
        position: isReversed ? "reversed" : "upright",
        is_reversed: isReversed,
        current_meaning: isReversed
          ? card.reversed_meaning || card.upright_meaning
          : card.upright_meaning,
        current_interpretation: isReversed
          ? card.reversed_interpretation || card.upright_interpretation || ''
          : card.upright_interpretation || '',
        current_keywords: isReversed
          ? card.reversed_keywords || card.upright_keywords || []
          : card.upright_keywords || [],
      };
    });

    // 새 카드 설정
    dispatch({ type: 'SET_AVAILABLE_CARDS', payload: cardsWithPosition });

    setTimeout(() => dispatch({ type: 'SET_SHUFFLING', payload: false }), 800);
  };

  // 다시 시작 (전체 초기화)
  const resetReading = () => {
    dispatch({ type: 'RESET_READING' });
  };

  // 뒤로 가기
  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'question' });
    dispatch({ type: 'SET_AVAILABLE_CARDS', payload: [] });
    dispatch({ type: 'RESET_SELECTED_CARDS' });
  };

  // 카드 그리드 레이아웃 계산 (크기와 정렬 균형)
  const getGridCols = () => {
    const cardCount = availableCards.length;
    
    // 카드 크기를 적절히 유지하면서 정렬도 고려
    if (cardCount <= 4) {
      return "grid-cols-2 sm:grid-cols-4"; // 모바일 2열, 데스크톱 4열
    } else if (cardCount <= 6) {
      return "grid-cols-3 sm:grid-cols-3 md:grid-cols-6"; // 3열 기본, 데스크톱에서 6열
    } else if (cardCount <= 8) {
      return "grid-cols-4 sm:grid-cols-4 md:grid-cols-8"; // 4열 기본
    } else if (cardCount <= 9) {
      return "grid-cols-3 sm:grid-cols-3 md:grid-cols-9"; // 3열×3행
    } else if (cardCount <= 12) {
      return "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"; // 모바일 3열, 데스크톱 6열
    } else if (cardCount <= 15) {
      return "grid-cols-3 sm:grid-cols-5 md:grid-cols-5"; // 3열 또는 5열
    } else if (cardCount <= 16) {
      return "grid-cols-4 sm:grid-cols-4 md:grid-cols-8"; // 4열×4행
    } else if (cardCount <= 20) {
      return "grid-cols-4 sm:grid-cols-5 md:grid-cols-5"; // 4열 또는 5열
    } else {
      return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6"; // 많은 카드는 최대 6열
    }
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
          <div className="flex items-center justify-center gap-2">
            <p className={`font-medium ${selectedCards.length === maxCards ? 'text-green-400' : 'text-gray-400'}`}>
              {selectedCards.length}/{maxCards} 카드 선택됨
            </p>
            {selectedCards.length === maxCards && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">완료!</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={reshuffleCards}
          className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          title="카드 다시 섞기"
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
              className={`grid ${getGridCols()} gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto px-2 justify-items-center`}
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
                  className="relative group cursor-pointer w-full min-w-[80px] max-w-[140px] mx-auto"
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
                          priority={index < 4} // 첫 4개 카드는 우선 로딩
                          loading={index < 4 ? "eager" : "lazy"}
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
                          priority={index < 6} // 첫 6개 카드 뒷면은 우선 로딩
                          loading={index < 6 ? "eager" : "lazy"}
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

      {/* 카드 선택 완료 알림 */}
      {selectedCards.length === maxCards && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-8 mb-8"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-bold text-lg">모든 카드를 선택했습니다!</span>
            </div>
            <p className="text-gray-300 text-sm">이제 카드의 해석을 확인해보세요</p>
          </div>
        </motion.div>
      )}

      {/* 완료 버튼 */}
      {selectedCards.length === maxCards && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8 mb-8"
        >
          <motion.button
            onClick={completeReading}
            className="relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* 반짝이는 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span>해석하기</span>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}