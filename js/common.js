/* ─────────────────────────────────────
   공통 헤더 렌더링 — 모든 페이지에서 사용
   <header class="ms_header"> 태그를 찾아 내용을 주입
   현재 페이지 파일명으로 활성 링크 자동 판별
───────────────────────────────────── */
(function () {
  const header = document.querySelector('header.ms_header');
  if (!header) return;

  /* 현재 파일명으로 활성 메뉴 판별 (대소문자 무시) */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* 활성 클래스 반환 헬퍼 */
  function active(filename) {
    return page === filename.toLowerCase() ? ' ms_nav_link--active' : '';
  }

  header.innerHTML = `
    <div class="ms_header_i">
      <a class="ms_logo" href="./index.html">NOVASM</a>
      <nav class="ms_nav" id="msNav">
        <a class="ms_nav_link${active('company.html')}" href="./company.html">Company</a>
        <a class="ms_nav_link${active('service.html')}" href="./service.html">Services</a>
        <a class="ms_nav_link${active('portfolio.html')}" href="./portfolio.html">Portfolio</a>
        <a class="ms_nav_link${active('whynovasm.html')}" href="./whynovasm.html">WHY NOVA SM</a>
      </nav>
      <!-- 모바일 햄버거 버튼 (640px 이하에서만 표시) -->
      <button class="ms_hamburger" id="msHamburger" aria-label="메뉴" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  /* 햄버거 토글 */
  const hamburger = document.getElementById('msHamburger');
  const nav = document.getElementById('msNav');
  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('ms_nav--open', !open);
  });
})();

/* ─────────────────────────────────────
   공통 푸터 렌더링 — 모든 페이지에서 사용
   <footer></footer> 태그를 찾아 내용을 주입
───────────────────────────────────── */
(function () {
  const footer = document.querySelector('footer.ms_footer');
  if (!footer) return;

  footer.innerHTML = `
    <!-- 상단: 로고 + 사이트맵 + 연락처 -->
    <div class="ms_footer_top">

      <!-- 좌: 로고 + 슬로건 -->
      <div class="ms_footer_brand">
        <a class="ms_footer_logo" href="./index.html">NOVASM</a>
        <p class="ms_footer_tagline">
          한국 메디컬 마케팅의 새로운 기준<br>
          브랜드 성장의 전 과정을 함께합니다.
        </p>
      </div>

      <!-- 중앙: 사이트맵 -->
      <nav class="ms_footer_nav" aria-label="푸터 내비게이션">
        <div class="ms_footer_nav_col">
          <span class="ms_footer_nav_title">Company</span>
          <a class="ms_footer_nav_link" href="./company.html">Who We Are</a>
          <a class="ms_footer_nav_link" href="./company.html#cp_why">왜 NOVA SM인가</a>
          <a class="ms_footer_nav_link" href="./company.html#cp_strength">우리의 강점</a>
        </div>
        <div class="ms_footer_nav_col">
          <span class="ms_footer_nav_title">Services</span>
          <a class="ms_footer_nav_link" href="./service.html">SNS Channel Management</a>
          <a class="ms_footer_nav_link" href="./service.html">Video Production</a>
          <a class="ms_footer_nav_link" href="./service.html">Creative Design</a>
          <a class="ms_footer_nav_link" href="./service.html">KOL / KOC Marketing</a>
        </div>
        <div class="ms_footer_nav_col">
          <span class="ms_footer_nav_title">More</span>
          <a class="ms_footer_nav_link" href="./portfolio.html">Portfolio</a>
          <a class="ms_footer_nav_link" href="./whynovasm.html">WHY NOVA SM</a>
          <a class="ms_footer_nav_link" href="./index.html#contact">Contact</a>
        </div>
      </nav>

      <!-- 우: 연락처 -->
      <div class="ms_footer_contact">
        <span class="ms_footer_contact_title">Contact</span>
        <p class="ms_footer_contact_item">
          <a href="mailto:contact@naver.com">contact@naver.com</a>
        </p>
        <p class="ms_footer_contact_item">서울 마포구 월드컵북로4길 81</p>
        <p class="ms_footer_contact_item">한국 메디컬 마케팅 전문 기업</p>
      </div>

    </div>

    <!-- 사업자 정보 -->
    <div class="ms_footer_biz">
      <div class="ms_footer_biz_item">
        <span class="ms_footer_biz_label">COMPANY</span>
        <span class="ms_footer_biz_value">NOVASM</span>
      </div>
      <div class="ms_footer_biz_item">
        <span class="ms_footer_biz_label">CEO</span>
        <span class="ms_footer_biz_value">OOO</span>
      </div>
      <div class="ms_footer_biz_item">
        <span class="ms_footer_biz_label">BIZ NO.</span>
        <span class="ms_footer_biz_value">012-34-56789</span>
      </div>
      <div class="ms_footer_biz_item">
        <span class="ms_footer_biz_label">EMAIL</span>
        <span class="ms_footer_biz_value">
          <a href="mailto:contact@naver.com">contact@naver.com</a>
        </span>
      </div>
      <div class="ms_footer_biz_item">
        <span class="ms_footer_biz_label">ADDRESS</span>
        <span class="ms_footer_biz_value">
          서울 마포구 월드컵북로4길 81<br>
          (동교동, WAWA109사옥) 1층
        </span>
      </div>
    </div>

    <!-- 하단 카피라이트 -->
    <div class="ms_footer_bottom">
      <p class="ms_footer_copy">© 2026 NOVASM. All Rights Reserved.</p>
      <div class="ms_footer_accent" aria-hidden="true"></div>
    </div>
  `;
})();
