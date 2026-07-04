/* ═══════════════════════════════════
   whynovasm.js — WHY NOVA SM 페이지 전용 스크립트
   ① 카드·타이틀 진입 애니메이션 (IntersectionObserver)
   ② 배경 골드 파티클 생성
   ③ 페이지네이션 도트 인터랙션
   ④ 스크롤 버튼 → 푸터로 부드럽게 스크롤
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ────────────────────────────────
     ① 진입 애니메이션 — IntersectionObserver
     카드, 중앙 제목, 태그라인에 .wn_visible 추가
  ──────────────────────────────── */
  const animTargets = document.querySelectorAll(
    '.wn_card, .wn_center, .wn_tagline, .wn_center_bottom'
  );

  /* data-delay 속성으로 카드별 stagger 딜레이 적용 */
  animTargets.forEach(function (el) {
    const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
    if (delay > 0) {
      el.style.transitionDelay = delay + 'ms';
    }
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wn_visible');
          /* 한 번 노출된 요소는 관찰 중단 */
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 } /* 요소의 15% 이상 뷰포트에 들어올 때 트리거 */
  );

  animTargets.forEach(function (el) {
    observer.observe(el);
  });

  /* ────────────────────────────────
     ② 배경 골드 파티클 생성
     .wn_particles 컨테이너 안에 무작위 위치·크기·속도 파티클 삽입
  ──────────────────────────────── */
  const particleContainer = document.querySelector('.wn_particles');

  if (particleContainer) {
    const PARTICLE_COUNT = 18; /* 파티클 개수 */

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'ms_hero_particle'; /* index.css의 파티클 스타일 재사용 */

      /* 무작위 크기 (2–6px) */
      const size = Math.random() * 4 + 2;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';

      /* 무작위 수평·수직 시작 위치 */
      p.style.left   = Math.random() * 100 + '%';
      p.style.bottom = Math.random() * 40 + '%';

      /* 무작위 애니메이션 속도 (6~14s) 및 딜레이 */
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay   = (Math.random() * 6) + 's';
      p.style.opacity = '0';

      particleContainer.appendChild(p);
    }
  }

  /* ────────────────────────────────
     ③ 페이지네이션 도트 인터랙션
     클릭한 도트를 활성화, 나머지 비활성화
  ──────────────────────────────── */
  const dots = document.querySelectorAll('.wn_dot');

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      /* 모든 도트에서 활성 클래스 제거 */
      dots.forEach(function (d) {
        d.classList.remove('wn_dot--active');
      });
      /* 클릭된 도트를 활성화 */
      dot.classList.add('wn_dot--active');
    });
  });

  /* ────────────────────────────────
     ④ 스크롤 버튼 → 푸터로 부드럽게 스크롤
  ──────────────────────────────── */
  const scrollBtn = document.querySelector('.wn_scroll_btn');
  const footer    = document.querySelector('footer.ms_footer');

  if (scrollBtn && footer) {
    scrollBtn.addEventListener('click', function () {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ────────────────────────────────
     ⑤ 헤더 스크롤 시 그림자 (공통 동작 보완)
  ──────────────────────────────── */
  const header = document.querySelector('header.ms_header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('ms_scrolled');
      } else {
        header.classList.remove('ms_scrolled');
      }
    }, { passive: true });
  }

});
