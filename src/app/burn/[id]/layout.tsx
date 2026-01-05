import { Metadata } from 'next';

// Dynamic OG 태그 생성
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: '누군가의 고민이 타오르고 있습니다 🔥 | Worry Burner',
        description: '24시간 후 영원히 사라질 고민. 지금 확인하세요.',
        openGraph: {
            title: '누군가의 고민이 타오르고 있습니다 🔥',
            description: '24시간 후 영원히 사라질 고민',
            images: ['/og-image.png'],
            type: 'website',
            locale: 'ko_KR',
        },
        twitter: {
            card: 'summary_large_image',
            title: '누군가의 고민이 타오르고 있습니다 🔥',
            description: '24시간 후 영원히 사라질 고민',
            images: ['/og-image.png'],
        },
    };
}

export default function BurnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
