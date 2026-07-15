/* 서비스 페이지 — 스크롤 진입 시 타이틀·카드 등장 */
(function () {
  const targets = document.querySelectorAll('.sv_title_block, .sv_card');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('sv_visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
})();
