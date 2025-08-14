import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

interface UseAsyncOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAsyncReturn<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { addToast } = useToast();

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = '작업이 완료되었습니다',
    errorMessage = '오류가 발생했습니다',
  } = options;

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setData(result);

        if (showSuccessToast) {
          addToast({
            type: 'success',
            title: successMessage,
          });
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);

        if (showErrorToast) {
          addToast({
            type: 'error',
            title: errorMessage,
            message: error.message,
          });
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, addToast, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset };
}