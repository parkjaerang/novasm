/* Portfolio Admin — CRUD · file upload · server save · localStorage fallback */
(function () {
  const STORAGE_KEY = 'NOVASM_PROJECTS_OVERRIDE';
  const TOKEN_KEY = 'NOVASM_ADMIN_TOKEN';
  const CATEGORY_LABELS = {
    medical: '의료미용 업계 마케팅 사례',
    clinic: '피부과 운영 사례',
    video: '영상콘텐츠 제작사례',
    brand: '브랜드 마케팅 사례',
  };

  const FALLBACK_MEDIA = [
    { src: './img/portfolio1.png', type: 'image', label: 'portfolio1' },
    { src: './img/portfolio2.png', type: 'image', label: 'portfolio2' },
    { src: './img/portfolio3.png', type: 'image', label: 'portfolio3' },
    { src: './img/portfolio4.png', type: 'image', label: 'portfolio4' },
    { src: './img/work1.png', type: 'image', label: 'work1' },
    { src: './img/work2.png', type: 'image', label: 'work2' },
    { src: './img/work3.png', type: 'image', label: 'work3' },
    { src: './img/work4.png', type: 'image', label: 'work4' },
    { src: './img/work5.png', type: 'image', label: 'work5' },
    { src: './img/work6.png', type: 'image', label: 'work6' },
    { src: './img/work7.png', type: 'image', label: 'work7' },
    { src: './img/medical_1.mp4', type: 'video', label: 'medical_1' },
    { src: './img/medical_2.mp4', type: 'video', label: 'medical_2' },
    { src: './img/medical_3.mp4', type: 'video', label: 'medical_3' },
    { src: './img/medical_4.mp4', type: 'video', label: 'medical_4' },
    { src: './img/seoul_intro.mp4', type: 'video', label: 'seoul_intro' },
  ];

  let MEDIA_LIBRARY = [...FALLBACK_MEDIA];
  const BASE = JSON.parse(JSON.stringify(window.NOVASM_PROJECTS_BASE || window.NOVASM_PROJECTS || []));

  let projects = loadProjectsLocal();
  let selectedId = null;
  let dirty = false;
  let saving = false;
  let serverReady = false;
  let authRequired = false;
  let lists = { tags: [], results: [], services: [] };
  let contents = [];
  let mediaTarget = null;
  let mediaTab = 'image';
  const blobUrls = new Map();
  const pendingFiles = new Map();

  const els = {
    list: document.getElementById('projectList'),
    count: document.getElementById('projectCount'),
    form: document.getElementById('projectForm'),
    empty: document.getElementById('emptyState'),
    formTitle: document.getElementById('formTitle'),
    tagsEditor: document.getElementById('tagsEditor'),
    resultsEditor: document.getElementById('resultsEditor'),
    servicesEditor: document.getElementById('servicesEditor'),
    contentsEditor: document.getElementById('contentsEditor'),
    preview: document.getElementById('btnPreview'),
    status: document.getElementById('saveStatus'),
    heroPreview: document.getElementById('heroPreview'),
    heroFileName: document.getElementById('heroFileName'),
    heroTip: document.getElementById('heroTip'),
    mediaModal: document.getElementById('mediaModal'),
    mediaModalGrid: document.getElementById('mediaModalGrid'),
  };

  function getAdminToken() {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  }

  function setAdminToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }

  function apiHeaders(extra = {}) {
    const headers = { ...extra };
    const token = getAdminToken();
    if (token) headers['X-Admin-Token'] = token;
    return headers;
  }

  async function api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: apiHeaders(options.headers || {}),
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* empty */ }
    if (!res.ok) {
      const err = new Error(data?.error || `요청 실패 (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function loadProjectsLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) { /* ignore */ }
    return JSON.parse(JSON.stringify(BASE));
  }

  function setDirty(value) {
    dirty = value;
    if (saving) {
      els.status.textContent = '저장 중…';
      return;
    }
    if (dirty) {
      els.status.textContent = '아직 저장하지 않은 변경이 있어요';
      return;
    }
    if (serverReady) {
      els.status.textContent = '서버에 저장됨 (사이트에 바로 반영)';
      return;
    }
    els.status.textContent = localStorage.getItem(STORAGE_KEY)
      ? '이 브라우저에만 저장됨 (서버 미연결)'
      : '원본 데이터 사용 중';
  }

  function toast(message) {
    let el = document.querySelector('.admin_toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'admin_toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-show'), 2400);
  }

  function renumber() {
    projects.forEach((p, i) => {
      p.num = String(i + 1).padStart(2, '0');
    });
  }

  function persistLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.NOVASM_PROJECTS = projects;
  }

  async function ensureAuth() {
    if (!authRequired) return true;
    if (getAdminToken()) return true;
    const token = window.prompt('관리자 비밀번호를 입력하세요');
    if (token == null) return false;
    try {
      await api('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setAdminToken(token);
      return true;
    } catch (_) {
      toast('비밀번호가 올바르지 않습니다');
      return false;
    }
  }

  async function uploadPendingFiles() {
    const entries = [...pendingFiles.entries()];
    const pathMap = new Map();

    for (const [oldPath, file] of entries) {
      const form = new FormData();
      form.append('file', file, file.name);
      const data = await api('/api/upload', { method: 'POST', body: form });
      pathMap.set(oldPath, data.src);
      const prev = blobUrls.get(oldPath);
      if (prev) URL.revokeObjectURL(prev);
      blobUrls.delete(oldPath);
      pendingFiles.delete(oldPath);
    }
    return pathMap;
  }

  function remapPaths(pathMap) {
    if (!pathMap.size) return;
    projects.forEach((p) => {
      if (pathMap.has(p.image)) p.image = pathMap.get(p.image);
      (p.contents || []).forEach((c) => {
        if (pathMap.has(c.src)) c.src = pathMap.get(c.src);
      });
    });
    if (els.form.image && pathMap.has(els.form.image.value)) {
      els.form.image.value = pathMap.get(els.form.image.value);
    }
    contents.forEach((c) => {
      if (pathMap.has(c.src)) c.src = pathMap.get(c.src);
    });
  }

  async function persist() {
    if (selectedId) readFormIntoProject();

    if (!serverReady) {
      persistLocal();
      setDirty(false);
      toast('브라우저에만 저장됨. npm start로 서버를 켜면 사이트에 바로 반영됩니다');
      return;
    }

    if (!(await ensureAuth())) return;

    saving = true;
    setDirty(true);
    try {
      const pathMap = await uploadPendingFiles();
      remapPaths(pathMap);
      await api('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });
      localStorage.removeItem(STORAGE_KEY);
      window.NOVASM_PROJECTS = projects;
      window.NOVASM_PROJECTS_BASE = JSON.parse(JSON.stringify(projects));
      dirty = false;
      saving = false;
      setDirty(false);
      await refreshMediaLibrary();
      renderList();
      if (selectedId) selectProject(selectedId);
      toast('서버에 저장되었습니다. 사이트에 바로 반영됩니다');
    } catch (err) {
      saving = false;
      setDirty(true);
      if (err.status === 401) {
        setAdminToken('');
        toast('인증이 필요합니다. 다시 저장해 주세요');
      } else {
        toast(err.message || '저장에 실패했습니다');
      }
    }
  }

  async function refreshMediaLibrary() {
    if (!serverReady) return;
    try {
      const data = await api('/api/media');
      if (Array.isArray(data.media) && data.media.length) {
        MEDIA_LIBRARY = data.media;
      }
    } catch (_) { /* keep fallback */ }
  }

  async function initServer() {
    try {
      const health = await api('/api/health');
      serverReady = true;
      authRequired = Boolean(health.authRequired);
      const data = await api('/api/projects');
      if (Array.isArray(data.projects)) {
        projects = data.projects;
        window.NOVASM_PROJECTS = projects;
      }
      await refreshMediaLibrary();
      setDirty(false);
      renderList();
      toast('서버 연결됨 — 저장 시 img·데이터 파일에 바로 반영됩니다');
    } catch (_) {
      serverReady = false;
      setDirty(Boolean(localStorage.getItem(STORAGE_KEY)));
    }
  }

  function slugify(name) {
    return String(name || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32) || `project-${Date.now()}`;
  }

  function uniqueId(base) {
    let id = base;
    let n = 2;
    while (projects.some((p) => p.id === id && p.id !== selectedId)) {
      id = `${base}-${n++}`;
    }
    return id;
  }

  function isVideoPath(src) {
    return /\.(mp4|webm|mov)($|\?)/i.test(src || '');
  }

  function fileNameFromPath(src) {
    if (!src) return '';
    return String(src).split('/').pop().split('?')[0];
  }

  function pathFromFileName(name) {
    return `./img/${name}`;
  }

  function detectType(src) {
    return isVideoPath(src) ? 'video' : 'image';
  }

  function rememberBlob(path, file) {
    const prev = blobUrls.get(path);
    if (prev) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(file);
    blobUrls.set(path, url);
    pendingFiles.set(path, file);
    return url;
  }

  function previewSrc(path) {
    return blobUrls.get(path) || path;
  }

  function emptyProject() {
    const id = uniqueId(`project-${projects.length + 1}`);
    return {
      id,
      num: String(projects.length + 1).padStart(2, '0'),
      category: 'medical',
      categoryLabel: CATEGORY_LABELS.medical,
      topDesc: '',
      image: './img/portfolio1.png',
      name: '새 프로젝트',
      sub: '',
      tags: [],
      overview: '',
      challenge: '',
      solution: '',
      results: [],
      services: [],
      contents: [],
    };
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function moveProject(from, to) {
    if (from === to || from < 0 || to < 0 || from >= projects.length || to >= projects.length) return;
    const [item] = projects.splice(from, 1);
    projects.splice(to, 0, item);
    renumber();
    setDirty(true);
    renderList();
    if (selectedId) selectProject(selectedId);
  }

  function renderList() {
    els.count.textContent = String(projects.length);
    els.list.innerHTML = projects.map((p, index) => `
      <li class="admin_list_item${p.id === selectedId ? ' is-active' : ''}" data-id="${escapeHtml(p.id)}" data-index="${index}" draggable="true">
        <span class="admin_list_handle" title="드래그해서 순서 변경" aria-hidden="true">⋮⋮</span>
        <div class="admin_list_meta">
          <div class="admin_list_num">${escapeHtml(p.num)}</div>
          <div class="admin_list_name">${escapeHtml(p.name)}</div>
          <div class="admin_list_cat">${escapeHtml(p.categoryLabel || p.category)}</div>
        </div>
        <div class="admin_list_moves">
          <button type="button" data-move="up" data-index="${index}" aria-label="위로" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" data-move="down" data-index="${index}" aria-label="아래로" ${index === projects.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      </li>
    `).join('');
  }

  function renderChips(field) {
    const editor = els[`${field}Editor`];
    editor.innerHTML = lists[field].map((item, i) => `
      <span class="admin_chip">
        ${escapeHtml(item)}
        <button type="button" data-remove-chip="${field}" data-index="${i}" aria-label="삭제">×</button>
      </span>
    `).join('') || `<span class="admin_empty_chip">아직 없어요. 아래에서 추가해 주세요.</span>`;
  }

  function mediaPreviewHtml(src, type) {
    const url = previewSrc(src);
    if (!src) return '<span class="admin_media_placeholder">파일을 선택해 주세요</span>';
    if (type === 'video' || isVideoPath(src)) {
      return `<video src="${escapeHtml(url)}" muted playsinline preload="metadata"></video>`;
    }
    return `<img src="${escapeHtml(url)}" alt="">`;
  }

  function renderHeroMedia() {
    const src = els.form.image.value.trim();
    els.heroPreview.innerHTML = mediaPreviewHtml(src, 'image');
    els.heroFileName.textContent = src ? fileNameFromPath(src) : '';
    const pending = pendingFiles.has(src);
    els.heroTip.hidden = !pending;
    if (pending) {
      els.heroTip.textContent = serverReady
        ? `"${fileNameFromPath(src)}" — 저장 시 서버 img 폴더에 자동 업로드됩니다.`
        : `"${fileNameFromPath(src)}" 파일을 img 폴더에 넣거나, npm start 후 저장해 주세요.`;
    }
  }

  function renderContents() {
    els.contentsEditor.innerHTML = contents.map((item, i) => {
      const type = item.type || detectType(item.src);
      const pending = pendingFiles.has(item.src);
      return `
      <div class="admin_content_card" data-index="${i}">
        <div class="admin_content_preview">
          ${mediaPreviewHtml(item.src, type)}
        </div>
        <div class="admin_content_fields">
          <label class="admin_field">
            <span>종류</span>
            <select data-content="type" data-index="${i}">
              <option value="image"${type === 'image' ? ' selected' : ''}>사진</option>
              <option value="video"${type === 'video' ? ' selected' : ''}>영상</option>
            </select>
          </label>
          <label class="admin_field">
            <span>라벨</span>
            <input type="text" data-content="label" data-index="${i}" value="${escapeHtml(item.label || '')}" placeholder="예: SNS, 영상">
          </label>
          <div class="admin_field admin_field--full">
            <span>파일</span>
            <div class="admin_media admin_media--compact">
              <p class="admin_media_name">${escapeHtml(fileNameFromPath(item.src) || '선택한 파일 없음')}</p>
              <div class="admin_media_actions">
                <label class="admin_btn admin_btn--file">
                  파일 첨부
                  <input type="file" accept="image/*,video/mp4,video/webm" data-file-for="content" data-index="${i}" hidden>
                </label>
                <button type="button" class="admin_btn" data-pick-library="content" data-index="${i}">보유 파일에서 고르기</button>
              </div>
              ${pending ? `<p class="admin_media_tip">"${escapeHtml(fileNameFromPath(item.src))}" — 저장 시 ${serverReady ? '자동 업로드' : '수동 복사 또는 서버 저장'}됩니다.</p>` : ''}
            </div>
          </div>
          <label class="admin_field admin_field--full">
            <span>설명 (캡션)</span>
            <input type="text" data-content="caption" data-index="${i}" value="${escapeHtml(item.caption || '')}" placeholder="짧게 설명해 주세요">
          </label>
        </div>
        <div class="admin_content_actions">
          <button type="button" data-content-move="up" data-index="${i}" aria-label="위로">▲</button>
          <button type="button" data-content-move="down" data-index="${i}" aria-label="아래로">▼</button>
          <button type="button" data-content-remove="${i}" aria-label="삭제">×</button>
        </div>
      </div>`;
    }).join('') || `<p class="admin_empty_chip">제작 콘텐츠가 없습니다. <strong>+ 콘텐츠 추가</strong>를 눌러 주세요.</p>`;
  }

  function openMediaModal(target) {
    mediaTarget = target;
    mediaTab = (typeof target === 'number' && contents[target]?.type === 'video') ? 'video' : 'image';
    document.querySelectorAll('[data-media-tab]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.mediaTab === mediaTab);
    });
    renderMediaModal();
    els.mediaModal.hidden = false;
  }

  function closeMediaModal() {
    els.mediaModal.hidden = true;
    mediaTarget = null;
  }

  function renderMediaModal() {
    const items = MEDIA_LIBRARY.filter((m) => m.type === mediaTab);
    els.mediaModalGrid.innerHTML = items.map((m) => `
      <button type="button" class="admin_media_pick" data-pick-src="${escapeHtml(m.src)}" title="${escapeHtml(m.label)}">
        ${m.type === 'video'
          ? `<video src="${escapeHtml(m.src)}" muted playsinline preload="metadata"></video><span class="admin_media_badge">영상</span>`
          : `<img src="${escapeHtml(m.src)}" alt="${escapeHtml(m.label)}">`}
        <span class="admin_media_pick_label">${escapeHtml(m.label)}</span>
      </button>
    `).join('') || '<p class="admin_empty_chip">표시할 파일이 없습니다.</p>';
  }

  function applyMedia(src, opts = {}) {
    const type = opts.type || detectType(src);
    if (mediaTarget === 'hero' || opts.forceHero) {
      els.form.image.value = src;
      renderHeroMedia();
      return;
    }
    if (typeof mediaTarget === 'number') {
      contents[mediaTarget].src = src;
      contents[mediaTarget].type = type;
      renderContents();
      return;
    }
    if (typeof opts.contentIndex === 'number') {
      contents[opts.contentIndex].src = src;
      contents[opts.contentIndex].type = type;
      renderContents();
    }
  }

  function handleFileAttach(file, target) {
    if (!file) return;
    const safeName = file.name.replace(/[^\w.\-가-힣]/g, '_');
    const path = pathFromFileName(safeName);
    rememberBlob(path, file);
    const type = file.type.startsWith('video/') || isVideoPath(safeName) ? 'video' : 'image';

    if (target === 'hero') {
      els.form.image.value = path;
      renderHeroMedia();
      toast('대표 이미지가 첨부되었습니다');
      return;
    }
    if (typeof target === 'number') {
      contents[target].src = path;
      contents[target].type = type;
      renderContents();
      toast('콘텐츠 파일이 첨부되었습니다');
    }
  }

  function selectProject(id) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    selectedId = id;
    lists = {
      tags: [...(project.tags || [])],
      results: [...(project.results || [])],
      services: [...(project.services || [])],
    };
    contents = JSON.parse(JSON.stringify(project.contents || []));

    els.empty.hidden = true;
    els.form.hidden = false;
    els.formTitle.textContent = project.name || '프로젝트 편집';
    els.preview.href = `./view.html?id=${encodeURIComponent(project.id)}`;

    const fields = ['id', 'num', 'category', 'categoryLabel', 'name', 'sub', 'topDesc', 'image', 'overview', 'challenge', 'solution'];
    fields.forEach((key) => {
      if (els.form[key]) els.form[key].value = project[key] ?? '';
    });
    /* 기존 프로젝트는 ID 자동 변경 방지 · 신규만 이름에 맞춰 갱신 */
    if (/^project(-\d+)?$/.test(project.id) || project.name === '새 프로젝트') {
      delete els.form.id.dataset.locked;
    } else {
      els.form.id.dataset.locked = '1';
    }

    renderList();
    renderChips('tags');
    renderChips('results');
    renderChips('services');
    renderContents();
    renderHeroMedia();
  }

  function readFormIntoProject() {
    if (!selectedId) return null;
    const index = projects.findIndex((p) => p.id === selectedId);
    if (index < 0) return null;

    const nextId = uniqueId(els.form.id.value.trim() || slugify(els.form.name.value));
    const category = els.form.category.value;

    const updated = {
      ...projects[index],
      id: nextId,
      num: els.form.num.value.trim() || projects[index].num,
      category,
      categoryLabel: els.form.categoryLabel.value.trim() || CATEGORY_LABELS[category] || category,
      name: els.form.name.value.trim(),
      sub: els.form.sub.value.trim(),
      topDesc: els.form.topDesc.value.replace(/\r\n/g, '\n').trim(),
      image: els.form.image.value.trim(),
      overview: els.form.overview.value.trim(),
      challenge: els.form.challenge.value.trim(),
      solution: els.form.solution.value.trim(),
      tags: [...lists.tags],
      results: [...lists.results],
      services: [...lists.services],
      contents: JSON.parse(JSON.stringify(contents)),
    };

    projects[index] = updated;
    selectedId = nextId;
    setDirty(true);
    return updated;
  }

  function addChip(field, value) {
    const text = String(value || '').trim();
    if (!text) return;
    if (!lists[field].includes(text)) lists[field].push(text);
    renderChips(field);
  }

  function exportJsFile() {
    const body = projects.map((p) => {
      return '  ' + JSON.stringify(p, null, 2).replace(/\n/g, '\n  ');
    }).join(',\n');

    const file = [
      '/* 포트폴리오 프로젝트 데이터 — portfolio.js · view.js 공유 */',
      'window.NOVASM_PROJECTS = [',
      body,
      '];',
      '',
      '/* Admin 원본 백업 + localStorage 오버라이드 (admin.html 저장분 미리보기) */',
      'window.NOVASM_PROJECTS_BASE = window.NOVASM_PROJECTS;',
      '(function applyProjectsOverride() {',
      '  try {',
      "    const raw = localStorage.getItem('NOVASM_PROJECTS_OVERRIDE');",
      '    if (!raw) return;',
      '    const parsed = JSON.parse(raw);',
      '    if (Array.isArray(parsed)) window.NOVASM_PROJECTS = parsed;',
      "  } catch (_) { /* ignore corrupt override */ }",
      '})();',
      '',
    ].join('\n');

    const blob = new Blob([file], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects-data.js';
    a.click();
    URL.revokeObjectURL(url);
    toast('projects-data.js 파일을 받았습니다');
  }

  /* ── Events ── */
  let dragFromIndex = null;

  els.list.addEventListener('click', (e) => {
    const moveBtn = e.target.closest('[data-move]');
    if (moveBtn) {
      e.stopPropagation();
      const i = Number(moveBtn.dataset.index);
      const j = i + (moveBtn.dataset.move === 'up' ? -1 : 1);
      moveProject(i, j);
      return;
    }

    const item = e.target.closest('.admin_list_item');
    if (item) selectProject(item.dataset.id);
  });

  els.list.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.admin_list_item');
    if (!item || e.target.closest('[data-move]')) {
      e.preventDefault();
      return;
    }
    dragFromIndex = Number(item.dataset.index);
    item.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.id);
  });

  els.list.addEventListener('dragend', (e) => {
    const item = e.target.closest('.admin_list_item');
    if (item) item.classList.remove('is-dragging');
    els.list.querySelectorAll('.is-drag-over').forEach((el) => el.classList.remove('is-drag-over'));
    dragFromIndex = null;
  });

  els.list.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const item = e.target.closest('.admin_list_item');
    if (!item || Number(item.dataset.index) === dragFromIndex) return;
    els.list.querySelectorAll('.is-drag-over').forEach((el) => {
      if (el !== item) el.classList.remove('is-drag-over');
    });
    item.classList.add('is-drag-over');
  });

  els.list.addEventListener('dragleave', (e) => {
    const item = e.target.closest('.admin_list_item');
    if (item && !item.contains(e.relatedTarget)) item.classList.remove('is-drag-over');
  });

  els.list.addEventListener('drop', (e) => {
    e.preventDefault();
    const item = e.target.closest('.admin_list_item');
    if (!item || dragFromIndex == null) return;
    const to = Number(item.dataset.index);
    item.classList.remove('is-drag-over');
    moveProject(dragFromIndex, to);
    toast('순서가 변경되었습니다');
  });

  document.getElementById('btnAdd').addEventListener('click', () => {
    const project = emptyProject();
    projects.push(project);
    renumber();
    setDirty(true);
    renderList();
    selectProject(project.id);
  });

  document.getElementById('btnSave').addEventListener('click', () => {
    persist();
  });

  document.getElementById('btnExport').addEventListener('click', () => {
    if (selectedId) readFormIntoProject();
    exportJsFile();
  });

  document.getElementById('btnReset').addEventListener('click', async () => {
    if (!confirm('이 브라우저에만 저장된 변경을 지우고, 서버(또는 원본) 데이터로 돌아갈까요?')) return;
    localStorage.removeItem(STORAGE_KEY);
    pendingFiles.clear();
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
    blobUrls.clear();
    if (serverReady) {
      try {
        const data = await api('/api/projects');
        projects = Array.isArray(data.projects) ? data.projects : JSON.parse(JSON.stringify(BASE));
      } catch (_) {
        projects = JSON.parse(JSON.stringify(BASE));
      }
    } else {
      projects = JSON.parse(JSON.stringify(BASE));
    }
    selectedId = null;
    els.form.hidden = true;
    els.empty.hidden = false;
    setDirty(false);
    renderList();
    toast('원본 상태로 돌아갔습니다');
  });

  document.getElementById('btnDelete').addEventListener('click', () => {
    if (!selectedId) return;
    const project = projects.find((p) => p.id === selectedId);
    if (!confirm(`"${project?.name || selectedId}" 프로젝트를 삭제할까요?`)) return;
    projects = projects.filter((p) => p.id !== selectedId);
    renumber();
    selectedId = null;
    els.form.hidden = true;
    els.empty.hidden = false;
    setDirty(true);
    renderList();
  });

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = readFormIntoProject();
    if (!updated) return;
    renderList();
    selectProject(updated.id);
    toast('반영됐습니다. 왼쪽 저장을 눌러 주세요');
  });

  els.form.category.addEventListener('change', () => {
    const label = CATEGORY_LABELS[els.form.category.value];
    if (label) els.form.categoryLabel.value = label;
  });

  els.form.name.addEventListener('input', () => {
    const name = els.form.name.value.trim();
    els.formTitle.textContent = name || '프로젝트 편집';
    /* 새 프로젝트처럼 기본 id 패턴이면 자동 갱신 */
    if (!els.form.id.dataset.locked) {
      const auto = uniqueId(slugify(name) || 'project');
      if (/^project(-\d+)?$/.test(els.form.id.value) || !els.form.id.value) {
        els.form.id.value = auto;
      }
    }
  });

  els.form.id.addEventListener('input', () => {
    els.form.id.dataset.locked = '1';
  });

  /* 파일 첨부 · 갤러리 */
  document.addEventListener('change', (e) => {
    const input = e.target.closest('input[type="file"][data-file-for]');
    if (!input || !input.files?.[0]) return;
    const forWhat = input.dataset.fileFor;
    if (forWhat === 'hero') handleFileAttach(input.files[0], 'hero');
    else if (forWhat === 'content') handleFileAttach(input.files[0], Number(input.dataset.index));
    input.value = '';
  });

  document.addEventListener('click', (e) => {
    const pickLib = e.target.closest('[data-pick-library]');
    if (pickLib) {
      const kind = pickLib.dataset.pickLibrary;
      if (kind === 'hero') openMediaModal('hero');
      else openMediaModal(Number(pickLib.dataset.index));
      return;
    }

    const remove = e.target.closest('[data-remove-chip]');
    if (remove) {
      const field = remove.dataset.removeChip;
      lists[field].splice(Number(remove.dataset.index), 1);
      renderChips(field);
    }
  });

  els.mediaModal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) {
      closeMediaModal();
      return;
    }
    const tab = e.target.closest('[data-media-tab]');
    if (tab) {
      mediaTab = tab.dataset.mediaTab;
      document.querySelectorAll('[data-media-tab]').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.mediaTab === mediaTab);
      });
      renderMediaModal();
      return;
    }
    const pick = e.target.closest('[data-pick-src]');
    if (pick) {
      applyMedia(pick.dataset.pickSrc);
      closeMediaModal();
      toast('파일이 선택되었습니다');
    }
  });

  document.querySelectorAll('[data-add-chip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.addChip;
      const inputId = field === 'tags' ? 'tagInput' : field === 'results' ? 'resultInput' : 'serviceInput';
      const input = document.getElementById(inputId);
      addChip(field, input.value);
      input.value = '';
      input.focus();
    });
  });

  ['tagInput', 'resultInput', 'serviceInput'].forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const map = { tagInput: 'tags', resultInput: 'results', serviceInput: 'services' };
      addChip(map[id], e.target.value);
      e.target.value = '';
    });
  });

  document.getElementById('btnAddContent').addEventListener('click', () => {
    contents.push({ type: 'image', src: './img/work1.png', label: 'SNS', caption: '' });
    renderContents();
  });

  els.contentsEditor.addEventListener('input', (e) => {
    const el = e.target.closest('[data-content]');
    if (!el) return;
    const i = Number(el.dataset.index);
    const key = el.dataset.content;
    contents[i][key] = el.value;
  });

  els.contentsEditor.addEventListener('change', (e) => {
    const el = e.target.closest('[data-content]');
    if (!el) return;
    const i = Number(el.dataset.index);
    contents[i][el.dataset.content] = el.value;
    if (el.dataset.content === 'type') {
      const type = el.value;
      if (type === 'video' && !isVideoPath(contents[i].src)) {
        contents[i].src = './img/medical_1.mp4';
      } else if (type === 'image' && isVideoPath(contents[i].src)) {
        contents[i].src = './img/work1.png';
      }
      renderContents();
    }
  });

  els.contentsEditor.addEventListener('click', (e) => {
    const remove = e.target.closest('[data-content-remove]');
    if (remove) {
      contents.splice(Number(remove.dataset.contentRemove), 1);
      renderContents();
      return;
    }
    const move = e.target.closest('[data-content-move]');
    if (!move) return;
    const i = Number(move.dataset.index);
    const j = i + (move.dataset.contentMove === 'up' ? -1 : 1);
    if (j < 0 || j >= contents.length) return;
    [contents[i], contents[j]] = [contents[j], contents[i]];
    renderContents();
  });

  window.addEventListener('beforeunload', (e) => {
    if (!dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* init */
  setDirty(false);
  renderList();
  initServer();
})();
