'use client';

// 자살예방 안전 모달
import { motion, AnimatePresence } from 'framer-motion';
import { HELPLINE_INFO } from '@/lib/keywords';

interface SafetyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SafetyModal({ isOpen, onClose }: SafetyModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[var(--surface)] rounded-2xl p-8 max-w-md w-full shadow-2xl
                     border border-[var(--muted)]/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 헤더 */}
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-4">💙</div>
                        <h2 className="font-hand text-3xl text-[var(--text)] mb-2">
                            잠깐, 당신이 걱정돼요.
                        </h2>
                        <p className="text-[var(--muted)]">
                            당신의 마음이 걱정됩니다.
                        </p>
                    </div>

                    {/* 메시지 */}
                    <div className="bg-[var(--background)] rounded-lg p-4 mb-6">
                        <p className="text-[var(--text)] text-center leading-relaxed">
                            힘든 감정은 누구에게나 찾아올 수 있어요.
                            <br />
                            전문 상담사와 이야기하면 도움이 될 수 있습니다.
                        </p>
                    </div>

                    {/* 상담 전화번호 */}
                    <div className="space-y-3 mb-6">
                        {/* 자살예방상담전화 */}
                        <a
                            href={`tel:${HELPLINE_INFO.suicide_prevention.number}`}
                            className="flex items-center justify-between p-4 bg-[var(--primary)]/10 
                         hover:bg-[var(--primary)]/20 rounded-lg transition-colors
                         border border-[var(--primary)]/30"
                        >
                            <div>
                                <div className="font-bold text-[var(--text)]">
                                    {HELPLINE_INFO.suicide_prevention.name}
                                </div>
                                <div className="text-sm text-[var(--muted)]">
                                    24시간 운영
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-[var(--primary)]">
                                {HELPLINE_INFO.suicide_prevention.number}
                            </div>
                        </a>

                        {/* 정신건강위기상담전화 */}
                        <a
                            href={`tel:${HELPLINE_INFO.mental_health.number}`}
                            className="flex items-center justify-between p-4 bg-[var(--accent)]/10 
                         hover:bg-[var(--accent)]/20 rounded-lg transition-colors
                         border border-[var(--accent)]/30"
                        >
                            <div>
                                <div className="font-bold text-[var(--text)]">
                                    {HELPLINE_INFO.mental_health.name}
                                </div>
                                <div className="text-sm text-[var(--muted)]">
                                    전문 상담 제공
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-[var(--accent)]">
                                {HELPLINE_INFO.mental_health.number}
                            </div>
                        </a>
                    </div>

                    {/* 닫기 버튼 */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-[var(--muted)] hover:text-[var(--text)]
                       transition-colors text-sm"
                    >
                        닫기
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
