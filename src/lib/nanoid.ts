// 10자리 비밀 링크 ID 생성 (36진수 알파벳)
import { customAlphabet } from 'nanoid';

// 소문자 알파벳 + 숫자 = 36^10 = 3.6 quadrillion 조합
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 10;

// nanoid 커스텀 생성기
export const generateSecretId = customAlphabet(alphabet, ID_LENGTH);

// ID 유효성 검증
export function isValidSecretId(id: string): boolean {
    if (!id || id.length !== ID_LENGTH) return false;
    return /^[0-9a-z]+$/.test(id);
}
