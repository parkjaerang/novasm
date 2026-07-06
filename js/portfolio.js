/* ─────────────────────────────────────
   포트폴리오 필터 & 카드 애니메이션
   카테고리 버튼 클릭 시 해당 카드만 표시
───────────────────────────────────── */
(function () {

  /* 프로젝트 카드 데이터
     category: 필터 키 ('all' | 'medical' | 'clinic' | 'video' | 'brand') */
  const PROJECTS = [
    {
      id: 'bls',
      num: '01',
      category: 'medical',
      topDesc: '한국 메디컬 브랜드의 중국 시장 진출과\n브랜드 인지도 확대를 위한 마케팅 프로젝트',
      image: './img/portfolio1.png',
      name: 'BLS CLINIC',
      sub: '중국 마케팅 & 브랜딩 프로젝트',
      tags: ['중국 시장 진출', '브랜드 인지도', 'SNS 마케팅'],
    },
    {
      id: 'toxnfill',
      num: '02',
      category: 'clinic',
      topDesc: '피부과 운영 사례',
      image: './img/portfolio2.png',
      name: 'TOXNFILL',
      sub: '피부과 운영 & 브랜딩 프로젝트',
      tags: ['피부과 운영', '브랜드 성장', '콘텐츠 마케팅'],
    },
    {
      id: 'maison',
      num: '03',
      category: 'brand',
      topDesc: '브랜드 운영 전략과 콘텐츠 마케팅을 통해\n지속 가능한 성장을 이끌어낸 사례',
      image: './img/portfolio4.png',
      name: 'MAISON DE MOI',
      sub: '브랜드 운영 및 콘텐츠 마케팅 프로젝트',
      tags: ['브랜드 전략', '콘텐츠 마케팅', '지속 가능한 성장'],
    },
    // {
    //   id: 'video1',
    //   num: '04',
    //   category: 'video',
    //   topDesc: '의료 시술 영상 콘텐츠 제작 및 SNS 채널 바이럴 캠페인',
    //   image: './img/portfolio1.png',
    //   name: 'CLINIC VIDEO',
    //   sub: '영상 콘텐츠 제작 프로젝트',
    //   tags: ['영상 제작', 'SNS 바이럴', '시술 콘텐츠'],
    // },
    // {
    //   id: 'medical2',
    //   num: '05',
    //   category: 'medical',
    //   topDesc: '의료미용 브랜드 런칭 전략 수립 및 통합 마케팅 실행 사례',
    //   image: './img/portfolio2.png',
    //   name: 'MEDSKIN LAB',
    //   sub: '의료미용 런칭 마케팅 프로젝트',
    //   tags: ['브랜드 런칭', '통합 마케팅', '의료미용'],
    // },
    // {
    //   id: 'brand2',
    //   num: '06',
    //   category: 'brand',
    //   topDesc: '프리미엄 스킨케어 브랜드의 아이덴티티 구축과 장기 성장 전략 사례',
    //   image: './img/portfolio3.png',
    //   name: 'LUMINE SKIN',
    //   sub: '프리미엄 브랜드 마케팅 프로젝트',
    //   tags: ['브랜드 아이덴티티', '프리미엄 전략', '스킨케어'],
    // },
    // {
    //   id: 'clinic2',
    //   num: '07',
    //   category: 'clinic',
    //   topDesc: '피부과 신규 개원 컨설팅 및 환자 유입 채널 최적화 프로젝트',
    //   image: './img/portfolio4.png',
    //   name: 'DERMA PLUS',
    //   sub: '피부과 개원 & 운영 컨설팅',
    //   tags: ['개원 컨설팅', '환자 유입', '채널 최적화'],
    // },
    // {
    //   id: 'video2',
    //   num: '08',
    //   category: 'video',
    //   topDesc: '브랜드 필름 및 숏폼 콘텐츠 시리즈 제작으로 인지도 극대화',
    //   image: './img/work1.png',
    //   name: 'NOVA FILMS',
    //   sub: '브랜드 필름 & 숏폼 제작 프로젝트',
    //   tags: ['브랜드 필름', '숏폼 콘텐츠', '인지도 상승'],
    // },
    // {
    //   id: 'medical3',
    //   num: '09',
    //   category: 'medical',
    //   topDesc: 'KOL / KOC 마케팅을 활용한 의료미용 업계 신뢰도 상승 캠페인',
    //   image: './img/work2.png',
    //   name: 'KOL CAMPAIGN',
    //   sub: 'KOL·KOC 인플루언서 마케팅',
    //   tags: ['KOL 마케팅', 'KOC', '신뢰도 캠페인'],
    // },
  ];
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
            <span class="pf_card_arrow" aria-label="자세히 보기">›</span>
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
        <div class="pf_hero_watermark">NSM</div>
        <span class="pf_hero_label">PROJECTS</span>
        <div class="pf_hero_divider"></div>
        <h1 class="pf_hero_headline">
          메디컬 브랜드의 성장을 만들어온<br class="pf_hero_br--desktop">
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

    /* 초기 등장 애니메이션 실행 */
    applyFilter('all');
  });

})();
