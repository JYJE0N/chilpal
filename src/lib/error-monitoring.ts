// src/lib/error-monitoring.ts

/**
 * 에러 모니터링 및 로깅 시스템
 * 
 * Sentry 없이도 효과적인 에러 추적을 제공하는 경량 시스템
 * 추후 Sentry나 다른 서비스로 쉽게 마이그레이션 가능
 */

export interface ErrorContext {
  userId?: string;
  userSession?: string;
  userAgent?: string;
  url?: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  fingerprint: string; // 같은 에러 그룹핑용
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errors: ErrorReport[] = [];
  private maxErrors = 100; // 메모리 제한
  private isProduction = process.env.NODE_ENV === 'production';

  private constructor() {
    // 전역 에러 핸들러 설정 (클라이언트 사이드만)
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private setupGlobalErrorHandlers() {
    // JavaScript 에러 캐치
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        level: 'error',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        component: 'global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Promise rejection 캐치
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          level: 'error',
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          component: 'global',
          action: 'unhandled_promise_rejection',
          metadata: {
            reason: event.reason
          }
        }
      );
    });
  }

  public captureError(error: Error, context: Partial<ErrorContext> = {}) {
    const errorId = this.generateErrorId();
    const fingerprint = this.generateFingerprint(error);
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      fingerprint,
      context: {
        timestamp: new Date(),
        level: 'error',
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...context
      }
    };

    this.addError(errorReport);
    
    // 프로덕션에서는 콘솔 로그 억제
    if (!this.isProduction) {
      console.error('Error captured:', errorReport);
    }

    // 심각한 에러는 즉시 서버로 전송
    if (context.level === 'error') {
      this.sendToServer(errorReport);
    }

    return errorId;
  }

  public captureMessage(
    message: string, 
    level: ErrorContext['level'] = 'info',
    context: Partial<ErrorContext> = {}
  ) {
    const messageError = new Error(message);
    messageError.name = 'CapturedMessage';
    
    return this.captureError(messageError, { ...context, level });
  }

  private addError(errorReport: ErrorReport) {
    this.errors.unshift(errorReport);
    
    // 메모리 제한
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: Error): string {
    // 에러 메시지와 스택의 첫 번째 라인을 기반으로 핑거프린트 생성
    const message = error.message.replace(/\d+/g, 'X'); // 숫자 제거로 일반화
    const stackFirstLine = error.stack?.split('\n')[1]?.replace(/:\d+:\d+/g, '') || '';
    
    return btoa(`${error.name}:${message}:${stackFirstLine}`).substr(0, 16);
  }

  private async sendToServer(errorReport: ErrorReport) {
    try {
      // API 엔드포인트로 에러 전송
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (sendError) {
      // 에러 전송 실패 시 로컬에만 저장
      if (!this.isProduction) {
        console.warn('Failed to send error to server:', sendError);
      }
    }
  }

  public getRecentErrors(limit = 20): ErrorReport[] {
    return this.errors.slice(0, limit);
  }

  public getErrorsByFingerprint(fingerprint: string): ErrorReport[] {
    return this.errors.filter(error => error.fingerprint === fingerprint);
  }

  public clearErrors() {
    this.errors = [];
  }

  public getErrorStats() {
    const total = this.errors.length;
    const byLevel = this.errors.reduce((acc, error) => {
      acc[error.context.level] = (acc[error.context.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byFingerprint = this.errors.reduce((acc, error) => {
      acc[error.fingerprint] = (acc[error.fingerprint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byLevel,
      byFingerprint,
      unique: Object.keys(byFingerprint).length
    };
  }
}

// 전역 인스턴스
export const errorMonitor = ErrorMonitor.getInstance();

// 편의 함수들
export const captureError = (error: Error, context?: Partial<ErrorContext>) => {
  return errorMonitor.captureError(error, context);
};

export const captureMessage = (
  message: string, 
  level?: ErrorContext['level'], 
  context?: Partial<ErrorContext>
) => {
  return errorMonitor.captureMessage(message, level, context);
};

// 타로 앱 특화 에러 캐처들
export const captureTarotError = (
  error: Error, 
  operation: 'card_selection' | 'reading_generation' | 'card_interpretation' | 'spread_creation' | 'database_operation',
  metadata?: Record<string, any>
) => {
  return captureError(error, {
    component: 'tarot',
    action: operation,
    level: 'error',
    metadata: {
      operation,
      ...metadata
    }
  });
};

export const captureUserAction = (
  action: string,
  metadata?: Record<string, any>
) => {
  return captureMessage(`User action: ${action}`, 'info', {
    component: 'user_interaction',
    action,
    metadata
  });
};

// 성능 모니터링
export const capturePerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  const level = duration > 5000 ? 'warning' : 'info'; // 5초 이상이면 경고
  
  return captureMessage(
    `Performance: ${operation} took ${duration}ms`,
    level,
    {
      component: 'performance',
      action: operation,
      metadata: {
        duration,
        ...metadata
      }
    }
  );
};

// React Error Boundary용 헬퍼
export const captureComponentError = (
  error: Error,
  errorInfo: { componentStack: string },
  componentName?: string
) => {
  return captureError(error, {
    component: componentName || 'unknown_component',
    action: 'component_render_error',
    level: 'error',
    metadata: {
      componentStack: errorInfo.componentStack
    }
  });
};