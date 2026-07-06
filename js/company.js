/* ═══════════════════════════════════════════════
   COMPANY PAGE — company.js
═══════════════════════════════════════════════ */

/* ── 1. 헤더 스크롤 축소 ── */
(function () {
  const header = document.getElementById('cp_header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('ms_scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── 2. IntersectionObserver: 섹션별 cp_in 클래스 부여 ── */
(function () {
  /* 관찰 대상 섹션들 */
  const sections = document.querySelectorAll(
    '.cp_who, .cp_why, .cp_strength, .cp_work, .cp_story, .cp_space, .cp_closing'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      /* 뷰포트에 30% 이상 진입하면 cp_in 추가 (한 번만) */
      if (entry.isIntersecting) {
        entry.target.classList.add('cp_in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── 3. 동적 지도 SVG 애니메이션 ── */
(function () {
  /* 한국 허브 좌표 (서울, viewBox 1407×802 기준) */
  const HUB = { x: 1270, y: 485 };

  /* 중국 주요 도시 — 서울로 연결되는 아크 */
  const CITIES = [
    { x: 760, y: 308 }, /* 베이징 */
    { x: 451, y: 496 }, /* 시안 */
    { x: 690, y: 444 }, /* 정저우 */
    { x: 594, y: 600 }, /* 우한 */
    { x: 708, y: 538 }, /* 상하이 */
    { x: 506, y: 602 }, /* 청두 */
    { x: 647, y: 664 }, /* 광저우 */
    { x: 850, y: 198 }, /* 하얼빈 */
    { x: 820, y: 268 }, /* 선양 */
    { x: 740, y: 558 }, /* 항저우 */
  ];

  /* 중국 내부 네트워크 */
  const INTERNAL = [
    [850, 198, 820, 268],
    [820, 268, 760, 308],
    [760, 308, 780, 348],
    [780, 348, 690, 444],
    [690, 444, 708, 538],
    [708, 538, 740, 558],
    [740, 558, 594, 600],
    [594, 600, 647, 664],
    [451, 496, 690, 444],
    [506, 602, 594, 600],
    [690, 444, 594, 600],
  ];

  const svgNS = 'http://www.w3.org/2000/svg';
  const internalGroup = document.getElementById('cp_internal');
  const linesGroup    = document.getElementById('cp_lines');
  const moversGroup   = document.getElementById('cp_movers');

  /* 중국 내부 연결선 */
  INTERNAL.forEach(([x1, y1, x2, y2], i) => {
    const seg = document.createElementNS(svgNS, 'line');
    seg.setAttribute('x1', x1);
    seg.setAttribute('y1', y1);
    seg.setAttribute('x2', x2);
    seg.setAttribute('y2', y2);
    seg.setAttribute('class', 'cp_internal_line');
    seg.style.animationDelay = `${0.15 + i * 0.05}s`;
    internalGroup.appendChild(seg);
  });

  /* 각 도시 — 서울에서 중국으로 뻗는 곡선 + 이동 포인트 */
  CITIES.forEach((city, i) => {
    const line = document.createElementNS(svgNS, 'path');
    /* 곡선: 서울 → 제어점(위쪽 아크) → 중국 도시 */
    const cx = (HUB.x + city.x) / 2 + 30;
    const cy = Math.min(HUB.y, city.y) - 90 - (i % 3) * 15;
    line.setAttribute('d', `M${HUB.x},${HUB.y} Q${cx},${cy} ${city.x},${city.y}`);
    line.setAttribute('class', 'cp_line');
    linesGroup.appendChild(line);

    const len = line.getTotalLength ? line.getTotalLength() : 300;
    line.style.strokeDasharray  = len;
    line.style.strokeDashoffset = len;
    line.style.transition = `stroke-dashoffset 1.6s ease ${0.4 + i * 0.1}s`;

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '3.5');
    circle.setAttribute('class', 'cp_mover');

    const anim = document.createElementNS(svgNS, 'animateMotion');
    anim.setAttribute('dur', `${2.6 + (i % 4) * 0.4}s`);
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('begin', `${0.8 + i * 0.3}s`);

    const pathId = `cp_line_${i}`;
    line.setAttribute('id', pathId);

    const mpath = document.createElementNS(svgNS, 'mpath');
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    anim.appendChild(mpath);
    circle.appendChild(anim);
    moversGroup.appendChild(circle);
  });

  /* 섹션 진입 시 선 그리기 시작 */
  const strengthSec = document.getElementById('cp_strength');
  const mapObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* strokeDashoffset을 0으로 — 선이 그려짐 */
        linesGroup.querySelectorAll('.cp_line').forEach(l => {
          l.style.strokeDashoffset = '0';
        });
        mapObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (strengthSec) mapObs.observe(strengthSec);
})();

/* ── 4. 마무리 섹션 — 스파클 입자 + 배경 패럴랙스 ── */
(function () {
  var closing = document.getElementById('cp_closing');
  if (!closing) return;

  /* 우측 광원 영역에 흰 스파클 입자 */
  var particlesWrap = closing.querySelector('.cp_closing_particles');
  if (particlesWrap) {
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('div');
      p.className = 'cp_closing_particle';
      p.style.left = (Math.random() * 38 + 52) + '%';
      p.style.top = (Math.random() * 70 + 10) + '%';
      var size = (Math.random() * 2.5 + 0.8).toFixed(1);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--dx', (Math.random() * 30 - 15).toFixed(0) + 'px');
      p.style.animationDuration = (6 + Math.random() * 8).toFixed(1) + 's';
      p.style.animationDelay = -(Math.random() * 12).toFixed(1) + 's';
      particlesWrap.appendChild(p);
    }
  }

  /* 스크롤 패럴랙스 — 배경 레이어만 미세 이동 */
  var shadow = closing.querySelector('.cp_closing_shadow');
  var glow = closing.querySelector('.cp_closing_glow');
  var steps = closing.querySelector('.cp_closing_steps');

  window.addEventListener('scroll', function () {
    var rect = closing.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    var progress = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.3) / window.innerHeight));
    if (shadow) shadow.style.transform = 'translateX(' + (progress * -12) + 'px)';
    if (glow) glow.style.transform = 'translateY(' + (progress * 16) + 'px)';
    if (steps) steps.style.transform = 'translateY(' + (progress * 8) + 'px)';
  }, { passive: true });
})();
