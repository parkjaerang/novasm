# NOVA SM Website

NOVA SM 브랜드 웹사이트 정적 프로젝트입니다.  
메인 랜딩부터 회사 소개, 서비스 소개, 포트폴리오 목록/상세 페이지까지 포함합니다.

## 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## 페이지 구성

- `index.html`  
  메인 랜딩 페이지. 인트로 오버레이, 핵심 서비스, 파트너 슬라이더, 포트폴리오 티저, 문의 폼 섹션을 포함합니다.
- `company.html`  
  회사 소개 페이지. WHY NOVA SM, 강점(지도 SVG 애니메이션), 업무 영역, 스토리, 공간, 클로징 CTA를 포함합니다.
- `service.html`  
  서비스 소개 페이지. 4개 핵심 서비스 카드를 중심으로 구성됩니다.
- `portfolio.html`  
  포트폴리오 목록 페이지. 필터 기반 카드 렌더링을 수행합니다.
- `view.html`  
  포트폴리오 상세 페이지. URL 쿼리(`id`)로 프로젝트를 로드하고 콘텐츠 라이트박스를 제공합니다.
- `whynovasm.html`  
  WHY NOVA SM 독립 페이지. 이유 카드와 인터랙션 중심 레이아웃입니다.

## 주요 디렉터리

- `css/`  
  페이지별 스타일 파일 (`index.css`, `company.css`, `service.css`, `portfolio.css`, `view.css`, `whynovasm.css`, `intro.css`, `common.css`)
- `js/`  
  페이지별 스크립트 및 공통 모듈
  - `common.js`: 공통 헤더/푸터 렌더링, 현재 메뉴 active 처리
  - `projects-data.js`: 포트폴리오 공통 데이터 소스
  - `portfolio.js`: 포트폴리오 목록 렌더링/필터링
  - `view.js`: 상세 페이지 렌더링/콘텐츠 라이트박스
  - `index.js`, `company.js`, `service.js`, `whynovasm.js`, `intro.js`: 각 페이지 전용 인터랙션
- `img/`  
  페이지에서 사용하는 이미지 및 영상(mp4) 리소스

## 로컬 실행 방법

정적 파일 프로젝트이므로 간단한 로컬 서버로 실행합니다.

### 1) Python 사용

```bash
python -m http.server 5500
```

브라우저에서 아래 주소로 접속:

- [http://localhost:5500/index.html](http://localhost:5500/index.html)

### 2) VS Code / Cursor Live Server 사용

- 프로젝트 루트에서 `index.html`을 Live Server로 실행

## 데이터 수정 가이드 (포트폴리오)

포트폴리오 목록과 상세는 `js/projects-data.js`를 기준으로 렌더링됩니다.

- 프로젝트 추가 시 필수 필드
  - `id`, `num`, `category`, `categoryLabel`
  - `topDesc`, `image`, `name`, `sub`, `tags`
  - `overview`, `challenge`, `solution`, `results`, `services`
  - `contents` (이미지/영상 목록)
- `portfolio.html`의 카드 목록과 `view.html?id={id}` 상세는 같은 데이터 소스를 사용합니다.

## 공통 UI 동작

- 모든 페이지의 `<header class="ms_header">`, `<footer class="ms_footer">`는 `js/common.js`에서 동적으로 주입됩니다.
- 현재 페이지 기준으로 네비게이션 active 상태가 자동 적용됩니다.
- 모바일에서는 햄버거 메뉴 토글을 사용합니다.

## 주의사항

- `view.html`은 `id` 쿼리가 없거나 잘못되면 "프로젝트를 찾을 수 없습니다" 화면을 출력합니다.
- 이미지/영상 파일 경로가 잘못되면 카드/라이트박스 미디어가 표시되지 않습니다.
- CORS/경로 문제를 피하기 위해 파일 더블클릭 실행보다 로컬 서버 실행을 권장합니다.

## 향후 개선 아이디어

- 문의 폼 백엔드 연동 (메일/DB)
- 포트폴리오 다국어 지원 (KR/CN/EN)
- SEO 메타 태그 및 OG 태그 강화
- 성능 최적화 (이미지 포맷/사이즈, 코드 분리)
