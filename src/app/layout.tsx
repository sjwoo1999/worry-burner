import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Worry Burner | 고민을 태워버리세요 🔥",
  description: "익명으로 고민을 작성하면 24시간 후 불타는 애니메이션과 함께 영원히 사라집니다. 디지털 공간에서의 심리적 해방.",
  keywords: ["고민", "익명", "감성", "힐링", "스트레스 해소", "Z세대"],
  openGraph: {
    title: "Worry Burner | 고민을 태워버리세요 🔥",
    description: "익명으로 고민을 작성하면 24시간 후 불타는 애니메이션과 함께 영원히 사라집니다.",
    images: ["/og-image.png"],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Worry Burner | 고민을 태워버리세요 🔥",
    description: "익명으로 고민을 작성하면 24시간 후 불타는 애니메이션과 함께 영원히 사라집니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 카카오 SDK - integrity 제거 (카카오가 자주 업데이트하므로) */}
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className="antialiased min-h-screen bg-vignette" suppressHydrationWarning>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

