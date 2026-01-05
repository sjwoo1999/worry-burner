// GET, DELETE /api/worries/[id] - 고민 조회/소각
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidSecretId } from '@/lib/nanoid';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: 고민 조회
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // ID 유효성 검증
        if (!isValidSecretId(id)) {
            return NextResponse.json(
                { error: 'invalid_id', message: '유효하지 않은 링크입니다.' },
                { status: 400 }
            );
        }

        // Rate limiting
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'rate_limit', message: '요청이 너무 많습니다.' },
                { status: 429 }
            );
        }

        // Supabase에서 문서 조회
        const { data, error } = await supabase
            .from('worries')
            .select('content, created_at, expires_at, is_burned, pat_count')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'not_found', message: '이미 사라진 고민입니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            content: data.content,
            createdAt: new Date(data.created_at).getTime(),
            expiresAt: new Date(data.expires_at).getTime(),
            isBurned: data.is_burned,
            patCount: data.pat_count || 0,
        });

    } catch (error) {
        console.error('고민 조회 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 수동 소각 (24시간 전에 소각)
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // ID 유효성 검증
        if (!isValidSecretId(id)) {
            return NextResponse.json(
                { error: 'invalid_id', message: '유효하지 않은 링크입니다.' },
                { status: 400 }
            );
        }

        // Rate limiting
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'rate_limit', message: '요청이 너무 많습니다.' },
                { status: 429 }
            );
        }

        // 먼저 문서 존재 및 상태 확인
        const { data: existing, error: fetchError } = await supabase
            .from('worries')
            .select('is_burned')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return NextResponse.json(
                { error: 'not_found', message: '이미 사라진 고민입니다.' },
                { status: 404 }
            );
        }

        // 이미 소각된 경우
        if (existing.is_burned) {
            return NextResponse.json(
                { error: 'already_burned', message: '이미 소각된 고민입니다.' },
                { status: 400 }
            );
        }

        // 소각 처리
        const burnedAt = new Date();
        const { error: updateError } = await supabase
            .from('worries')
            .update({
                is_burned: true,
                burned_at: burnedAt.toISOString(),
            })
            .eq('id', id);

        if (updateError) {
            console.error('소각 업데이트 오류:', updateError);
            return NextResponse.json(
                { error: 'db_error', message: '소각 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            burnedAt: burnedAt.getTime(),
        });

    } catch (error) {
        console.error('고민 소각 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
