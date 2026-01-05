// GET /api/cron/cleanup - 만료된 고민 일괄 삭제 (Vercel Cron)
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Cron secret 인증
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'unauthorized', message: '인증되지 않은 요청입니다.' },
                { status: 401 }
            );
        }

        // Service Role 클라이언트 사용
        const supabase = createServerClient();

        // 만료된 고민 삭제 (RPC 함수 사용)
        const { data: deletedCount, error } = await supabase
            .rpc('cleanup_expired_worries');

        if (error) {
            console.error('Cleanup RPC 오류:', error);
            return NextResponse.json(
                { error: 'db_error', message: '삭제 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        console.log(`Cleanup 완료: ${deletedCount}개 문서 삭제됨`);

        return NextResponse.json({
            success: true,
            deletedCount: deletedCount || 0,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Cleanup 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
