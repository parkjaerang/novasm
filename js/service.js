/* ─────────────────────────────────────
   service.js — 서비스 페이지 진입 애니메이션
   IntersectionObserver로 카드·타이틀 블록 순차 등장
───────────────────────────────────── */
(function () {
  /* 관찰 대상: 타이틀 블록 + 4개 카드 */
  const targets = document.querySelectorAll('.sv_title_block, .sv_card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sv_visible');
          observer.unobserve(entry.target); /* 한 번만 실행 */
        }
      });
    },
    { threshold: 0.15 } /* 요소가 15% 이상 보일 때 트리거 */
  );

  targets.forEach((el) => observer.observe(el));
})();
