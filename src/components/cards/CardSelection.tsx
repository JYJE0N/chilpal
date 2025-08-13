"use client";

import { useState } from "react";
import { majorArcanaCards } from "@/data/major-arcana";
import { cupsCards } from "@/data/cups-minor-arcana";
import { pentaclesCards } from "@/data/pentacles-minor-arcana";
import { swordsCards } from "@/data/swords-minor-arcana";
import { wandsCards } from "@/data/wands-minor-arcana";

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

// 샘플 카드 데이터 (실제로는 allTarotCards에서 가져옴)
const sampleCards: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    suit: "major",
    upright_meaning: "새로운 시작, 순수함, 모험",
    upright_interpretation: "새로운 여정이 시작됩니다.",
    upright_keywords: ["새로운 시작", "모험"],
    has_reversal: true,
    image_url: "/images/cards/major/00-fool.png",
  },
  {
    id: 1,
    name: "The Magician",
    suit: "major",
    upright_meaning: "의지력, 창조, 실현",
    upright_interpretation: "당신에게 필요한 모든 도구가 있습니다.",
    upright_keywords: ["의지력", "창조"],
    has_reversal: true,
    image_url: "/images/cards/major/01-magician.png",
  },
  {
    id: 22,
    name: "Ace of Cups",
    suit: "cups",
    number: 1,
    upright_meaning: "새로운 사랑, 감정의 시작",
    upright_interpretation: "새로운 감정적 경험이 시작됩니다.",
    upright_keywords: ["새로운 사랑", "기쁨"],
    has_reversal: false,
    image_url: "/images/cards/minor/cups/ace-cups.png",
  },
  {
    id: 36,
    name: "Ace of Pentacles",
    suit: "pentacles",
    number: 1,
    upright_meaning: "새로운 기회, 물질적 시작",
    upright_interpretation: "새로운 사업 기회가 찾아옵니다.",
    upright_keywords: ["새로운 기회", "번영"],
    has_reversal: false,
    image_url: "/images/cards/minor/pentacles/ace-pentacles.png",
  },
  {
    id: 50,
    name: "Ace of Swords",
    suit: "swords",
    number: 1,
    upright_meaning: "새로운 아이디어, 정신적 명료함",
    upright_interpretation: "새로운 통찰이 떠오릅니다.",
    upright_keywords: ["새로운 아이디어", "명료함"],
    has_reversal: false,
    image_url: "/images/cards/minor/swords/ace-swords.png",
  },
  {
    id: 64,
    name: "Ace of Wands",
    suit: "wands",
    number: 1,
    upright_meaning: "새로운 시작, 창조적 영감",
    upright_interpretation: "창조적 에너지가 솟아납니다.",
    upright_keywords: ["창조적 영감", "열정"],
    has_reversal: false,
    image_url: "/images/cards/minor/wands/ace-wands.png",
  },
  {
    id: 21,
    name: "The World",
    suit: "major",
    upright_meaning: "완성, 성취, 완전함",
    upright_interpretation: "긴 여정이 성공적으로 마무리됩니다.",
    upright_keywords: ["완성", "성취"],
    has_reversal: true,
    image_url: "/images/cards/major/21-world.png",
  },
];

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

// 카드를 DrawnCard로 변환하는 함수
const drawCardWithPosition = (card: TarotCard): DrawnCard => {
  const isReversed = card.has_reversal ? Math.random() < 0.5 : false;

  return {
    ...card,
    position: isReversed ? "reversed" : "upright",
    is_reversed: isReversed,
    current_meaning: isReversed
      ? card.reversed_meaning || card.upright_meaning
      : card.upright_meaning,
    current_interpretation: isReversed
      ? card.reversed_interpretation || card.upright_interpretation
      : card.upright_interpretation,
    current_keywords: isReversed
      ? card.reversed_keywords || card.upright_keywords
      : card.upright_keywords,
  };
};

interface CardSelectionProps {
  onComplete?: (selectedCards: DrawnCard[]) => void;
}

export default function CardSelection({ onComplete }: CardSelectionProps) {
  const [question, setQuestion] = useState("");
  const [availableCards, setAvailableCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<"question" | "selection" | "result">(
    "question"
  );

  // 7장 랜덤 카드 생성
  const shuffleCards = () => {
    // 모든 카드를 합치기
    const allCards = [
      ...majorArcanaCards,
      ...cupsCards,
      ...pentaclesCards,
      ...swordsCards,
      ...wandsCards
    ];
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    setAvailableCards(shuffled.slice(0, 7));
    setSelectedCards([]);
    setRevealedCards(new Set());
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
                운명이 보여준 7장 중에서 3장을 선택하세요
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
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 justify-items-center">
              {availableCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`relative transition-all duration-300 ${
                    selectedCards.some((sc) => sc.id === card.id)
                      ? "opacity-50 scale-90"
                      : revealedCards.has(card.id)
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:scale-105"
                  }`}
                  onClick={() => {
                    if (
                      !selectedCards.some((sc) => sc.id === card.id) &&
                      selectedCards.length < 3
                    ) {
                      handleCardClick(card);
                    }
                  }}
                >
                  {/* 카드 */}
                  <div className="w-24 h-36 relative">
                    {/* 뒷면 */}
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                        revealedCards.has(card.id)
                          ? "opacity-0 rotate-y-180"
                          : "opacity-100"
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg border-2 border-yellow-400 flex items-center justify-center">
                        <span className="text-yellow-400 text-xl">🌙</span>
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
                      <img
                        src={card.image_url}
                        alt={card.name}
                        className={`w-full h-full object-cover rounded-lg border-2 ${getSuitColor(
                          card.suit
                        )}`}
                      />
                    </div>
                  </div>

                  {/* 선택 표시 */}
                  {selectedCards.some((sc) => sc.id === card.id) && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedCards.findIndex((sc) => sc.id === card.id) + 1}
                    </div>
                  )}
                </div>
              ))}
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
              <button
                onClick={shuffleCards}
                className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all"
              >
                🔄 카드 다시 섞기
              </button>
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
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className={`w-full h-full object-cover rounded-lg border-2 ${getSuitColor(card.suit)} ${
                            card.is_reversed ? "rotate-180" : ""
                          }`}
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
