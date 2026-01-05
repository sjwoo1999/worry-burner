// POST /api/worries/[id]/pat - 토닥토닥 카운트 증가
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidSecretId } from '@/lib/nanoid';
import { getClientIp } from '@/lib/rate-limit';

// IP당 문서당 1회 제한을 위한 메모리 저장소
const patRecords = new Map<string, Set<string>>();

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // ID 유효성 검증
        if (!isValidSecretId(id)) {
            return NextResponse.json(
                { error: 'invalid_id', message: '유효하지 않은 링크입니다.' },
                { status: 400 }
            );
        }

        // IP 추출
        const ip = getClientIp(request);

        // IP당 문서당 1회 제한 체크
        if (!patRecords.has(id)) {
            patRecords.set(id, new Set());
        }

        const ipSet = patRecords.get(id)!;
        if (ipSet.has(ip)) {
            return NextResponse.json(
                { error: 'already_patted', message: '이미 토닥토닥 하셨습니다.' },
                { status: 400 }
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

        // 토닥토닥 카운트 증가 (RPC 함수 사용)
        const { data: newCount, error: rpcError } = await supabase
            .rpc('increment_pat', { worry_id: id });

        if (rpcError) {
            console.error('토닥토닥 RPC 오류:', rpcError);
            return NextResponse.json(
                { error: 'db_error', message: '저장 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        // IP 기록
        ipSet.add(ip);

        return NextResponse.json({
            patCount: newCount,
        });

    } catch (error) {
        console.error('토닥토닥 오류:', error);
        return NextResponse.json(
            { error: 'internal_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
