"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard, DrawnCard } from "@/types/tarot";
import { CARD_BACK_BLUR_DATA_URL, getCardBlurDataUrl } from "@/lib/image-utils";
import { useToast } from "@/components/ui/Toast";
import { useAsync } from "@/hooks/useAsync";
import {
  Moon,
  Sparkles,
  Dot,
  AtomIcon,
  BadgeCheckIcon,
  StarIcon,
  BookAIcon,
} from "lucide-react";
import { drawRandomCards, drawCardWithPosition } from "@/data/all-tarot-cards";
import {
  classifyQuestion,
  generatePositionInterpretation,
  generateOverallInterpretation,
  generateKeywordInsights,
} from "@/lib/tarot-interpretation";

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
  const [spreadType, setSpreadType] = useState<"three-card" | "one-card">(
    "three-card"
  );
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

    // 스프레드 유형에 따라 카드 개수 결정 - 원카드도 여러 장 표시
    const cardCount = spreadType === "one-card" ? 10 : 14;
    const randomCards = drawRandomCards(cardCount);
    setAvailableCards(randomCards);
    setSelectedCards([]);
    setRevealedCards(new Set());

    setTimeout(() => setIsShuffling(false), 800);
  };

  // 카드 선택 처리
  const handleCardClick = (card: TarotCard) => {
    const maxCards = spreadType === "one-card" ? 1 : 3;
    if (selectedCards.length >= maxCards) return;

    setRevealedCards((prev) => new Set([...prev, card.id]));

    setTimeout(() => {
      const drawnCard = drawCardWithPosition(card);
      setSelectedCards((prev) => [...prev, drawnCard]);

      // 원카드는 즉시 결과 표시
      if (spreadType === "one-card") {
        setTimeout(() => completeReading(), 1000);
      }
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
    setSpreadType("three-card");
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
    const interpretation = generateOverallInterpretation(
      question,
      selectedCards,
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
          <h1 className="text-5xl font-bold mystic-text-gradient mb-4 drop-shadow-2xl flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Moon className="w-10 h-10 text-yellow-300" />
            </div>
            칠팔 타로 리딩
            <Moon className="w-10 h-10 text-white-300 animate-pulse" />
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            신비로운 별빛 아래에서 운명의 카드를 선택하세요
          </p>
        </header>

        {/* 스프레드 선택 단계 */}
        {phase === "spread-selection" && (
          <div className="glass-card-dark p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-6">
              리딩 스타일 선택
            </h2>
            <p className="text-purple-200 mb-8">
              어떤 방식으로 카드를 띄고 싶으신가요?
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* 원카드 리딩 */}
              <motion.div
                onClick={() => {
                  setSpreadType("one-card");
                  setPhase("question");
                  setTimeout(scrollToTop, 300);
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-light p-6 cursor-pointer border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all hover:backdrop-blur-xl"
              >
                <div className="mb-4">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <BadgeCheckIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  원카드 리딩
                </h3>
                <p className="text-yellow-200 text-sm mb-4">
                  빠르고 간단한 답변을 원할 때
                </p>
                <ul className="text-yellow-100 text-xs space-y-1">
                  <li>• 오늘의 운세는?</li>
                  <li>• 지금 집중해야 할 것은?</li>
                  <li>• 예/아니오 질문</li>
                </ul>
                <div className="mt-4 text-yellow-300 text-sm font-medium">
                  약 1분 소요
                </div>
              </motion.div>

              {/* 3카드 리딩 */}
              <motion.div
                onClick={() => {
                  setSpreadType("three-card");
                  setPhase("question");
                  setTimeout(scrollToTop, 300);
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-light p-6 cursor-pointer border-2 border-purple-400/30 hover:border-purple-400/60 transition-all hover:backdrop-blur-xl"
              >
                <div className="mb-4">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <AtomIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  과거-현재-미래 리딩
                </h3>
                <p className="text-purple-200 text-sm mb-4">
                  상세하고 종합적인 해석을 원할 때
                </p>
                <ul className="text-purple-100 text-xs space-y-1">
                  <li>• 인생의 중요한 결정</li>
                  <li>• 복잡한 상황 분석</li>
                  <li>• 깊이 있는 통찰</li>
                </ul>
                <div className="mt-4 text-purple-300 text-sm font-medium">
                  약 3-5분 소요
                </div>
              </motion.div>
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
              <p className="text-purple-200 text-lg font-medium">
                {`"${question}"`}
              </p>
            </div>

            {/* 선택 진행 상황 */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {isShuffling
                  ? "카드를 섞는 중..."
                  : spreadType === "one-card"
                  ? "10장 중에서 운명의 카드 1장을 선택하세요"
                  : "운명이 보여준 14장 중에서 3장을 선택하세요"}
              </h3>
              {spreadType === "three-card" && (
                <>
                  <div className="flex justify-center gap-2 mb-6">
                    {[0, 1, 2].map((index) => (
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
                    {selectedCards.length === 0 &&
                      "첫 번째 카드를 선택하세요 (과거)"}
                    {selectedCards.length === 1 &&
                      "두 번째 카드를 선택하세요 (현재)"}
                    {selectedCards.length === 2 &&
                      "마지막 카드를 선택하세요 (미래)"}
                    {selectedCards.length === 3 &&
                      "🎉 모든 카드를 선택했습니다!"}
                  </p>
                </>
              )}

              {spreadType === "one-card" && (
                <p className="text-yellow-200 mb-6">
                  {selectedCards.length === 0
                    ? "마음이 이끌리는 카드를 선택하세요"
                    : "🎆 카드가 선택되었습니다! 잠시만 기다려주세요..."}
                </p>
              )}
            </div>

            {/* 카드 그리드 */}
            <div className="relative min-h-[300px] md:min-h-[200px] px-4">
              <div
                className={`${
                  spreadType === "one-card"
                    ? "grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 justify-items-center max-w-3xl mx-auto"
                    : "grid grid-cols-4 md:grid-cols-7 lg:grid-cols-7 gap-3 justify-items-center"
                }`}
              >
                <AnimatePresence mode="sync">
                  {isShuffling
                    ? // 셔플 애니메이션 표시
                      Array.from({
                        length: spreadType === "one-card" ? 10 : 14,
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
                          className="w-20 h-32 lg:w-24 lg:h-36"
                        >
                          {/* 셔플 애니메이션 중 카드 뒷면 */}
                          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
                            <Image
                              src="/card-back-design.png"
                              alt="Card Back"
                              fill
                              sizes="(max-width: 640px) 80px, 96px"
                              className="object-cover rounded-lg"
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={CARD_BACK_BLUR_DATA_URL}
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
                            if (
                              !selectedCards.some((sc) => sc.id === card.id) &&
                              selectedCards.length <
                                (spreadType === "one-card" ? 1 : 3) &&
                              !isShuffling
                            ) {
                              handleCardClick(card);
                            }
                          }}
                        >
                          {/* 카드 */}
                          <div className="w-20 h-32 lg:w-24 lg:h-36 relative">
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
            {((spreadType === "three-card" && selectedCards.length === 3) ||
              (spreadType === "one-card" && selectedCards.length === 1)) &&
              spreadType === "three-card" && (
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
                <Sparkles className="w-8 h-8 text-yellow-300" />
                리딩 완료!
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </h2>
              <p className="text-purple-200 mb-8 text-center">
                {`"${question}"에 대한 답이 여기 있습니다.`}
              </p>

              {/* 선택된 카드들 표시 */}
              <div
                className={`mb-12 ${
                  spreadType === "one-card"
                    ? "flex justify-center"
                    : "grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
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
                    <h4 className="text-white text-xl font-semibold mb-4 drop-shadow-lg">
                      {spreadType === "one-card"
                        ? "운명의 카드"
                        : ["과거", "현재", "미래"][index]}
                    </h4>
                    <div className="glass-card-light p-6 h-full min-h-[480px] flex flex-col shadow-xl">
                      {/* 카드 이미지 */}
                      <div className="relative w-36 h-52 mx-auto mb-4 flex-shrink-0">
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
                      <h5 className="font-bold text-black-900 mb-3 text-lg">
                        {card.name}
                      </h5>
                      <p className="text-sm text-black-700 mb-4 leading-relaxed text-justify-center tracking-normal">
                        {card.current_meaning}
                      </p>

                      {/* 위치별 상세 해석 */}
                      <div className="bg-white/50 p-4 rounded-lg mt-4 flex-grow backdrop-blur-sm border border-white/30">
                        <p className="text-sm text-purple-900 leading-relaxed font-medium text-justify tracking-normal">
                          {spreadType === "one-card"
                            ? `이 카드는 "${question}"에 대한 직접적인 답변을 제공합니다. ${card.current_interpretation}`
                            : generatePositionInterpretation(
                                card,
                                ["past", "present", "future"][index] as
                                  | "past"
                                  | "present"
                                  | "future",
                                classifyQuestion(question)
                              )}
                        </p>
                      </div>

                      {/* 키워드 */}
                      <div className="flex flex-wrap gap-2 justify-center mt-4 flex-shrink-0">
                        {card.current_keywords
                          .slice(0, 3)
                          .map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1.5 rounded-full font-medium backdrop-blur-sm shadow-lg border border-purple-400/30"
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
                className="glass-card-dark p-8 mb-8 max-w-4xl mx-auto"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                  <BookAIcon className="w-6 h-6 text-purple-300" />
                  종합 해석
                </h3>
                <div className="text-purple-100 text-base leading-relaxed whitespace-pre-line px-4 text-justify tracking-normal">
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

              <div className="text-center mt-8">
                <motion.button
                  onClick={resetReading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 glass-button text-white font-bold rounded-full transition-all text-lg"
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
