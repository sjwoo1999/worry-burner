'use client';

// 고민 내용 표시 컴포넌트 (종이 카드 스타일)
import { motion } from 'framer-motion';

interface WorryViewProps {
    content: string;
    createdAt: number;
    patCount?: number;
    isBurning?: boolean;
    isBurned?: boolean;
}

export default function WorryView({
    content,
    createdAt,
    patCount = 0,
    isBurning = false,
    isBurned = false
}: WorryViewProps) {
    // 날짜 포맷팅
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative ${isBurning ? 'burning burn-glow' : ''}`}
        >
            {/* 종이 카드 */}
            <div className="paper-texture rounded-lg p-8 relative overflow-hidden">
                {/* 고민 내용 */}
                <div className="relative z-10">
                    <p className="text-[var(--text)] text-lg leading-relaxed whitespace-pre-wrap">
                        {content}
                    </p>
                </div>

                {/* 하단 정보 */}
                <div className="mt-8 pt-4 border-t border-[var(--muted)]/20 
                        flex items-center justify-between">
                    <span className="text-sm text-[var(--muted)]">
                        {formatDate(createdAt)}
                    </span>

                    {patCount > 0 && (
                        <span className="text-sm text-[var(--accent)]">
                            💙 {patCount}명이 토닥토닥
                        </span>
                    )}
                </div>

                {/* 소각됨 오버레이 */}
                {isBurned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-[var(--background)]/90 
                       flex flex-col items-center justify-center z-20"
                    >
                        <span className="text-6xl mb-4">🔥</span>
                        <p className="text-xl font-bold text-[var(--text)]">소각 완료</p>
                        <p className="font-hand text-[var(--accent)] text-lg mt-3">
                            "마음이 한결 가벼워졌길 바라요"
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
