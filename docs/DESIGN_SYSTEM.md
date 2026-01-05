# Worry Burner 디자인 시스템

> **Ember & Ash** - 타다 남은 재와 불씨

---

## 1. 색상 시스템

### 디자인 철학
**차가운 디지털 공간을 따뜻한 아날로그 감성으로 전환**

영감: 캠프파이어의 따뜻한 빛, 벽난로 앞 아늑함, 불에 탄 종이의 질감

### 색상 팔레트

#### Campfire 스케일
| Token | HEX | 이름 | 용도 |
|-------|-----|------|------|
| `campfire-900` | `#1C1917` | Deep Night | 메인 배경 |
| `campfire-800` | `#292524` | Charcoal Wood | 카드/입력창 배경 |
| `campfire-700` | `#44403C` | Burnt Wood | 테두리/구분선 |
| `campfire-500` | `#E25822` | Flame Heart | 메인 액션 |
| `campfire-400` | `#FF4500` | Ember Glow | 글로우 효과 |
| `campfire-300` | `#FFA725` | Spark Gold | 하이라이트 |
| `campfire-100` | `#F5E8D8` | Lit Parchment | 메인 텍스트 |

#### CSS 변수
```css
:root {
  --background: #1C1917;
  --surface: #292524;
  --border: #44403C;
  --primary: #E25822;
  --accent: #FFA725;
  --text: #F5E8D8;
  --text-muted: #A8A29E;
}
```

### 그라디언트
```css
/* 불꽃 버튼 */
.fire-gradient {
  background: linear-gradient(to top, #CC3300, #E25822, #FFA725);
}

/* 비네팅 배경 */
.vignette {
  background: radial-gradient(ellipse at center,
    #292524 0%, #1C1917 70%, #0C0A09 100%);
}
```

### ✅ Do's
- 배경: campfire-900/800
- 텍스트: campfire-100 (양피지색)
- 강조: campfire-500 그라디언트

### ❌ Don'ts
- 순백색 `#FFFFFF` 금지
- 순검정 `#000000` 단독 금지
- 차가운 파란색 금지

---

## 2. 타이포그래피

### 폰트 패밀리

#### Primary: Gowun Batang (고운바탕)
```css
font-family: 'Gowun Batang', serif;
```
- **Weight**: 400 (Regular), 700 (Bold)
- **용도**: 제목, 본문, 입력창
- **특징**: 둥글고 부드러운 명조체

#### Accent: Nanum Pen Script (나눔펜스크립트)
```css
font-family: 'Nanum Pen Script', cursive;
/* 또는 */
.font-hand { font-family: 'Nanum Pen Script', cursive; }
```
- **용도**: 감성 문구, 위로 메시지
- **특징**: 친근한 손글씨

### 타입 스케일
| 레벨 | 크기 | 용도 |
|------|------|------|
| Display | 48px / Bold | 메인 타이틀 |
| H1 | 36px / Bold | 페이지 제목 |
| H2 | 24px / Bold | 섹션 제목 |
| Body | 16px / Regular | 본문 |
| Body Large | 18px / Regular | 고민 내용 |
| Small | 14px / Regular | 보조 텍스트 |
| Handwriting | 24px / Nanum Pen | 감성 문구 |

---

## 3. 컴포넌트

### Fire Button (Primary)
```css
.btn-fire {
  background: linear-gradient(to top, #CC3300, #E25822, #FFA725);
  animation: breathe 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.4);
  border-radius: 8px;
  padding: 16px 32px;
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.4); }
  50% { box-shadow: 0 0 35px rgba(255, 69, 0, 0.7); }
}
```

**상태**:
- `hover`: scale(1.02), brightness 증가
- `active`: scale(0.98)
- `disabled`: opacity 0.5

### Paper Textarea
```css
.paper-texture {
  background-color: #292524;
  background-image: 
    linear-gradient(transparent 1.9rem, rgba(245, 232, 216, 0.04) 1.9rem);
  background-size: 100% 2rem;
  border: 1px solid rgba(245, 232, 216, 0.1);
}
```

### Modal
```css
.modal-overlay {
  background: rgba(12, 10, 9, 0.92);
  backdrop-filter: blur(8px);
}
```

### Certificate
```css
.certificate {
  background: linear-gradient(180deg, #292524 0%, #1C1917 100%);
  border: 2px solid rgba(255, 167, 37, 0.25);
}
```

---

## 4. 애니메이션

### 원칙
- 자연스럽고 부드러운 움직임
- 불꽃의 일렁임 모방
- 과하지 않게, 감성적으로

### Duration
| 타입 | 시간 |
|------|------|
| Fast | 200ms |
| Normal | 300ms |
| Slow | 500ms |
| Breathe Cycle | 2s |

### 핵심 애니메이션
| 이름 | 용도 | 특징 |
|------|------|------|
| `breathe` | 버튼 글로우 | 2초 주기, 무한 |
| `ember` | 불씨 파티클 | 위로 상승 |
| `burn-mask` | 소각 효과 | 2.5초 |
| `urgent-pulse` | 긴박감 | 1초 opacity |

---

## 5. 스페이싱

### 기본 단위: 4px

| Token | 값 |
|-------|-----|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |

### 사용 가이드
- 컴포넌트 패딩: 16-24px
- 섹션 간격: 32-48px
- 페이지 마진: 16px (모바일) / 24px (데스크톱)

---

## 6. 아이콘 & 이모지

### 이모지 시스템
| 이모지 | 용도 |
|--------|------|
| 🔥 | 소각, 태우기, 로고 |
| 👀 | 엿보기 |
| 🌙 | 빈 상태, 밤 |
| ❤️ | 토닥토닥 |
| 📋 | 복사 |
| 💨 | 연기, 사라짐 |

### 아이콘 라이브러리
- **권장**: Lucide React
- **스타일**: 2px stroke, rounded
- **색상**: `#F5E8D8` 또는 currentColor

---

## 7. 반응형 브레이크포인트

| 이름 | 너비 |
|------|------|
| Mobile | < 640px |
| Tablet | 640-1024px |
| Desktop | > 1024px |

### 터치 타겟
- 최소 **44x44px**

---

*Last Updated: 2026-01-05*
