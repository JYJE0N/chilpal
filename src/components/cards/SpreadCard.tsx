'use client';

import { motion } from 'framer-motion';
import { SpreadDefinition } from '@/types/spreads';
import { 
  BadgeCheckIcon, 
  AtomIcon, 
  Heart, 
  Users, 
  Briefcase, 
  HelpCircle,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';

interface SpreadCardProps {
  spread: SpreadDefinition;
  onSelect: () => void;
  featured?: boolean;
}

const getSpreadIcon = (spreadId: string) => {
  switch (spreadId) {
    case 'one-card':
      return <BadgeCheckIcon className="w-6 h-6 text-white" />;
    case 'three-card':
      return <AtomIcon className="w-6 h-6 text-white" />;
    case 'celtic-cross':
      return <Sparkles className="w-6 h-6 text-white" />;
    case 'relationship':
      return <Users className="w-6 h-6 text-white" />;
    case 'love-spread':
      return <Heart className="w-6 h-6 text-white" />;
    case 'career-path':
      return <Briefcase className="w-6 h-6 text-white" />;
    case 'yes-no':
      return <HelpCircle className="w-6 h-6 text-white" />;
    default:
      return <Target className="w-6 h-6 text-white" />;
  }
};

const getSpreadColor = (spreadId: string) => {
  switch (spreadId) {
    case 'one-card':
      return {
        border: 'border-yellow-400/30 hover:border-yellow-400/60',
        bg: 'hover:bg-yellow-500/10',
        text: 'text-yellow-200',
        accent: 'text-yellow-300'
      };
    case 'three-card':
      return {
        border: 'border-purple-400/30 hover:border-purple-400/60',
        bg: 'hover:bg-purple-500/10',
        text: 'text-purple-200',
        accent: 'text-purple-300'
      };
    case 'celtic-cross':
      return {
        border: 'border-pink-400/30 hover:border-pink-400/60',
        bg: 'hover:bg-pink-500/10',
        text: 'text-pink-200',
        accent: 'text-pink-300'
      };
    case 'relationship':
      return {
        border: 'border-rose-400/30 hover:border-rose-400/60',
        bg: 'hover:bg-rose-500/10',
        text: 'text-rose-200',
        accent: 'text-rose-300'
      };
    case 'love-spread':
      return {
        border: 'border-red-400/30 hover:border-red-400/60',
        bg: 'hover:bg-red-500/10',
        text: 'text-red-200',
        accent: 'text-red-300'
      };
    case 'career-path':
      return {
        border: 'border-blue-400/30 hover:border-blue-400/60',
        bg: 'hover:bg-blue-500/10',
        text: 'text-blue-200',
        accent: 'text-blue-300'
      };
    case 'yes-no':
      return {
        border: 'border-green-400/30 hover:border-green-400/60',
        bg: 'hover:bg-green-500/10',
        text: 'text-green-200',
        accent: 'text-green-300'
      };
    default:
      return {
        border: 'border-gray-400/30 hover:border-gray-400/60',
        bg: 'hover:bg-gray-500/10',
        text: 'text-gray-200',
        accent: 'text-gray-300'
      };
  }
};

export default function SpreadCard({ spread, onSelect, featured = false }: SpreadCardProps) {
  const colors = getSpreadColor(spread.id);
  const icon = getSpreadIcon(spread.id);

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card-light p-6 cursor-pointer border-2 ${colors.border} transition-all ${colors.bg} ${
        featured ? 'ring-2 ring-purple-400/50' : ''
      }`}
    >
      <div className="mb-4">
        <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">
        {spread.name}
      </h3>
      
      <p className={`${colors.text} text-sm mb-4`}>
        {spread.description}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">카드 수:</span>
          <span className={colors.accent}>{spread.cardCount}장</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">소요 시간:</span>
          <span className={colors.accent}>{spread.estimatedTime}</span>
        </div>
      </div>
      
      <ul className={`${colors.text} text-xs space-y-1`}>
        {spread.recommendedFor.slice(0, 3).map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
      
      {featured && (
        <div className="mt-4 text-center">
          <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
            ✨ 전문 리딩
          </span>
        </div>
      )}
    </motion.div>
  );
}