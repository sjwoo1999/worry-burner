'use client';

// 소각 페이지 - 고민 조회 + 소각 애니메이션
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WorryView from '@/components/WorryView';
import Countdown from '@/components/Countdown';
import BurnButton from '@/components/BurnButton';
import BurnAnimation from '@/components/BurnAnimation';
import Certificate from '@/components/Certificate';
import PatPat from '@/components/PatPat';
import ShareButtons from '@/components/ShareButtons';
import type { GetWorryResponse } from '@/lib/types';

type PageState = 'loading' | 'viewing' | 'burning' | 'burned' | 'expired' | 'not_found';

export default function BurnPage() {
    const params = useParams();
    const id = params.id as string;

    const [state, setState] = useState<PageState>('loading');
    const [worry, setWorry] = useState<GetWorryResponse | null>(null);
    const [burnedAt, setBurnedAt] = useState<number | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);

    // 고민 조회
    useEffect(() => {
        const fetchWorry = async () => {
            try {
                const response = await fetch(`/api/worries/${id}`);

                if (response.status === 404) {
                    setState('not_found');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data: GetWorryResponse = await response.json();
                setWorry(data);

                if (data.isBurned) {
                    setState('burned');
                } else if (data.expiresAt <= Date.now()) {
                    setState('expired');
                } else {
                    setState('viewing');
                }
            } catch (error) {
                console.error('고민 조회 실패:', error);
                setState('not_found');
            }
        };

        fetchWorry();
    }, [id]);

    // 소각 처리
    const handleBurn = useCallback(async () => {
        setState('burning');

        try {
            const response = await fetch(`/api/worries/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to burn');
            }

            const data = await response.json();
            setBurnedAt(data.burnedAt);
        } catch (error) {
            console.error('소각 실패:', error);
            setState('viewing');
        }
    }, [id]);

    // 소각 애니메이션 완료
    const handleBurnComplete = () => {
        setState('burned');
    };

    // 만료 시 자동 소각
    const handleExpired = () => {
        setState('expired');
    };

    // 비밀 URL
    const secretUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/burn/${id}`
        : '';

    // 로딩 상태
    if (state === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl"
                >
                    🔥
                </motion.div>
            </div>
        );
    }

    // 찾을 수 없음
    if (state === 'not_found') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-6">🌫️</div>
                    <h1 className="text-2xl font-bold text-[var(--text)] mb-4">
                        이미 사라진 고민입니다
                    </h1>
                    <p className="text-[var(--muted)] mb-8">
                        이 고민은 이미 재가 되었거나, 존재하지 않습니다.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-[var(--primary)] rounded-lg
                       text-white font-medium hover:bg-[var(--primary)]/90"
                    >
                        새 고민 작성하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            {/* 비네팅 배경 */}
            <div className="fixed inset-0 bg-vignette -z-10" />

            {/* 홈 링크 */}
            <Link
                href="/"
                className="fixed top-4 left-4 md:top-6 md:left-6 text-[var(--muted)]
                         hover:text-[var(--accent)] transition-colors text-sm z-10"
            >
                ← 새 고민 작성하기
            </Link>

            <div className="w-full max-w-2xl">
                {/* 인증서 모드 */}
                {showCertificate && burnedAt ? (
                    <Certificate
                        burnedAt={burnedAt}
                        onClose={() => setShowCertificate(false)}
                    />
                ) : (
                    <>
                        {/* 카운트다운 */}
                        {(state === 'viewing' || state === 'expired') && worry && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <Countdown
                                    expiresAt={worry.expiresAt}
                                    onExpired={handleExpired}
                                />
                            </motion.div>
                        )}

                        {/* 고민 내용 */}
                        {worry && (
                            <BurnAnimation
                                isPlaying={state === 'burning'}
                                onComplete={handleBurnComplete}
                            >
                                <WorryView
                                    content={worry.content}
                                    createdAt={worry.createdAt}
                                    patCount={worry.patCount}
                                    isBurning={state === 'burning'}
                                    isBurned={state === 'burned'}
                                />
                            </BurnAnimation>
                        )}

                        {/* 액션 버튼 영역 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 space-y-4"
                        >
                            {/* 보기/만료 상태 */}
                            {(state === 'viewing' || state === 'expired') && (
                                <>
                                    <BurnButton
                                        onBurn={handleBurn}
                                        isExpired={state === 'expired'}
                                    />

                                    {/* 토닥토닥 + 공유 */}
                                    <div className="flex items-center justify-between mt-6">
                                        <PatPat worryId={id} initialCount={worry?.patCount || 0} />
                                        <div className="flex-1 ml-4">
                                            <ShareButtons url={secretUrl} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 소각 완료 */}
                            {state === 'burned' && (
                                <div className="text-center space-y-4">
                                    <motion.button
                                        onClick={() => setShowCertificate(true)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-[var(--accent)] rounded-lg
                               text-[var(--background)] font-bold"
                                    >
                                        📜 소각 인증서 받기
                                    </motion.button>

                                    <Link
                                        href="/"
                                        className="block w-full py-4 bg-[var(--surface)] border border-[var(--muted)]/30
                               rounded-lg text-[var(--text)] font-medium text-center
                               hover:border-[var(--primary)]/50 transition-colors"
                                    >
                                        새 고민 작성하기
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
