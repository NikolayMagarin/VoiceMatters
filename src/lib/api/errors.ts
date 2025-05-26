import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import {
  authErrorTextMapper,
  badRequestErrorTextMapper,
} from './errorTextMappers';

export class ApiError extends Error {
  status: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 403,
    details?: Record<string, unknown>
  ) {
    super(message);

    Object.setPrototypeOf(this, AuthError.prototype);

    this.name = 'AuthError';
    this.status = statusCode;

    if (details) {
      this.details = details;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}

export class AuthError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 403,
    details?: Record<string, unknown>
  ) {
    super(message, statusCode, details);

    Object.setPrototypeOf(this, AuthError.prototype);

    this.name = 'AuthError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 403,
    details?: Record<string, unknown>
  ) {
    super(message, statusCode, details);

    Object.setPrototypeOf(this, BadRequestError.prototype);

    this.name = 'BadRequestError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 404,
    details?: Record<string, unknown>
  ) {
    super(message, statusCode, details);

    Object.setPrototypeOf(this, NotFoundError.prototype);

    this.name = 'NotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message, statusCode, details);

    Object.setPrototypeOf(this, ValidationError.prototype);

    this.name = 'ValidationError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export async function errorHandler(axiosError: AxiosError<any, any>) {
  let error: Error | null = null;

  const responseErrorText = axiosError.response?.data?.Errors?.[0]
    ?.Message as string;

  if (axiosError.status === 403) {
    error = new AuthError('Not Allowed: ' + axiosError.message, 403, {
      originalMessage: axiosError.message,
      originalText: responseErrorText || axiosError.message,
      text:
        typeof responseErrorText === 'string'
          ? mapErrorText(responseErrorText, authErrorTextMapper)
          : null,
    });
  }

  if (axiosError.status === 400) {
    if (isValidationError(axiosError)) {
      error = new ValidationError(
        'Validation failed: ' + axiosError.message,
        400,
        {
          originalMessage: axiosError.message,
          originalErrors: axiosError.response?.data?.errors,
        }
      );
    } else {
      error = new BadRequestError('Bad Request: ' + axiosError.message, 400, {
        originalMessage: axiosError.message,
        originalText: responseErrorText || axiosError.message,
        text:
          typeof responseErrorText === 'string'
            ? mapErrorText(responseErrorText, badRequestErrorTextMapper)
            : null,
      });
    }
  }

  if (axiosError.status === 404) {
    error = new NotFoundError('Not Found', 404);
  }

  if (error instanceof AuthError || error instanceof BadRequestError) {
    toast.error(
      typeof error.details?.text === 'string'
        ? error.details.text
        : 'Неизвестная ошибка'
    );
  }

  return Promise.reject(error || axiosError);
}

function isValidationError(axiosError: AxiosError<any, any>) {
  return (
    (axiosError.response?.data?.title as string) ===
    'One or more validation errors occurred.'
  );
}

function mapErrorText(
  responseErrorText: string,
  mapper: [RegExp, string | ((...matchGroups: string[]) => string)][]
) {
  for (const [regex, errorText] of mapper) {
    const match = regex.exec(responseErrorText);
    if (match) {
      if (typeof errorText === 'string') {
        return errorText;
      }

      return errorText(...match);
    }
  }

  return null;
}

export function retryPolicy(retryCount: number, error: unknown) {
  return (
    (error instanceof ApiError || error instanceof AxiosError) &&
    typeof error.status === 'number' &&
    error.status >= 500 &&
    error.status <= 599 &&
    retryCount < 5
  );
}
