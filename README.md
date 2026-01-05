# 🔥 Worry Burner

> **"고민을 태워, 마음을 비우다"**

익명으로 고민을 작성하면 24시간 후 불타는 애니메이션과 함께 영원히 사라지는 감성 웹앱

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📝 **익명 고민 작성** | 500자 제한, 완전 익명 |
| ⏳ **24시간 카운트다운** | 시간이 지나면 자동 소각 |
| 🔥 **소각 애니메이션** | 불씨 파티클과 함께 감성 효과 |
| 📜 **소각 인증서** | PNG 다운로드 및 공유 |
| 👀 **엿보기** | 다른 사람의 익명 고민 랜덤 조회 |
| ❤️ **토닥토닥** | 익명 공감 기능 |
| 🛡️ **자살예방 필터** | 위험 키워드 감지 + 상담전화 연결 |

---

## 🎬 데모

<!-- 배포 후 URL 업데이트 -->
🔗 **Live Demo**: [worry-burner.vercel.app](https://worry-burner.vercel.app)

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS + Custom CSS |
| Animation | Framer Motion |
| Font | Gowun Batang, Nanum Pen Script |
| Deployment | Vercel |

---

## 🚀 시작하기

### Prerequisites

- Node.js 18+
- npm 또는 yarn
- Supabase 계정

### Installation

```bash
# 레포지토리 클론
git clone https://github.com/your-username/worry-burner.git
cd worry-burner

# 의존성 설치
npm install
```

### 환경변수 설정

```bash
# env.template을 복사
cp env.template .env.local
```

`.env.local` 파일 수정:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cron 인증
CRON_SECRET=your_random_secret

# 앱 URL (배포 후 변경)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 마이그레이션 실행:

```sql
-- supabase/migrations/001_create_worries.sql 내용 실행
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx           # 메인 (고민 작성)
│   ├── burn/[id]/         # 소각 페이지
│   ├── peek/              # 엿보기
│   └── api/               # API Routes
├── components/
│   ├── WriteForm.tsx      # 고민 작성 폼
│   ├── BurnAnimation.tsx  # 소각 애니메이션
│   ├── Certificate.tsx    # 인증서
│   ├── Countdown.tsx      # 카운트다운
│   └── ...
└── lib/
    ├── supabase.ts        # Supabase 클라이언트
    └── keywords.ts        # 자살예방 필터
```

---

## 🚢 배포

### Vercel 배포

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 Import
3. Environment Variables 설정
4. Deploy!

### 환경변수 (Vercel)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 키 |
| `CRON_SECRET` | Cron 인증용 |
| `NEXT_PUBLIC_BASE_URL` | 배포된 앱 URL |

---

## 🎨 Design System

**테마: Ember & Ash** - 타다 남은 재와 불씨

| 색상 | HEX | 용도 |
|------|-----|------|
| Deep Night | `#1C1917` | 메인 배경 |
| Charcoal Wood | `#292524` | 카드 배경 |
| Flame Heart | `#E25822` | 메인 액션 |
| Spark Gold | `#FFA725` | 하이라이트 |
| Lit Parchment | `#F5E8D8` | 텍스트 |

📚 자세한 내용: [Design System](docs/DESIGN_SYSTEM.md) | [Brand Guidelines](docs/BRAND_GUIDELINES.md)

---

## 📄 License

MIT License

---

<p align="center">
  Made with 🔥 by Worry Burner Team
</p>
