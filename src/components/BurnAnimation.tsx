'use client';

// 소각 애니메이션 컴포넌트 (CSS Mask + Lottie + 사운드)
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lottie 동적 임포트 (SSR 비활성화)
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface BurnAnimationProps {
    isPlaying: boolean;
    onComplete?: () => void;
    children: React.ReactNode;
}

export default function BurnAnimation({ isPlaying, onComplete, children }: BurnAnimationProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [showEmbers, setShowEmbers] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [fireAnimation, setFireAnimation] = useState<object | null>(null);

    // Lottie 애니메이션 로드
    useEffect(() => {
        fetch('/lottie/fire.json')
            .then(res => res.json())
            .then(data => setFireAnimation(data))
            .catch(() => {
                // 로드 실패 시 기본 애니메이션 사용
                console.log('Lottie 애니메이션을 로드할 수 없습니다');
            });
    }, []);

    // 오디오 초기화 및 재생
    useEffect(() => {
        if (isPlaying) {
            // 오디오 재생
            audioRef.current = new Audio('/sounds/fire-crackling.mp3');
            audioRef.current.volume = 0.5;
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => {
                // 자동 재생 차단 시 무시
                console.log('오디오 자동재생이 차단되었습니다');
            });

            // 불씨 효과 시작
            setTimeout(() => setShowEmbers(true), 500);

            // 애니메이션 완료
            const timer = setTimeout(() => {
                setAnimationComplete(true);
                audioRef.current?.pause();
                onComplete?.();
            }, 3500);

            return () => {
                clearTimeout(timer);
                audioRef.current?.pause();
                audioRef.current = null;
            };
        }
    }, [isPlaying, onComplete]);

    return (
        <div className="relative">
            {/* 소각 중인 컨텐츠 */}
            <motion.div
                className={isPlaying && !animationComplete ? 'burning' : ''}
                animate={isPlaying && !animationComplete ? {
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(0.8)'],
                } : {}}
                transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
            >
                {!animationComplete && children}
            </motion.div>

            {/* Lottie 불꽃 오버레이 */}
            <AnimatePresence>
                {isPlaying && !animationComplete && fireAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-10"
                    >
                        <Lottie
                            animationData={fireAnimation}
                            loop={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bottom: '-20%',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS 기반 불꽃 효과 (Lottie 폴백) */}
            <AnimatePresence>
                {isPlaying && !animationComplete && !fireAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                    >
                        {/* 불꽃 그라데이션 */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-1/2"
                            style={{
                                background: 'linear-gradient(to top, rgba(249, 115, 22, 0.8), rgba(251, 191, 36, 0.4), transparent)',
                                animation: 'flicker 0.3s ease-in-out infinite',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 불씨 파티클 */}
            <AnimatePresence>
                {showEmbers && !animationComplete && (
                    <>
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    y: 0,
                                    x: Math.random() * 100 - 50,
                                    scale: Math.random() * 0.5 + 0.5,
                                }}
                                animate={{
                                    opacity: 0,
                                    y: -150 - Math.random() * 100,
                                    x: Math.random() * 200 - 100,
                                }}
                                transition={{
                                    duration: 1.5 + Math.random(),
                                    delay: Math.random() * 2,
                                    repeat: Infinity,
                                }}
                                className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, ${Math.random() > 0.5 ? '#F97316' : '#FBBF24'
                                        }, transparent)`,
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* 소각 완료 메시지 */}
            <AnimatePresence>
                {animationComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center
                       bg-[var(--background)]/95 rounded-lg"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-7xl mb-4"
                        >
                            🔥
                        </motion.div>
                        <h3 className="text-2xl font-bold text-[var(--text)] mb-2">
                            소각 완료
                        </h3>
                        <p className="text-[var(--muted)]">
                            당신의 고민이 한 줌의 재가 되었습니다
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS 애니메이션 */}
            <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
