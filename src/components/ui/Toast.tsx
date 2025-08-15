"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
      return 'border-green-500 bg-green-500/10 text-green-100';
    case 'error':
      return 'border-red-500 bg-red-500/10 text-red-100';
    case 'warning':
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-100';
    case 'info':
      return 'border-blue-500 bg-blue-500/10 text-blue-100';
    default:
      return 'border-gray-500 bg-gray-500/10 text-gray-100';
  }
};

// 개별 토스트 컴포넌트
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative max-w-sm w-full bg-gray-800/95 backdrop-blur-lg mobile-toast-blur rounded-lg p-4 shadow-2xl border-l-4
        ${getToastColors(toast.type)}
      `}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
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
          <h4 className="font-semibold text-white mb-1">
            {toast.title}
          </h4>

          {/* 메시지 */}
          {toast.message && (
            <p className="text-sm opacity-90">
              {toast.message}
            </p>
          )}

          {/* 액션 버튼 */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-semibold text-white underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      {/* 진행 바 */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

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