// 고민(Worry) 타입 정의

export interface Worry {
    id: string;                  // nanoid 10자리, 문서 ID = URL ID
    content: string;             // 고민 텍스트, 최대 500자
    createdAt: number;           // 생성 시점 (밀리초)
    expiresAt: number;           // 만료 시점 (createdAt + 24시간)
    isBurned: boolean;           // 소각 완료 여부
    burnedAt: number | null;     // 소각 시점 (밀리초)
    patCount: number;            // 토닥토닥 횟수
}

// 고민 생성 요청
export interface CreateWorryRequest {
    content: string;
}

// 고민 생성 응답
export interface CreateWorryResponse {
    id: string;
    secretUrl: string;
    expiresAt: number;
}

// 고민 조회 응답
export interface GetWorryResponse {
    content: string;
    createdAt: number;
    expiresAt: number;
    isBurned: boolean;
    patCount: number;
}

// 소각 응답
export interface BurnWorryResponse {
    success: boolean;
    burnedAt: number;
}

// 토닥토닥 응답
export interface PatPatResponse {
    patCount: number;
}

// API 에러 응답
export interface ApiError {
    error: string;
    message: string;
}

// 고민 상태 enum
export type WorryStatus = 'pending' | 'burning' | 'burned' | 'expired';

// 24시간 = 86400000 밀리초
export const EXPIRY_DURATION_MS = 24 * 60 * 60 * 1000;

// 최대 글자 수
export const MAX_CONTENT_LENGTH = 500;
