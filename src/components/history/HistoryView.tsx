"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/share/ShareButton";
import {
  BookOpen,
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  Heart as Health,
  Star,
  Brain,
} from "lucide-react";
import RadixSelect from "@/components/ui/RadixSelect";

interface ReadingRecord {
  _id: string;
  question: string;
  spreadType: "three-card" | "one-card";
  cards: Array<{
    id: number;
    name: string;
    suit: string;
    image_url: string;
    is_reversed: boolean;
    current_meaning: string;
  }>;
  interpretation: string;
  questionType: string;
  createdAt: string;
}

interface ReadingStats {
  totalReadings: number;
  questionTypes: { [key: string]: number };
  spreadTypes: { [key: string]: number };
  favoriteCards: Array<{
    cardId: number;
    name: string;
    suit: string;
    count: number;
  }>;
  recentActivity: Array<{
    question: string;
    questionType: string;
    spreadType: string;
    createdAt: string;
  }>;
}

export default function HistoryView() {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState<ReadingRecord | null>(
    null
  );
  const [currentPage] = useState(1);
  const [filter, setFilter] = useState({ type: "all", spread: "all" });

  useEffect(() => {
    loadReadings();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  const loadReadings = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "6",
        ...(filter.type !== "all" && { type: filter.type }),
        ...(filter.spread !== "all" && { spread: filter.spread }),
      });

      const response = await fetch(`/api/readings?${params}`);
      const data = await response.json();

      if (data.success) {
        setReadings(data.data.readings);
      }
    } catch (error) {
      console.error("Failed to load readings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/readings/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const deleteReading = async (id: string) => {
    if (!confirm("이 리딩을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReadings((prev) => prev.filter((r) => r._id !== id));
        setSelectedReading(null);
        loadStats(); // 통계 새로고침
      }
    } catch (error) {
      console.error("Failed to delete reading:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours < 1 ? "방금 전" : `${hours}시간 전`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR");
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, { icon: any; label: string }> = {
      love: { icon: Heart, label: "연애" },
      career: { icon: Briefcase, label: "직업" },
      money: { icon: DollarSign, label: "재물" },
      health: { icon: Health, label: "건강" },
      general: { icon: Star, label: "일반" },
    };
    const typeData = labels[type] || labels["general"];
    const IconComponent = typeData.icon;
    return (
      <span className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {typeData.label}
      </span>
    );
  };

  const getSpreadTypeLabel = (spreadType: string) => {
    const labels: Record<string, string> = {
      "one-card": "원카드",
      "three-card": "3카드",
      "celtic-cross": "켈틱크로스",
      relationship: "관계",
      "love-spread": "연애",
      "career-path": "경력",
      "yes-no": "결정도움",
    };
    return labels[spreadType] || spreadType;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4 text-purple-300 animate-pulse" />
          <p>히스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold dawn-text-primary mb-4 drop-shadow-2xl flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 dawn-text-sub" />
            타로 히스토리
            <BookOpen className="w-8 h-8 dawn-text-accent animate-pulse" />
          </h1>
          <p className="dawn-text-secondary text-lg drop-shadow-lg">
            당신의 신비로운 타로 여정을 돌아보세요
          </p>
        </header>

        {/* 통계 카드 */}
        {stats && (
          <div className="dawn-container">
            <div className="grid grid-cols-2 md:grid-cols-4 dawn-card-spacing mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dawn-glass-card-light text-center"
              >
                <div className="text-2xl font-bold dawn-text-primary">
                  {stats.totalReadings}
                </div>
                <div className="dawn-text-secondary text-sm">총 리딩</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="dawn-glass-card-light text-center"
              >
                <div className="text-2xl font-bold dawn-text-primary">
                  {Object.values(stats.questionTypes).reduce(
                    (a, b) => Math.max(a, b),
                    0
                  )}
                </div>
                <div className="dawn-text-secondary text-sm">
                  {Object.keys(stats.questionTypes).reduce(
                    (a, b) =>
                      stats.questionTypes[a] > stats.questionTypes[b] ? a : b,
                    "general"
                  ) === "general"
                    ? "일반"
                    : Object.keys(stats.questionTypes).reduce((a, b) =>
                        stats.questionTypes[a] > stats.questionTypes[b] ? a : b
                      )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="dawn-glass-card-light text-center"
              >
                <div className="text-2xl font-bold dawn-text-primary">
                  {stats.favoriteCards[0]?.count || 0}회
                </div>
                <div className="dawn-text-secondary text-sm">
                  {stats.favoriteCards[0]?.name ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>최다 카드</span>
                      <span className="text-xs dawn-text-accent font-medium">
                        {stats.favoriteCards[0].name}
                      </span>
                    </div>
                  ) : (
                    "최다 카드"
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="dawn-glass-card-light text-center"
              >
                <div className="text-2xl font-bold dawn-text-primary">
                  {stats.spreadTypes["one-card"] || 0}
                </div>
                <div className="dawn-text-secondary text-sm">원카드 리딩</div>
              </motion.div>
            </div>
          </div>
        )}

        {/* 필터 */}
        <div className="dawn-container mb-8">
          {/* 필터 박스 */}
          <div className="dawn-glass-card-light">
            <div className="flex flex-col sm:flex-row items-center justify-center dawn-card-spacing">
              {/* 질문 유형 */}
              <div className="w-fit">
                <RadixSelect
                  value={filter.type}
                  onChange={(value) =>
                    setFilter((prev) => ({ ...prev, type: value }))
                  }
                  options={[
                    { value: "love", label: "연애", icon: "•" },
                    { value: "career", label: "직업", icon: "•" },
                    { value: "money", label: "재물", icon: "•" },
                    { value: "health", label: "건강", icon: "•" },
                    { value: "general", label: "일반", icon: "•" },
                    { value: "all", label: "전체 유형", icon: "✓" },
                  ]}
                  placeholder="질문유형"
                />
              </div>

              {/* 스프레드 타입 */}
              <div className="w-fit">
                <RadixSelect
                  value={filter.spread}
                  onChange={(value) =>
                    setFilter((prev) => ({ ...prev, spread: value }))
                  }
                  options={[
                    { value: "one-card", label: "원카드", icon: "•" },
                    { value: "three-card", label: "3카드", icon: "•" },
                    { value: "celtic-cross", label: "켈틱크로스", icon: "•" },
                    { value: "relationship", label: "관계", icon: "•" },
                    { value: "love-spread", label: "연애스프레드", icon: "•" },
                    { value: "career-path", label: "커리어패스", icon: "•" },
                    { value: "yes-no", label: "결정도움", icon: "•" },
                    { value: "all", label: "전체 타입", icon: "✓" },
                  ]}
                  placeholder="스프레드타입"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 리딩 목록 */}
        <div className="dawn-container">
          {readings.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl dawn-text-primary mb-3">
                아직 리딩 기록이 없습니다
              </h3>
              <p className="dawn-text-secondary mb-8">
                첫 번째 타로 리딩을 시작해보세요!
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="dawn-btn-primary text-lg"
                >
                  타로 리딩 시작하기
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 dawn-card-spacing">
              {readings.map((reading, index) => (
                <motion.div
                  key={reading._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="dawn-glass-card cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedReading(reading)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full font-bold">
                      {getSpreadTypeLabel(reading.spreadType)}
                    </span>
                    <span className="text-xs dawn-text-muted">
                      {formatDate(reading.createdAt)}
                    </span>
                  </div>

                  <h3 className="dawn-text-primary font-semibold mb-3 line-clamp-2">
                    {reading.question.length > 40
                      ? reading.question.substring(0, 40) + "..."
                      : reading.question}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs dawn-text-secondary">
                      {getQuestionTypeLabel(reading.questionType)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {reading.cards?.slice(0, 3).map((card, idx) => {
                      if (!card || !card.name) return null;

                      return (
                        <div
                          key={idx}
                          className="relative w-8 h-12"
                        >
                          <Image
                            src={card.image_url || "/images/cards/card-back.png"}
                            alt={card.name}
                            fill
                            className={`object-cover rounded border ${
                              card.is_reversed ? "rotate-180" : ""
                            }`}
                            sizes="32px"
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 상세 모달 */}
        <AnimatePresence>
          {selectedReading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
              onClick={() => setSelectedReading(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="dawn-glass-card max-w-3xl w-full mx-2 md:mx-0 max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 헤더 - 고정 */}
                <div className="p-6 border-b border-purple-400/20 flex-shrink-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-500/20 dawn-text-point px-3 py-1.5 rounded-full text-sm font-medium border border-pink-400/30">
                          {getSpreadTypeLabel(selectedReading.spreadType)} 리딩
                        </span>
                        <span className="text-sm dawn-text-muted">
                          {formatDate(selectedReading.createdAt)}
                        </span>
                      </div>
                      <h2 className="text-base dawn-text-secondary leading-relaxed break-words line-clamp-2">
                        {selectedReading.question.length > 60 
                          ? `${selectedReading.question.substring(0, 60)}...` 
                          : selectedReading.question}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="dawn-text-muted hover:dawn-text-primary p-2 rounded-full hover:bg-white/10 transition-all flex-shrink-0 self-start"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 컨텐츠 - 스크롤 가능 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6 p-6">
                    {/* 카드 섹션 */}
                    <div className="space-y-4">
                      {selectedReading.cards?.map((card, idx) => {
                        if (!card || !card.name) return null;

                        return (
                          <div
                            key={idx}
                            className="flex gap-4 p-4 dawn-glass-card-light hover:border-pink-400/30 transition-all"
                          >
                            <div className="relative w-16 h-24 flex-shrink-0">
                              <Image
                                src={
                                  card.image_url ||
                                  "/images/cards/card-back.png"
                                }
                                alt={card.name}
                                fill
                                className={`object-cover rounded-lg shadow-sm ${
                                  card.is_reversed ? "rotate-180" : ""
                                }`}
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold dawn-text-primary mb-2 flex items-center gap-2 flex-wrap text-sm">
                                <span className="break-words">{card.name}</span>
                                {card.is_reversed && (
                                  <span className="dawn-text-accent text-xs bg-yellow-500/20 px-2 py-1 rounded-full flex-shrink-0 border border-yellow-400/30">
                                    역방향
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs dawn-text-secondary leading-relaxed break-words line-clamp-3">
                                {card.current_meaning ||
                                  "해석 정보가 없습니다."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 종합 해석 */}
                    <div className="dawn-glass-card-light">
                      <h4 className="font-semibold dawn-text-primary mb-3 text-base flex items-center gap-2">
                        <Brain className="w-4 h-4 dawn-text-sub" />
                        <span>종합 해석</span>
                      </h4>
                      <p className="dawn-text-secondary whitespace-pre-line leading-relaxed break-words text-sm max-h-32 overflow-y-auto custom-scrollbar">
                        {selectedReading.interpretation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 - 고정 */}
                <div className="p-6 border-t border-purple-400/20 dawn-glass-card-light flex-shrink-0">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* 공유 버튼 */}
                    <ShareButton
                      title={`칠팔 타로 - ${selectedReading.question}`}
                      text={`"${selectedReading.question}"에 대한 과거 타로 리딩 결과입니다.`}
                      hashtags={['타로', '타로기록', '운세', '칠팔타로']}
                    />
                    
                    {/* 액션 버튼들 */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => deleteReading(selectedReading._id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white rounded-lg transition-all font-medium text-sm"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setSelectedReading(null)}
                        className="dawn-btn-primary text-sm"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
