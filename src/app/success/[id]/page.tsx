'use client';

// 성공 페이지 - 비밀 링크 안내
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ShareButtons from '@/components/ShareButtons';

export default function SuccessPage() {
    const params = useParams();
    const id = params.id as string;
    const [secretUrl, setSecretUrl] = useState('');

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        setSecretUrl(`${baseUrl}/burn/${id}`);
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            {/* 배경 */}
            <div className="fixed inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[#1a1a2e] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* 아이콘 */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center text-6xl mb-6"
                >
                    🔥
                </motion.div>

                {/* 제목 */}
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] text-center mb-4">
                    당신의 고민이 담겼습니다
                </h1>

                <p className="text-[var(--muted)] text-center mb-8">
                    24시간 후, 이 고민은 영원히 사라집니다.
                </p>

                {/* 비밀 링크 박스 */}
                <div className="bg-[var(--surface)] rounded-lg p-4 mb-4">
                    <p className="text-xs text-[var(--muted)] mb-2">비밀 링크</p>
                    <code className="text-[var(--accent)] text-sm break-all">
                        {secretUrl}
                    </code>
                </div>

                {/* 경고 */}
                <div className="flex items-start gap-3 bg-[var(--danger)]/10 rounded-lg p-4 mb-6
                        border border-[var(--danger)]/30">
                    <span className="text-xl">⚠️</span>
                    <div className="text-sm text-[var(--text)]">
                        <strong>이 링크를 잃어버리면 다시 볼 수 없습니다.</strong>
                        <p className="text-[var(--muted)] mt-1">
                            안전한 곳에 저장하거나 공유해주세요.
                        </p>
                    </div>
                </div>

                {/* 공유 버튼 */}
                <ShareButtons
                    url={secretUrl}
                    title="누군가의 고민이 타오르고 있습니다 🔥"
                    description="24시간 후 영원히 사라질 고민"
                />

                {/* 고민 보러가기 */}
                <a
                    href={`/burn/${id}`}
                    className="block w-full mt-4 py-4 text-center bg-[var(--primary)]
                     hover:bg-[var(--primary)]/90 rounded-lg text-white font-bold
                     transition-colors"
                >
                    내 고민 보러가기 →
                </a>

                {/* 홈으로 */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm"
                    >
                        새 고민 작성하기
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
