'use client';

// 소각 버튼 컴포넌트
import { useState } from 'react';
import { motion } from 'framer-motion';

interface BurnButtonProps {
    onBurn: () => Promise<void>;
    disabled?: boolean;
    isExpired?: boolean;
}

export default function BurnButton({ onBurn, disabled = false, isExpired = false }: BurnButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isBurning, setIsBurning] = useState(false);

    const handleClick = async () => {
        if (isBurning) return;

        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        setIsBurning(true);
        try {
            await onBurn();
        } catch (error) {
            console.error('소각 실패:', error);
            setIsBurning(false);
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        setIsConfirming(false);
    };

    if (isBurning) {
        return (
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-full py-4 px-8 bg-[var(--primary)] rounded-lg
                   text-white font-bold text-xl text-center"
            >
                🔥 불타는 중...
            </motion.div>
        );
    }

    if (isExpired) {
        return (
            <motion.button
                onClick={handleClick}
                disabled={disabled}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="시간 만료된 고민 태우기"
                className="w-full py-4 px-8 bg-[var(--danger)] rounded-lg
                   text-white font-bold text-xl
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
                시간 만료 - 지금 태우기 🔥
            </motion.button>
        );
    }

    if (isConfirming) {
        return (
            <div className="space-y-3">
                <p className="text-center text-[var(--accent)] font-medium">
                    정말로 지금 태우시겠습니까?
                </p>
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleCancel}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 bg-[var(--surface)] border border-[var(--muted)]/30
                       rounded-lg text-[var(--text)] font-medium"
                    >
                        취소
                    </motion.button>
                    <motion.button
                        onClick={handleClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 btn-fire rounded-lg
                       text-white font-bold"
                    >
                        태워버리기 🔥
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <motion.button
            onClick={handleClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="고민 태우기"
            className="w-full py-4 px-8 btn-fire rounded-lg
                 text-white font-bold text-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-3"
        >
            지금 태우기 🔥
        </motion.button>
    );
}
