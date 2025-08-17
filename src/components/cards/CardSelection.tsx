"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DrawnCard } from "@/types/tarot";
import { useReadingState } from "@/hooks/useReadingState";
import { useToast } from "@/components/ui/Toast";
import { useAsync } from "@/hooks/useAsync";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import SpreadSelector from "./SpreadSelector";
import QuestionInput from "./QuestionInput";
import CardGrid from "./CardGrid";
import ReadingResult from "./ReadingResult";

interface CardSelectionProps {
  onComplete?: (selectedCards: DrawnCard[]) => void;
}

export default function CardSelection({ onComplete }: CardSelectionProps) {
  const { state, dispatch } = useReadingState();

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
      throw new Error("리딩 저장에 실패했습니다");
    }

    return response.json();
  };

  const { execute: saveReading } = useAsync(
    saveReadingAsync,
    {
      showSuccessToast: true,
      successMessage: "리딩이 저장되었습니다",
    }
  );

  // 당겨서 새로고침 기능
  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: () => {
      window.location.reload();
    },
    threshold: 100,
  });

  // 페이지 로드 및 phase 변경 시 스크롤 최상단으로 이동 (타이밍 이슈 해결)
  useEffect(() => {
    // 브라우저 체크
    if (typeof window === 'undefined') return;
    
    // 지연 실행으로 렌더링 완료 후 스크롤
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [state.phase]); // phase가 변경될 때마다 실행

  // Pull state를 reducer에 동기화
  useEffect(() => {
    dispatch({
      type: 'SET_PULL_STATE',
      payload: { isPulling, pullDistance, isRefreshing }
    });
  }, [isPulling, pullDistance, isRefreshing, dispatch]);

  // 스크롤 진행률 추적 및 TOP 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      dispatch({ type: 'SET_SCROLL_PROGRESS', payload: Math.min(currentProgress, 100) });
      
      // 300px 이상 스크롤하면 TOP 버튼 표시
      dispatch({ type: 'SET_SHOW_TOP_BUTTON', payload: window.scrollY > 300 });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // 중복 방지 리딩 저장 함수
  const saveReadingOnce = async (readingData: any) => {
    if (state.isSavingReading) {
      console.log('이미 저장 중이므로 스킵');
      return;
    }

    const readingHash = JSON.stringify({
      question: readingData.question,
      cards: readingData.cards.map((c: any) => ({ id: c.id, position: c.is_reversed })),
      spreadType: readingData.spreadType
    });

    if (state.lastSavedReadingId === readingHash) {
      console.log('동일한 리딩이므로 스킵');
      return;
    }

    dispatch({ type: 'SET_IS_SAVING_READING', payload: true });
    dispatch({ type: 'SET_LAST_SAVED_READING_ID', payload: readingHash });

    try {
      const result = await saveReading(readingData);
      // 저장된 리딩의 ID를 state에 저장
      if (result && result.data && result.data._id) {
        dispatch({ type: 'SET_SAVED_READING_ID', payload: result.data._id });
      }
      // useAsync에서 자동으로 토스트를 띄우므로 여기서는 제거
    } catch (error) {
      console.error('리딩 저장 오류:', error);
      dispatch({ type: 'SET_LAST_SAVED_READING_ID', payload: null }); // 실패시 초기화
    } finally {
      dispatch({ type: 'SET_IS_SAVING_READING', payload: false });
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 당겨서 새로고침 인디케이터 */}
      <AnimatePresence>
        {state.isPulling && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              y: state.pullDistance * 0.3, 
              scale: 1 + (state.pullDistance / 200),
            }}
            exit={{ 
              opacity: 0, 
              y: -50, 
              scale: 0.5,
              transition: { duration: 0.2 }
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30"
          >
            <motion.div
              animate={{ rotate: state.isRefreshing ? 360 : 0 }}
              transition={{ 
                duration: state.isRefreshing ? 1 : 0.3, 
                repeat: state.isRefreshing ? Infinity : 0,
                ease: "linear" 
              }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스크롤 진행 바 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${state.scrollProgress}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      </div>

      {/* 페이즈별 컴포넌트 렌더링 */}
      <AnimatePresence mode="wait">
        {state.phase === "spread-selection" && (
          <motion.div
            key="spread-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <SpreadSelector
              selectedSpread={state.spreadType}
              dispatch={dispatch}
            />
          </motion.div>
        )}

        {state.phase === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionInput
              question={state.question}
              spreadType={state.spreadType}
              currentPlaceholder={state.currentPlaceholder}
              dispatch={dispatch}
            />
          </motion.div>
        )}

        {state.phase === "selection" && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <CardGrid
              question={state.question}
              spreadType={state.spreadType}
              availableCards={state.availableCards}
              selectedCards={state.selectedCards}
              revealedCards={state.revealedCards}
              isShuffling={state.isShuffling}
              shuffleKey={state.shuffleKey}
              dispatch={dispatch}
              onComplete={onComplete}
              saveReadingOnce={saveReadingOnce}
            />
          </motion.div>
        )}

        {state.phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ReadingResult
              question={state.question}
              spreadType={state.spreadType}
              selectedCards={state.selectedCards}
              showTopButton={state.showTopButton}
              dispatch={dispatch}
              readingId={state.savedReadingId || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}