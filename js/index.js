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

/* 문의 폼 — contact.php 로 메일 발송 */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const CONTACT_API_URL = './contact.php';
  const submitBtn = form.querySelector('.ms_ct_submit');
  const btnDefaultHtml = submitBtn ? submitBtn.innerHTML : '';

  let statusEl = form.querySelector('.ms_ct_status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'ms_ct_status';
    statusEl.setAttribute('role', 'status');
    statusEl.hidden = true;
    form.appendChild(statusEl);
  }

  function showStatus(message, type) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = 'ms_ct_status ms_ct_status--' + type;
  }

  function clearStatus() {
    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.className = 'ms_ct_status';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearStatus();

    const company = (form.company?.value || '').trim();
    const name = (form.name?.value || '').trim();
    const tel = (form.tel?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const subject = (form.subject?.value || '').trim();
    const message = (form.message?.value || '').trim();

    if (!name || !tel || !email) {
      showStatus('담당자명, 연락처, 이메일은 필수 입력 항목입니다.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('올바른 이메일 주소를 입력해주세요.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '전송 중…';
    }

    fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, name, tel, email, subject, message }),
    })
      .then((res) => res.text())
      .then((text) => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (_) {
          console.error('PHP raw response:', text);
          showStatus('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
          return;
        }

        if (data.ok) {
          form.reset();
          showStatus('문의가 접수되었습니다. 빠르게 연락드리겠습니다.', 'ok');
        } else {
          showStatus(data.message || '전송에 실패했습니다.', 'error');
        }
      })
      .catch((err) => {
        console.error('Contact API error', err);
        showStatus('네트워크 오류가 발생했습니다. 연결을 확인해주세요.', 'error');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = btnDefaultHtml;
        }
      });
  });
})();
