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

  /* 중국 도시 좌표 — HTML circle과 동일 */
  const CITIES = [
    { x: 760, y: 308 }, /* 베이징 */
    { x: 451, y: 496 }, /* 시안 */
    { x: 690, y: 444 }, /* 정저우 */
    { x: 594, y: 600 }, /* 우한 */
    { x: 708, y: 538 }, /* 상하이 */
    { x: 506, y: 602 }, /* 청두 */
    { x: 647, y: 664 }, /* 광저우 */
  ];

  const svgNS = 'http://www.w3.org/2000/svg';
  const linesGroup  = document.getElementById('cp_lines');
  const moversGroup = document.getElementById('cp_movers');

  /* 각 도시마다 연결선 + 이동 포인트 생성 */
  CITIES.forEach((city, i) => {
    /* ─ 연결선 ─ */
    const line = document.createElementNS(svgNS, 'path');
    /* 곡선: 한국(허브) → 제어점(중간 위쪽) → 도시 */
    const cx = (HUB.x + city.x) / 2;
    const cy = Math.min(HUB.y, city.y) - 80;
    line.setAttribute('d', `M${HUB.x},${HUB.y} Q${cx},${cy} ${city.x},${city.y}`);
    line.setAttribute('class', 'cp_line');
    linesGroup.appendChild(line);

    /* 선 길이를 구해 dashoffset 애니메이션에 활용 */
    const len = line.getTotalLength ? line.getTotalLength() : 300;
    line.style.strokeDasharray  = len;
    line.style.strokeDashoffset = len;
    line.style.transition = `stroke-dashoffset 1.4s ease ${0.3 + i * 0.12}s`;

    /* ─ 이동 포인트 (animateMotion) ─ */
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '4');
    circle.setAttribute('class', 'cp_mover');

    const anim = document.createElementNS(svgNS, 'animateMotion');
    anim.setAttribute('dur', `${2.4 + (i % 3) * 0.5}s`);
    anim.setAttribute('repeatCount', 'indefinite');
    /* 시작 지연: 섹션 진입 전에도 준비하되 opacity로 숨김 */
    anim.setAttribute('begin', `${i * 0.35}s`);

    const mpath = document.createElementNS(svgNS, 'mpath');
    /* 같은 경로 재활용 — href로 참조 */
    const pathId = `cp_line_${i}`;
    line.setAttribute('id', pathId);
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
