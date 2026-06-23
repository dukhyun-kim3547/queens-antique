// 화면에 보여줄 한국어 라벨과 가격 형식을 한곳에 모아둔다.

// 검수 등급: 데이터베이스 값 -> 화면 표시 글자
export const inspectionGradeLabel: Record<string, string> = {
  remote: "원격 감정",
  in_person: "직접 검수",
};

// 보관 상태: 데이터베이스 값 -> 화면 표시 글자
export const storageStatusLabel: Record<string, string> = {
  seller: "판매자 보관",
  queens: "퀸스앤틱 보관",
};

// 작품 상태: 데이터베이스 값 -> 화면 표시 글자
export const itemStatusLabel: Record<string, string> = {
  pending: "등록 대기",
  selling: "판매중",
  sold: "판매완료",
  withdrawn: "내림",
};

// 가격을 "1,800,000원" 형태로 바꿔준다.
export function formatPrice(won: number): string {
  return won.toLocaleString("ko-KR") + "원";
}

// "2026-06-30" 같은 날짜 문자열을 "2026년 6월 30일" 로 바꿔준다.
export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

// 다음 인하 때 적용될 예상 가격을 계산한다.
// (현재가에서 인하폭% 만큼 내림, 단 최저가 밑으로는 안 내려감)
export function nextDropPrice(
  currentPrice: number,
  stepPercent: number,
  reservePrice: number
): number {
  const dropped = Math.floor(currentPrice * (1 - stepPercent / 100));
  return Math.max(dropped, reservePrice);
}
