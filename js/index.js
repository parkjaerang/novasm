/* 파트너 슬라이더 — 카드 active 순환 + 자동 재생 */
(function () {
  const cards = document.querySelectorAll('.ms_pt_card');
  const dots = document.querySelectorAll('.ms_pt_dot');
  const prev = document.getElementById('ptPrev');
  const next = document.getElementById('ptNext');
  if (!cards.length || !prev || !next) return;

  let active = 1;
  let timer;

  function setActive(idx) {
    cards[active].classList.remove('ms_pt_card--active');
    dots[active].classList.remove('ms_pt_dot--active');
    active = (idx + cards.length) % cards.length;
    cards[active].classList.add('ms_pt_card--active');
    dots[active].classList.add('ms_pt_dot--active');
  }

  function startAutoPlay() {
    timer = setInterval(() => setActive(active + 1), 4000);
  }

  function resetTimer() {
    clearInterval(timer);
    startAutoPlay();
  }

  prev.addEventListener('click', () => { setActive(active - 1); resetTimer(); });
  next.addEventListener('click', () => { setActive(active + 1); resetTimer(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { setActive(i); resetTimer(); });
  });

  startAutoPlay();
})();

/* 히어로 — 배경 골드 부유 파티클 */
(function () {
  const hero = document.querySelector('.ms_hero');
  if (!hero) return;

  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'ms_hero_particle';
    const size = (Math.random() * 3 + 1).toFixed(1) + 'px';
    p.style.left = (Math.random() * 88 + 4) + '%';
    p.style.bottom = (Math.random() * 40 + 5) + '%';
    p.style.width = size;
    p.style.height = size;
    p.style.animationDuration = (5 + Math.random() * 7).toFixed(1) + 's';
    p.style.animationDelay = -(Math.random() * 9).toFixed(1) + 's';
    hero.appendChild(p);
  }
})();

/* 스크롤 리빌 — 섹션·카드가 뷰포트에 들어오면 ms_in 추가 */
(function () {
  function createRevealObserver(threshold) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('ms_in');
        obs.unobserve(entry.target);
      });
    }, { threshold });
    return obs;
  }

  const sectionObs = createRevealObserver(0.15);
  document.querySelectorAll('.ms_who, .ms_services, .ms_partner, .ms_portfolio, .ms_contact')
    .forEach((el) => sectionObs.observe(el));

  const cardObs = createRevealObserver(0.2);
  document.querySelectorAll('.ms_svc_card').forEach((card, i) => {
    card.style.animationDelay = (i * 0.12) + 's';
    cardObs.observe(card);
  });
})();

/* 헤더 — 스크롤 시 컴팩트 스타일 */
(function () {
  const header = document.querySelector('.ms_header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('ms_scrolled', window.scrollY > 60);
  }, { passive: true });
})();
