/**
 * intro.js
 * NOVA SM 인트로 애니메이션 컨트롤러
 * 씬 순서: 골드빔 → 슬로건 → 로고 → 도시영상 → 의료장면 → 한중지도 → 최종로고
 */

(function () {
  'use strict';

  /* ── 렌즈 플레어 보조 광선 생성 ──────────────────── */
  /**
   * .intro_beam 안에 방사형 광선(ray)과 헤이즈를 추가한다.
   * @param {HTMLElement} beam - .intro_beam 요소
   */
  function buildFlareRays(beam) {
    /* 헤이즈(빛 번짐) */
    const haze = document.createElement('div');
    haze.className = 'intro_haze';
    beam.appendChild(haze);

    /* 방사형 보조 광선 각도 목록 (도 단위, 코어 중심 기준) */
    const rays = [
      /* 주 대각선 방향 반대편 꼬리 */
      { angle: 155, length: 700, opacity: 0.6 },
      /* 위아래 짧은 수직 광선 */
      { angle: 80,  length: 180, opacity: 0.45 },
      { angle: 260, length: 180, opacity: 0.45 },
      /* 대각 보조 광선 */
      { angle: 45,  length: 250, opacity: 0.3 },
      { angle: 225, length: 250, opacity: 0.3 },
      { angle: 120, length: 130, opacity: 0.25 },
      { angle: 300, length: 130, opacity: 0.25 },
    ];

    rays.forEach(function (r) {
      const el = document.createElement('div');
      el.className = 'intro_ray';
      el.style.cssText = `
        width: ${r.length}px;
        transform: translate(-50%, -50%) rotate(${r.angle}deg);
        opacity: ${r.opacity};
        transform-origin: center center;
      `;
      beam.appendChild(el);
    });
  }

  /* ── 파티클 생성 유틸 ──────────────────────────── */
  /**
   * 빔이 지나간 대각선 경로(우상→좌하)에 미세 파티클을 흩뿌린다.
   * @param {HTMLElement} container - 파티클을 붙일 부모 요소
   * @param {number} count - 생성할 파티클 수
   */
  function spawnBeamParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'intro_particle';

      /* 우상→좌하 대각선 경로 기준 위치 */
      const pct = i / count;
      const baseX = 100 - pct * 110;  /* 우측(100vw)에서 왼쪽으로 */
      const baseY = pct * 110 - 10;   /* 위(-10vh)에서 아래로 */

      const size = Math.random() * 4 + 1;

      p.style.cssText = `
        left: ${baseX + (Math.random() - 0.5) * 15}vw;
        top:  ${baseY + (Math.random() - 0.5) * 15}vh;
        width: ${size}px;
        height: ${size}px;
        --delay: ${0.5 + Math.random() * 0.8}s;
        --dur: ${0.9 + Math.random() * 0.8}s;
        --tx1: ${(Math.random() - 0.5) * 40}px;
        --ty1: ${-10 - Math.random() * 20}px;
        --tx2: ${(Math.random() - 0.5) * 80}px;
        --ty2: ${-30 - Math.random() * 50}px;
      `;
      container.appendChild(p);
    }
  }

  /**
   * 메인 빔 뒤를 따라오는 잔상 고스트 빔 생성
   * 딜레이를 조금씩 늦춰서 잔상이 남는 느낌을 만든다.
   * @param {HTMLElement} container
   */
  function spawnGhostBeams(container) {
    /* [딜레이 오프셋, 불투명도, 크기, blur] */
    var ghosts = [
      { offset: 0.22, op: 0.35, size: 160, blur: 38 },
      { offset: 0.44, op: 0.20, size: 110, blur: 48 },
      { offset: 0.66, op: 0.10, size:  80, blur: 56 },
    ];

    ghosts.forEach(function (g) {
      var el = document.createElement('div');
      el.className = 'intro_ghost';
      /* 메인 빔 딜레이(0.2s) + 오프셋만큼 더 늦게 출발 → 뒤에서 따라옴 */
      el.style.cssText = `
        --ghost-delay: ${0.2 + g.offset}s;
        --ghost-dur: 2.4s;
        --ghost-op: ${g.op};
        --ghost-size: ${g.size}px;
        --ghost-blur: ${g.blur}px;
      `;
      container.appendChild(el);
    });
  }

  /**
   * 최종 씬에서 사방에 흩어진 파티클이 중앙으로 수렴하는 효과 생성
   * @param {HTMLElement} container
   * @param {number} count
   */
  function spawnConvergeParticles(container, count) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'intro_converge_particle';

      /* 무작위 시작 위치 */
      const startX = Math.random() * 100;  /* vw */
      const startY = Math.random() * 100;  /* vh */

      /* 중앙까지의 이동 벡터 */
      const sx = startX / 100 * window.innerWidth;
      const sy = startY / 100 * window.innerHeight;
      const dx = cx - sx;
      const dy = cy - sy;

      const size = Math.random() * 5 + 2;

      p.style.cssText = `
        --sz: ${size}px;
        --px: ${startX}vw;
        --py: ${startY}vh;
        --cx: ${dx}px;
        --cy: ${dy}px;
        --cd: ${16.4 + Math.random() * 0.5}s;
      `;
      container.appendChild(p);
    }
  }

  /* ── DOM 구성 ──────────────────────────────────── */
  function buildIntro() {
    const overlay = document.getElementById('intro_overlay');
    if (!overlay) return;

    /* 렌즈 플레어 빔 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_beam"></div>
    `);
    /* 빔 내부에 보조 광선 + 헤이즈 삽입 */
    buildFlareRays(overlay.querySelector('.intro_beam'));

    /* 잔상 고스트 빔: 메인보다 딜레이를 두고 뒤따라옴 */
    spawnGhostBeams(overlay);

    /* 빔 경로 파티클 */
    spawnBeamParticles(overlay, 40);

    /* 슬로건 텍스트 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_slogan" id="introSlogan">
        <span class="intro_slogan_line" style="--s-delay:1.4s;--s-shine:2s;">
          KOREA MEDICAL MARKETING
        </span>
        <span class="intro_slogan_line" style="--s-delay:1.7s;--s-shine:2.3s;">
          NEW STANDARD
        </span>
      </div>
    `);

    /* 슬로건 → 텍스트 로고 전환 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_logo_burst"></div>
      <div class="intro_logo_wrap" id="introLogoWrap">
        <span class="intro_logo_nova">NOVA</span>
        <span class="intro_logo_sm">SM</span>
      </div>
    `);

    /* 도시 장면 — 전체화면 단일 영상 슬롯 (영상 추후 삽입) */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_cities" id="introCities">
        <div class="intro_city_slot">
          <video src="./img/seoul_intro.mp4" autoplay muted playsinline loop></video>
        </div>
      </div>
    `);

    /* 의료 장면: 4칸, 위에서 내려오기 — 파일명만 교체하면 바로 적용 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_medical" id="introMedical">
        <div class="intro_med_panel" data-label="원장 상담">
          <video class="intro_med_video" src="./img/medical_1.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel" data-label="시술 장면">
          <video class="intro_med_video" src="./img/medical_2.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel" data-label="의료진 협업">
          <video class="intro_med_video" src="./img/medical_3.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel" data-label="전문성 &amp; 신뢰">
          <video class="intro_med_video" src="./img/medical_4.mp4" autoplay muted playsinline loop></video>
        </div>
      </div>
    `);

    /* 한중 지도 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_map" id="introMap">
        <img class="intro_map_img" src="./img/한중지도.png" alt="한국-중국 연결 지도">
        <!-- 골드 연결 라인 SVG -->
        <svg class="intro_map_line_svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#8a7040"/>
              <stop offset="40%"  stop-color="#d4af5e"/>
              <stop offset="60%"  stop-color="#fff8d6"/>
              <stop offset="100%" stop-color="#8a7040"/>
            </linearGradient>
          </defs>
          <!-- 서울(1290, 600) 먼저 등장, 베이징(976, 430) 동시 등장, 이후 곡선 연결 -->
          <path class="intro_map_gold_path"
            d="M 1290 590 C 1240 510, 1040 470, 995 485"/>
          <!-- 서울 마커 -->
          <circle cx="1290" cy="590" r="5" fill="#d4af5e" opacity="0"
            style="animation: map_dot 0.3s ease forwards 12.9s;">
          </circle>
          <!-- 베이징 마커 -->
          <circle cx="995"  cy="485" r="5" fill="#d4af5e" opacity="0"
            style="animation: map_dot 0.3s ease forwards 12.9s;">
          </circle>
        </svg>
        <span class="intro_map_tagline">CONNECT KOREA, EXPAND CHINA</span>
      </div>
    `);

    /* 최종 로고 씬: 수렴 파티클 + 글로우 + 로고 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_final" id="introFinal">
        <div class="intro_final_glow"></div>
        <img class="intro_final_logo" src="./img/novasm_logo.png" alt="NOVA SM">
      </div>
    `);

    /* 수렴 파티클 — 최종 씬 컨테이너에 삽입 */
    const finalEl = document.getElementById('introFinal');
    spawnConvergeParticles(finalEl, 60);

    /* 건너뛰기 버튼 */
    overlay.insertAdjacentHTML('beforeend', `
      <button class="intro_skip" id="introSkip" aria-label="인트로 건너뛰기">
        SKIP ›
      </button>
    `);
  }

  /* ── 슬로건 → 로고 전환 타이밍 제어 ──────────── */
  function scheduleSloganFade() {
    const slogan = document.getElementById('introSlogan');
    if (!slogan) return;

    /* 3.6s 후 슬로건이 중앙으로 수축하며 blur — 로고 텍스트로 흘러드는 느낌 */
    setTimeout(function () {
      slogan.style.transition = 'opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease, letter-spacing 0.7s ease';
      slogan.style.opacity = '0';
      slogan.style.transform = 'scale(0.7)';
      slogan.style.filter = 'blur(8px)';

      /* letter-spacing 개별 라인에도 적용 */
      Array.from(slogan.querySelectorAll('.intro_slogan_line')).forEach(function (line) {
        line.style.transition = 'letter-spacing 0.7s ease';
        line.style.letterSpacing = '0.6em';
      });
    }, 3600);
  }

  /* ── 인트로 종료 처리 ──────────────────────────── */
  function endIntro() {
    const overlay = document.getElementById('intro_overlay');
    const skip    = document.getElementById('introSkip');

    if (skip)    skip.style.display = 'none';
    if (overlay) {
      overlay.classList.add('intro--done');
      /* 페이드아웃(0.8s) 후 DOM에서 제거 */
      setTimeout(function () {
        overlay.remove();
      }, 800);
    }
  }

  /* ── 건너뛰기 버튼 바인딩 ──────────────────────── */
  function bindSkip() {
    const btn = document.getElementById('introSkip');
    if (btn) btn.addEventListener('click', endIntro);
  }

  /* ── 전체 인트로 타이머 ────────────────────────── */
  /* 총 약 16초 후 자동 종료 */
  function startIntroTimer() {
    setTimeout(endIntro, 20000);
  }

  /* ── 진입점 ────────────────────────────────────── */
  /* sessionStorage를 이용해 같은 탭 세션에서 인트로를 한 번만 재생 */
  document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('introPlayed')) {
      /* 이미 재생된 경우 오버레이를 즉시 제거 */
      var overlay = document.getElementById('intro_overlay');
      if (overlay) overlay.remove();
      return;
    }

    sessionStorage.setItem('introPlayed', '1');
    buildIntro();
    scheduleSloganFade();
    bindSkip();
    startIntroTimer();
  });

}());
