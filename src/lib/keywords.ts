// 자살예방 금칙어 리스트 및 필터 함수

// 민감한 키워드 목록
const SENSITIVE_KEYWORDS = [
    '자살',
    '죽고싶',
    '죽고 싶',
    '동반',
    '목숨',
    '생을마감',
    '극단적',
    '자해',
    '끝내고싶',
    '끝내고 싶',
    '세상을 떠나',
    '삶을 포기',
    '더이상 살',
    '더 이상 살',
];

// 상담 전화번호 정보
export const HELPLINE_INFO = {
    suicide_prevention: {
        name: '자살예방상담전화',
        number: '1393',
        description: '24시간 운영되는 자살예방 전문 상담전화입니다.',
    },
    mental_health: {
        name: '정신건강위기상담전화',
        number: '1577-0199',
        description: '정신건강 위기 상황 시 전문 상담을 받을 수 있습니다.',
    },
};

/**
 * 텍스트에서 민감한 키워드를 감지합니다.
 * @param text 검사할 텍스트
 * @returns 감지된 경우 true
 */
export function containsSensitiveKeywords(text: string): boolean {
    if (!text) return false;

    const normalizedText = text.toLowerCase().replace(/\s+/g, '');

    return SENSITIVE_KEYWORDS.some(keyword => {
        const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
        return normalizedText.includes(normalizedKeyword);
    });
}

/**
 * 텍스트에서 발견된 민감한 키워드 목록을 반환합니다.
 * @param text 검사할 텍스트
 * @returns 발견된 키워드 배열
 */
export function findSensitiveKeywords(text: string): string[] {
    if (!text) return [];

    const normalizedText = text.toLowerCase().replace(/\s+/g, '');

    return SENSITIVE_KEYWORDS.filter(keyword => {
        const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
        return normalizedText.includes(normalizedKeyword);
    });
}
