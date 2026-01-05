'use client';

// 24시간 카운트다운 타이머
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
    expiresAt: number;
    onExpired?: () => void;
}

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

// Helper function to calculate time left (defined outside component for initializer use)
function calculateTimeLeftHelper(expiresAt: number): TimeLeft {
    const now = Date.now();
    const difference = expiresAt - now;

    if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
    };
}

export default function Countdown({ expiresAt, onExpired }: CountdownProps) {
    // Use initializer functions to avoid setState in effect
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeftHelper(expiresAt));
    const [isExpired, setIsExpired] = useState(() => calculateTimeLeftHelper(expiresAt).total <= 0);
    const onExpiredRef = useRef(onExpired);

    // Keep ref updated
    useEffect(() => {
        onExpiredRef.current = onExpired;
    }, [onExpired]);

    const calculateTimeLeft = useCallback((): TimeLeft => {
        return calculateTimeLeftHelper(expiresAt);
    }, [expiresAt]);

    useEffect(() => {
        // If already expired on mount, call callback
        if (isExpired) {
            onExpiredRef.current?.();
            return;
        }

        // 1초마다 업데이트
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.total <= 0) {
                setIsExpired(true);
                onExpiredRef.current?.();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, calculateTimeLeft, isExpired]);

    // 숫자 포맷팅 (2자리)
    const pad = (num: number) => String(num).padStart(2, '0');

    // 긴급도에 따른 색상 + 애니메이션
    const getTimerStyle = () => {
        const minutesLeft = Math.floor(timeLeft.total / 60000);
        const hoursLeft = Math.floor(timeLeft.total / 3600000);

        if (minutesLeft <= 10) {
            // 마지막 10분: 진동 애니메이션
            return 'text-[var(--danger)] animate-pulse';
        } else if (hoursLeft < 1) {
            // 마지막 1시간: 펄스 애니메이션
            return 'text-[var(--danger)]';
        } else if (hoursLeft < 6) {
            return 'text-[var(--primary)]';
        }
        return 'text-[var(--accent)]';
    };

    // 진행률 (24시간 = 100%)
    const progress = Math.max(0, Math.min(100, (timeLeft.total / (24 * 60 * 60 * 1000)) * 100));

    if (isExpired) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-6 bg-[var(--danger)]/10 rounded-lg border border-[var(--danger)]/30"
            >
                <div className="text-4xl mb-2">⏰</div>
                <p className="text-xl font-bold text-[var(--danger)]">시간이 다 됐습니다</p>
                <p className="text-[var(--muted)] mt-1">이 고민은 곧 사라집니다</p>
            </motion.div>
        );
    }

    return (
        <div className="text-center">
            {/* 카운트다운 숫자 */}
            <div className={`countdown-number text-5xl md:text-6xl font-bold ${getTimerStyle()} mb-4`}>
                <span>{pad(timeLeft.hours)}</span>
                <span className="mx-2 opacity-50">:</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="mx-2 opacity-50">:</span>
                <span>{pad(timeLeft.seconds)}</span>
            </div>

            {/* 진행 바 */}
            <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                    initial={{ width: '100%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* 안내 텍스트 */}
            <p className="text-[var(--muted)] mt-3 text-sm">
                {timeLeft.hours > 0
                    ? `${timeLeft.hours}시간 ${timeLeft.minutes}분 후 이 고민은 영원히 사라집니다`
                    : `${timeLeft.minutes}분 ${timeLeft.seconds}초 후 이 고민은 영원히 사라집니다`
                }
            </p>
        </div>
    );
}
