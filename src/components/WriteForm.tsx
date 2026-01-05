'use client';

// 고민 작성 폼 컴포넌트
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { containsSensitiveKeywords } from '@/lib/keywords';
import { MAX_CONTENT_LENGTH } from '@/lib/types';
import SafetyModal from './SafetyModal';

interface WriteFormProps {
    onSuccess: (id: string) => void;
}

export default function WriteForm({ onSuccess }: WriteFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSafetyModal, setShowSafetyModal] = useState(false);

    const characterCount = content.length;
    const isOverLimit = characterCount > MAX_CONTENT_LENGTH;

    const handleSubmit = useCallback(async () => {
        if (!content.trim() || isSubmitting || isOverLimit) return;

        // 클라이언트 측 민감 키워드 체크
        if (containsSensitiveKeywords(content)) {
            setShowSafetyModal(true);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/worries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content.trim() }),
            });

            const data = await response.json();

            if (data.error === 'sensitive_content') {
                setShowSafetyModal(true);
                setIsSubmitting(false);
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || '오류가 발생했습니다.');
            }

            onSuccess(data.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            setIsSubmitting(false);
        }
    }, [content, isSubmitting, isOverLimit, onSuccess]);

    // 키보드 단축키: Ctrl+Enter / Cmd+Enter로 제출
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl mx-auto"
            >
                {/* 종이 질감 textarea */}
                <div className="paper-texture rounded-xl p-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="여기에 고민을 적어주세요...&#10;&#10;아무도 모르게, 불태워 드릴게요. 🔥"
                        aria-label="고민 입력"
                        className="w-full min-h-[300px] p-6 bg-transparent text-[var(--text)] 
                       placeholder:text-[var(--muted)] placeholder:opacity-50
                       focus:outline-none resize-none
                       text-lg leading-relaxed"
                        disabled={isSubmitting}
                    />
                </div>

                {/* 글자 수 카운터 + 단축키 힌트 */}
                <div className="flex justify-between items-center mt-3 px-1">
                    <div className="flex items-center gap-3">
                        <span className={`text-sm ${isOverLimit ? 'text-[var(--danger)]' : 'text-[var(--muted)]'}`}>
                            {characterCount} / {MAX_CONTENT_LENGTH}자
                        </span>
                        <span className="text-xs text-[var(--muted)]/60 hidden md:inline">
                            ⌘+Enter로 태우기
                        </span>
                    </div>
                    {error && (
                        <span className="text-sm text-[var(--danger)]">{error}</span>
                    )}
                </div>

                {/* 태워버리기 버튼 */}
                <motion.button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting || isOverLimit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="고민 태워버리기"
                    className="w-full mt-6 py-4 px-8 btn-fire rounded-lg
                     text-white font-bold text-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:transform-none disabled:shadow-none
                     flex items-center justify-center gap-3"
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin">🔄</span>
                            불을 피우는 중...
                        </>
                    ) : (
                        <>
                            태워버리기 🔥
                        </>
                    )}
                </motion.button>
            </motion.div>

            {/* 자살예방 모달 */}
            <SafetyModal
                isOpen={showSafetyModal}
                onClose={() => setShowSafetyModal(false)}
            />
        </>
    );
}
