export interface ValidationRequest {
  idPelanggan: string;
  idServer: string;
  gameTitle: string;
  gameTitleX: string;
}

export interface ValidationResponse {
  status: 'success' | 'error';
  message: string;
  code?: string;
  data?: {
    idPelanggan: string;
    username: string;
    idServer: string;
    gameTitle: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ValidationError {
  status: number;
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_SYNC_USER_URL || 'http://localhost:5050';
const TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_SYNC_USER_TIMEOUT || '5000', 10);

export async function validateUserAndServer(
  request: ValidationRequest
): Promise<ValidationResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(`${API_URL}/api/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: ValidationResponse = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Terjadi kesalahan saat validasi',
        errors: data.errors,
      } as ValidationError;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw {
          status: 408,
          code: 'TIMEOUT',
          message: 'Request timeout. Pastikan server api-sync-user sedang berjalan.',
        } as ValidationError;
      }

      throw {
        status: 500,
        code: 'NETWORK_ERROR',
        message: `Gagal terhubung ke server validasi: ${error.message}`,
      } as ValidationError;
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      throw error as ValidationError;
    }

    throw {
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan yang tidak diketahui',
    } as ValidationError;
  }
}

export function formatGameTitle(input: string): string {
  return input.toUpperCase().replace(/\s+/g, '');
}

export function isValidGameTitle(gameTitle: string): boolean {
  const validTitles = [
    'MOBILELEGEND',
    'FREEFIRE',
    'AOV',
    'TOMANDJERRY',
    'CALLOFDUTY',
    'LORDSMOBILE',
    'MARVELSUPERWAR',
  ];
  return validTitles.includes(gameTitle);
}

export function getGameTitleDisplay(gameTitle: string): string {
  const displayMap: Record<string, string> = {
    MOBILELEGEND: 'Mobile Legends',
    FREEFIRE: 'Free Fire',
    AOV: 'Arena of Valor',
    TOMANDJERRY: 'Tom & Jerry',
    CALLOFDUTY: 'Call of Duty',
    LORDSMOBILE: 'Lords Mobile',
    MARVELSUPERWAR: 'Marvel Super War',
  };
  return displayMap[gameTitle] || gameTitle;
}

export function getValidGameTitles(): string[] {
  return [
    'MOBILELEGEND',
    'FREEFIRE',
    'AOV',
    'TOMANDJERRY',
    'CALLOFDUTY',
    'LORDSMOBILE',
    'MARVELSUPERWAR',
  ];
}

export function getGameTitleOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'MOBILELEGEND', label: 'Mobile Legends' },
    { value: 'FREEFIRE', label: 'Free Fire' },
    { value: 'AOV', label: 'Arena of Valor' },
    { value: 'TOMANDJERRY', label: 'Tom & Jerry' },
    { value: 'CALLOFDUTY', label: 'Call of Duty' },
    { value: 'LORDSMOBILE', label: 'Lords Mobile' },
    { value: 'MARVELSUPERWAR', label: 'Marvel Super War' },
  ];
}
