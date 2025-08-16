"use client";

import { motion } from "framer-motion";
import { SPREADS, SpreadType } from "@/types/spreads";
import { ReadingDispatch } from "@/hooks/useReadingState";
import { Zap, Clock, Cross, Users, Heart, Briefcase, HelpCircle, Sparkles } from "lucide-react";

interface SpreadSelectorProps {
  selectedSpread: SpreadType;
  dispatch: ReadingDispatch;
}

export default function SpreadSelector({ selectedSpread, dispatch }: SpreadSelectorProps) {
  const handleSpreadSelect = (spreadId: SpreadType) => {
    dispatch({ type: 'SET_SPREAD_TYPE', payload: spreadId });
    dispatch({ type: 'SET_PHASE', payload: 'question' });
  };

  const getSpreadIcon = (spreadId: SpreadType) => {
    switch (spreadId) {
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
              className={`p-8 rounded-2xl border transition-all duration-300 group hover:scale-105 ${
                selectedSpread === spread.id
                  ? "border-purple-400/30 bg-purple-400/15 shadow-xl shadow-purple-500/20"
                  : "border-white/10 bg-black/20 hover:border-purple-400/25 hover:bg-purple-400/8 hover:shadow-[0_0_20px_rgba(168,85,247,0.3),inset_0_0_20px_rgba(168,85,247,0.1)]"
              }`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                {getSpreadIcon(spread.id)}
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