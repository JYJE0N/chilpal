# 카카오톡 공유 이미지 디버깅 가이드

## 문제 해결 단계

### 1. **로컬 환경에서는 이미지가 안 보임**
- 카카오톡은 외부에서 접근 가능한 HTTPS URL만 지원
- `localhost`나 `127.0.0.1`은 카카오 크롤러가 접근 불가
- **해결**: 배포된 환경에서 테스트 필요

### 2. **카카오 개발자도구에서 URL 검증**
1. https://developers.kakao.com/tool/debugger/sharing 접속
2. 공유할 URL 입력하여 크롤링 테스트
3. OG 태그와 이미지 URL 확인

### 3. **테스트 이미지 URL**
- 기본 테스트: `https://yourdomain.com/api/og/test`
- 동적 이미지: `https://yourdomain.com/api/og?title=테스트&cards=The Fool&question=테스트질문&spreadType=one-card`

### 4. **필수 조건들**
- ✅ HTTPS 프로토콜 (HTTP는 불가)
- ✅ 외부 접근 가능한 도메인
- ✅ 이미지 크기: 권장 1200x630
- ✅ 절대 URL 경로
- ✅ Content-Type: image/* 

### 5. **체크리스트**
- [ ] 배포된 환경에서 테스트
- [ ] 이미지 URL이 직접 접근 가능한지 확인
- [ ] 개발자도구에서 크롤링 테스트
- [ ] 카카오톡 앱에서 실제 공유 테스트

### 6. **디버깅 팁**
- 브라우저 개발자도구에서 console.log로 이미지 URL 확인
- 이미지 URL을 직접 브라우저에서 열어서 표시되는지 확인
- 카카오톡 공유 전에 몇 분 기다리기 (캐시 갱신)

## 예상 해결책
배포 후 `NEXT_PUBLIC_URL`을 실제 도메인으로 변경하면 정상 작동할 예정입니다.