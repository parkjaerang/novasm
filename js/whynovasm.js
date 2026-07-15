/* WHY NOVA SM — 진입 애니메이션, 배경 파티클, 헤더 스크롤 */
(function () {
  const animTargets = document.querySelectorAll('.wn_card, .wn_center, .wn_tagline, .wn_center_bottom');

  animTargets.forEach((el) => {
    const delay = Number(el.dataset.delay);
    if (delay > 0) el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('wn_visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  animTargets.forEach((el) => observer.observe(el));

  const particles = document.querySelector('.wn_particles');
  if (particles) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'ms_hero_particle';
      const size = (Math.random() * 4 + 2).toFixed(1) + 'px';
      p.style.width = size;
      p.style.height = size;
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = Math.random() * 40 + '%';
      p.style.animationDuration = (Math.random() * 8 + 6).toFixed(1) + 's';
      p.style.animationDelay = -(Math.random() * 6).toFixed(1) + 's';
      particles.appendChild(p);
    }
  }

  const header = document.querySelector('header.ms_header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('ms_scrolled', window.scrollY > 10);
    }, { passive: true });
  }
})();
