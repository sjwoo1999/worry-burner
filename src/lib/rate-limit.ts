// IP 기반 Rate Limiting (브루트포스 방지)

// 요청 기록을 저장하는 맵 (메모리 기반, 프로덕션에서는 Redis 권장)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limit 설정
const WINDOW_MS = 60 * 1000; // 1분
const MAX_REQUESTS = 10; // 분당 최대 요청 수

/**
 * IP 기반 rate limiting 체크
 * @param ip 클라이언트 IP 주소
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(ip: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
} {
    const now = Date.now();
    const record = requestCounts.get(ip);

    // 기록이 없거나 윈도우가 지난 경우
    if (!record || now > record.resetTime) {
        requestCounts.set(ip, {
            count: 1,
            resetTime: now + WINDOW_MS,
        });
        return {
            allowed: true,
            remaining: MAX_REQUESTS - 1,
            resetTime: now + WINDOW_MS,
        };
    }

    // 제한 초과 체크
    if (record.count >= MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: record.resetTime,
        };
    }

    // 카운트 증가
    record.count += 1;
    requestCounts.set(ip, record);

    return {
        allowed: true,
        remaining: MAX_REQUESTS - record.count,
        resetTime: record.resetTime,
    };
}

/**
 * 요청에서 IP 주소 추출
 * @param request Request 객체
 * @returns IP 주소 문자열
 */
export function getClientIp(request: Request): string {
    // Vercel / Cloudflare 환경
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    // Cloudflare
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // 기본값
    return 'unknown';
}

// 주기적 정리 (메모리 누수 방지)
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
        if (now > record.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, WINDOW_MS);
