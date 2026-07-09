/* ─────────────────────────────────────
   포트폴리오 상세 뷰 페이지
   URL: view.html?id={projectId}
───────────────────────────────────── */
(function () {

  const PROJECTS = window.NOVASM_PROJECTS || [];
  let lightboxItems = [];
  let lightboxIndex = 0;

  function getProjectId() {
    return new URLSearchParams(location.search).get('id');
  }

  function buildContentCard(item, index) {
    const isVideo = item.type === 'video';
    return `
      <button
        class="pv_content_card${isVideo ? ' pv_content_card--video' : ''}"
        type="button"
        data-index="${index}"
        aria-label="${item.caption} 보기"
      >
        <div class="pv_content_thumb">
          ${isVideo
            ? `<video src="${item.src}" muted playsinline preload="metadata"></video>
               <span class="pv_content_play" aria-hidden="true">▶</span>`
            : `<img src="${item.src}" alt="${item.caption}" loading="lazy">`}
        </div>
        <div class="pv_content_info">
          <span class="pv_content_label">${item.label}</span>
          <p class="pv_content_caption">${item.caption}</p>
        </div>
      </button>
    `;
  }

  function buildContentsSection(project) {
    const contents = project.contents || [];
    if (!contents.length) return '';

    const labels = [...new Set(contents.map(c => c.label))];

    return `
      <section class="pv_contents" aria-label="제작 콘텐츠">
        <div class="pv_contents_head">
          <span class="pv_label">CONTENT</span>
          <h2 class="pv_contents_title">제작 콘텐츠</h2>
          <p class="pv_contents_desc">프로젝트에서 제작·운영한 실제 콘텐츠입니다.</p>
        </div>

        <div class="pv_contents_filter" role="group" aria-label="콘텐츠 필터">
          <button class="pv_contents_tab pv_contents_tab--active" type="button" data-filter="all">전체</button>
          ${labels.map(l => `
            <button class="pv_contents_tab" type="button" data-filter="${l}">${l}</button>
          `).join('')}
        </div>

        <div class="pv_contents_grid">
          ${contents.map(buildContentCard).join('')}
        </div>
      </section>
    `;
  }

  function buildRelatedCard(p) {
    return `
      <a class="pv_related_card" href="./view.html?id=${p.id}">
        <div class="pv_related_img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="pv_related_body">
          <span class="pv_related_num">${p.num}</span>
          <p class="pv_related_name">${p.name}</p>
          <p class="pv_related_sub">${p.sub}</p>
        </div>
      </a>
    `;
  }

  function buildLightbox() {
    return `
      <div class="pv_lightbox" id="pvLightbox" hidden aria-hidden="true">
        <div class="pv_lightbox_backdrop" data-close></div>
        <div class="pv_lightbox_panel" role="dialog" aria-modal="true" aria-label="콘텐츠 미리보기">
          <button class="pv_lightbox_close" type="button" data-close aria-label="닫기">×</button>
          <button class="pv_lightbox_nav pv_lightbox_prev" type="button" aria-label="이전">‹</button>
          <div class="pv_lightbox_media" id="pvLightboxMedia"></div>
          <button class="pv_lightbox_nav pv_lightbox_next" type="button" aria-label="다음">›</button>
          <div class="pv_lightbox_footer">
            <span class="pv_lightbox_label" id="pvLightboxLabel"></span>
            <p class="pv_lightbox_caption" id="pvLightboxCaption"></p>
            <span class="pv_lightbox_count" id="pvLightboxCount"></span>
          </div>
        </div>
      </div>
    `;
  }

  function buildDetail(project) {
    const related = PROJECTS.filter(p => p.id !== project.id).slice(0, 2);
    lightboxItems = project.contents || [];

    return `
      <article class="pv_detail">
        <div class="pv_hero">
          <a class="pv_back" href="./portfolio.html">← Portfolio</a>
          <span class="pv_label">PROJECT DETAIL</span>
          <div class="pv_divider"></div>
          <div class="pv_hero_meta">
            <span class="pv_num">${project.num}</span>
            <span class="pv_category">${project.categoryLabel}</span>
          </div>
          <h1 class="pv_title">${project.name}</h1>
          <p class="pv_sub">${project.sub}</p>
          <div class="pv_tags">
            ${project.tags.map(t => `<span class="pv_tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="pv_visual">
          <img src="${project.image}" alt="${project.name}">
        </div>

        <div class="pv_content">
          <section class="pv_section">
            <h2 class="pv_section_title">프로젝트 개요</h2>
            <p class="pv_section_text">${project.overview}</p>
          </section>

          <div class="pv_split">
            <section class="pv_section">
              <h2 class="pv_section_title">과제 / 목표</h2>
              <p class="pv_section_text">${project.challenge}</p>
            </section>
            <section class="pv_section">
              <h2 class="pv_section_title">솔루션</h2>
              <p class="pv_section_text">${project.solution}</p>
            </section>
          </div>

          <section class="pv_section">
            <h2 class="pv_section_title">주요 성과</h2>
            <ul class="pv_results">
              ${project.results.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </section>

          <section class="pv_section">
            <h2 class="pv_section_title">제공 서비스</h2>
            <div class="pv_services">
              ${project.services.map(s => `<span class="pv_service">${s}</span>`).join('')}
            </div>
          </section>
        </div>

        ${buildContentsSection(project)}

        ${related.length ? `
          <section class="pv_related">
            <div class="pv_related_head">
              <span class="pv_label">MORE PROJECTS</span>
              <h2 class="pv_related_title">다른 프로젝트 보기</h2>
            </div>
            <div class="pv_related_grid">
              ${related.map(buildRelatedCard).join('')}
            </div>
          </section>
        ` : ''}

        <div class="pv_footer_bar">
          <a class="pv_footer_link" href="./portfolio.html">
            전체 프로젝트 보기
            <span class="pv_footer_arrow">→</span>
          </a>
        </div>
      </article>
      ${buildLightbox()}
    `;
  }

  function buildNotFound() {
    return `
      <section class="pv_notfound">
        <span class="pv_label">NOT FOUND</span>
        <div class="pv_divider"></div>
        <h1 class="pv_title">프로젝트를 찾을 수 없습니다</h1>
        <p class="pv_section_text">요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.</p>
        <a class="pv_back_btn" href="./portfolio.html">포트폴리오로 돌아가기</a>
      </section>
    `;
  }

  function getVisibleIndices() {
    return [...document.querySelectorAll('.pv_content_card:not(.pv_content_card--hidden)')]
      .map(card => Number(card.dataset.index));
  }

  function renderLightbox(index) {
    const item = lightboxItems[index];
    if (!item) return;

    lightboxIndex = index;
    const media = document.getElementById('pvLightboxMedia');
    const label = document.getElementById('pvLightboxLabel');
    const caption = document.getElementById('pvLightboxCaption');
    const count = document.getElementById('pvLightboxCount');
    const visible = getVisibleIndices();
    const pos = visible.indexOf(index);

    if (item.type === 'video') {
      media.innerHTML = `<video src="${item.src}" controls autoplay playsinline></video>`;
    } else {
      media.innerHTML = `<img src="${item.src}" alt="${item.caption}">`;
    }

    label.textContent = item.label;
    caption.textContent = item.caption;
    count.textContent = pos >= 0 ? `${pos + 1} / ${visible.length}` : '';
  }

  function openLightbox(index) {
    const box = document.getElementById('pvLightbox');
    if (!box) return;

    box.hidden = false;
    box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pv_lightbox_open');
    renderLightbox(index);
  }

  function closeLightbox() {
    const box = document.getElementById('pvLightbox');
    if (!box) return;

    const video = box.querySelector('video');
    if (video) video.pause();

    box.hidden = true;
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pv_lightbox_open');
    document.getElementById('pvLightboxMedia').innerHTML = '';
  }

  function stepLightbox(dir) {
    const visible = getVisibleIndices();
    if (!visible.length) return;

    const pos = visible.indexOf(lightboxIndex);
    const next = visible[(pos + dir + visible.length) % visible.length];
    renderLightbox(next);
  }

  function bindContents() {
    const grid = document.querySelector('.pv_contents_grid');
    if (!grid) return;

    grid.addEventListener('click', function (e) {
      const card = e.target.closest('.pv_content_card');
      if (!card || card.classList.contains('pv_content_card--hidden')) return;
      openLightbox(Number(card.dataset.index));
    });

    document.querySelectorAll('.pv_contents_tab').forEach(tab => {
      tab.addEventListener('click', function () {
        const filter = this.dataset.filter;

        document.querySelectorAll('.pv_contents_tab').forEach(t => {
          t.classList.toggle('pv_contents_tab--active', t === this);
        });

        document.querySelectorAll('.pv_content_card').forEach(card => {
          const item = lightboxItems[Number(card.dataset.index)];
          const match = filter === 'all' || item.label === filter;
          card.classList.toggle('pv_content_card--hidden', !match);
        });
      });
    });

    const box = document.getElementById('pvLightbox');
    if (!box) return;

    box.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeLightbox);
    });

    box.querySelector('.pv_lightbox_prev').addEventListener('click', () => stepLightbox(-1));
    box.querySelector('.pv_lightbox_next').addEventListener('click', () => stepLightbox(1));

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (!main) return;

    const id = getProjectId();
    const project = PROJECTS.find(p => p.id === id);

    if (project) {
      document.title = `${project.name} | NOVA SM`;
      main.innerHTML = buildDetail(project);
      bindContents();
    } else {
      document.title = '프로젝트를 찾을 수 없습니다 | NOVA SM';
      main.innerHTML = buildNotFound();
    }
  });

})();
