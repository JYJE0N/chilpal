"use client";

import { motion } from "framer-motion";
import { SpreadDefinition } from "@/types/spreads";
import {
  BadgeCheckIcon,
  AtomIcon,
  Heart,
  Users,
  Briefcase,
  HelpCircle,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";

interface SpreadCardProps {
  spread: SpreadDefinition;
  onSelect: () => void;
  featured?: boolean;
}

const getSpreadIcon = (spreadId: string) => {
  switch (spreadId) {
    case "one-card":
      return <BadgeCheckIcon className="w-6 h-6 dawn-text-primary" />;
    case "three-card":
      return <AtomIcon className="w-6 h-6 dawn-text-primary" />;
    case "celtic-cross":
      return <Sparkles className="w-6 h-6 dawn-text-primary" />;
    case "relationship":
      return <Users className="w-6 h-6 dawn-text-primary" />;
    case "love-spread":
      return <Heart className="w-6 h-6 dawn-text-primary" />;
    case "career-path":
      return <Briefcase className="w-6 h-6 dawn-text-primary" />;
    case "yes-no":
      return <Target className="w-6 h-6 dawn-text-primary" />;
    default:
      return <Target className="w-6 h-6 dawn-text-primary" />;
  }
};

const getSpreadColor = (spreadId: string) => {
  switch (spreadId) {
    case "one-card":
      return {
        border: "border-yellow-400/30 hover:border-yellow-400/60",
        bg: "hover:bg-yellow-500/10",
        iconBg: "from-yellow-400 to-yellow-300",
      };
    case "three-card":
      return {
        border: "border-purple-400/30 hover:border-purple-400/60",
        bg: "hover:bg-purple-500/10",
        iconBg: "from-purple-400 to-pink-400",
      };
    case "celtic-cross":
      return {
        border: "border-pink-400/30 hover:border-pink-400/60",
        bg: "hover:bg-pink-500/10",
        iconBg: "from-pink-400 to-purple-400",
      };
    case "relationship":
      return {
        border: "border-rose-400/30 hover:border-rose-400/60",
        bg: "hover:bg-rose-500/10",
        iconBg: "from-rose-400 to-pink-400",
      };
    case "love-spread":
      return {
        border: "border-red-400/30 hover:border-red-400/60",
        bg: "hover:bg-red-500/10",
        iconBg: "from-red-400 to-pink-400",
      };
    case "career-path":
      return {
        border: "border-cyan-400/30 hover:border-cyan-400/60",
        bg: "hover:bg-cyan-500/10",
        iconBg: "from-cyan-400 to-blue-400",
      };
    case "yes-no":
      return {
        border: "border-green-400/30 hover:border-green-400/60",
        bg: "hover:bg-green-500/10",
        iconBg: "from-green-400 to-cyan-400",
      };
    default:
      return {
        border: "border-gray-400/30 hover:border-gray-400/60",
        bg: "hover:bg-gray-500/10",
        iconBg: "from-gray-400 to-purple-400",
      };
  }
};

export default function SpreadCard({
  spread,
  onSelect,
  featured = false,
}: SpreadCardProps) {
  const colors = getSpreadColor(spread.id);
  const icon = getSpreadIcon(spread.id);

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`dawn-glass-card-light cursor-pointer border-2 ${
        colors.border
      } transition-all ${colors.bg} ${
        featured ? "ring-2 ring-pink-400/50" : ""
      }`}
    >
      <div className="mb-6">
        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${colors.iconBg} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>

      {/* 스프레드 이름 - 강조된 텍스트 */}
      <h3 className="text-lg font-bold dawn-text-primary mb-3">
        {spread.name} 스프레드
      </h3>

      {/* 설명 - 노란색 텍스트 */}
      <p className="dawn-text-accent text-sm mb-4 leading-relaxed">{spread.description}</p>

      {/* 카드 수만 표시 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="dawn-text-muted">Draw:</span>
          <span className="dawn-text-primary font-medium">{spread.cardCount}장</span>
        </div>
      </div>

      {/* 라운드 태그들 - 청록색 */}
      <div className="flex flex-wrap gap-2">
        {spread.recommendedFor.slice(0, 3).map((item, index) => (
          <span
            key={index}
            className="text-xs bg-cyan-500/20 dawn-text-sub px-3 py-1 rounded-full border border-cyan-500/30"
          >
            {item}
          </span>
        ))}
      </div>

      {/* {featured && (
        <div className="mt-4 text-center">
          <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
            ✨ 전문 리딩
          </span>
        </div>
      )} */}
    </motion.div>
  );
}
