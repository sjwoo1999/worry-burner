'use client';

// 엿보기 페이지 - 다른 사람의 고민을 랜덤으로 조회
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorryView from '@/components/WorryView';
import PatPat from '@/components/PatPat';

interface RandomWorry {
    id: string;
    content: string;
    createdAt: number;
    expiresAt: number;
    patCount: number;
}

export default function PeekPage() {
    const [worry, setWorry] = useState<RandomWorry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const fetchRandomWorry = useCallback(async () => {
        setIsLoading(true);
        setIsEmpty(false);

        try {
            const response = await fetch('/api/worries/random');
            const data = await response.json();

            if (data.worry) {
                setWorry(data.worry);
            } else {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error('랜덤 고민 조회 실패:', error);
            setIsEmpty(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRandomWorry();
    }, [fetchRandomWorry]);

    // 남은 시간 계산
    const getRemainingTime = () => {
        if (!worry) return '';
        const remaining = worry.expiresAt - Date.now();
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 후 사라짐`;
        }
        return `${minutes}분 후 사라짐`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            {/* 비네팅 배경 */}
            <div className="fixed inset-0 bg-vignette -z-10" />

            {/* 헤더 */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-2">
                    👀 엿보기
                </h1>
                <p className="text-[var(--muted)]">
                    누군가의 익명 고민을 살짝 엿봅니다
                </p>
            </motion.header>

            {/* 콘텐츠 */}
            <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="text-4xl inline-block"
                            >
                                🔥
                            </motion.div>
                            <p className="text-[var(--muted)] mt-4">고민을 찾는 중...</p>
                        </motion.div>
                    ) : isEmpty ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">🌙</div>
                            <h2 className="text-xl font-bold text-[var(--text)] mb-2">
                                엿볼 고민이 없습니다
                            </h2>
                            <p className="text-[var(--muted)]">
                                아직 아무도 고민을 남기지 않았거나,
                                <br />
                                모든 고민이 이미 사라졌습니다.
                            </p>
                        </motion.div>
                    ) : worry ? (
                        <motion.div
                            key="worry"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* 고민 카드 */}
                            <WorryView
                                content={worry.content}
                                createdAt={worry.createdAt}
                                patCount={worry.patCount}
                            />

                            {/* 남은 시간 표시 */}
                            <div className="text-center mt-4">
                                <span className="text-[var(--primary)] text-sm">
                                    ⏰ {getRemainingTime()}
                                </span>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <PatPat worryId={worry.id} initialCount={worry.patCount} />
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* 다른 고민 보기 버튼 */}
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex flex-col items-center gap-4"
                    >
                        <motion.button
                            onClick={fetchRandomWorry}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-[var(--surface)] border border-[var(--muted)]/30
                         rounded-lg text-[var(--text)] font-medium
                         hover:border-[var(--accent)]/50 transition-colors"
                        >
                            🔀 다른 고민 보기
                        </motion.button>

                        <a
                            href="/"
                            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm"
                        >
                            ← 내 고민 작성하기
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
