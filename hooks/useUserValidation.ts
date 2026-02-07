import { useState, useCallback } from 'react';
import {
  ValidationRequest,
  ValidationResponse,
  ValidationError,
  isValidGameTitle,
} from '@/lib/user-validation';

export interface UseUserValidationState {
  isLoading: boolean;
  error: ValidationError | null;
  success: ValidationResponse | null;
  isValidating: boolean;
}

export interface UseUserValidationActions {
  validate: (request: ValidationRequest) => Promise<ValidationResponse>;
  reset: () => void;
  clearError: () => void;
}

export function useUserValidation(): UseUserValidationState & UseUserValidationActions {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [success, setSuccess] = useState<ValidationResponse | null>(null);

  const validate = useCallback(async (request: ValidationRequest): Promise<ValidationResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!isValidGameTitle(request.gameTitle)) {
        const validationError: ValidationError = {
          status: 400,
          code: 'INVALID_GAME_TITLE',
          message: `Game Title tidak valid. Pilih dari: Mobile Legends, Free Fire, Arena of Valor, Tom & Jerry, Call of Duty, Lords Mobile, Marvel Super War`,
        };
        setError(validationError);
        throw validationError;
      }

      const response = await fetch('/api/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ValidationResponse = await response.json();

      if (!response.ok) {
        const validationError: ValidationError = {
          status: response.status,
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'Terjadi kesalahan saat validasi',
          errors: data.errors,
        };
        setError(validationError);
        throw validationError;
      }

      setSuccess(data);
      return data;
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'status' in err) {
        const validationError = err as ValidationError;
        setError(validationError);
        throw validationError;
      }

      const unknownError: ValidationError = {
        status: 500,
        code: 'UNKNOWN_ERROR',
        message: 'Terjadi kesalahan yang tidak diketahui',
      };
      setError(unknownError);
      throw unknownError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    success,
    isValidating: isLoading,
    validate,
    reset,
    clearError,
  };
}
