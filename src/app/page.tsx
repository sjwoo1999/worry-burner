'use client';

// 메인 페이지 - 고민 작성 폼
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WriteForm from '@/components/WriteForm';
import SecretLinkModal from '@/components/SecretLinkModal';

export default function HomePage() {
  const router = useRouter();
  const [worryId, setWorryId] = useState<string | null>(null);
  const [secretUrl, setSecretUrl] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    setWorryId(id);
    setSecretUrl(`${baseUrl}/burn/${id}`);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* 비네팅 배경 */}
      <div className="fixed inset-0 bg-vignette -z-10" />

      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
          <span className="text-[var(--primary)]">🔥</span> Worry Burner
        </h1>
        <p className="font-hand text-[var(--text)] text-xl md:text-2xl max-w-md mx-auto opacity-90 leading-relaxed">
          고민을 적어 태워버리세요.
          <br />
          <span className="text-[var(--accent)]">24시간 후</span>, 이 고민은 영원히 사라집니다.
        </p>
      </motion.header>

      {/* 작성 폼 */}
      <WriteForm onSuccess={handleSuccess} />

      {/* 엿보기 링크 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <a
          href="/peek"
          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors
                     text-sm underline underline-offset-4"
        >
          다른 사람의 고민 엿보기 👀
        </a>
      </motion.footer>

      {/* 비밀 링크 모달 */}
      <SecretLinkModal
        isOpen={showModal}
        worryId={worryId || ''}
        secretUrl={secretUrl}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
