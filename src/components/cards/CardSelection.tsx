"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard, DrawnCard } from "@/types/tarot";
import { SpreadType, SPREADS } from "@/types/spreads";
import { CARD_BACK_BLUR_DATA_URL, getCardBlurDataUrl } from "@/lib/image-utils";
import { useToast } from "@/components/ui/Toast";
import { useAsync } from "@/hooks/useAsync";
import ShareButton from "@/components/share/ShareButton";
import {
  Moon,
  Sparkles,
  AtomIcon,
  BadgeCheckIcon,
  StarIcon,
  BookAIcon,
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
  const [spreadType, setSpreadType] = useState<SpreadType>("one-card");
  const [phase, setPhase] = useState<
    "spread-selection" | "question" | "selection" | "result"
  >("spread-selection");
  const [scrollProgress, setScrollProgress] = useState(0);

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
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: "✨ 리딩이 히스토리에 저장되었습니다",
      errorMessage: "💫 리딩 저장에 실패했습니다",
    }
  );

  // 스크롤 진행률 추적
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(currentProgress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 카드 생성 with 셔플 애니메이션
  const shuffleCards = async () => {
    setIsShuffling(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 스프레드에 따라 카드 개수 결정
    const selectedSpread = SPREADS.find((s) => s.id === spreadType);
    const maxCards = selectedSpread?.cardCount || 1;
    let cardCount;
    if (maxCards <= 3) {
      cardCount = 14;
    } else if (spreadType === "celtic-cross") {
      cardCount = 30; // 켈틱 크로스는 30장 표시
    } else {
      cardCount = 20;
    }
    const randomCards = drawRandomCards(cardCount);
    setAvailableCards(randomCards);
    setSelectedCards([]);
    setRevealedCards(new Set());

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
            if (onComplete) {
              onComplete(updatedCards);
            }

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

            // 백그라운드에서 저장
            saveReading(readingData);

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

  // 다시 시작
  const resetReading = () => {
    setQuestion("");
    setSelectedCards([]);
    setRevealedCards(new Set());
    setSpreadType("one-card");
    setPhase("spread-selection");

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

    // 백그라운드에서 저장 (사용자는 즉시 결과 확인 가능)
    saveReading(readingData);

    // 결과 영역이 보이도록 스크롤
    setTimeout(scrollToTop, 200);
  };

  return (
    <div className="min-h-screen p-4 relative">
      {/* 스크롤 진행 표시기 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 mystic-glow"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Moon className="w-10 h-10 text-blue-300" />
            </div>
            타로 리딩
            <Moon className="w-10 h-10 text-blue-200 animate-pulse" />
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            78장으로 알아보는 미래
          </p>
        </header>

        {/* 스프레드 선택 단계 */}
        {phase === "spread-selection" && (
          <div className="glass-card-dark p-8 text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">
              타로 스프레드 선택
            </h2>
            <p className="text-white/80 mb-8">
              질문의 성격에 맞는 리딩 방식을 선택하세요
            </p>

            {/* 간단한 스프레드 */}
            <div className="mb-8">
              <h3 className="text-xl text-white mb-6">심플 리딩</h3>
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
            <div className="mb-8">
              <h3 className="text-xl text-white mb-6">상세 리딩</h3>
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
              <h3 className="text-xl text-white mb-6">전문 리딩</h3>
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
          <div className="glass-card-dark p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-6">
              무엇이 궁금하신가요?
            </h2>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 새로운 직장은 어떨까요?"
                className="w-full p-4 text-lg text-white placeholder-purple-200 glass-input rounded-lg focus:outline-none mb-6"
                onKeyPress={(e) => e.key === "Enter" && startReading()}
              />
              <button
                onClick={startReading}
                className="px-8 py-3 glass-button text-white font-bold rounded-full transition-all transform hover:scale-105"
              >
                카드 뽑기 시작
              </button>
            </div>
          </div>
        )}

        {/* 카드 선택 단계 */}
        {phase === "selection" && (
          <div className="space-y-8">
            {/* 질문 표시 */}
            <div className="glass-card-dark p-6 text-center">
              <h3 className="text-xl text-white mb-2">🔮 당신의 질문</h3>
              <p className="text-white/80 text-lg font-medium">
                {`"${question}"`}
              </p>
            </div>

            {/* 선택 진행 상황 */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {isShuffling
                  ? "카드를 섞는 중..."
                  : (() => {
                      const selectedSpread = SPREADS.find(
                        (s) => s.id === spreadType
                      );
                      const maxCards = selectedSpread?.cardCount || 1;
                      return `${selectedSpread?.name} - ${availableCards.length}장 중에서 ${maxCards}장을 선택하세요`;
                    })()}
              </h3>
              {(() => {
                const selectedSpread = SPREADS.find((s) => s.id === spreadType);
                const maxCards = selectedSpread?.cardCount || 1;

                if (maxCards > 1) {
                  return (
                    <>
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
                      <p className="text-purple-200 mb-6">
                        {selectedCards.length < maxCards
                          ? `${selectedCards.length + 1}번째 카드: ${
                              selectedSpread?.positions[selectedCards.length]
                                ?.name || ""
                            } 선택하세요`
                          : "🎉 모든 카드를 선택했습니다!"}
                      </p>
                    </>
                  );
                } else {
                  return (
                    <p className="text-yellow-200 mb-6">
                      {selectedCards.length === 0
                        ? "마음이 이끄는 카드를 선택하세요"
                        : "🎆 카드가 선택되었습니다! 잠시만 기다려주세요..."}
                    </p>
                  );
                }
              })()}
            </div>

            {/* 카드 그리드 */}
            <div className="relative min-h-[300px] md:min-h-[200px] px-4">
              <div
                className={`${(() => {
                  const selectedSpread = SPREADS.find(
                    (s) => s.id === spreadType
                  );
                  const maxCards = selectedSpread?.cardCount || 1;

                  if (maxCards === 1) {
                    return "grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 justify-items-center max-w-3xl mx-auto";
                  } else if (maxCards <= 5) {
                    return "grid grid-cols-4 md:grid-cols-7 lg:grid-cols-7 gap-3 justify-items-center";
                  } else if (spreadType === "celtic-cross") {
                    // 켈틱 크로스 전용 레이아웃: 더 많은 카드 표시
                    return "grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-1.5 justify-items-center";
                  } else {
                    return "grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 justify-items-center";
                  }
                })()}`}
              >
                <AnimatePresence mode="sync">
                  {isShuffling
                    ? // 셔플 애니메이션 표시
                      Array.from({
                        length: availableCards.length,
                      }).map((_, index) => (
                        <motion.div
                          key={`shuffle-${index}`}
                          layout
                          initial={{
                            opacity: 0,
                            scale: 0.3,
                            rotateY: -180,
                            y: -50,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotateY: 360,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: 20,
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
                    : availableCards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          layout
                          layoutId={`card-${card.id}`}
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
                          exit={{
                            opacity: 0,
                            scale: 0.9,
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
                            scale: selectedCards.some((sc) => sc.id === card.id)
                              ? 1
                              : 1.1,
                            y: selectedCards.some((sc) => sc.id === card.id)
                              ? 0
                              : -10,
                            transition: { duration: 0.2 },
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative cursor-pointer ${
                            selectedCards.some((sc) => sc.id === card.id)
                              ? "opacity-50"
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

                          {/* 선택 표시 */}
                          {selectedCards.some((sc) => sc.id === card.id) && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                              {selectedCards.findIndex(
                                (sc) => sc.id === card.id
                              ) + 1}
                            </div>
                          )}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass-button text-white font-bold rounded-full transition-all text-lg"
                >
                  리딩 결과 보기
                </motion.button>
              </motion.div>
            )}

            {/* 다시 섞기 버튼 */}
            <div className="text-center">
              <motion.button
                onClick={shuffleCards}
                disabled={isShuffling}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                  hashtags={['타로', '타로카드', '운세', '칠팔타로']}
                />
                
                {/* 새 질문 버튼 */}
                <motion.button
                  onClick={resetReading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 glass-button text-white font-bold rounded-full transition-all"
                >
                  새로운 질문하기
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
