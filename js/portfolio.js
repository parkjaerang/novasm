/* 포트폴리오 — 목록 렌더링, 카테고리 필터, 카드 애니메이션 */
(function () {
  const PROJECTS = window.NOVASM_PROJECTS || [];

  const FILTERS = [
    { key: 'all',     label: '전체' },
    { key: 'medical', label: '의료미용 업계 마케팅 사례' },
    { key: 'clinic',  label: '피부과 운영 사례' },
    { key: 'video',   label: '영상콘텐츠 제작사례' },
    { key: 'brand',   label: '브랜드 마케팅 사례' },
  ];

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
            ${p.tags.map((t) => `<span class="pf_card_tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `;
  }

  function buildFilters() {
    return FILTERS.map((f) => `
      <button class="pf_filter_btn" data-filter="${f.key}">${f.label}</button>
    `).join('');
  }

  function applyFilter(key) {
    document.querySelectorAll('.pf_filter_btn').forEach((btn) => {
      btn.classList.toggle('pf_filter_btn--active', btn.dataset.filter === key);
    });

    let visible = 0;
    document.querySelectorAll('.pf_card').forEach((card) => {
      const match = key === 'all' || card.dataset.category === key;
      if (match) {
        card.classList.remove('pf_card--hidden', 'pf_card--animate');
        void card.offsetWidth;
        card.style.animationDelay = `${visible++ * 0.07}s`;
        card.classList.add('pf_card--animate');
      } else {
        card.classList.add('pf_card--hidden');
      }
    });

    const empty = document.querySelector('.pf_empty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  const main = document.querySelector('main');
  if (!main) return;

  main.innerHTML = `
    <section class="pf_hero">
      <div class="pf_hero_watermark" aria-hidden="true"><span>N</span><span>SM</span></div>
      <span class="pf_hero_label">PROJECTS</span>
      <div class="pf_hero_divider"></div>
      <h1 class="pf_hero_headline">
        메디컬 브랜드의 성장을 만들어온<br>
        NOVA SM의 다양한 프로젝트를<br class="pf_hero_br--mobile">소개합니다.
      </h1>
    </section>
    <div class="pf_filter" role="group" aria-label="프로젝트 필터">
      ${buildFilters()}
    </div>
    <section class="pf_grid_section">
      <div class="pf_grid">
        ${PROJECTS.map(buildCard).join('')}
        <div class="pf_empty">
          <p class="pf_empty_text">해당 카테고리의 프로젝트가 없습니다.</p>
        </div>
      </div>
    </section>
  `;

  main.addEventListener('click', (e) => {
    const btn = e.target.closest('.pf_filter_btn');
    if (btn) {
      applyFilter(btn.dataset.filter);
      return;
    }

    const card = e.target.closest('.pf_card');
    if (card && !e.target.closest('.pf_card_arrow')) {
      const id = card.dataset.id;
      if (id) location.href = `./view.html?id=${id}`;
    }
  });

  applyFilter('all');
})();
