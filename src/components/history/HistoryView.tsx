"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Dot, Heart, Briefcase, DollarSign, Heart as Health, Star } from "lucide-react";

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
  const [selectedReading, setSelectedReading] = useState<ReadingRecord | null>(null);
  const [currentPage] = useState(1);
  const [filter, setFilter] = useState({ type: 'all', spread: 'all' });

  useEffect(() => {
    loadReadings();
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  const loadReadings = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '6',
        ...(filter.type !== 'all' && { type: filter.type }),
        ...(filter.spread !== 'all' && { spread: filter.spread })
      });

      const response = await fetch(`/api/readings?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReadings(data.data.readings);
      }
    } catch (error) {
      console.error('Failed to load readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/readings/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const deleteReading = async (id: string) => {
    if (!confirm('이 리딩을 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setReadings(prev => prev.filter(r => r._id !== id));
        setSelectedReading(null);
        loadStats(); // 통계 새로고침
      }
    } catch (error) {
      console.error('Failed to delete reading:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours < 1 ? '방금 전' : `${hours}시간 전`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, { icon: any, label: string }> = {
      love: { icon: Heart, label: '연애' },
      career: { icon: Briefcase, label: '직업' },
      money: { icon: DollarSign, label: '재물' },
      health: { icon: Health, label: '건강' },
      general: { icon: Star, label: '일반' }
    };
    const typeData = labels[type] || labels['general'];
    const IconComponent = typeData.icon;
    return (
      <span className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {typeData.label}
      </span>
    );
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
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mystic-text-gradient mb-4 drop-shadow-2xl flex items-center justify-center gap-4">
            <BookOpen className="w-10 h-10 text-purple-300" />
            타로 히스토리
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            당신의 신비로운 타로 여정을 돌아보세요
          </p>
        </header>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-dark p-6 text-center"
            >
              <div className="text-2xl font-bold text-white">{stats.totalReadings}</div>
              <div className="text-purple-200 text-sm">총 리딩</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-dark p-6 text-center"
            >
              <div className="text-2xl font-bold text-white">
                {Object.values(stats.questionTypes).reduce((a, b) => Math.max(a, b), 0)}
              </div>
              <div className="text-purple-200 text-sm">
                {Object.keys(stats.questionTypes).reduce((a, b) => 
                  stats.questionTypes[a] > stats.questionTypes[b] ? a : b, 'general'
                ) === 'general' ? '일반' : 
                Object.keys(stats.questionTypes).reduce((a, b) => 
                  stats.questionTypes[a] > stats.questionTypes[b] ? a : b
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-dark p-6 text-center"
            >
              <div className="text-2xl font-bold text-white">
                {stats.favoriteCards[0]?.count || 0}
              </div>
              <div className="text-purple-200 text-sm">최다 카드</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-dark p-6 text-center"
            >
              <div className="text-2xl font-bold text-white">
                {stats.spreadTypes['one-card'] || 0}
              </div>
              <div className="text-purple-200 text-sm">원카드 리딩</div>
            </motion.div>
          </div>
        )}

        {/* 필터 */}
        <div className="glass-card-dark p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-white text-sm mr-2">질문 유형:</label>
              <select 
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                className="glass-input text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              >
                <option value="all">전체</option>
                <option value="love">연애</option>
                <option value="career">직업</option>
                <option value="money">재물</option>
                <option value="health">건강</option>
                <option value="general">일반</option>
              </select>
            </div>
            
            <div>
              <label className="text-white text-sm mr-2">스프레드:</label>
              <select 
                value={filter.spread}
                onChange={(e) => setFilter(prev => ({ ...prev, spread: e.target.value }))}
                className="glass-input text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              >
                <option value="all">전체</option>
                <option value="one-card">원카드</option>
                <option value="three-card">3카드</option>
              </select>
            </div>
          </div>
        </div>

        {/* 리딩 목록 */}
        {readings.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl text-white mb-2">아직 리딩 기록이 없습니다</h3>
            <p className="text-purple-200 mb-6">첫 번째 타로 리딩을 시작해보세요!</p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-button text-white font-bold rounded-full transition-all text-lg"
              >
                타로 리딩 시작하기
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readings.map((reading, index) => (
              <motion.div
                key={reading._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card-light p-6 cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedReading(reading)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Dot className="w-3 h-3" />
                    {reading.spreadType === 'one-card' ? '원카드' : '3카드'}
                  </span>
                  <span className="text-xs text-purple-300">
                    {formatDate(reading.createdAt)}
                  </span>
                </div>
                
                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                  {reading.question.length > 40 
                    ? reading.question.substring(0, 40) + '...' 
                    : reading.question
                  }
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-purple-200">
                    {getQuestionTypeLabel(reading.questionType)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {reading.cards.slice(0, 3).map((card, idx) => (
                    <div key={idx} className="relative w-8 h-12">
                      <Image
                        src={card.image_url}
                        alt={card.name}
                        fill
                        className={`object-cover rounded border ${
                          card.is_reversed ? 'rotate-180' : ''
                        }`}
                        sizes="32px"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 상세 모달 */}
        <AnimatePresence>
          {selectedReading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedReading(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card-light max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-purple-900">
                      {selectedReading.question}
                    </h2>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-white/20 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-purple-200/80 text-purple-800 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                      <Dot className="w-3 h-3" />
                      {selectedReading.spreadType === 'one-card' ? '원카드 리딩' : '과거-현재-미래 리딩'}
                    </span>
                    <span className="ml-2 text-sm text-purple-600">
                      {formatDate(selectedReading.createdAt)}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 mb-6">
                    {selectedReading.cards.map((card, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-white/40 rounded-lg backdrop-blur-sm border border-white/30">
                        <div className="relative w-16 h-24 flex-shrink-0">
                          <Image
                            src={card.image_url}
                            alt={card.name}
                            fill
                            className={`object-cover rounded ${
                              card.is_reversed ? 'rotate-180' : ''
                            }`}
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">
                            {card.name}
                            {card.is_reversed && <span className="text-red-500 ml-2">(역방향)</span>}
                          </h4>
                          <p className="text-sm text-purple-800">
                            {card.current_meaning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white/50 p-6 rounded-lg mb-6 backdrop-blur-sm border border-white/30">
                    <h4 className="font-semibold text-purple-900 mb-3 text-lg">🔮 종합 해석</h4>
                    <p className="text-sm text-purple-900 whitespace-pre-line leading-relaxed">
                      {selectedReading.interpretation}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => deleteReading(selectedReading._id)}
                      className="px-6 py-3 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all backdrop-blur-sm font-medium"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="px-6 py-3 glass-button text-white rounded-lg transition-all font-medium"
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