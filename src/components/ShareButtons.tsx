'use client';

// 링크 복사 + 카카오 공유 버튼
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShareButtonsProps {
    url: string;
    title?: string;
    description?: string;
}

declare global {
    interface Window {
        Kakao: {
            init: (key: string) => void;
            isInitialized: () => boolean;
            Share: {
                sendDefault: (options: Record<string, unknown>) => void;
            };
        };
    }
}

export default function ShareButtons({
    url,
    title = '누군가의 고민이 타오르고 있습니다 🔥',
    description = '24시간 후 영원히 사라질 고민'
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [kakaoReady, setKakaoReady] = useState(false);

    // 카카오 SDK 초기화
    useEffect(() => {
        const initKakao = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                // 카카오 JavaScript 키 (환경변수로 관리 권장)
                const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
                if (kakaoKey) {
                    window.Kakao.init(kakaoKey);
                    setKakaoReady(true);
                }
            } else if (window.Kakao?.isInitialized()) {
                setKakaoReady(true);
            }
        };

        // SDK 로드 확인
        if (window.Kakao) {
            initKakao();
        } else {
            const checkKakao = setInterval(() => {
                if (window.Kakao) {
                    initKakao();
                    clearInterval(checkKakao);
                }
            }, 100);

            // 5초 후 타임아웃
            setTimeout(() => clearInterval(checkKakao), 5000);
        }
    }, []);

    // 클립보드 복사
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // 폴백: 구형 브라우저
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // 카카오톡 공유
    const handleKakaoShare = () => {
        if (!window.Kakao?.Share) return;

        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: `${window.location.origin}/og-image.png`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: '고민 보러가기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    };

    return (
        <div className="flex gap-3">
            {/* 링크 복사 버튼 */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                aria-label="링크 복사하기"
                className="flex-1 py-3 px-4 bg-[var(--surface)] border border-[var(--muted)]/30
                   hover:border-[var(--accent)]/50 rounded-lg
                   text-[var(--text)] font-medium
                   flex items-center justify-center gap-2 transition-colors"
            >
                {copied ? (
                    <>
                        <span>✓</span>
                        복사됨!
                    </>
                ) : (
                    <>
                        <span>📋</span>
                        링크 복사
                    </>
                )}
            </motion.button>

            {/* 카카오톡 공유 버튼 */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleKakaoShare}
                disabled={!kakaoReady}
                aria-label="카카오톡으로 공유하기"
                className="flex-1 py-3 px-4 bg-[#FEE500] hover:bg-[#FDD835]
                   rounded-lg text-[#3C1E1E] font-medium
                   flex items-center justify-center gap-2 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.85 5.33 4.6 6.74-.15.52-.56 1.92-.64 2.22-.1.36.13.35.28.26.11-.07 1.77-1.2 2.48-1.68.42.06.85.09 1.28.09 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
                </svg>
                카카오톡
            </motion.button>
        </div>
    );
}
