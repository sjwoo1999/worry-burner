// Supabase 클라이언트 초기화
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 환경변수에서 Supabase 설정 로드
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경변수 체크
const isConfigured = supabaseUrl && supabaseAnonKey;

// Supabase 클라이언트 (클라이언트/서버 공용)
// 환경변수가 없으면 더미 클라이언트 생성 (런타임 에러 방지)
export const supabase: SupabaseClient = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');

// 서버 사이드 전용 (Service Role Key 사용)
export function createServerClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey || !supabaseUrl) {
        // Service Role Key가 없으면 일반 클라이언트 반환
        return supabase;
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// 타입 정의 (Supabase Database 스키마)
export interface Database {
    public: {
        Tables: {
            worries: {
                Row: {
                    id: string;
                    content: string;
                    created_at: string;
                    expires_at: string;
                    is_burned: boolean;
                    burned_at: string | null;
                    pat_count: number;
                };
                Insert: {
                    id: string;
                    content: string;
                    expires_at: string;
                    is_burned?: boolean;
                    burned_at?: string | null;
                    pat_count?: number;
                };
                Update: {
                    is_burned?: boolean;
                    burned_at?: string | null;
                    pat_count?: number;
                };
            };
        };
    };
}
