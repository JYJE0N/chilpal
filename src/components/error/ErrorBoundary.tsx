// src/components/error/ErrorBoundary.tsx

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureComponentError } from '@/lib/error-monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    const errorId = captureComponentError(error, {
      componentStack: errorInfo.componentStack || ''
    }, this.props.componentName);
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // 개발 환경에서는 콘솔에도 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            {/* 에러 아이콘 */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
            </div>

            {/* 에러 메시지 */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              앗! 뭔가 잘못되었습니다
            </h2>
            <p className="text-gray-600 mb-6">
              카드를 읽는 도중 예상치 못한 오류가 발생했습니다. 
              잠시 후 다시 시도해주세요.
            </p>

            {/* 에러 세부 정보 (개발 환경 또는 요청시에만) */}
            {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && 
             this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  에러 세부 정보 보기
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs">
                  <div className="mb-2">
                    <strong>에러 ID:</strong> {this.state.errorId}
                  </div>
                  <div className="mb-2">
                    <strong>메시지:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>스택:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-700">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>컴포넌트 스택:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-700">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                페이지 새로고침
              </button>
            </div>

            {/* 문의 안내 */}
            <p className="text-xs text-gray-500 mt-4">
              문제가 계속되면 잠시 후 다시 시도하거나 페이지를 새로고침해주세요.
              {this.state.errorId && (
                <>
                  <br />
                  에러 ID: <code className="bg-gray-100 px-1 rounded">{this.state.errorId}</code>
                </>
              )}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 특정 컴포넌트용 에러 바운더리 팩토리
export const createErrorBoundary = (componentName: string, fallback?: ReactNode) => {
  const CustomErrorBoundary = ({ children }: { children: ReactNode }) => (
    <ErrorBoundary 
      componentName={componentName} 
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
  CustomErrorBoundary.displayName = `ErrorBoundary(${componentName})`;
  return CustomErrorBoundary;
};

// 타로 관련 컴포넌트용 특화 에러 바운더리
export const TarotErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary 
    componentName="tarot-component"
    fallback={
      <div className="min-h-[300px] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            카드를 다시 섞고 있습니다...
          </h3>
          <p className="text-gray-600 text-sm">
            잠시 후 다시 시도해주세요
          </p>
        </div>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);