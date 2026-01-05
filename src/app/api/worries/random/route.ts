// GET /api/worries/random - 랜덤 고민 1개 조회 (엿보기)
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'rate_limit', message: '요청이 너무 많습니다.' },
                { status: 429 }
            );
        }

        // 랜덤 고민 조회 (RPC 함수 사용)
        const { data, error } = await supabase
            .rpc('get_random_worry');

        if (error) {
            console.error('랜덤 고민 조회 오류:', error);
            return NextResponse.json(
                { error: 'db_error', message: '조회 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json({
                worry: null,
                message: '현재 엿볼 수 있는 고민이 없습니다.',
            });
        }

        const worry = data[0];

        return NextResponse.json({
            worry: {
                id: worry.id,
                content: worry.content,
                createdAt: new Date(worry.created_at).getTime(),
                expiresAt: new Date(worry.expires_at).getTime(),
                patCount: worry.pat_count || 0,
            },
        });

    } catch (error) {
        console.error('랜덤 고민 조회 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
