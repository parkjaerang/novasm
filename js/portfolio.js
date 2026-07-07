/* ─────────────────────────────────────
   포트폴리오 필터 & 카드 애니메이션
   카테고리 버튼 클릭 시 해당 카드만 표시
───────────────────────────────────── */
(function () {

  const PROJECTS = window.NOVASM_PROJECTS || [];
  /* 필터 카테고리 정의 */
  const FILTERS = [
    { key: 'all',     label: '전체' },
    { key: 'medical', label: '의료미용 업계 마케팅 사례' },
    { key: 'clinic',  label: '피부과 운영 사례' },
    { key: 'video',   label: '영상콘텐츠 제작사례' },
    { key: 'brand',   label: '브랜드 마케팅 사례' },
  ];

  /* 현재 활성 필터 */
  let activeFilter = 'all';

  /* 카드 HTML 생성 */
  function buildCard(p) {
    return `
      <article class="pf_card" data-category="${p.category}" data-id="${p.id}">
        <div class="pf_card_top">
          <span class="pf_card_num">${p.num}</span>
          <p class="pf_card_desc">${p.topDesc.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="pf_card_img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="pf_card_bottom">
          <div class="pf_card_row">
            <div>
              <p class="pf_card_name">${p.name}</p>
              <p class="pf_card_sub">${p.sub}</p>
            </div>
            <a class="pf_card_arrow" href="./view.html?id=${p.id}" aria-label="자세히 보기">›</a>
          </div>
          <div class="pf_card_tags">
            ${p.tags.map(t => `<span class="pf_card_tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `;
  }

  /* 필터 버튼 HTML 생성 */
  function buildFilters() {
    return FILTERS.map(f => `
      <button
        class="pf_filter_btn${f.key === 'all' ? ' pf_filter_btn--active' : ''}"
        data-filter="${f.key}"
      >${f.label}</button>
    `).join('');
  }

  /* 필터 적용 — 카드 표시/숨김 + 애니메이션 */
  function applyFilter(key) {
    activeFilter = key;
    const cards = document.querySelectorAll('.pf_card');
    let visible = 0;

    cards.forEach((card, i) => {
      const match = key === 'all' || card.dataset.category === key;
      if (match) {
        /* 숨김 클래스 제거 후 등장 애니메이션 */
        card.classList.remove('pf_card--hidden');
        card.classList.remove('pf_card--animate');
        /* 리플로우 강제 후 애니메이션 재실행 */
        void card.offsetWidth;
        card.style.animationDelay = `${visible * 0.07}s`;
        card.classList.add('pf_card--animate');
        visible++;
      } else {
        card.classList.add('pf_card--hidden');
      }
    });

    /* 결과 없음 처리 */
    const empty = document.querySelector('.pf_empty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  /* 페이지 마운트 */
  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (!main) return;

    /* 포트폴리오 전체 HTML 주입 */
    main.innerHTML = `
      <!-- 히어로 섹션 -->
      <section class="pf_hero">
        <div class="pf_hero_watermark" aria-hidden="true"><span>N</span><span>SM</span></div>
        <span class="pf_hero_label">PROJECTS</span>
        <div class="pf_hero_divider"></div>
        <h1 class="pf_hero_headline">
          메디컬 브랜드의 성장을 만들어온<br>
          NOVA SM의 다양한 프로젝트를<br class="pf_hero_br--mobile">소개합니다.
        </h1>
      </section>

      <!-- 필터 바 -->
      <div class="pf_filter" role="group" aria-label="프로젝트 필터">
        ${buildFilters()}
      </div>

      <!-- 프로젝트 카드 그리드 -->
      <section class="pf_grid_section">
        <div class="pf_grid">
          ${PROJECTS.map(buildCard).join('')}
          <div class="pf_empty">
            <p class="pf_empty_text">해당 카테고리의 프로젝트가 없습니다.</p>
          </div>
        </div>
      </section>
    `;

    /* 필터 버튼 이벤트 바인딩 */
    document.querySelectorAll('.pf_filter_btn').forEach(btn => {
      btn.addEventListener('click', function () {
        /* 활성 버튼 클래스 전환 */
        document.querySelectorAll('.pf_filter_btn').forEach(b => b.classList.remove('pf_filter_btn--active'));
        this.classList.add('pf_filter_btn--active');
        /* 필터 적용 */
        applyFilter(this.dataset.filter);
      });
    });

    /* 카드 클릭 시 상세 페이지 이동 */
    document.querySelectorAll('.pf_card').forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.pf_card_arrow')) return;
        const id = this.dataset.id;
        if (id) location.href = `./view.html?id=${id}`;
      });
    });

    /* 초기 등장 애니메이션 실행 */
    applyFilter('all');
  });

})();
