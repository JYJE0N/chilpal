"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Zap, Clock, Cross, Users, Heart, Briefcase, HelpCircle } from "lucide-react";
import { SPREADS, SpreadType } from "@/types/spreads";
import { ReadingDispatch } from "@/hooks/useReadingState";
// drawRandomCards는 동적 import로 로드
import { DrawnCard } from "@/types/tarot";

// 질문 예시 배열 (랜덤 노출용)
const QUESTION_EXAMPLES = [
  "다시 재회할 수 있을까요?",
  "먼저 연락할까요?",
  "연락이 올까요?",
  "이직할까요?",
  "새로운 직장은 어떨까요?",
  "이번 투자는 어떨까요?",
  "건강은 괜찮을까요?",
  "이 관계가 발전할까요?",
  "새로운 시작이 올까요?",
  "지금 상황이 나아질까요?",
  "운명의 상대를 만날 수 있을까요?",
  "창업을 해도 될까요?",
  "이사를 가도 될까요?",
  "고백을 해도 될까요?",
  "새로운 취미를 시작할까요?"
];

interface QuestionInputProps {
  question: string;
  spreadType: SpreadType;
  currentPlaceholder: string;
  dispatch: ReadingDispatch;
}

export default function QuestionInput({ 
  question, 
  spreadType, 
  currentPlaceholder, 
  dispatch 
}: QuestionInputProps) {
  const [localQuestion, setLocalQuestion] = useState(question);
  const selectedSpread = SPREADS.find((s) => s.id === spreadType);

  // 플레이스홀더 로테이션
  useEffect(() => {
    const randomExample = QUESTION_EXAMPLES[Math.floor(Math.random() * QUESTION_EXAMPLES.length)];
    dispatch({ type: 'SET_CURRENT_PLACEHOLDER', payload: randomExample });

    const interval = setInterval(() => {
      const randomExample = QUESTION_EXAMPLES[Math.floor(Math.random() * QUESTION_EXAMPLES.length)];
      dispatch({ type: 'SET_CURRENT_PLACEHOLDER', payload: randomExample });
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const shuffleCards = async () => {
    // 고유한 셔플 키 생성 (중복 방지)
    const newShuffleKey = Date.now();
    dispatch({ type: 'SET_SHUFFLE_KEY', payload: newShuffleKey });
    dispatch({ type: 'SET_SHUFFLING', payload: true });

    // 먼저 기존 상태 초기화 (한 번에 처리)
    dispatch({ type: 'RESET_SELECTED_CARDS' });
    dispatch({ type: 'RESET_REVEALED_CARDS' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 스프레드에 따라 카드 개수 결정 (배수로 맞추기)
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

  const handleContinue = () => {
    if (!localQuestion.trim()) return;
    
    dispatch({ type: 'SET_QUESTION', payload: localQuestion });
    dispatch({ type: 'SET_PHASE', payload: 'selection' });
    shuffleCards();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'spread-selection' });
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* 상단 네비게이션 */}
      <div className="flex justify-start items-center mb-4 pt-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">뒤로</span>
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-start pt-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center mx-auto"
        >

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-3 flex justify-center"
        >
          {(() => {
            const getSpreadIcon = (type: SpreadType) => {
              switch (type) {
                case "one-card":
                  return <Zap className="w-12 h-12 text-yellow-400" />;
                case "three-card":
                  return <Clock className="w-12 h-12 text-blue-400" />;
                case "celtic-cross":
                  return <Cross className="w-12 h-12 text-purple-400" />;
                case "relationship":
                  return <Users className="w-12 h-12 text-green-400" />;
                case "love-spread":
                  return <Heart className="w-12 h-12 text-pink-400" />;
                case "career-path":
                  return <Briefcase className="w-12 h-12 text-orange-400" />;
                case "yes-no":
                  return <HelpCircle className="w-12 h-12 text-indigo-400" />;
                default:
                  return <Sparkles className="w-12 h-12 text-purple-400" />;
              }
            };
            return getSpreadIcon(spreadType);
          })()}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          {selectedSpread?.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-6 text-sm"
        >
          {selectedSpread?.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <label className="block text-white text-lg font-medium mb-3">
              타로에게 묻고 싶은 질문을 입력하세요
            </label>
            <textarea
              value={localQuestion}
              onChange={(e) => setLocalQuestion(e.target.value)}
              placeholder={currentPlaceholder}
              className="w-full h-32 p-4 bg-black/30 border border-purple-400/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none backdrop-blur-sm"
              maxLength={200}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {localQuestion.length}/200
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinue}
            disabled={!localQuestion.trim()}
            className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            카드 섞기
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
}