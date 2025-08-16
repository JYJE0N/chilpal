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
  Lightbulb,
  Zap,
  Clock,
  Cross,
  Users,
  HelpCircle,
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
    current_interpretation?: string;
    current_keywords?: string[];
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
    // 필터 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const labels: Record<string, { icon: any; label: string }> = {
      "one-card": { icon: Zap, label: "원카드" },
      "three-card": { icon: Clock, label: "3카드" },
      "celtic-cross": { icon: Cross, label: "켈틱크로스" },
      relationship: { icon: Users, label: "관계" },
      "love-spread": { icon: Heart, label: "연애" },
      "career-path": { icon: Briefcase, label: "경력" },
      "yes-no": { icon: HelpCircle, label: "결정도움" },
    };
    const typeData = labels[spreadType] || { icon: Sparkles, label: spreadType };
    const IconComponent = typeData.icon;
    return (
      <span className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {typeData.label}
      </span>
    );
  };

  const getCardPositionLabel = (index: number, spreadType: string): string => {
    switch (spreadType) {
      case "three-card":
        return ["과거", "현재", "미래"][index] || `카드 ${index + 1}`;
      case "one-card":
        return "답변";
      case "celtic-cross":
        return [
          "현재 상황", 
          "도전 과제", 
          "먼 과거", 
          "가까운 과거", 
          "가능한 미래", 
          "가까운 미래", 
          "당신의 접근", 
          "외부 영향", 
          "희망과 두려움", 
          "최종 결과"
        ][index] || `카드 ${index + 1}`;
      case "love-spread":
        return ["현재 감정", "상대의 마음", "관계의 장애물", "필요한 것", "연애운"][index] || `카드 ${index + 1}`;
      case "career-path":
        return ["현재 위치", "강점", "약점", "기회", "조언"][index] || `카드 ${index + 1}`;
      case "relationship":
        return ["당신", "상대방", "당신의 감정", "상대의 감정", "관계의 현재", "관계의 미래"][index] || `카드 ${index + 1}`;
      case "yes-no":
        return ["현재 상황", "선택의 결과", "고려할 점", "최선의 길"][index] || `카드 ${index + 1}`;
      default:
        return `카드 ${index + 1}`;
    }
  };

  const formatInterpretation = (interpretation: string): string => {
    // 질문 부분과 개별 카드 해석, 메시지 제거하고 핵심 결론만 추출
    let formatted = interpretation;
    
    // 불필요한 패턴들 제거
    const unnecessaryPatterns = [
      // 질문 관련
      /질문:\s*.*?(?=\n|$)/gi,
      /문의\s*내용:\s*.*?(?=\n|$)/gi,
      /\".*?\"에\s*대한\s*(?:답변|해석|결과)[은는:]*\s*/gi,
      /^.*?에\s*대해\s*(?:말씀|설명|해석)드리[면겠자면]*\s*/gi,
      /^.*?(?:질문|문의)하신\s*내용에\s*대해\s*/gi,
      
      // 개별 카드 해석 (이미 위에서 표시됨)
      /\d+\.\s*.*?:\s*.*?(?=\n\d+\.|$)/gi,
      /과거:\s*.*?(?=\n현재:|\n미래:|$)/gi,
      /현재:\s*.*?(?=\n미래:|$)/gi,
      /미래:\s*.*?(?=\n|$)/gi,
      
      // 카드명 반복
      /^.*?카드[가는]*\s*나타내는\s*/gi,
      /^.*?카드의\s*의미[는]*\s*/gi,
      
      // 키워드 반복 (이미 위에서 표시됨)
      /키워드:\s*.*?(?=\n|$)/gi,
      /주요\s*키워드[는:]*\s*.*?(?=\n|$)/gi,
      
      // 불필요한 메시지 제거
      /.*?타로.*?메시지.*?(?=\n|$)/gi,
      /.*?우주.*?메시지.*?(?=\n|$)/gi,
      /.*?전하고\s*있습니다.*?(?=\n|$)/gi,
      /.*?말하고\s*있습니다.*?(?=\n|$)/gi,
      /.*?보여주고\s*있습니다.*?(?=\n|$)/gi,
      /.*?알려주고\s*있습니다.*?(?=\n|$)/gi,
      /.*?가르쳐주고\s*있습니다.*?(?=\n|$)/gi
    ];
    
    unnecessaryPatterns.forEach(pattern => {
      formatted = formatted.replace(pattern, '');
    });
    
    // 종합/결론 부분만 추출
    const conclusionPatterns = [
      /(?:종합|결론|전체적으로|핵심|요약)[적으로]*[은는:]*\s*(.*?)$/i,
      /(?:따라서|그러므로|결국|결론적으로)\s*(.*?)$/i,
      /(?:조언|권장|제안).*?:\s*(.*?)$/i
    ];
    
    for (const pattern of conclusionPatterns) {
      const match = formatted.match(pattern);
      if (match && match[1] && match[1].trim().length > 20) {
        formatted = match[1].trim();
        break;
      }
    }
    
    // 앞뒤 공백 및 불필요한 문자 제거
    formatted = formatted
      .replace(/^\s*[-•*]\s*/gm, '') // 리스트 마커 제거
      .replace(/\n\s*\n/g, '\n') // 빈 줄 제거
      .replace(/.*?메시지.*?/gi, '') // 메시지 관련 문장 제거
      .trim();
    
    // 너무 짧으면 원본의 마지막 문장들 사용
    if (formatted.length < 30) {
      const sentences = interpretation.split(/[.!?]+/).filter(s => s.trim().length > 10);
      formatted = sentences.slice(-2).join('. ').trim();
      if (formatted) formatted += '.';
    }
    
    return formatted || interpretation;
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-info" />
            타로 히스토리
            <BookOpen className="w-8 h-8 text-accent animate-pulse" />
          </h1>
          <p className="text-secondary text-lg">
            당신의 신비로운 타로 여정을 돌아보세요
          </p>
        </header>

        {/* 통계 카드 */}
        {stats && (
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">통계</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-light text-center"
              >
                <div className="text-2xl font-bold text-primary">
                  {stats.totalReadings}
                </div>
                <div className="text-secondary text-sm">총 리딩</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card-light text-center"
              >
                <div className="text-2xl font-bold text-primary">
                  {Object.values(stats.questionTypes).reduce(
                    (a, b) => Math.max(a, b),
                    0
                  )}
                </div>
                <div className="text-secondary text-sm">
                  최다 질문
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card-light text-center"
              >
                <div className="text-2xl font-bold text-primary">
                  {stats.favoriteCards[0]?.count || 0}회
                </div>
                <div className="text-secondary text-sm">
                  {stats.favoriteCards[0]?.name ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>최다 카드</span>
                      <span className="text-xs text-accent font-medium">
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
                className="glass-card-light text-center"
              >
                <div className="text-2xl font-bold text-primary">
                  {stats.spreadTypes["one-card"] || 0}
                </div>
                <div className="text-secondary text-sm">원카드 리딩</div>
              </motion.div>
            </div>
          </section>
        )}

        {/* 필터 */}
        <div className="glass-card">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 overflow-hidden">
            {/* 질문 유형 */}
            <RadixSelect
              value={filter.type}
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, type: value }))
              }
              options={[
                { value: "love", label: "연애" },
                { value: "career", label: "직업" },
                { value: "money", label: "재물" },
                { value: "health", label: "건강" },
                { value: "general", label: "일반" },
                { value: "all", label: "전체 유형" },
              ]}
              placeholder="질문 유형 선택"
              className="flex-1 min-w-[120px] max-w-[200px]"
            />

            {/* 스프레드 타입 */}
            <RadixSelect
              value={filter.spread}
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, spread: value }))
              }
              options={[
                { value: "one-card", label: "원카드" },
                { value: "three-card", label: "3카드" },
                { value: "celtic-cross", label: "켈틱크로스" },
                { value: "relationship", label: "관계" },
                { value: "love-spread", label: "연애스프레드" },
                { value: "career-path", label: "커리어패스" },
                { value: "yes-no", label: "결정도움" },
                { value: "all", label: "전체 타입" },
              ]}
              placeholder="스프레드 타입 선택"
              className="flex-1 min-w-[120px] max-w-[200px]"
            />
          </div>
        </div>

        {/* 리딩 목록 */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-6 text-center">리딩 기록</h2>
          {readings.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl text-primary mb-3">
                아직 리딩 기록이 없습니다
              </h3>
              <p className="text-secondary mb-8">
                첫 번째 타로 리딩을 시작해보세요!
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg"
                >
                  타로 리딩 시작하기
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {readings.map((reading, index) => (
                <motion.div
                  key={reading._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-light cursor-pointer transition-all hover:border-purple-400/40"
                  onClick={() => setSelectedReading(reading)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-1 rounded-full font-medium">
                          {getSpreadTypeLabel(reading.spreadType)}
                        </span>
                        <span className="text-xs text-secondary">
                          {getQuestionTypeLabel(reading.questionType)}
                        </span>
                      </div>
                      <span className="text-xs text-muted">
                        {formatDate(reading.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-primary font-medium mb-2 line-clamp-1">
                      {reading.question.length > 60
                        ? reading.question.substring(0, 60) + "..."
                        : reading.question}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {reading.cards?.slice(0, reading.spreadType === 'one-card' ? 1 : 3).map((card, idx) => {
                          if (!card || !card.name) return null;

                          return (
                            <div
                              key={idx}
                              className="relative w-7 h-10"
                              title={card.name}
                            >
                              <Image
                                src={card.image_url || "/images/cards/card-back.png"}
                                alt={card.name}
                                fill
                                className={`object-cover rounded border border-purple-400/30 ${
                                  card.is_reversed ? "rotate-180" : ""
                                }`}
                                sizes="28px"
                              />
                              {card.is_reversed && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full border border-white/50" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-accent hover:text-point transition-colors">
                        자세히 보기 →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

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
                className="glass-card max-w-3xl w-full mx-1 md:mx-0 max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 헤더 - 고정 */}
                <div className="p-3 md:p-6 border-b border-purple-400/20 flex-shrink-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-point px-3 py-1.5 rounded-full text-sm font-medium border border-pink-400/30">
                          {getSpreadTypeLabel(selectedReading.spreadType)} 리딩
                        </span>
                        <span className="text-sm text-muted">
                          {formatDate(selectedReading.createdAt)}
                        </span>
                      </div>
                      <h2 className="text-base text-secondary leading-relaxed break-words line-clamp-1">
                        {selectedReading.question.length > 40
                          ? `${selectedReading.question.substring(0, 40)}...` 
                          : selectedReading.question}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="text-muted hover:text-primary p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0 self-start"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 컨텐츠 - 스크롤 가능 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4 md:space-y-6 p-3 md:p-6">
                    {/* 카드 섹션 */}
                    <div className="space-y-4">
                      {selectedReading.cards?.map((card, idx) => {
                        if (!card || !card.name) return null;
                        const positionLabel = getCardPositionLabel(idx, selectedReading.spreadType);

                        return (
                          <div key={idx} className="glass-card-light">
                            {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4">
                              <div className="relative w-20 h-28 md:w-16 md:h-24 flex-shrink-0 mx-auto md:mx-0">
                                <Image
                                  src={card.image_url || "/images/cards/card-back.png"}
                                  alt={card.name}
                                  fill
                                  className={`object-cover rounded-lg shadow-sm ${
                                    card.is_reversed ? "rotate-180" : ""
                                  }`}
                                  sizes="64px"
                                />
                                {/* 역방향 표시 */}
                                {card.is_reversed && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border border-white/50" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0 space-y-2 md:space-y-3 text-center md:text-left">
                                {/* 카드명 */}
                                <div>
                                  {/* 모바일: 세로 배치 */}
                                  <div className="block md:hidden text-center">
                                    {/* 스프레드 위치 */}
                                    {selectedReading.spreadType !== "one-card" && positionLabel && (
                                      <span className="text-xs font-medium text-accent bg-purple-500/20 px-2 py-1 rounded border border-purple-400/30 inline-block mb-1">
                                        {positionLabel}
                                      </span>
                                    )}
                                    {/* 카드명과 역방향 표시 */}
                                    <h4 className="font-semibold text-primary text-base flex items-center justify-center gap-2">
                                      <span>{card.name}</span>
                                      {card.is_reversed && (
                                        <span className="text-white text-xs bg-red-500 px-2 py-1 rounded-full font-medium shadow-sm">
                                          역
                                        </span>
                                      )}
                                    </h4>
                                  </div>
                                  
                                  {/* 데스크톱: 가로 배치 */}
                                  <h4 className="hidden md:flex font-semibold text-primary text-base mb-1 items-center gap-2">
                                    {/* 스프레드 위치 말머리 */}
                                    {selectedReading.spreadType !== "one-card" && positionLabel && (
                                      <span className="text-xs font-medium text-accent bg-purple-500/20 px-2 py-1 rounded border border-purple-400/30">
                                        {positionLabel}
                                      </span>
                                    )}
                                    <span>{card.name}</span>
                                    {card.is_reversed && (
                                      <span className="text-white text-xs bg-red-500 px-2 py-1 rounded-full font-medium shadow-sm">
                                        역
                                      </span>
                                    )}
                                  </h4>
                                </div>
                                
                                {(() => {
                                  // 키워드와 해석을 올바르게 분리
                                  let keywords = card.current_keywords || [];
                                  let interpretation = card.current_interpretation || card.current_meaning || "";
                                  
                                  // current_keywords가 없고 current_meaning에 키워드가 포함된 경우 분리
                                  if (!keywords.length && card.current_meaning && card.current_meaning.includes('키워드:')) {
                                    const parts = card.current_meaning.split('키워드:');
                                    if (parts.length > 1) {
                                      interpretation = parts[0].trim();
                                      const keywordText = parts[1].trim();
                                      keywords = keywordText.split(/[,、\s]+/).filter(k => k.trim().length > 0).slice(0, 4);
                                    }
                                  }
                                  
                                  // 해석에서 키워드 패턴 및 불필요한 부분 제거
                                  interpretation = interpretation
                                    .replace(/키워드:\s*.*?(?=\n|$)/gi, '')
                                    .replace(/주요\s*키워드[는:]*\s*.*?(?=\n|$)/gi, '')
                                    .replace(/^.*?의미:\s*/gi, '') // "의미:" 접두사 제거
                                    .replace(/^.*?해석:\s*/gi, '') // "해석:" 접두사 제거
                                    .trim();
                                  
                                  // 해석이 키워드 나열식이면 서술형으로 변환
                                  if (interpretation && interpretation.length < 50 && !interpretation.includes('.') && !interpretation.includes('니다')) {
                                    const cardAction = card.is_reversed ? '주의하라고' : '나아가라고';
                                    interpretation = `이 카드는 당신에게 ${interpretation} 상황에서 ${cardAction} 말하고 있습니다.`;
                                  }
                                  
                                  return (
                                    <>
                                      {/* 키워드 표시 */}
                                      {keywords.length > 0 && (
                                        <div>
                                          <h5 className="text-xs font-medium text-muted heading-sm">키워드</h5>
                                          <div className="flex flex-wrap gap-1">
                                            {keywords.map((keyword, kidx) => (
                                              <span
                                                key={kidx}
                                                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                                              >
                                                {keyword.trim()}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* 서술형 해석 */}
                                      <div>
                                        <h5 className="text-xs font-medium text-muted heading-sm">
                                          {card.is_reversed ? "역방향 해석" : "정방향 해석"}
                                        </h5>
                                        <p className="text-sm text-secondary leading-relaxed break-words paragraph">
                                          {interpretation || "해석 정보가 없습니다."}
                                        </p>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 종합 해석 */}
                    <div className="glass-card-light">
                      <h4 className="font-semibold text-yellow-400 mb-3 text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        핵심결론
                      </h4>
                      <p className="text-secondary whitespace-pre-line leading-relaxed break-words text-sm max-h-40 overflow-y-auto custom-scrollbar">
                        {formatInterpretation(selectedReading.interpretation)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 - 고정 */}
                <div className="p-3 md:p-6 border-t border-purple-400/20 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                  {/* 공유 버튼 */}
                  <ShareButton
                    title={`칠팔 타로 - ${selectedReading.question}`}
                    text={`"${selectedReading.question}"에 대한 타로 리딩 결과입니다. 뽑힌 카드들이 전하는 특별한 메시지를 확인해보세요!`}
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/reading/${selectedReading._id}`}
                    hashtags={['타로', '타로기록', '운세', '칠팔타로', selectedReading.questionType]}
                  />
                  
                  {/* 액션 버튼들 */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => deleteReading(selectedReading._id)}
                      className="btn-danger btn-sm"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="btn-primary btn-sm"
                    >
                      닫기
                    </button>
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
