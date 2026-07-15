/* 공통 헤더·푸터 — 각 페이지의 빈 <header>/<footer>에 내용 주입 */
(function () {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const email = 'contact@naver.com';

  function active(...files) {
    return files.some((f) => page === f.toLowerCase()) ? ' ms_nav_link--active' : '';
  }

  const header = document.querySelector('header.ms_header');
  if (header) {
    header.innerHTML = `
      <div class="ms_header_i">
        <a class="ms_logo" href="./index.html"><img src="./img/novasm_logo_navy.png" alt="novasm logo"></a>
        <nav class="ms_nav">
          <a class="ms_nav_link${active('company.html')}" href="./company.html">Company</a>
          <a class="ms_nav_link${active('service.html')}" href="./service.html">Services</a>
          <a class="ms_nav_link${active('portfolio.html', 'view.html')}" href="./portfolio.html">Portfolio</a>
          <a class="ms_nav_link${active('whynovasm.html')}" href="./whynovasm.html">WHY NOVA SM</a>
        </nav>
        <button class="ms_hamburger" aria-label="메뉴" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    const hamburger = header.querySelector('.ms_hamburger');
    const nav = header.querySelector('.ms_nav');
    hamburger.addEventListener('click', () => {
      const open = nav.classList.toggle('ms_nav--open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  const footer = document.querySelector('footer.ms_footer');
  if (footer) {
    footer.innerHTML = `
      <div class="ms_footer_top">
        <div class="ms_footer_brand">
          <a class="ms_footer_logo" href="./index.html">NOVASM</a>
          <p class="ms_footer_tagline">
            한국 메디컬 마케팅의 새로운 기준<br>
            브랜드 성장의 전 과정을 함께합니다.
          </p>
        </div>
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
        <div class="ms_footer_contact">
          <span class="ms_footer_contact_title">Contact</span>
          <p class="ms_footer_contact_item">
            <a href="mailto:${email}">${email}</a>
          </p>
          <p class="ms_footer_contact_item">서울 마포구 월드컵북로4길 81</p>
          <p class="ms_footer_contact_item">한국 메디컬 마케팅 전문 기업</p>
        </div>
      </div>
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
            <a href="mailto:${email}">${email}</a>
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
      <div class="ms_footer_bottom">
        <p class="ms_footer_copy">© 2026 NOVASM. All Rights Reserved.</p>
        <div class="ms_footer_accent" aria-hidden="true"></div>
      </div>
    `;
  }
})();
