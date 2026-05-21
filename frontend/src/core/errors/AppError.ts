export class AppError extends Error {
  readonly code?: string;
  readonly statusCode?: number;

  constructor(
    message: string,
    code?: string,
    statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function parseApiError(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? 'Error desconocido';
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}
