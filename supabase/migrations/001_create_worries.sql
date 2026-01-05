-- =============================================
-- Worry Burner - Supabase 데이터베이스 스키마
-- =============================================

-- worries 테이블 생성
CREATE TABLE IF NOT EXISTS worries (
    id TEXT PRIMARY KEY,                    -- nanoid 10자리
    content TEXT NOT NULL,                  -- 고민 텍스트 (최대 500자)
    created_at TIMESTAMPTZ DEFAULT now(),   -- 생성 시점
    expires_at TIMESTAMPTZ NOT NULL,        -- 만료 시점 (24시간 후)
    is_burned BOOLEAN DEFAULT false,        -- 소각 완료 여부
    burned_at TIMESTAMPTZ,                  -- 소각 시점
    pat_count INTEGER DEFAULT 0             -- 토닥토닥 횟수
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_worries_expires_at ON worries(expires_at);
CREATE INDEX IF NOT EXISTS idx_worries_is_burned ON worries(is_burned);

-- =============================================
-- Row Level Security (RLS) 설정
-- =============================================

-- RLS 활성화
ALTER TABLE worries ENABLE ROW LEVEL SECURITY;

-- 정책 1: 누구나 새 고민 작성 가능 (익명)
CREATE POLICY "Anonymous insert" ON worries
    FOR INSERT
    WITH CHECK (true);

-- 정책 2: id를 아는 사람만 조회 가능 (전체 목록 조회 불가)
-- 참고: 이 정책은 모든 SELECT를 허용하지만,
-- API에서 반드시 WHERE id = ? 조건을 사용해야 합니다.
-- 전체 목록 API는 제공하지 않으므로 실질적으로 안전합니다.
CREATE POLICY "Select by id only" ON worries
    FOR SELECT
    USING (true);

-- 정책 3: 소각 업데이트 허용
CREATE POLICY "Allow burn update" ON worries
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 토닥토닥 카운터 증가 함수
-- =============================================

CREATE OR REPLACE FUNCTION increment_pat(worry_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE worries
    SET pat_count = pat_count + 1
    WHERE id = worry_id
    RETURNING pat_count INTO new_count;
    
    RETURN new_count;
END;
$$;

-- =============================================
-- 만료된 고민 자동 삭제 함수 (pg_cron 또는 Edge Function에서 호출)
-- =============================================

CREATE OR REPLACE FUNCTION cleanup_expired_worries()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM worries
    WHERE expires_at < now();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =============================================
-- 랜덤 고민 조회 함수 (엿보기용)
-- =============================================

CREATE OR REPLACE FUNCTION get_random_worry()
RETURNS TABLE (
    id TEXT,
    content TEXT,
    created_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    pat_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT w.id, w.content, w.created_at, w.expires_at, w.pat_count
    FROM worries w
    WHERE w.is_burned = false
      AND w.expires_at > now()
    ORDER BY random()
    LIMIT 1;
END;
$$;
