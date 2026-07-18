/* Admin 미저장 초안 미리보기 — localStorage 초안을 사이트 데이터로 주입 */
(function () {
  window.NOVASM_PREVIEW_MODE = true;
  window.NOVASM_PORTFOLIO_URL = './preview-portfolio.html';
  window.NOVASM_VIEW_URL = function (id) {
    return './preview-view.html?id=' + encodeURIComponent(id || '');
  };

  function remapMedia(project, blobs) {
    const p = JSON.parse(JSON.stringify(project));
    if (blobs[p.image]) p.image = blobs[p.image];
    (p.contents || []).forEach((c) => {
      if (blobs[c.src]) c.src = blobs[c.src];
    });
    return p;
  }

  function showBanner() {
    if (document.querySelector('.preview_banner')) return;
    const bar = document.createElement('div');
    bar.className = 'preview_banner';
    bar.setAttribute('role', 'status');
    bar.innerHTML = window.NOVASM_PREVIEW_EMPTY
      ? '미리보기 데이터가 없습니다. Admin에서 <strong>미리보기</strong>를 다시 눌러 주세요.'
      : '미리보기 모드 · 아직 서버에 저장되지 않은 내용입니다. <a href="./admin.html">Admin으로 돌아가기</a>';
    document.body.prepend(bar);
  }

  try {
    const raw = localStorage.getItem('NOVASM_PREVIEW_PROJECTS');
    const blobs = JSON.parse(localStorage.getItem('NOVASM_PREVIEW_BLOBS') || '{}');
    if (!raw) {
      window.NOVASM_PROJECTS = [];
      window.NOVASM_PREVIEW_EMPTY = true;
    } else {
      const parsed = JSON.parse(raw);
      window.NOVASM_PROJECTS = Array.isArray(parsed)
        ? parsed.map((p) => remapMedia(p, blobs))
        : [];
      window.NOVASM_PREVIEW_EMPTY = window.NOVASM_PROJECTS.length === 0;
    }
  } catch (_) {
    window.NOVASM_PROJECTS = [];
    window.NOVASM_PREVIEW_EMPTY = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
