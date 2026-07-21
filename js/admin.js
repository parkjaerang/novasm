/* Portfolio Admin — CRUD · file upload · server save */
(function () {
  const STORAGE_KEY = 'NOVASM_PROJECTS_OVERRIDE';
  const TOKEN_KEY = 'NOVASM_ADMIN_TOKEN';
  const LANG_KEY = 'NOVASM_ADMIN_LANG';

  const I18N = {
    ko: {
      btnAdd: '+ 새 프로젝트',
      btnSave: '저장',
      btnReset: '처음부터 다시',
      listHead: '프로젝트 목록 <span class="admin_list_hint">(드래그로 순서)</span>',
      previewSite: '미리보기 사이트 →',
      statusIdle: '변경 사항 없음',
      statusSaving: '저장 중…',
      statusOffline: '서버에 연결할 수 없습니다',
      statusDirty: '아직 저장하지 않은 변경이 있어요',
      statusSaved: '서버에 저장됨 (사이트에 바로 반영)',
      guideTitle: '사용 방법',
      guide1: '왼쪽에서 프로젝트를 고르거나 <em>새 프로젝트</em>를 만듭니다.',
      guide2: '이미지는 <em>파일 첨부</em> 또는 <em>보유 이미지에서 고르기</em>로 넣습니다.',
      guide3: '<em>이 프로젝트 적용</em> → <em>저장</em> 하면 <code>img</code> 업로드가 됩니다.',
      guide4: '<em>상세 미리보기</em> / <em>미리보기 사이트</em>로 저장 전에 확인할 수 있습니다.',
      emptyState: '왼쪽에서 프로젝트를 선택하거나<br>새 프로젝트를 추가하세요.',
      formTitle: '프로젝트 편집',
      btnPreview: '상세 미리보기',
      btnDelete: '삭제',
      sectionBasic: '기본 정보',
      fieldName: '프로젝트명',
      fieldSub: '한 줄 소개',
      fieldCategory: '카테고리',
      fieldNum: '목록 번호 <em>(자동)</em>',
      fieldTopDesc: '카드에 보이는 짧은 설명 <em>(줄바꿈 가능)</em>',
      fieldHero: '대표 이미지',
      phHero: '이미지를 선택해 주세요',
      btnAttach: '파일 첨부',
      btnPickImage: '보유 이미지에서 고르기',
      advancedSummary: '고급 설정 (보통 수정할 필요 없음)',
      fieldId: '주소용 ID <em>(영문·자동 생성)</em>',
      idTitle: '소문자, 숫자, 하이픈만',
      fieldCatLabel: '카테고리 표시명',
      sectionTags: '태그',
      phTag: '태그 입력 후 Enter (예: SNS, 브랜딩)',
      btnChipAdd: '추가',
      sectionDetail: '상세 본문',
      fieldOverview: '프로젝트 개요',
      fieldChallenge: '과제 / 목표',
      fieldSolution: '솔루션',
      sectionResults: '주요 성과',
      phResult: '성과 한 줄 입력 후 Enter',
      sectionServices: '제공 서비스',
      phService: '서비스명 입력 후 Enter',
      sectionContents: '제작 콘텐츠',
      btnAddContent: '+ 콘텐츠 추가',
      btnApply: '이 프로젝트 적용',
      formFootHint: '적용 후 왼쪽 <strong>저장</strong>을 누르면 서버에 바로 반영됩니다.',
      mediaModalTitle: '보유 이미지에서 고르기',
      close: '닫기',
      langGroup: '언어 선택',
      tabImage: '사진',
      tabVideo: '영상',
      catMedical: '의료미용 업계 마케팅 사례',
      catClinic: '피부과 운영 사례',
      catVideo: '영상콘텐츠 제작사례',
      catBrand: '브랜드 마케팅 사례',
      phName: '예: BLS CLINIC',
      phSub: '예: 중국 마케팅 & 브랜딩 프로젝트',
      phTopDesc: '목록 카드에 노출되는 짧은 설명',
      phOverview: '어떤 프로젝트인지 간단히',
      phChallenge: '무엇을 해결하려 했는지',
      phSolution: '어떻게 해결했는지',
      newProject: '새 프로젝트',
      dragReorder: '드래그해서 순서 변경',
      moveUp: '위로',
      moveDown: '아래로',
      remove: '삭제',
      chipEmpty: '아직 없어요. 아래에서 추가해 주세요.',
      pickFile: '파일을 선택해 주세요',
      uploadTip: '"{name}" — 저장 시 서버에 자동 업로드됩니다.',
      contentType: '종류',
      contentLabel: '라벨',
      contentFile: '파일',
      contentCaption: '설명 (캡션)',
      noFileSelected: '선택한 파일 없음',
      btnPickFile: '보유 파일에서 고르기',
      phContentLabel: '예: SNS, 영상',
      phCaption: '짧게 설명해 주세요',
      contentsEmpty: '제작 콘텐츠가 없습니다. <strong>+ 콘텐츠 추가</strong>를 눌러 주세요.',
      mediaEmpty: '표시할 파일이 없습니다.',
      videoBadge: '영상',
      authPrompt: '관리자 비밀번호를 입력하세요',
      toastBadPassword: '비밀번호가 올바르지 않습니다',
      toastOfflineSave: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요',
      toastSaved: '서버에 저장되었습니다. 사이트에 바로 반영됩니다',
      toastAuthRequired: '인증이 필요합니다. 다시 저장해 주세요',
      toastSaveFail: '저장에 실패했습니다',
      toastConnected: '서버에 연결되었습니다',
      toastOffline: '서버에 연결할 수 없습니다',
      toastHeroAttached: '대표 이미지가 첨부되었습니다',
      toastContentAttached: '콘텐츠 파일이 첨부되었습니다',
      toastReordered: '순서가 변경되었습니다',
      confirmReset: '저장하지 않은 변경을 취소하고 서버 데이터로 돌아갈까요?',
      toastReset: '서버 데이터로 되돌렸습니다',
      confirmDelete: '"{name}" 프로젝트를 삭제할까요?',
      toastApplied: '반영됐습니다. 왼쪽 저장을 눌러 주세요',
      toastFilePicked: '파일이 선택되었습니다',
      requestFailed: '요청 실패 ({status})',
    },
    zh: {
      btnAdd: '+ 新建项目',
      btnSave: '保存',
      btnReset: '恢复初始',
      listHead: '项目列表 <span class="admin_list_hint">(拖拽排序)</span>',
      previewSite: '预览网站 →',
      statusIdle: '暂无更改',
      statusSaving: '保存中…',
      statusOffline: '无法连接服务器',
      statusDirty: '还有未保存的更改',
      statusSaved: '已保存到服务器（网站立即生效）',
      guideTitle: '使用方法',
      guide1: '从左侧选择项目，或创建 <em>新建项目</em>。',
      guide2: '图片可通过 <em>上传文件</em> 或 <em>从已有图片选择</em> 添加。',
      guide3: '点击 <em>应用此项目</em> → <em>保存</em> 即可上传到 <code>img</code>。',
      guide4: '保存前可通过 <em>详情预览</em> / <em>预览网站</em> 查看效果。',
      emptyState: '请从左侧选择项目<br>或添加新项目。',
      formTitle: '编辑项目',
      btnPreview: '详情预览',
      btnDelete: '删除',
      sectionBasic: '基本信息',
      fieldName: '项目名称',
      fieldSub: '一句话介绍',
      fieldCategory: '分类',
      fieldNum: '列表编号 <em>(自动)</em>',
      fieldTopDesc: '卡片短描述 <em>(可换行)</em>',
      fieldHero: '主图',
      phHero: '请选择图片',
      btnAttach: '上传文件',
      btnPickImage: '从已有图片选择',
      advancedSummary: '高级设置（通常无需修改）',
      fieldId: '地址 ID <em>(英文·自动生成)</em>',
      idTitle: '仅限小写字母、数字和连字符',
      fieldCatLabel: '分类显示名',
      sectionTags: '标签',
      phTag: '输入标签后按 Enter（例：SNS、品牌）',
      btnChipAdd: '添加',
      sectionDetail: '详细正文',
      fieldOverview: '项目概述',
      fieldChallenge: '课题 / 目标',
      fieldSolution: '解决方案',
      sectionResults: '主要成果',
      phResult: '输入一行成果后按 Enter',
      sectionServices: '提供服务',
      phService: '输入服务名后按 Enter',
      sectionContents: '制作内容',
      btnAddContent: '+ 添加内容',
      btnApply: '应用此项目',
      formFootHint: '应用后点击左侧 <strong>保存</strong> 即可立即同步到服务器。',
      mediaModalTitle: '从已有图片选择',
      close: '关闭',
      langGroup: '语言选择',
      tabImage: '图片',
      tabVideo: '视频',
      catMedical: '医疗美容行业营销案例',
      catClinic: '皮肤科运营案例',
      catVideo: '影像内容制作案例',
      catBrand: '品牌营销案例',
      phName: '例：BLS CLINIC',
      phSub: '例：中国营销与品牌项目',
      phTopDesc: '显示在列表卡片上的短描述',
      phOverview: '简单说明这是什么项目',
      phChallenge: '想要解决什么问题',
      phSolution: '如何解决的',
      newProject: '新建项目',
      dragReorder: '拖拽更改顺序',
      moveUp: '上移',
      moveDown: '下移',
      remove: '删除',
      chipEmpty: '还没有内容，请在下方添加。',
      pickFile: '请选择文件',
      uploadTip: '"{name}" — 保存时将自动上传到服务器。',
      contentType: '类型',
      contentLabel: '标签',
      contentFile: '文件',
      contentCaption: '说明（字幕）',
      noFileSelected: '未选择文件',
      btnPickFile: '从已有文件选择',
      phContentLabel: '例：SNS、视频',
      phCaption: '请简短说明',
      contentsEmpty: '暂无制作内容。请点击 <strong>+ 添加内容</strong>。',
      mediaEmpty: '没有可显示的文件。',
      videoBadge: '视频',
      authPrompt: '请输入管理员密码',
      toastBadPassword: '密码不正确',
      toastOfflineSave: '无法连接服务器，请稍后重试',
      toastSaved: '已保存到服务器，网站立即生效',
      toastAuthRequired: '需要验证，请重新保存',
      toastSaveFail: '保存失败',
      toastConnected: '已连接服务器',
      toastOffline: '无法连接服务器',
      toastHeroAttached: '主图已添加',
      toastContentAttached: '内容文件已添加',
      toastReordered: '顺序已更改',
      confirmReset: '要取消未保存的更改并恢复为服务器数据吗？',
      toastReset: '已恢复为服务器数据',
      confirmDelete: '确定删除项目 "{name}" 吗？',
      toastApplied: '已应用。请点击左侧保存',
      toastFilePicked: '已选择文件',
      requestFailed: '请求失败 ({status})',
    },
  };

  let lang = localStorage.getItem(LANG_KEY) === 'zh' ? 'zh' : 'ko';

  function t(key, vars) {
    let str = I18N[lang]?.[key] ?? I18N.ko[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replaceAll(`{${k}}`, String(v));
      });
    }
    return str;
  }

  function categoryLabels() {
    return {
      medical: t('catMedical'),
      clinic: t('catClinic'),
      video: t('catVideo'),
      brand: t('catBrand'),
    };
  }

  function isNewProjectName(name) {
    return name === I18N.ko.newProject || name === I18N.zh.newProject;
  }

  function applyStaticI18n() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'ko';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.querySelectorAll('.admin_lang_btn').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyLang(next) {
    if (!I18N[next] || next === lang) return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticI18n();
    setDirty(dirty);
    renderList();
    if (!els.form.hidden && selectedId) {
      const project = projects.find((p) => p.id === selectedId);
      if (project && !els.form.name.value.trim()) {
        els.formTitle.textContent = t('formTitle');
      } else if (project) {
        els.formTitle.textContent = els.form.name.value.trim() || t('formTitle');
      }
      renderChips('tags');
      renderChips('results');
      renderChips('services');
      renderContents();
      renderHeroMedia();
    }
    if (!els.mediaModal.hidden) renderMediaModal();
  }

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
    sitePreview: document.getElementById('btnSitePreview'),
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
      const err = new Error(data?.error || t('requestFailed', { status: res.status }));
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
      els.status.textContent = t('statusSaving');
      return;
    }
    if (!serverReady) {
      els.status.textContent = t('statusOffline');
      return;
    }
    if (!serverReady) {
      els.status.textContent = t('statusOffline');
      return;
    }
    if (dirty) {
      els.status.textContent = t('statusDirty');
      return;
    }
    els.status.textContent = t('statusSaved');
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
    const token = window.prompt(t('authPrompt'));
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
      toast(t('toastBadPassword'));
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
      toast(t('toastOfflineSave'));
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
      toast(t('toastSaved'));
    } catch (err) {
      saving = false;
      setDirty(true);
      if (err.status === 401) {
        setAdminToken('');
        toast(t('toastAuthRequired'));
      } else {
        toast(err.message || t('toastSaveFail'));
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
      toast(t('toastConnected'));
    } catch (_) {
      serverReady = false;
      setDirty(false);
      toast(t('toastOffline'));
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
      categoryLabel: categoryLabels().medical,
      topDesc: '',
      image: './img/portfolio1.png',
      name: t('newProject'),
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
        <span class="admin_list_handle" title="${escapeHtml(t('dragReorder'))}" aria-hidden="true">⋮⋮</span>
        <div class="admin_list_meta">
          <div class="admin_list_num">${escapeHtml(p.num)}</div>
          <div class="admin_list_name">${escapeHtml(p.name)}</div>
          <div class="admin_list_cat">${escapeHtml(p.categoryLabel || p.category)}</div>
        </div>
        <div class="admin_list_moves">
          <button type="button" data-move="up" data-index="${index}" aria-label="${escapeHtml(t('moveUp'))}" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" data-move="down" data-index="${index}" aria-label="${escapeHtml(t('moveDown'))}" ${index === projects.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      </li>
    `).join('');
  }

  function renderChips(field) {
    const editor = els[`${field}Editor`];
    editor.innerHTML = lists[field].map((item, i) => `
      <span class="admin_chip">
        ${escapeHtml(item)}
        <button type="button" data-remove-chip="${field}" data-index="${i}" aria-label="${escapeHtml(t('remove'))}">×</button>
      </span>
    `).join('') || `<span class="admin_empty_chip">${escapeHtml(t('chipEmpty'))}</span>`;
  }

  function mediaPreviewHtml(src, type) {
    const url = previewSrc(src);
    if (!src) return `<span class="admin_media_placeholder">${escapeHtml(t('pickFile'))}</span>`;
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
      els.heroTip.textContent = t('uploadTip', { name: fileNameFromPath(src) });
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
            <span>${escapeHtml(t('contentType'))}</span>
            <select data-content="type" data-index="${i}">
              <option value="image"${type === 'image' ? ' selected' : ''}>${escapeHtml(t('tabImage'))}</option>
              <option value="video"${type === 'video' ? ' selected' : ''}>${escapeHtml(t('tabVideo'))}</option>
            </select>
          </label>
          <label class="admin_field">
            <span>${escapeHtml(t('contentLabel'))}</span>
            <input type="text" data-content="label" data-index="${i}" value="${escapeHtml(item.label || '')}" placeholder="${escapeHtml(t('phContentLabel'))}">
          </label>
          <div class="admin_field admin_field--full">
            <span>${escapeHtml(t('contentFile'))}</span>
            <div class="admin_media admin_media--compact">
              <p class="admin_media_name">${escapeHtml(fileNameFromPath(item.src) || t('noFileSelected'))}</p>
              <div class="admin_media_actions">
                <label class="admin_btn admin_btn--file">
                  ${escapeHtml(t('btnAttach'))}
                  <input type="file" accept="image/*,video/mp4,video/webm" data-file-for="content" data-index="${i}" hidden>
                </label>
                <button type="button" class="admin_btn" data-pick-library="content" data-index="${i}">${escapeHtml(t('btnPickFile'))}</button>
              </div>
              ${pending ? `<p class="admin_media_tip">${escapeHtml(t('uploadTip', { name: fileNameFromPath(item.src) }))}</p>` : ''}
            </div>
          </div>
          <label class="admin_field admin_field--full">
            <span>${escapeHtml(t('contentCaption'))}</span>
            <input type="text" data-content="caption" data-index="${i}" value="${escapeHtml(item.caption || '')}" placeholder="${escapeHtml(t('phCaption'))}">
          </label>
        </div>
        <div class="admin_content_actions">
          <button type="button" data-content-move="up" data-index="${i}" aria-label="${escapeHtml(t('moveUp'))}">▲</button>
          <button type="button" data-content-move="down" data-index="${i}" aria-label="${escapeHtml(t('moveDown'))}">▼</button>
          <button type="button" data-content-remove="${i}" aria-label="${escapeHtml(t('remove'))}">×</button>
        </div>
      </div>`;
    }).join('') || `<p class="admin_empty_chip">${t('contentsEmpty')}</p>`;
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
          ? `<video src="${escapeHtml(m.src)}" muted playsinline preload="metadata"></video><span class="admin_media_badge">${escapeHtml(t('videoBadge'))}</span>`
          : `<img src="${escapeHtml(m.src)}" alt="${escapeHtml(m.label)}">`}
        <span class="admin_media_pick_label">${escapeHtml(m.label)}</span>
      </button>
    `).join('') || `<p class="admin_empty_chip">${escapeHtml(t('mediaEmpty'))}</p>`;
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
      toast(t('toastHeroAttached'));
      return;
    }
    if (typeof target === 'number') {
      contents[target].src = path;
      contents[target].type = type;
      renderContents();
      toast(t('toastContentAttached'));
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
    els.formTitle.textContent = project.name || t('formTitle');
    els.preview.href = `./preview-view.html?id=${encodeURIComponent(project.id)}`;

    const fields = ['id', 'num', 'category', 'categoryLabel', 'name', 'sub', 'topDesc', 'image', 'overview', 'challenge', 'solution'];
    fields.forEach((key) => {
      if (els.form[key]) els.form[key].value = project[key] ?? '';
    });
    /* 기존 프로젝트는 ID 자동 변경 방지 · 신규만 이름에 맞춰 갱신 */
    if (/^project(-\d+)?$/.test(project.id) || isNewProjectName(project.name)) {
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
      categoryLabel: els.form.categoryLabel.value.trim() || categoryLabels()[category] || category,
      name: els.form.name.value.trim(),
      sub: els.form.sub.value.trim(),
      topDesc: els.form.topDesc.value.replace(/\r\n/g, '\n').trim(),
      image: els.form.image.value.trim(),
      overview: els.form.overview.value.replace(/\r\n/g, '\n').trim(),
      challenge: els.form.challenge.value.replace(/\r\n/g, '\n').trim(),
      solution: els.form.solution.value.replace(/\r\n/g, '\n').trim(),
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

  function preparePreviewDraft() {
    if (selectedId) readFormIntoProject();
    localStorage.setItem('NOVASM_PREVIEW_PROJECTS', JSON.stringify(projects));
    const blobs = {};
    blobUrls.forEach((url, path) => {
      blobs[path] = url;
    });
    localStorage.setItem('NOVASM_PREVIEW_BLOBS', JSON.stringify(blobs));
    localStorage.setItem('NOVASM_PREVIEW_AT', String(Date.now()));
  }

  function openPreview(url) {
    preparePreviewDraft();
    window.open(url, '_blank', 'noopener');
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
    toast(t('toastReordered'));
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

  document.getElementById('btnReset').addEventListener('click', async () => {
    if (!confirm(t('confirmReset'))) return;
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
    toast(t('toastReset'));
  });

  document.getElementById('btnDelete').addEventListener('click', () => {
    if (!selectedId) return;
    const project = projects.find((p) => p.id === selectedId);
    if (!confirm(t('confirmDelete', { name: project?.name || selectedId }))) return;
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
    toast(t('toastApplied'));
  });

  els.form.category.addEventListener('change', () => {
    const label = categoryLabels()[els.form.category.value];
    if (label) els.form.categoryLabel.value = label;
  });

  els.form.name.addEventListener('input', () => {
    const name = els.form.name.value.trim();
    els.formTitle.textContent = name || t('formTitle');
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
      toast(t('toastFilePicked'));
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

  els.preview.addEventListener('click', (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast('미리볼 프로젝트를 먼저 선택해 주세요');
      return;
    }
    const updated = readFormIntoProject();
    const id = updated?.id || selectedId;
    openPreview(`./preview-view.html?id=${encodeURIComponent(id)}`);
  });

  if (els.sitePreview) {
    els.sitePreview.addEventListener('click', (e) => {
      e.preventDefault();
      openPreview('./preview-portfolio.html');
    });
  }

  /* init */
  applyStaticI18n();
  document.querySelectorAll('.admin_lang_btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  setDirty(false);
  renderList();
  initServer();
})();
