'use client';

// 소각 인증서 컴포넌트 (html2canvas로 이미지 생성)
import { useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface CertificateProps {
    burnedAt: number;
    onClose?: () => void;
}

export default function Certificate({ burnedAt, onClose }: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 날짜 포맷팅
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 이미지로 저장 (로딩 상태 추가)
    const handleDownload = useCallback(async () => {
        if (!certificateRef.current || isSaving) return;

        setIsSaving(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                backgroundColor: '#1C1917',
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `worry-burner-certificate-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('인증서 저장 실패:', error);
        } finally {
            setIsSaving(false);
        }
    }, [isSaving]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            {/* 인증서 카드 */}
            <div
                ref={certificateRef}
                className="certificate rounded-2xl p-8 text-center"
            >
                {/* 재/연기 이미지 */}
                <div className="w-20 h-20 mx-auto mb-6 relative">
                    {/* 연기 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-500/50 to-transparent rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-2 bg-gradient-to-t from-gray-400/40 to-transparent rounded-full blur-lg" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        💨
                    </div>
                </div>

                {/* 제목 */}
                <h2 className="text-xl font-bold text-[var(--text)] mb-4">
                    소각 인증서
                </h2>

                {/* 메인 메시지 */}
                <div className="my-8">
                    <p className="font-hand text-[var(--accent)] text-2xl leading-relaxed">
                        &ldquo;제 고민이<br />한 줌의 재가 되었습니다&rdquo;
                    </p>
                </div>

                {/* 구분선 */}
                <div className="w-16 h-0.5 bg-[var(--muted)]/30 mx-auto my-6" />

                {/* 소각 일시 */}
                <div className="space-y-1">
                    <p className="text-[var(--muted)] text-sm">소각 일시</p>
                    <p className="text-[var(--text)] font-medium">
                        {formatDate(burnedAt)}
                    </p>
                    <p className="text-[var(--muted)] text-sm">
                        {formatTime(burnedAt)}
                    </p>
                </div>

                {/* 로고 */}
                <div className="mt-8 pt-6 border-t border-[var(--muted)]/20">
                    <p className="text-[var(--primary)] font-bold">
                        🔥 Worry Burner
                    </p>
                    <p className="font-hand text-[var(--muted)] text-sm mt-1">
                        고민을 태워, 마음을 비우다
                    </p>
                </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3 mt-6">
                <motion.button
                    onClick={handleDownload}
                    disabled={isSaving}
                    whileHover={!isSaving ? { scale: 1.02 } : {}}
                    whileTap={!isSaving ? { scale: 0.98 } : {}}
                    aria-label="인증서 이미지로 저장하기"
                    className={`flex-1 py-3 px-4 bg-[var(--primary)] rounded-lg
                     text-white font-medium flex items-center justify-center gap-2
                     ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            저장 중...
                        </>
                    ) : (
                        <>
                            📥 이미지 저장
                        </>
                    )}
                </motion.button>

                {onClose && (
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="인증서 닫기"
                        className="flex-1 py-3 px-4 bg-[var(--surface)] border border-[var(--muted)]/30
                       rounded-lg text-[var(--text)] font-medium"
                    >
                        닫기
                    </motion.button>
                )}
            </div>

            {/* 새 고민 작성 링크 */}
            <div className="text-center mt-6">
                <Link
                    href="/"
                    className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                >
                    새 고민 작성하기 →
                </Link>
            </div>
        </motion.div>
    );
}
