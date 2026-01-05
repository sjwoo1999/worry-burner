'use client';

// 재사용 가능한 토스트 알림 컴포넌트
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
    type?: 'success' | 'error' | 'info';
}

export default function Toast({
    message,
    show,
    onClose,
    duration = 2000,
    type = 'success',
}: ToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    const bgColor = {
        success: 'bg-[var(--primary)]',
        error: 'bg-[var(--danger)]',
        info: 'bg-[var(--surface)]',
    }[type];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                    transition={{ duration: 0.3 }}
                    className={`fixed bottom-24 left-1/2 ${bgColor} text-[var(--text)] 
                     px-6 py-3 rounded-full shadow-lg z-50
                     border border-[var(--muted)]/20`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
