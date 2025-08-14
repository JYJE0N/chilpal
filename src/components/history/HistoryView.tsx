"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
    const fetchData = async () => {
      await loadReadings();
      await loadStats();
    };
    fetchData();
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
    const labels = {
      love: '💕 연애',
      career: '💼 직업',
      money: '💰 재물',
      health: '🏥 건강',
      general: '🌟 일반'
    };
    return labels[type] || '🌟 일반';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🔮</div>
          <p>히스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📚 리딩 히스토리
          </h1>
          <p className="text-purple-200 text-lg">
            당신의 타로 여정을 돌아보세요
          </p>
        </header>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">{stats.totalReadings}</div>
              <div className="text-purple-200 text-sm">총 리딩</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
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
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
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
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">
                {stats.spreadTypes['one-card'] || 0}
              </div>
              <div className="text-purple-200 text-sm">원카드 리딩</div>
            </motion.div>
          </div>
        )}

        {/* 필터 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-white text-sm mr-2">질문 유형:</label>
              <select 
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                className="bg-white/20 text-white rounded px-3 py-1 text-sm"
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
                className="bg-white/20 text-white rounded px-3 py-1 text-sm"
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
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl text-white mb-2">아직 리딩 기록이 없습니다</h3>
            <p className="text-purple-200 mb-6">첫 번째 타로 리딩을 시작해보세요!</p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
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
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer"
                onClick={() => setSelectedReading(reading)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold">
                    {reading.spreadType === 'one-card' ? '🎴 원카드' : '🔮 3카드'}
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
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedReading.question}
                    </h2>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                      {selectedReading.spreadType === 'one-card' ? '🎴 원카드 리딩' : '🔮 과거-현재-미래 리딩'}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(selectedReading.createdAt)}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 mb-6">
                    {selectedReading.cards.map((card, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
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
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {card.name}
                            {card.is_reversed && <span className="text-red-500 ml-2">(역방향)</span>}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {card.current_meaning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">종합 해석</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedReading.interpretation}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => deleteReading(selectedReading._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setSelectedReading(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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