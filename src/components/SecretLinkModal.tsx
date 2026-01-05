'use client';

// 비밀 링크 안내 모달
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ShareButtons from './ShareButtons';

interface SecretLinkModalProps {
    isOpen: boolean;
    worryId: string;
    secretUrl: string;
    onClose: () => void;
}

export default function SecretLinkModal({
    isOpen,
    worryId,
    secretUrl,
}: Omit<SecretLinkModalProps, 'onClose'> & { onClose?: () => void }) {

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[var(--surface)] rounded-2xl p-8 max-w-lg w-full shadow-2xl
                     border border-[var(--primary)]/20"
                >
                    {/* 헤더 */}
                    <div className="text-center mb-6">
                        <motion.div
                            className="text-5xl mb-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🔥
                        </motion.div>
                        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                            당신의 고민이 담겼습니다
                        </h2>
                        <p className="text-[var(--muted)]">
                            24시간 후, 이 고민은 영원히 사라집니다.
                        </p>
                    </div>

                    {/* 비밀 링크 */}
                    <div className="bg-[var(--background)] rounded-lg p-4 mb-4">
                        <p className="text-xs text-[var(--muted)] mb-2">비밀 링크</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-[var(--accent)] text-sm break-all">
                                {secretUrl}
                            </code>
                        </div>
                    </div>

                    {/* 경고 메시지 */}
                    <div className="flex items-start gap-3 bg-[var(--danger)]/10 rounded-lg p-4 mb-6
                          border border-[var(--danger)]/30">
                        <span className="text-xl">⚠️</span>
                        <p className="text-sm text-[var(--text)]">
                            <strong>이 링크를 잃어버리면 다시 볼 수 없습니다.</strong>
                            <br />
                            안전한 곳에 저장하거나 공유해주세요.
                        </p>
                    </div>

                    {/* 공유 버튼 */}
                    <ShareButtons
                        url={secretUrl}
                        title="누군가의 고민이 타오르고 있습니다 🔥"
                        description="24시간 후 영원히 사라질 고민"
                    />

                    {/* 고민 보러가기 버튼 */}
                    <Link
                        href={`/burn/${worryId}`}
                        className="block w-full mt-4 py-4 text-center bg-[var(--primary)]
                       hover:bg-[var(--primary)]/90 rounded-lg text-white font-bold
                       transition-colors"
                    >
                        내 고민 보러가기 →
                    </Link>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
