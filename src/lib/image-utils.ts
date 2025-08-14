// src/lib/image-utils.ts

// 타로 카드 blur placeholder 데이터 URL 생성
export const CARD_BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// 카드 뒷면 blur placeholder
export const CARD_BACK_BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAYDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAfEAABBAEFAQAAAAAAAAAAAAABAAIDESEEBSIxQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AiqNnmfqX6WfUQtY8tNtJ+4K6iiD/2Q==";

// 수트별 blur placeholder 생성
export function getCardBlurDataUrl(suit: string): string {
  // 실제로는 각 수트별로 다른 blur 이미지를 생성하거나
  // 동적으로 base64를 생성할 수 있습니다
  switch (suit) {
    case "major":
      return CARD_BLUR_DATA_URL;
    case "cups":
      return CARD_BLUR_DATA_URL;
    case "pentacles":
      return CARD_BLUR_DATA_URL;
    case "swords":
      return CARD_BLUR_DATA_URL;
    case "wands":
      return CARD_BLUR_DATA_URL;
    default:
      return CARD_BLUR_DATA_URL;
  }
}

// 이미지 사이즈 계산 헬퍼
export function getImageSizes(cardSize: "small" | "medium" | "large"): string {
  switch (cardSize) {
    case "small":
      return "(max-width: 640px) 80px, 96px";
    case "medium":
      return "(max-width: 640px) 112px, (max-width: 768px) 128px, 128px";
    case "large":
      return "(max-width: 640px) 160px, (max-width: 768px) 192px, 192px";
    default:
      return "(max-width: 640px) 112px, 128px";
  }
}

// 이미지 로딩 우선순위 결정
export function getImagePriority(index: number, isVisible: boolean = true): boolean {
  // 첫 3개 카드는 우선 로드
  // 화면에 보이는 카드는 우선 로드
  return index < 3 || isVisible;
}