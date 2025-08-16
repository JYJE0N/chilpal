"use client";

import { motion } from "framer-motion";
import { SPREADS, SpreadType } from "@/types/spreads";
import { ReadingDispatch } from "@/hooks/useReadingState";

interface SpreadSelectorProps {
  selectedSpread: SpreadType;
  dispatch: ReadingDispatch;
}

export default function SpreadSelector({ selectedSpread, dispatch }: SpreadSelectorProps) {
  const handleSpreadSelect = (spreadId: SpreadType) => {
    dispatch({ type: 'SET_SPREAD_TYPE', payload: spreadId });
    dispatch({ type: 'SET_PHASE', payload: 'question' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          어떤 스프레드로
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-12"
        >
          타로의 안내를 받으시겠습니까?
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {SPREADS.map((spread, index) => (
            <motion.button
              key={spread.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleSpreadSelect(spread.id)}
              className={`p-8 rounded-2xl border-2 transition-all duration-300 group hover:scale-105 ${
                selectedSpread === spread.id
                  ? "border-purple-400 bg-purple-400/20 shadow-xl shadow-purple-500/30"
                  : "border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-400/10"
              }`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {spread.name}
              </h3>
              <p className="text-gray-400 mb-4">{spread.description}</p>
              <div className="text-sm text-purple-400 font-medium">
                {spread.cardCount}장의 카드
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}