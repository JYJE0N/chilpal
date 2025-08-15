"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard, DrawnCard } from "@/types/tarot";
import { SpreadType, SPREADS } from "@/types/spreads";
import { CARD_BACK_BLUR_DATA_URL, getCardBlurDataUrl } from "@/lib/image-utils";
import { useToast } from "@/components/ui/Toast";
import { useAsync } from "@/hooks/useAsync";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import ShareButton from "@/components/share/ShareButton";
import {
  Moon,
  Sparkles,
  AtomIcon,
  BadgeCheckIcon,
  StarIcon,
  BookAIcon,
  ArrowUp,
} from "lucide-react";
import { drawRandomCards, drawCardWithPosition } from "@/data/all-tarot-cards";
import {
  classifyQuestion,
  generateOverallInterpretation,
  generateKeywordInsights,
} from "@/lib/tarot-interpretation";
import { generateSpreadInterpretation } from "@/lib/spread-interpretation";
import SpreadCard from "./SpreadCard";

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

interface CardSelectionProps {
  onComplete?: (selectedCards: DrawnCard[]) => void;
}

export default function CardSelection({ onComplete }: CardSelectionProps) {
  const [question, setQuestion] = useState("");
  const [availableCards, setAvailableCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [spreadType, setSpreadType] = useState<SpreadType>("one-card");
  const [phase, setPhase] = useState<
    "spread-selection" | "question" | "selection" | "result"
  >("spread-selection");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);
  const [lastSavedReadingId, setLastSavedReadingId] = useState<string | null>(null);
  const [isSavingReading, setIsSavingReading] = useState(false);

  // 당겨서 새로고침 기능
  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: () => {
      window.location.reload();
    },
    threshold: 80,
    disabled: false
  });

  // 토스트 및 비동기 처리
  const { addToast } = useToast();

  // 리딩 저장 함수
  const saveReadingAsync = async (readingData: any) => {
    const response = await fetch("/api/readings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(readingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "리딩 저장에 실패했습니다");
    }

    return response.json();
  };

  const { loading: isSaving, execute: saveReading } = useAsync(
    saveReadingAsync,
    {
      showSuccessToast: false,
      showErrorToast: true,
      successMessage: "✨ 리딩이 히스토리에 저장되었습니다",
      errorMessage: "💫 리딩 저장에 실패했습니다",
    }
  );

  // 스크롤 진행률 추적 및 TOP 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(currentProgress, 100));
      
      // 300px 이상 스크롤하면 TOP 버튼 표시
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 카드 생성 with 셔플 애니메이션
  const shuffleCards = async () => {
    // 고유한 셔플 키 생성 (중복 방지)
    const newShuffleKey = Date.now();
    setShuffleKey(newShuffleKey);
    setIsShuffling(true);

    // 먼저 기존 상태 초기화 (한 번에 처리)
    setSelectedCards([]);
    setRevealedCards(new Set());

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 스프레드에 따라 카드 개수 결정 (배수로 맞추기)
    const selectedSpread = SPREADS.find((s) => s.id === spreadType);
    const maxCards = selectedSpread?.cardCount || 1;
    let cardCount;
    if (maxCards === 1) {
      cardCount = 16; // 4열×4줄로 완전히 채우기
    } else if (maxCards === 3) {
      cardCount = 14; // 7열×2줄
    } else if (maxCards === 4) {
      cardCount = 12; // 4열×3줄 또는 6열×2줄
    } else if (maxCards === 5) {
      cardCount = 15; // 5열×3줄
    } else if (spreadType === "celtic-cross") {
      cardCount = 30; // 6열×5줄
    } else {
      cardCount = 20; // 5열×4줄
    }
    const randomCards = drawRandomCards(cardCount);

    // 새 카드 설정
    setAvailableCards(randomCards);

    setTimeout(() => setIsShuffling(false), 800);
  };

  // 카드 선택 처리
  const handleCardClick = (card: TarotCard) => {
    const selectedSpread = SPREADS.find((s) => s.id === spreadType);
    const maxCards = selectedSpread?.cardCount || 1;
    if (selectedCards.length >= maxCards) return;

    setRevealedCards((prev) => new Set([...prev, card.id]));

    setTimeout(() => {
      const drawnCard = drawCardWithPosition(card);
      setSelectedCards((prev) => {
        const updatedCards = [...prev, drawnCard];

        // 1카드 스프레드는 즉시 결과 표시
        const selectedSpread = SPREADS.find((s) => s.id === spreadType);
        const maxCards = selectedSpread?.cardCount || 1;
        if (maxCards === 1 && updatedCards.length === 1) {
          setTimeout(() => {
            // updatedCards를 직접 사용하여 해석 생성
            setPhase("result");
            // 1카드는 여기서 직접 처리하므로 onComplete 호출하지 않음

            // 리딩 저장 (비동기 처리)
            const interpretation = generateSpreadInterpretation(
              spreadType,
              updatedCards,
              question,
              classifyQuestion(question)
            );

            const readingData = {
              question,
              spreadType,
              cards: updatedCards,
              interpretation,
              questionType: classifyQuestion(question),
            };

            // 1카드 전용 저장 (중복 방지)
            saveReadingOnce(readingData);

            // 결과 영역이 보이도록 스크롤
            setTimeout(scrollToTop, 200);
          }, 1000);
        }

        return updatedCards;
      });
    }, 500);
  };

  // 페이지 상단으로 부드럽게 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 중복 방지 리딩 저장 함수
  const saveReadingOnce = async (readingData: any) => {
    if (isSavingReading) {
      console.log('이미 저장 중이므로 스킵');
      return;
    }

    const readingHash = JSON.stringify({
      question: readingData.question,
      cards: readingData.cards.map((c: any) => ({ id: c.id, position: c.is_reversed })),
      spreadType: readingData.spreadType
    });

    if (lastSavedReadingId === readingHash) {
      console.log('동일한 리딩이므로 스킵');
      return;
    }

    setIsSavingReading(true);
    setLastSavedReadingId(readingHash);

    try {
      await saveReading(readingData);
      addToast({
        type: "success",
        title: "저장 완료",
        message: "✨ 리딩이 히스토리에 저장되었습니다",
      });
    } catch (error) {
      console.error('리딩 저장 오류:', error);
      setLastSavedReadingId(null); // 실패시 초기화
    } finally {
      setIsSavingReading(false);
    }
  };

  // 다시 시작
  const resetReading = () => {
    setQuestion("");
    setSelectedCards([]);
    setRevealedCards(new Set());
    setSpreadType("one-card");
    setPhase("spread-selection");
    setLastSavedReadingId(null); // 저장 상태 초기화
    setIsSavingReading(false);

    setTimeout(scrollToTop, 100);
  };

  // 리딩 시작 시에도 스크롤
  const startReading = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      addToast({
        type: "warning",
        title: "질문을 입력해주세요",
        message: "타로 카드에게 궁금한 것을 물어보세요",
      });
      return;
    }

    if (trimmedQuestion.length < 5) {
      addToast({
        type: "warning",
        title: "질문이 너무 짧습니다",
        message: "5글자 이상의 구체적인 질문을 입력해주세요",
      });
      return;
    }

    if (trimmedQuestion.length > 200) {
      addToast({
        type: "warning",
        title: "질문이 너무 깁니다",
        message: "200글자 이내로 간결하게 작성해주세요",
      });
      return;
    }

    addToast({
      type: "info",
      title: "카드를 섞고 있습니다",
      message: "운명의 카드를 준비하는 중...",
      duration: 2000,
    });

    shuffleCards();
    setPhase("selection");

    // 카드 선택 영역으로 부드럽게 스크롤
    setTimeout(scrollToTop, 300);
  };

  // 리딩 완료 시에도 스크롤 조정
  const completeReading = async () => {
    setPhase("result");
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
    const selectedSpread = SPREADS.find((s) => s.id === spreadType);
    const maxCards = selectedSpread?.cardCount || 1;
    if (maxCards > 1) {
      saveReadingOnce(readingData);
    }

    // 결과 영역이 보이도록 스크롤
    setTimeout(scrollToTop, 200);
  };

  return (
    <div className="min-h-screen p-4 relative overflow-x-hidden">
      {/* 당겨서 새로고침 인디케이터 */}
      <AnimatePresence>
        {isPulling && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              y: pullDistance * 0.3, 
              scale: 1 + (pullDistance / 200),
            }}
            exit={{ 
              opacity: 0, 
              y: -50, 
              scale: 0.5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className={`glass-card-dark p-4 rounded-full flex items-center gap-3 ${isRefreshing ? 'text-green-400 bg-green-500/10' : 'text-white/80'}`}
              animate={{
                scale: isRefreshing ? [1, 1.1, 1] : 1,
                boxShadow: isRefreshing 
                  ? ["0 4px 20px rgba(34, 197, 94, 0.3)", "0 8px 40px rgba(34, 197, 94, 0.5)", "0 4px 20px rgba(34, 197, 94, 0.3)"]
                  : `0 4px 20px rgba(168, 85, 247, ${Math.min(pullDistance / 100, 0.4)})`
              }}
              transition={{
                duration: isRefreshing ? 1 : 0.3,
                repeat: isRefreshing ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ 
                  rotate: isRefreshing ? 360 : pullDistance * 2,
                  scale: isRefreshing ? [1, 1.2, 1] : 1 + (pullDistance / 300)
                }}
                transition={{ 
                  rotate: { duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0, ease: "linear" },
                  scale: { duration: isRefreshing ? 1 : 0.2, repeat: isRefreshing ? Infinity : 0 }
                }}
              >
                <ArrowUp className={`w-5 h-5 ${isRefreshing ? 'text-green-400' : ''}`} />
              </motion.div>
              <motion.span 
                className="text-sm font-medium"
                animate={{
                  scale: isRefreshing ? [1, 1.05, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0
                }}
              >
                {isRefreshing ? '🌀 새로고침 중...' : '⬇️ 당겨서 새로고침'}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스크롤 진행 표시기 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 mystic-glow"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <motion.div 
        className="max-w-6xl mx-auto w-full"
        animate={{
          y: isPulling ? pullDistance * 0.1 : 0,
          scale: isPulling ? 1 + (pullDistance / 1000) : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {/* 헤더 - 간소화된 여백 */}
        <header className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl flex items-center justify-center gap-3">
            <Moon className="w-8 h-8 text-blue-300" />
            타로 리딩
            <Moon className="w-8 h-8 text-blue-200 animate-pulse" />
          </h1>
          <p className="text-white/90 text-lg drop-shadow-lg">
            78장으로 알아보는 미래
          </p>
        </header>

        {/* 스프레드 선택 단계 */}
        {phase === "spread-selection" && (
          <div className="glass-card-dark p-6 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              스프레드 선택
            </h2>
            <p className="text-white/80 mb-6">
              질문 성격에 맞는 방식을 선택하세요
            </p>

            {/* 간단한 스프레드 */}
            <div className="mb-6">
              <h3 className="text-lg text-white mb-4">심플 리딩</h3>
              <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {SPREADS.filter((s) => s.category === "simple").map(
                  (spread) => (
                    <SpreadCard
                      key={spread.id}
                      spread={spread}
                      onSelect={() => {
                        setSpreadType(spread.id);
                        setPhase("question");
                        setTimeout(scrollToTop, 300);
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* 중급 스프레드 */}
            <div className="mb-6">
              <h3 className="text-lg text-white mb-4">상세 리딩</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {SPREADS.filter((s) => s.category === "intermediate").map(
                  (spread) => (
                    <SpreadCard
                      key={spread.id}
                      spread={spread}
                      onSelect={() => {
                        setSpreadType(spread.id);
                        setPhase("question");
                        setTimeout(scrollToTop, 300);
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* 고급 스프레드 */}
            <div>
              <h3 className="text-lg text-white mb-4">전문 리딩</h3>
              <div className="grid md:grid-cols-1 gap-4 max-w-2xl mx-auto">
                {SPREADS.filter((s) => s.category === "advanced").map(
                  (spread) => (
                    <SpreadCard
                      key={spread.id}
                      spread={spread}
                      onSelect={() => {
                        setSpreadType(spread.id);
                        setPhase("question");
                        setTimeout(scrollToTop, 300);
                      }}
                      featured={true}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* 질문 입력 단계 */}
        {phase === "question" && (
          <div className="glass-card-dark p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              무엇이 궁금하신가요?
            </h2>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 새로운 직장은 어떨까요?"
                className="w-full p-3 text-lg text-white placeholder-purple-200 glass-input rounded-lg focus:outline-none mb-4"
                onKeyPress={(e) => e.key === "Enter" && startReading()}
              />
              <motion.button
                onClick={startReading}
                whileHover={{ 
                  scale: 1.1,
                  y: -3,
                  boxShadow: "0 8px 25px rgba(168, 85, 247, 0.4)",
                  transition: { 
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
                whileTap={{ 
                  scale: 0.95,
                  y: 0,
                  transition: { duration: 0.1 }
                }}
                className="px-8 py-3 glass-button text-white font-bold rounded-full transition-all"
              >
                카드 뽑기 시작
              </motion.button>
            </div>
          </div>
        )}

        {/* 카드 선택 단계 */}
        {phase === "selection" && (
          <div className="space-y-8">
            {/* 질문 표시 - 통일된 포맷 */}
            <div className="glass-card-dark p-6 text-center">
              <h3 className="text-xl text-white mb-4">당신의 질문</h3>
              <p className="text-white text-2xl font-semibold">
                {`"${question}"`}
              </p>
            </div>

            {/* 선택 진행 상황 - 통일된 포맷 */}
            <div className="text-center">
              {/* 스프레드 타이틀 - 모든 스프레드 동일한 스타일 */}
              <h3 className="text-2xl font-semibold text-white mb-4">
                {isShuffling
                  ? "카드를 섞는 중..."
                  : (() => {
                      const selectedSpread = SPREADS.find(
                        (s) => s.id === spreadType
                      );
                      const maxCards = selectedSpread?.cardCount || 1;
                      return (
                        <>
                          {selectedSpread?.name}
                          <br />
                          아래 카드 중 {maxCards}장을 선택하세요
                        </>
                      );
                    })()}
              </h3>

              {/* 진행 상황 표시 - 모든 스프레드 동일한 스타일 */}
              {(() => {
                const selectedSpread = SPREADS.find((s) => s.id === spreadType);
                const maxCards = selectedSpread?.cardCount || 1;

                return (
                  <>
                    {/* 진행 도트 (모든 스프레드에 표시) */}
                    <div className="flex justify-center gap-2 mb-6 flex-wrap">
                      {Array.from({ length: maxCards }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-full ${
                            index < selectedCards.length
                              ? "bg-yellow-400"
                              : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* 안내 메시지 - 모든 스프레드 동일한 스타일 */}
                    <p className="text-yellow-200 text-lg font-medium mb-6">
                      {selectedCards.length < maxCards
                        ? "마음이 이끄는 카드를 선택하세요"
                        : "🎉 모든 카드를 선택했습니다!"}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* 카드 그리드 */}
            <div className="relative min-h-[300px] md:min-h-[200px] px-8 py-4">
              <div
                className={`${(() => {
                  const selectedSpread = SPREADS.find(
                    (s) => s.id === spreadType
                  );
                  const maxCards = selectedSpread?.cardCount || 1;

                  // 카드 수와 스프레드에 맞는 그리드 설정
                  if (maxCards === 1) {
                    // 14장 → 모바일 4열, 데스크톱 7열로 적절한 간격
                    return "grid grid-cols-4 md:grid-cols-7 gap-3 md:gap-4 justify-items-center max-w-5xl mx-auto";
                  } else if (maxCards === 3) {
                    // 14장 → 모바일 4열, 데스크톱 7열
                    return "grid grid-cols-4 md:grid-cols-7 gap-3 md:gap-4 justify-items-center max-w-5xl mx-auto";
                  } else if (maxCards === 4) {
                    // 12장 → 4열×3줄 = 12장 (4카드용으로 조정)
                    return "grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 justify-items-center max-w-4xl mx-auto";
                  } else if (maxCards === 5) {
                    // 15장 → 5열×3줄 = 15장
                    return "grid grid-cols-5 md:grid-cols-5 gap-3 md:gap-4 justify-items-center max-w-4xl mx-auto";
                  } else if (spreadType === "celtic-cross") {
                    // 30장 → 6열×5줄 = 30장
                    return "grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-3 justify-items-center max-w-4xl mx-auto";
                  } else {
                    // 20장 → 5열×4줄 = 20장
                    return "grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 justify-items-center max-w-4xl mx-auto";
                  }
                })()}`}
              >
                {/* 셔플 애니메이션 */}
                <AnimatePresence>
                  {isShuffling
                    ? Array.from({
                        length: availableCards.length,
                      }).map((_, index) => (
                        <motion.div
                          key={`shuffle-${shuffleKey}-${index}`}
                          layout
                          initial={{
                            opacity: 0,
                            scale: 0.6,
                            rotateY: -180,
                            y: -30,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotateY: 360,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.6,
                            y: 10,
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.03,
                            ease: "easeOut",
                            rotateY: {
                              duration: 0.8,
                              ease: "easeInOut",
                            },
                          }}
                          className={`${
                            spreadType === "celtic-cross"
                              ? "w-16 h-24 lg:w-18 lg:h-28" // 켈틱 크로스용 작은 카드
                              : "w-20 h-32 lg:w-24 lg:h-36" // 일반 카드
                          }`}
                        >
                          {/* 셔플 애니메이션 중 카드 뒷면 */}
                          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
                            <Image
                              src="/card-back-design.png"
                              alt="Card Back"
                              fill
                              sizes="(max-width: 640px) 80px, 96px"
                              className="object-cover rounded-lg"
                              priority
                            />
                          </div>
                        </motion.div>
                      ))
                    : null}
                </AnimatePresence>

                {/* 일반 카드 애니메이션 */}
                <AnimatePresence>
                  {!isShuffling &&
                    availableCards.map((card, index) => (
                        <motion.div
                          key={`card-${shuffleKey}-${card.id}`}
                          layout
                          layoutId={`card-${shuffleKey}-${card.id}`}
                          initial={{
                            opacity: 0,
                            scale: 0.6,
                            rotateX: 90,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                          }}
                          style={{
                            transform: selectedCards.some((sc) => sc.id === card.id) 
                              ? 'translateY(-3px)' 
                              : 'translateY(0)',
                            zIndex: selectedCards.some((sc) => sc.id === card.id) ? 10 : 'auto',
                            transition: 'transform 0.2s ease-out',
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.6,
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.04,
                            ease: "backOut",
                            type: "spring",
                            stiffness: 100,
                          }}
                          whileHover={{
                            scale: 1.08,
                            y: -8,
                            rotate: [0, -2, 2, 0],
                            transition: { 
                              duration: 0.3,
                              type: "spring",
                              stiffness: 300,
                              damping: 10
                            },
                          }}
                          whileTap={{ 
                            scale: 0.9,
                            rotate: 5,
                            transition: { 
                              duration: 0.1,
                              type: "spring",
                              stiffness: 400 
                            }
                          }}
                          className={`relative cursor-pointer ${
                            selectedCards.some((sc) => sc.id === card.id)
                              ? "ring-2 ring-yellow-400 rounded-lg"
                              : ""
                          }`}
                          onClick={() => {
                            const selectedSpread = SPREADS.find(
                              (s) => s.id === spreadType
                            );
                            const maxCards = selectedSpread?.cardCount || 1;

                            if (
                              !selectedCards.some((sc) => sc.id === card.id) &&
                              selectedCards.length < maxCards &&
                              !isShuffling
                            ) {
                              handleCardClick(card);
                            }
                          }}
                        >
                          {/* 카드 */}
                          <div
                            className={`relative ${
                              spreadType === "celtic-cross"
                                ? "w-16 h-24 lg:w-18 lg:h-28" // 켈틱 크로스용 작은 카드
                                : "w-20 h-32 lg:w-24 lg:h-36" // 일반 카드
                            }`}
                          >
                            {/* 뒷면 */}
                            <div
                              className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                                revealedCards.has(card.id)
                                  ? "opacity-0 rotate-y-180"
                                  : "opacity-100"
                              }`}
                            >
                              {/* 카드 뒷면 이미지 */}
                              <div className="w-full h-full rounded-lg overflow-hidden relative">
                                <Image
                                  src="/images/cards/card-back.png"
                                  alt="Card Back"
                                  fill
                                  sizes="96px"
                                  className="object-cover rounded-lg"
                                  priority
                                />
                              </div>
                            </div>

                            {/* 앞면 */}
                            <div
                              className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                                revealedCards.has(card.id)
                                  ? "opacity-100"
                                  : "opacity-0 rotate-y-180"
                              }`}
                            >
                              <Image
                                src={card.image_url}
                                alt={card.name}
                                fill
                                sizes="(max-width: 640px) 80px, 96px"
                                priority={index < 3}
                                loading={index < 3 ? "eager" : "lazy"}
                                placeholder="blur"
                                blurDataURL={getCardBlurDataUrl(card.suit)}
                                className={`object-cover rounded-lg border-2 ${getSuitColor(
                                  card.suit
                                )}`}
                              />
                            </div>
                          </div>

                        </motion.div>
                      ))}
                </AnimatePresence>
              </div>
            </div>

            {/* 완료 버튼 */}
            {(() => {
              const selectedSpread = SPREADS.find((s) => s.id === spreadType);
              const maxCards = selectedSpread?.cardCount || 1;
              return selectedCards.length === maxCards && maxCards > 1;
            })() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-8"
              >
                <motion.button
                  onClick={completeReading}
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    boxShadow: "0 10px 30px rgba(251, 191, 36, 0.4)",
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 10
                    }
                  }}
                  whileTap={{ 
                    scale: 0.9,
                    transition: { duration: 0.1 }
                  }}
                  className="px-8 py-4 glass-button text-white font-bold rounded-full transition-all text-lg"
                >
                  리딩 결과 보기
                </motion.button>
              </motion.div>
            )}

            {/* 다시 섞기 버튼 */}
            <div className="flex justify-center mt-6">
              <motion.button
                onClick={shuffleCards}
                disabled={isShuffling}
                whileHover={isShuffling ? {} : { 
                  scale: 1.05,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 10
                  }
                }}
                whileTap={isShuffling ? {} : { 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                className="px-6 py-2 glass-button text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isShuffling ? "🌀 섞는 중..." : "🔄 카드 다시 섞기"}
              </motion.button>
            </div>
          </div>
        )}

        {/* 결과 단계 */}
        {phase === "result" && (
          <div className="space-y-8">
            <div className="glass-card-dark p-8">
              <h2 className="text-3xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-300" />
                리딩 완료!
                <Sparkles className="w-8 h-8 text-blue-300" />
              </h2>
              <p className="text-white/80 mb-8 text-center">
                {`"${question}"에 대한 답이 여기 있습니다.`}
              </p>

              {/* 선택된 카드들 표시 */}
              <div
                className={`mb-12 ${
                  spreadType === "one-card"
                    ? "flex justify-center"
                    : (() => {
                        const selectedSpread = SPREADS.find(
                          (s) => s.id === spreadType
                        );
                        const cardCount = selectedSpread?.cardCount || 3;

                        if (cardCount >= 10) {
                          // 켈틱크로스 등 많은 카드
                          return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto px-4";
                        } else if (cardCount >= 6) {
                          // 관계 스프레드 등 중간 개수
                          return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto px-4";
                        } else {
                          // 3-5카드
                          return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto px-4";
                        }
                      })()
                }`}
              >
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center w-full max-w-sm mx-auto"
                  >
                    <div className="glass-card-light p-3 md:p-5 h-full min-h-[450px] md:min-h-[500px] flex flex-col shadow-xl">
                      {/* 서브타이틀 */}
                      <h4 className="text-white text-lg font-semibold mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg px-3 py-2 border border-white/10">
                        {spreadType === "one-card"
                          ? "운명의 카드"
                          : (() => {
                              const selectedSpread = SPREADS.find(
                                (s) => s.id === spreadType
                              );
                              return (
                                selectedSpread?.positions[index]?.name ||
                                `${index + 1}번째 카드`
                              );
                            })()}
                      </h4>
                      {/* 카드 이미지 */}
                      <div className="relative w-36 h-52 mx-auto mb-3 flex-shrink-0">
                        <Image
                          src={card.image_url}
                          alt={card.name}
                          fill
                          sizes="(max-width: 640px) 112px, 128px"
                          priority={true}
                          placeholder="blur"
                          blurDataURL={getCardBlurDataUrl(card.suit)}
                          className={`object-cover rounded-lg border-2 ${getSuitColor(
                            card.suit
                          )} ${card.is_reversed ? "rotate-180" : ""}`}
                        />
                        {card.is_reversed && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            역방향
                          </div>
                        )}
                      </div>
                      <h5 className="font-bold text-pink-300 mb-2 text-lg text-center">
                        {card.name}
                      </h5>
                      <p className="text-sm text-white-700 mb-3 leading-relaxed text-center tracking-normal">
                        {card.current_meaning}
                      </p>

                      {/* 위치별 상세 해석 */}
                      <div className="bg-white/70 p-3 rounded-lg mt-3 flex-grow border border-white/30">
                        <p className="text-sm text-gray-800 leading-relaxed font-medium text-justify tracking-normal">
                          {spreadType === "one-card"
                            ? `이 카드는 "${question}"에 대한 직접적인 답변을 제공합니다. ${card.current_interpretation}`
                            : (() => {
                                const selectedSpread = SPREADS.find(
                                  (s) => s.id === spreadType
                                );
                                return (
                                  selectedSpread?.positions[index]
                                    ?.description || card.current_interpretation
                                );
                              })()}
                        </p>
                      </div>

                      {/* 키워드 */}
                      <div className="flex flex-wrap gap-2 justify-center mt-3 flex-shrink-0 min-h-[50px] items-start p-1">
                        {card.current_keywords
                          .slice(0, 3)
                          .map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-700 text-white px-3 py-1.5 rounded-full font-medium shadow-lg border border-purple-500/50 break-words max-w-[120px] text-center leading-tight"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 종합 해석 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-card-dark p-6 md:p-8 mb-8 max-w-6xl mx-auto"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                  <BookAIcon className="w-6 h-6 text-purple-300" />
                  종합 해석
                </h3>
                <div className="text-purple-100 text-base leading-relaxed whitespace-pre-line px-2 md:px-4 text-justify tracking-normal">
                  {generateOverallInterpretation(
                    question,
                    selectedCards,
                    classifyQuestion(question)
                  )}
                </div>

                {/* 추가 인사이트 */}
                {generateKeywordInsights(selectedCards).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/30">
                    <h4 className="text-white font-semibold mb-4 text-lg">
                      ✨ 추가 인사이트
                    </h4>
                    <div className="space-y-2">
                      {generateKeywordInsights(selectedCards).map(
                        (insight, idx) => (
                          <p
                            key={idx}
                            className="text-purple-200 text-sm leading-relaxed px-4 text-justify tracking-normal"
                          >
                            • {insight}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* 공유 및 액션 버튼 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                {/* 공유 버튼 */}
                <ShareButton
                  title={`칠팔 타로 - ${question}`}
                  text={`"${question}"에 대한 타로 리딩 결과를 확인했습니다!`}
                  hashtags={["타로", "타로카드", "운세", "칠팔타로"]}
                />

                {/* 새 질문 버튼 */}
                <motion.button
                  onClick={resetReading}
                  whileHover={{ 
                    scale: 1.1,
                    y: -3,
                    boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)",
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  className="px-8 py-3 glass-button text-white font-bold rounded-full transition-all"
                >
                  새로운 질문하기
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* TOP 버튼 */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: [0, 0, 360],
              transition: {
                rotate: { duration: 0.6, ease: "easeOut" }
              }
            }}
            exit={{ opacity: 0, y: 20, scale: 0 }}
            whileHover={{ 
              scale: 1.2,
              y: -5,
              boxShadow: "0 10px 30px rgba(139, 69, 19, 0.3)",
              transition: { 
                type: "spring",
                stiffness: 400,
                damping: 10
              }
            }}
            whileTap={{ 
              scale: 0.8,
              y: 0,
              transition: { duration: 0.1 }
            }}
            className="fixed bottom-6 right-6 w-12 h-12 glass-button text-white rounded-full flex items-center justify-center z-50 shadow-lg"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
