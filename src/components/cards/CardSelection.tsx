"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard, DrawnCard } from "@/types/tarot";
import { 
  allTarotCards, 
  drawRandomCards, 
  drawCardWithPosition 
} from "@/data/all-tarot-cards";

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


interface CardSelectionProps {
  onComplete?: (selectedCards: DrawnCard[]) => void;
}

export default function CardSelection({ onComplete }: CardSelectionProps) {
  const [question, setQuestion] = useState("");
  const [availableCards, setAvailableCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [phase, setPhase] = useState<"question" | "selection" | "result">(
    "question"
  );

  // 14장 랜덤 카드 생성 with 셔플 애니메이션
  const shuffleCards = async () => {
    // 먼저 셔플 상태로 변경하고 기존 카드들을 페이드 아웃
    setIsShuffling(true);
    
    // 짧은 딜레이로 애니메이션 전환 시간 확보
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 새 카드 생성
    const randomCards = drawRandomCards(14);
    setAvailableCards(randomCards);
    setSelectedCards([]);
    setRevealedCards(new Set());
    
    // 셔플 애니메이션 종료
    setTimeout(() => setIsShuffling(false), 800);
  };

  // 카드 선택 처리
  const handleCardClick = (card: TarotCard) => {
    if (selectedCards.length >= 3) return;

    // 카드 공개
    setRevealedCards((prev) => new Set([...prev, card.id]));

    // 0.5초 후 선택된 카드에 추가
    setTimeout(() => {
      const drawnCard = drawCardWithPosition(card);
      setSelectedCards((prev) => [...prev, drawnCard]);
    }, 500);
  };

  // 리딩 시작
  const startReading = () => {
    if (!question.trim()) {
      alert("질문을 입력해주세요!");
      return;
    }
    shuffleCards();
    setPhase("selection");
  };

  // 리딩 완료
  const completeReading = () => {
    setPhase("result");
    if (onComplete) {
      onComplete(selectedCards);
    }
  };

  // 다시 시작
  const resetReading = () => {
    setQuestion("");
    setSelectedCards([]);
    setRevealedCards(new Set());
    setPhase("question");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔮 칠팔 타로 리딩 🔮
          </h1>
          <p className="text-purple-200 text-lg">
            마음의 질문을 품고 운명의 카드를 선택하세요
          </p>
        </header>

        {/* 질문 입력 단계 */}
        {phase === "question" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-6">
              🌟 무엇이 궁금하신가요? 🌟
            </h2>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 새로운 직장은 어떨까요?"
                className="w-full p-4 text-lg rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none mb-6"
                onKeyPress={(e) => e.key === "Enter" && startReading()}
              />
              <button
                onClick={startReading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                ✨ 카드 뽑기 시작 ✨
              </button>
            </div>
          </div>
        )}

        {/* 카드 선택 단계 */}
        {phase === "selection" && (
          <div className="space-y-8">
            {/* 질문 표시 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <h3 className="text-xl text-white mb-2">🔮 당신의 질문</h3>
              <p className="text-purple-200 text-lg font-medium">
                {`"${question}"`}
              </p>
            </div>

            {/* 선택 진행 상황 */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {isShuffling ? "카드를 섞는 중..." : "운명이 보여준 14장 중에서 3장을 선택하세요"}
              </h3>
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
                {selectedCards.length === 3 && "🎉 모든 카드를 선택했습니다!"}
              </p>
            </div>

            {/* 카드 그리드 */}
            <div className="relative min-h-[300px] md:min-h-[200px] px-4">
              <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-7 gap-3 justify-items-center">
              <AnimatePresence mode="sync">
              {isShuffling ? (
                // 셔플 애니메이션 표시
                Array.from({ length: 14 }).map((_, index) => (
                  <motion.div
                    key={`shuffle-${index}`}
                    layout
                    initial={{ 
                      opacity: 0, 
                      scale: 0.3,
                      rotateY: -180,
                      y: -50
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: 360,
                      y: 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8,
                      y: 20,
                      transition: { duration: 0.2 }
                    }}
                    transition={{ 
                      duration: 0.6,
                      delay: index * 0.03,
                      ease: "easeOut",
                      rotateY: {
                        duration: 0.8,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-20 h-32 lg:w-24 lg:h-36"
                  >
                    {/* 셔플 애니메이션 중 카드 뒷면 */}
                    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
                      <Image
                        src="/images/cards/card-back.png"
                        alt="Card Back"
                        fill
                        sizes="96px"
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
              availableCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={`card-${card.id}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.6,
                    rotateX: 90
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateX: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.9,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.04,
                    ease: "backOut",
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: selectedCards.some((sc) => sc.id === card.id) ? 1 : 1.1,
                    y: selectedCards.some((sc) => sc.id === card.id) ? 0 : -10,
                    transition: { duration: 0.2 }
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
                      selectedCards.length < 3 &&
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
                        sizes="96px"
                        className={`object-cover rounded-lg border-2 ${getSuitColor(
                          card.suit
                        )}`}
                        priority={index < 3}
                      />
                    </div>
                  </div>

                  {/* 선택 표시 */}
                  {selectedCards.some((sc) => sc.id === card.id) && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedCards.findIndex((sc) => sc.id === card.id) + 1}
                    </div>
                  )}
                </motion.div>
              ))
              )}
              </AnimatePresence>
              </div>
            </div>

            {/* 완료 버튼 */}
            {selectedCards.length === 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={completeReading}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  🔮 리딩 결과 보기 🔮
                </button>
              </div>
            )}

            {/* 다시 섞기 버튼 */}
            <div className="text-center">
              <motion.button
                onClick={shuffleCards}
                disabled={isShuffling}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isShuffling ? "🌀 섞는 중..." : "🔄 카드 다시 섞기"}
              </motion.button>
            </div>
          </div>
        )}

        {/* 결과 단계 */}
        {phase === "result" && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🌟 리딩 완료! 🌟
              </h2>
              <p className="text-purple-200 mb-6">
                {`"${question}"에 대한 답이 여기 있습니다.`}
              </p>

              {/* 선택된 카드들 표시 */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {selectedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="text-center"
                  >
                    <h4 className="text-white text-lg font-semibold mb-2">
                      {["과거", "현재", "미래"][index]}
                    </h4>
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      {/* 카드 이미지 */}
                      <div className="relative w-32 h-48 mx-auto mb-3">
                        <Image
                          src={card.image_url}
                          alt={card.name}
                          fill
                          sizes="128px"
                          className={`object-cover rounded-lg border-2 ${getSuitColor(card.suit)} ${
                            card.is_reversed ? "rotate-180" : ""
                          }`}
                          priority
                        />
                        {card.is_reversed && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            역방향
                          </div>
                        )}
                      </div>
                      <h5 className="font-bold text-gray-800 mb-2">
                        {card.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        {card.current_meaning}
                      </p>
                      <p className="text-xs text-gray-500">
                        {card.current_interpretation}
                      </p>
                      {/* 키워드 */}
                      <div className="flex flex-wrap gap-1 justify-center mt-3">
                        {card.current_keywords.slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={resetReading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                🔮 새로운 질문하기 🔮
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
