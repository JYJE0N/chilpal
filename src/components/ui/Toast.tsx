"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 토스트 타입 정의
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Context 타입
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Context 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// 토스트 아이콘
const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return 'ℹ️';
  }
};

// 토스트 색상
const getToastColors = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-green-400 bg-green-500/10 dawn-text-primary';
    case 'error':
      return 'border-red-400 bg-red-500/10 dawn-text-primary';
    case 'warning':
      return 'border-yellow-400 bg-yellow-500/10 dawn-text-primary';
    case 'info':
      return 'border-cyan-400 bg-cyan-500/10 dawn-text-primary';
    default:
      return 'border-purple-400 bg-purple-500/10 dawn-text-primary';
  }
};

// 개별 토스트 컴포넌트
const ToastItem = React.forwardRef<HTMLDivElement, { toast: Toast; onRemove: (id: string) => void }>(
  ({ toast, onRemove }, ref) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        dawn-glass-card-light relative max-w-sm w-full mobile-toast-blur shadow-2xl border-l-4
        ${getToastColors(toast.type)}
      `}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-3 right-3 dawn-text-muted hover:dawn-text-primary transition-colors p-1 hover:bg-white/10 rounded"
      >
        ✕
      </button>

      <div className="flex items-start gap-3 pr-6">
        {/* 아이콘 */}
        <span className="text-xl flex-shrink-0">
          {getToastIcon(toast.type)}
        </span>

        <div className="flex-1">
          {/* 제목 */}
          <h4 className="font-semibold dawn-text-primary mb-1">
            {toast.title}
          </h4>

          {/* 메시지 */}
          {toast.message && (
            <p className="text-sm dawn-text-secondary opacity-90">
              {toast.message}
            </p>
          )}

          {/* 액션 버튼 */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-semibold dawn-text-accent underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      {/* 진행 바 */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-b-lg"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
      />
    </motion.div>
  );
  }
);

ToastItem.displayName = 'ToastItem';

// 토스트 컨테이너
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-28 right-4 z-[10000] space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// 토스트 프로바이더
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// 편의 함수들
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'success' as const,
    title,
    message,
    ...options,
  }),
  
  error: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'error' as const,
    title,
    message,
    ...options,
  }),
  
  warning: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'warning' as const,
    title,
    message,
    ...options,
  }),
  
  info: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'info' as const,
    title,
    message,
    ...options,
  }),
};