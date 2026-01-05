'use client';

// 토닥토닥 버튼 컴포넌트
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './Toast';

interface PatPatProps {
    worryId: string;
    initialCount?: number;
}

export default function PatPat({ worryId, initialCount = 0 }: PatPatProps) {
    const [count, setCount] = useState(initialCount);
    const [isPatting, setIsPatting] = useState(false);
    const [hasPatted, setHasPatted] = useState(false);
    const [showHeart, setShowHeart] = useState(false);

    // Toast states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

    const handlePat = async () => {
        if (hasPatted || isPatting) {
            // 이미 토닥토닥한 경우 토스트 표시
            setToastMessage('이미 토닥토닥 했어요 ☺️');
            setToastType('info');
            setShowToast(true);
            return;
        }

        setIsPatting(true);

        try {
            const response = await fetch(`/api/worries/${worryId}/pat`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                setCount(data.patCount);
                setHasPatted(true);
                setShowHeart(true);
                setTimeout(() => setShowHeart(false), 1000);

                // 성공 토스트
                setToastMessage('💕 토닥토닥을 보냈어요');
                setToastType('success');
                setShowToast(true);
            } else if (data.error === 'already_patted') {
                setHasPatted(true);
                setToastMessage('이미 토닥토닥 했어요 ☺️');
                setToastType('info');
                setShowToast(true);
            }
        } catch (error) {
            console.error('토닥토닥 실패:', error);
            setToastMessage('잠시 후 다시 시도해주세요');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsPatting(false);
        }
    };

    return (
        <div className="relative inline-flex items-center">
            <motion.button
                onClick={handlePat}
                disabled={isPatting}
                whileHover={!hasPatted ? { scale: 1.1 } : {}}
                whileTap={!hasPatted ? { scale: 0.9 } : {}}
                aria-label="토닥토닥 보내기"
                className={`
          px-4 py-2 rounded-full flex items-center gap-2
          transition-colors
          ${hasPatted
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)] cursor-default'
                        : 'bg-[var(--surface)] hover:bg-[var(--accent)]/10 text-[var(--muted)] hover:text-[var(--accent)]'
                    }
          disabled:cursor-not-allowed
        `}
            >
                <motion.span
                    animate={isPatting ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {hasPatted ? '💙' : '🤍'}
                </motion.span>
                <span className="text-sm font-medium">
                    {hasPatted ? '토닥토닥 했어요' : '토닥토닥'}
                </span>
                {count > 0 && (
                    <span className="text-sm opacity-70">
                        {count}
                    </span>
                )}
            </motion.button>

            {/* 플로팅 하트 애니메이션 */}
            <AnimatePresence>
                {showHeart && (
                    <motion.div
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -50, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-2xl"
                    >
                        💙
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 토스트 알림 */}
            <Toast
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
                type={toastType}
            />
        </div>
    );
}
