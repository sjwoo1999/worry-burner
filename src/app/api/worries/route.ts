// POST /api/worries - 새 고민 작성
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSecretId } from '@/lib/nanoid';
import { containsSensitiveKeywords } from '@/lib/keywords';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { MAX_CONTENT_LENGTH, EXPIRY_DURATION_MS } from '@/lib/types';

export async function POST(request: Request) {
    try {
        // Rate limiting 체크
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'rate_limit', message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': String(rateLimit.remaining),
                        'X-RateLimit-Reset': String(rateLimit.resetTime),
                    }
                }
            );
        }

        // 요청 바디 파싱
        const body = await request.json();
        const { content } = body;

        // 유효성 검증: 빈 내용
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'empty_content', message: '고민 내용을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 유효성 검증: 글자 수 초과
        if (content.length > MAX_CONTENT_LENGTH) {
            return NextResponse.json(
                { error: 'content_too_long', message: `고민은 ${MAX_CONTENT_LENGTH}자 이내로 작성해주세요.` },
                { status: 400 }
            );
        }

        // 자살예방 키워드 체크
        if (containsSensitiveKeywords(content)) {
            return NextResponse.json(
                { error: 'sensitive_content', message: '민감한 내용이 감지되었습니다.' },
                { status: 200 } // 200으로 반환하여 클라이언트에서 모달 표시
            );
        }

        // 고유 ID 생성
        const id = generateSecretId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + EXPIRY_DURATION_MS);

        // Supabase에 문서 생성
        const { error } = await supabase
            .from('worries')
            .insert({
                id,
                content: content.trim(),
                expires_at: expiresAt.toISOString(),
            });

        if (error) {
            console.error('Supabase 저장 오류:', error);
            return NextResponse.json(
                { error: 'db_error', message: '저장 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        // 비밀 URL 생성
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const secretUrl = `${baseUrl}/burn/${id}`;

        return NextResponse.json({
            id,
            secretUrl,
            expiresAt: expiresAt.getTime(),
        }, { status: 201 });

    } catch (error) {
        console.error('고민 생성 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
