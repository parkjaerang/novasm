/* ══════════════════════════════════════
   TIMING (seconds from opening start)
════════════════════════════════════════
  0.0  – S1 starts (light streak)
  1.8  – S2 starts (KMM text)
  4.0  – S3 starts (NOVA SM logo morph)
  6.5  – S4 starts (city scroll)
  10.0 – S5 starts (medical panels)
  13.5 – S6 starts (connect map)
  17.0 – S7 starts (final logo)
  21.0 – Opening ends → main site
══════════════════════════════════════ */

/* 각 씬의 시작 타이밍 (밀리초) */
const T = {
  s1: 0,
  s2: 1800,
  s3: 4000,
  s4: 6500,
  s5: 10000,
  s6: 13500,
  s7: 17000,
  end: 21000,
};

let openingDone = false;

/* ── Utility: 요소를 서서히 표시 ── */
function fadeIn(el, duration = 600, delay = 0) {
  el.style.transition = `opacity ${duration}ms ease`;
  setTimeout(() => { el.style.opacity = '1'; }, delay);
}

/* ── Utility: 요소를 서서히 숨김 ── */
function fadeOut(el, duration = 500, delay = 0) {
  el.style.transition = `opacity ${duration}ms ease`;
  setTimeout(() => { el.style.opacity = '0'; }, delay);
}

/* ── SCENE 01: 파티클 생성 ── */
function spawnParticles(containerId, count = 20) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 2 + 1.5).toFixed(2);
    const del = (Math.random() * 1.5).toFixed(2);
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; top:${y}%;
      opacity:0;
      animation: particleDrift ${dur}s ease-out ${del}s forwards;
    `;
    wrap.appendChild(p);
  }
}

/* particleDrift 키프레임을 동적으로 주입 */
const pStyle = document.createElement('style');
pStyle.textContent = `
@keyframes particleDrift {
  0%   { opacity:0; transform:translateY(0) scale(1); }
  30%  { opacity:0.8; }
  100% { opacity:0; transform:translateY(-${40}px) scale(0.3); }
}`;
document.head.appendChild(pStyle);

/* ── SCENE 04: 건물 실루엣 생성 ── */
function makeBuildingSet(id, palette) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    const w = Math.random() * 60 + 20;
    const h = Math.random() * 55 + 20;
    const left = (i / count) * 100;
    b.style.cssText = `
      position:absolute; bottom:0;
      left:${left}%;
      width:${w}px; height:${h}%;
      background:${palette};
      opacity:0.7;
    `;
    /* 건물 창문 생성 */
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        const win = document.createElement('div');
        const lit = Math.random() > 0.4;
        win.style.cssText = `
          position:absolute;
          width:6px; height:8px;
          left:${8 + c*14}px; top:${8 + r*14}px;
          background:${lit ? 'rgba(255,240,180,0.95)' : 'rgba(180,180,200,0.4)'};
        `;
        b.appendChild(win);
      }
    }
    wrap.appendChild(b);
  }
}

/* ── SCENE 07: 중앙으로 모이는 파티클 생성 ── */
function spawnGatherParticles() {
  const wrap = document.getElementById('fp-wrap');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'f-particle';
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    /* 파티클이 화면 중앙으로 이동할 거리 계산 */
    const tx = cx - startX;
    const ty = cy - startY;
    const dur = (Math.random() * 1.5 + 1).toFixed(2);
    const del = (Math.random() * 0.8).toFixed(2);
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${startX}px; top:${startY}px;
      --tx:${tx}px; --ty:${ty}px;
      animation-duration:${dur}s;
      animation-delay:${del}s;
    `;
    wrap.appendChild(p);
  }
}

/* ── SCENE 02→03: 텍스트 모프 전환 ── */
function morphS2toS3() {
  const s2 = document.getElementById('s2');
  const s3 = document.getElementById('s3');
  const logo = document.getElementById('logo03');

  /* S2 각 .line의 텍스트를 낱글자 <span>으로 분해 */
  const lines = s2.querySelectorAll('.line');
  lines.forEach(line => {
    const text = line.textContent;
    /* 현재 line-appear 상태 유지하며 낱글자로 교체 */
    line.style.opacity = '1';
    line.style.transform = 'translateY(0)';
    line.innerHTML = text.split('').map(ch =>
      ch === ' ' ? ' ' : `<span class="m-letter">${ch}</span>`
    ).join('');
  });

  /* Phase 1: 낱글자들이 화면 중앙으로 수렴하며 사라짐 (400ms) */
  const allLetters = [...s2.querySelectorAll('.m-letter')];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  allLetters.forEach((span, i) => {
    const rect = span.getBoundingClientRect();
    /* 각 글자의 현재 중심점 → 화면 중앙까지의 이동 거리 */
    const dx = cx - (rect.left + rect.width / 2);
    const dy = cy - (rect.top + rect.height / 2);
    const delay = i * 18;
    setTimeout(() => {
      span.style.transition = `transform 0.45s ease-in, opacity 0.35s ease-in 0.1s`;
      span.style.transform = `translate(${dx}px,${dy}px) scale(0.05) rotate(${(Math.random()-0.5)*80}deg)`;
      span.style.opacity = '0';
    }, delay);
  });

  /* Phase 2: 골드 플래시 후 S3 전환 (500ms) */
  setTimeout(() => {
    s2.style.opacity = '0';

    /* 중앙 골드 섬광 */
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;z-index:999;pointer-events:none;
      background:radial-gradient(circle at center,rgba(255,240,160,0.85) 0%,transparent 60%);
      opacity:1;transition:opacity 0.5s ease;
    `;
    document.body.appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; }, 30);
    setTimeout(() => flash.remove(), 600);

    /* S3 씬 표시 (logo는 innerHTML 교체로 초기화되므로 transform 리셋) */
    logo.style.opacity = '1';
    logo.style.transform = 'scale(1)';
    s3.style.opacity = '1';

    /* NOVA SM 텍스트를 낱글자 span으로 분해하여 중앙에서 퍼지며 등장 */
    logo.innerHTML = 'NOVA SM'.split('').map(ch =>
      ch === ' '
        ? '<span style="display:inline-block;width:0.35em"> </span>'
        : `<span class="s3-letter">${ch}</span>`
    ).join('');

    const s3Letters = [...logo.querySelectorAll('.s3-letter')];
    s3Letters.forEach((span, i) => {
      /* 시작: 중앙에서 작게, 각도 랜덤 */
      span.style.transform = 'scale(0.05)';
      span.style.opacity = '0';
      setTimeout(() => {
        span.style.transition = `transform 0.65s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.5s ease`;
        span.style.transform = 'scale(1)';
        span.style.opacity = '1';
      }, 60 + i * 75);
    });

    /* 링 확장 후 페이드 아웃 */
    const ring = document.getElementById('logo-ring');
    setTimeout(() => {
      ring.style.transition = 'opacity 0.5s ease, transform 1s ease';
      ring.style.opacity = '0.3';
      ring.style.transform = 'scale(1)';
    }, 500);
    setTimeout(() => {
      ring.style.transition = 'opacity 0.8s ease';
      ring.style.opacity = '0';
    }, 1500);

  }, 500);
}

/* ═══════════════════════════════════
   MAIN SEQUENCE – 씬 순서대로 실행
═══════════════════════════════════ */
function runOpening() {

  /* S1: 파티클 및 건물 사전 생성 */
  spawnParticles('p1', 25);
  spawnParticles('p2', 25);
  spawnParticles('p3', 25);
  makeBuildingSet('b1', 'rgba(60,90,130,0.7)');
  makeBuildingSet('b2', 'rgba(80,70,120,0.7)');
  makeBuildingSet('b3', 'rgba(120,100,60,0.7)');
  makeBuildingSet('b4', 'rgba(50,110,110,0.7)');

  /* S2: KMM 텍스트 씬 전환 */
  setTimeout(() => {
    const s1 = document.getElementById('s1');
    const s2 = document.getElementById('s2');
    fadeOut(s1, 500);
    fadeIn(s2, 600);

    /* 텍스트 라인 순차 등장 */
    setTimeout(() => {
      const lines = s2.querySelectorAll('.line');
      lines.forEach((l, i) => {
        setTimeout(() => { l.classList.add('line-appear'); }, i * 250);
      });
    }, 300);
  }, T.s2);

  /* S3: S2 글자 → NOVA SM 모프 전환 */
  setTimeout(() => morphS2toS3(), T.s3);

  /* S4: 도시 항공 씬 – 슬라이드 스크롤 */
  setTimeout(() => {
    const s3 = document.getElementById('s3');
    const s4 = document.getElementById('s4');
    fadeOut(s3, 500);
    fadeIn(s4, 600);

    const slides = document.getElementById('city-slides');
    setTimeout(() => {
      slides.style.transition = 'transform 3.5s cubic-bezier(0.25,0.1,0.25,1)';
      slides.style.transform = 'translateX(-75%)';
    }, 400);
  }, T.s4);

  /* S5: 의료 패널 씬 */
  setTimeout(() => {
    const s4 = document.getElementById('s4');
    const s5 = document.getElementById('s5');
    fadeOut(s4, 400);
    fadeIn(s5, 500);

    /* 패널 라벨 순차 페이드 인 */
    const mlIds = ['ml1','ml2','ml3','ml4'];
    mlIds.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0.7';
      }, 1000 + i * 200);
    });
  }, T.s5);

  /* S6: 한국-중국 연결 지도 씬 */
  setTimeout(() => {
    const s5 = document.getElementById('s5');
    const s6 = document.getElementById('s6');
    fadeOut(s5, 400);
    fadeIn(s6, 600);

    /* SVG 연결 경로 애니메이션 */
    const path = document.getElementById('conn-path');
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 1.8s ease';
      path.style.strokeDashoffset = '0';
    }, 400);

    /* 경로 중간쯤 중국 점 등장 */
    setTimeout(() => {
      const dotCn = document.getElementById('dot-cn');
      dotCn.style.transition = 'opacity 0.5s ease';
      dotCn.style.opacity = '1';
    }, 1500);

    /* 텍스트 순차 등장 */
    const ctLines = document.querySelectorAll('.ct-line');
    ctLines.forEach((l, i) => {
      setTimeout(() => {
        l.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        l.style.opacity = '1';
        l.style.transform = 'translateY(0)';
      }, 2000 + i * 300);
    });
  }, T.s6);

  /* S7: 파이널 로고 씬 */
  setTimeout(() => {
    const s6 = document.getElementById('s6');
    const s7 = document.getElementById('s7');
    fadeOut(s6, 400);
    fadeIn(s7, 700);

    spawnGatherParticles();

    /* 로고 버스트 인 */
    const wrap = document.getElementById('final-logo-wrap');
    setTimeout(() => {
      wrap.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.175,0.885,0.32,1.275)';
      wrap.style.opacity = '1';
      wrap.style.transform = 'scale(1)';
    }, 600);

    /* 데코 라인 확장 */
    setTimeout(() => {
      const d1 = document.getElementById('deco1');
      const d2 = document.getElementById('deco2');
      d1.style.transition = 'width 0.8s ease, opacity 0.5s ease';
      d1.style.width = '300px'; d1.style.opacity = '1';
      d2.style.transition = 'width 0.8s ease, opacity 0.5s ease';
      d2.style.width = '300px'; d2.style.opacity = '1';
    }, 1000);

    /* 태그라인 등장 */
    setTimeout(() => {
      const tag = document.getElementById('final-tag');
      tag.style.transition = 'opacity 0.8s ease';
      tag.style.opacity = '1';
    }, 1600);

  }, T.s7);

  /* 오프닝 종료 후 메인 사이트로 전환 */
  setTimeout(() => {
    if (!openingDone) endOpening();
  }, T.end);
}

/* 오프닝 종료 및 메인 사이트 표시 */
function endOpening() {
  openingDone = true;
  const overlay = document.getElementById('transition-overlay');
  overlay.style.transition = 'opacity 0.8s ease';
  overlay.style.opacity = '1';
  setTimeout(() => {
    document.getElementById('opening').style.display = 'none';
    document.getElementById('skip-btn').style.display = 'none';
    const main = document.getElementById('main-site');
    main.style.display = 'block';
    /* 한 프레임 후 클래스 추가해야 transition이 동작함 */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { main.classList.add('ms-visible'); });
    });
    overlay.style.transition = 'opacity 0.8s ease';
    overlay.style.opacity = '0';
  }, 800);
}

/* DOM 로드 완료 후 오프닝 시작 */
window.addEventListener('DOMContentLoaded', runOpening);

/* ═══════════════════════════════════
   PARTNER SLIDER — 카드 active 상태 순환 + 자동 재생
═══════════════════════════════════ */
(function () {
  var cards  = document.querySelectorAll('.ms_pt_card');
  var dots   = document.querySelectorAll('.ms_pt_dot');
  var active = 1; /* 초기 활성 인덱스 */
  var timer;

  function setActive(idx) {
    cards[active].classList.remove('ms_pt_card--active');
    dots[active].classList.remove('ms_pt_dot--active');
    active = (idx + cards.length) % cards.length;
    cards[active].classList.add('ms_pt_card--active');
    dots[active].classList.add('ms_pt_dot--active');
  }

  /* 4초마다 자동으로 다음 카드 */
  function startAutoPlay() {
    timer = setInterval(function () { setActive(active + 1); }, 4000);
  }

  /* 사용자 조작 시 타이머 리셋 */
  function resetTimer() {
    clearInterval(timer);
    startAutoPlay();
  }

  document.getElementById('ptPrev').addEventListener('click', function () { setActive(active - 1); resetTimer(); });
  document.getElementById('ptNext').addEventListener('click', function () { setActive(active + 1); resetTimer(); });

  /* 점 클릭으로도 이동 */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { setActive(i); resetTimer(); });
  });

  startAutoPlay();
})();

/* ═══════════════════════════════════
   HERO — 배경 골드 부유 파티클 생성
═══════════════════════════════════ */
(function () {
  var hero = document.querySelector('.ms_hero');
  if (!hero) return;

  /* 기존 위로 올라가는 파티클 */
  for (var i = 0; i < 16; i++) {
    var p = document.createElement('div');
    p.className = 'ms_hero_particle';
    p.style.left            = (Math.random() * 88 + 4) + '%';
    p.style.bottom          = (Math.random() * 40 + 5) + '%';
    p.style.width           = (Math.random() * 3 + 1).toFixed(1) + 'px';
    p.style.height          = p.style.width;
    p.style.animationDuration = (5 + Math.random() * 7).toFixed(1) + 's';
    /* 음수 delay: 파티클이 이미 진행 중인 것처럼 자연스럽게 시작 */
    p.style.animationDelay  = -(Math.random() * 9).toFixed(1) + 's';
    hero.appendChild(p);
  }


})();

/* ═══════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   각 섹션이 뷰포트에 15% 이상 들어오면 ms_in 클래스 추가
═══════════════════════════════════ */
(function () {
  /* 섹션 단위 관찰 */
  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('ms_in');
        sectionObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  ['.ms_who', '.ms_services', '.ms_partner', '.ms_portfolio', '.ms_contact'].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) sectionObs.observe(el);
  });

  /* 서비스 카드는 개별 관찰 — stagger delay를 inline으로 주입 */
  var cardObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('ms_in');
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.ms_svc_card').forEach(function (card, i) {
    card.style.animationDelay = (i * 0.12) + 's';
    cardObs.observe(card);
  });
})();

/* ═══════════════════════════════════
   HEADER — 스크롤 시 컴팩트 스타일 적용
═══════════════════════════════════ */
(function () {
  var header = document.querySelector('.ms_header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      header.classList.add('ms_scrolled');
    } else {
      header.classList.remove('ms_scrolled');
    }
  }, { passive: true });
})();
