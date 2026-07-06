/**
 * intro.js
 * NOVA SM 인트로 애니메이션 컨트롤러
 * 씬 순서: 수평 골드빔(발광코어) → 슬로건 → 로고 → 서울몽타주 → 의료장면 → 한중지도 → 최종로고
 */

(function () {
  'use strict';

  /** 뷰포트 너비 기준 이펙트 스케일 (0.42 ~ 1) */
  function introScale() {
    return Math.min(1, Math.max(0.42, window.innerWidth / 1280));
  }

  /** 화면 크기별 파티클 수 조절 */
  function introParticleCount(base) {
    if (window.innerWidth < 480) return Math.round(base * 0.4);
    if (window.innerWidth < 768) return Math.round(base * 0.6);
    if (window.innerWidth < 1024) return Math.round(base * 0.8);
    return base;
  }

  /* ── 렌즈 플레어 보조 광선 생성 ──────────────────── */
  /**
   * .intro_beam 안에 방사형 광선(ray)과 헤이즈를 추가한다.
   * @param {HTMLElement} beam - .intro_beam 요소
   */
  function buildFlareRays(beam) {
    var scale = introScale();

    /* 헤이즈(빛 번짐) — 다층 */
    ['intro_haze', 'intro_haze intro_haze--outer'].forEach(function (cls) {
      const haze = document.createElement('div');
      haze.className = cls;
      beam.appendChild(haze);
    });

    /* 수평 주 광선 + 렌즈 플레어 보조 광선 — 길이는 뷰포트에 맞게 축소 */
    const rays = [
      { angle: 0,   length: Math.round(1400 * scale), opacity: 0.85, w: 2 },
      { angle: 180, length: Math.round(900 * scale),  opacity: 0.4,  w: 1 },
      { angle: 0,   length: Math.round(600 * scale),  opacity: 0.25, w: 6, blur: 4 },
      { angle: 90,  length: Math.round(220 * scale),  opacity: 0.35, w: 1 },
      { angle: 270, length: Math.round(220 * scale),  opacity: 0.35, w: 1 },
      { angle: 25,  length: Math.round(320 * scale),  opacity: 0.22, w: 1 },
      { angle: 335, length: Math.round(320 * scale),  opacity: 0.22, w: 1 },
      { angle: 155, length: Math.round(280 * scale),  opacity: 0.18, w: 1 },
      { angle: 205, length: Math.round(280 * scale),  opacity: 0.18, w: 1 },
    ];

    rays.forEach(function (r) {
      const el = document.createElement('div');
      el.className = 'intro_ray';
      el.style.cssText = `
        width: ${r.length}px;
        height: ${r.w || 1}px;
        transform: translate(-50%, -50%) rotate(${r.angle}deg);
        opacity: ${r.opacity};
        filter: blur(${r.blur || 0.5}px);
        transform-origin: center center;
      `;
      beam.appendChild(el);
    });
  }

  /**
   * 수평 빔 경로를 따라 미세 골드 파티클 생성
   * @param {HTMLElement} container
   * @param {number} count
   */
  function spawnBeamParticles(container, count) {
    var scale = introScale();
    var total = introParticleCount(count);

    for (let i = 0; i < total; i++) {
      const p = document.createElement('div');
      const isStreak = i % 5 === 0;
      p.className = isStreak ? 'intro_particle intro_particle--streak' : 'intro_particle';

      /* 좌→우 수평 경로 (화면 중앙 부근) */
      const pct = i / Math.max(total - 1, 1);
      const baseX = pct * 130 - 15;
      const baseY = 50 + (Math.random() - 0.5) * 14;

      const size = isStreak ? Math.random() * 2 + 1 : Math.random() * 4 + 1;

      p.style.cssText = `
        left: ${baseX + (Math.random() - 0.5) * 8}vw;
        top:  ${baseY + (Math.random() - 0.5) * 6}vh;
        width: ${isStreak ? size * 8 : size}px;
        height: ${isStreak ? size : size}px;
        --delay: ${0.35 + Math.random() * 0.9}s;
        --dur: ${0.8 + Math.random() * 1.1}s;
        --tx1: ${Math.round((20 + Math.random() * 40) * scale)}px;
        --ty1: ${(Math.random() - 0.5) * 24 * scale}px;
        --tx2: ${Math.round((60 + Math.random() * 100) * scale)}px;
        --ty2: ${(Math.random() - 0.5) * 40 * scale}px;
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
    var scale = introScale();

    /* [딜레이 오프셋, 불투명도, 크기, blur] */
    var ghosts = [
      { offset: 0.22, op: 0.35, size: Math.round(160 * scale), blur: Math.round(38 * scale) },
      { offset: 0.44, op: 0.20, size: Math.round(110 * scale), blur: Math.round(48 * scale) },
      { offset: 0.66, op: 0.10, size: Math.round(80 * scale),  blur: Math.round(56 * scale) },
    ];

    ghosts.forEach(function (g) {
      var el = document.createElement('div');
      el.className = 'intro_ghost';
      /* 메인 빔 딜레이(0.2s) + 오프셋만큼 더 늦게 출발 → 뒤에서 따라옴 */
      el.style.cssText = `
        --ghost-delay: ${0.15 + g.offset}s;
        --ghost-dur: 2.6s;
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
    const total = introParticleCount(count);

    for (let i = 0; i < total; i++) {
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

      const size = (Math.random() * 5 + 2) * Math.max(introScale(), 0.65);

      p.style.cssText = `
        --sz: ${size}px;
        --px: ${startX}vw;
        --py: ${startY}vh;
        --cx: ${dx}px;
        --cy: ${dy}px;
        --cd: ${19.5 + Math.random() * 0.6}s;
      `;
      container.appendChild(p);
    }
  }

  /* ── DOM 구성 ──────────────────────────────────── */
  function buildIntro() {
    const overlay = document.getElementById('intro_overlay');
    if (!overlay) return;

    /* 렌즈 플레어 빔 + 시네마틱 레이어 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_grain" aria-hidden="true"></div>
      <div class="intro_vignette" aria-hidden="true"></div>
      <div class="intro_screen_flash" aria-hidden="true"></div>
      <div class="intro_beam">
        <div class="intro_anamorphic" aria-hidden="true"></div>
        <div class="intro_core intro_core--hot" aria-hidden="true"></div>
        <div class="intro_core intro_core--gold" aria-hidden="true"></div>
        <div class="intro_core intro_core--bloom" aria-hidden="true"></div>
      </div>
    `);
    /* 빔 내부에 보조 광선 + 헤이즈 삽입 */
    buildFlareRays(overlay.querySelector('.intro_beam'));

    /* 잔상 고스트 빔: 메인보다 딜레이를 두고 뒤따라옴 */
    spawnGhostBeams(overlay);

    /* 빔 경로 파티클 */
    spawnBeamParticles(overlay, 72);

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
        <span class="intro_logo_nova">
          N<span class="intro_logo_o">O</span><span class="intro_logo_v">V</span><span class="intro_logo_a">A</span>
        </span>
        <span class="intro_logo_sm">SM</span>
        <span class="intro_logo_v_core" aria-hidden="true"></span>
      </div>
    `);

    /* 도시 장면 — 서울 단일 영상 + 지역 라벨 전환 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_cities" id="introCities">
        <div class="intro_city_slot">
          <video class="intro_city_video" src="./img/seoul_intro.mp4" muted playsinline loop preload="auto"></video>
        </div>
      </div>
    `);

    /* 의료 장면: 4칸, 위에서 내려오기 — 파일명만 교체하면 바로 적용 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_medical" id="introMedical">
        <div class="intro_med_panel">
          <video class="intro_med_video" src="./img/medical_1.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel">
          <video class="intro_med_video" src="./img/medical_2.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel">
          <video class="intro_med_video" src="./img/medical_3.mp4" autoplay muted playsinline loop></video>
        </div>
        <div class="intro_med_panel">
          <video class="intro_med_video" src="./img/medical_4.mp4" autoplay muted playsinline loop></video>
        </div>
      </div>
    `);

    /* 한중 지도 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_map" id="introMap">
        <!-- 이미지 위에 SVG를 정확히 겹치기 위한 래퍼 -->
        <div class="intro_map_figure">
          <img class="intro_map_img" src="./img/한중지도.png" alt="한국-중국 연결 지도">
          <!-- 골드 연결 라인 SVG — viewBox를 이미지 비율(820×461)에 맞춰 좌표 재계산 -->
          <!-- 서울: 이미지 내 90.2%, 60.8% → (740, 280) / 베이징: 54.3%, 38.1% → (445, 176) -->
          <svg class="intro_map_line_svg" viewBox="0 0 820 461" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#8a7040"/>
                <stop offset="40%"  stop-color="#d4af5e"/>
                <stop offset="60%"  stop-color="#fff8d6"/>
                <stop offset="100%" stop-color="#8a7040"/>
              </linearGradient>
            </defs>
            <!-- 서울(740, 280) → 베이징(445, 176) 곡선 연결 -->
            <path class="intro_map_gold_path"
              d="M 740 280 C 690 201, 490 161, 445 176"/>
            <!-- 서울 마커 -->
            <circle cx="740" cy="280" r="3" fill="#d4af5e" opacity="0"
              style="animation: map_dot 0.3s ease forwards 15.4s;">
            </circle>
            <!-- 베이징 마커 -->
            <circle cx="445" cy="176" r="3" fill="#d4af5e" opacity="0"
              style="animation: map_dot 0.3s ease forwards 15.4s;">
            </circle>
          </svg>
        </div>
        <span class="intro_map_tagline">CONNECT KOREA<br>EXPAND CHINA</span>
      </div>
    `);

    /* 최종 로고 씬: 수렴 파티클 + 글로우 + 로고 */
    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_final" id="introFinal">
        <div class="intro_final_glow"></div>
        <div class="intro_final_logo_wrap">
          <img class="intro_final_logo" src="./img/novasm_logo.png" alt="NOVA SM">
          <p class="intro_final_tagline">Nova seasoned marketers</p>
        </div>
      </div>
    `);

    /* 수렴 파티클 — 최종 씬 컨테이너에 삽입 */
    const finalEl = document.getElementById('introFinal');
    spawnConvergeParticles(finalEl, 90);

    /* 건너뛰기 버튼 */
    overlay.insertAdjacentHTML('beforeend', `
      <button class="intro_skip" id="introSkip" aria-label="인트로 건너뛰기">
        SKIP ›
      </button>
    `);
  }

  /* ── 슬로건 → 로고 전환 · 로고 페이드아웃 타이밍 ── */
  function scheduleSloganFade() {
    const slogan = document.getElementById('introSlogan');
    if (!slogan) return;

    /* 5.2s 후 슬로건이 중앙으로 수축하며 blur — 로고 텍스트로 흘러드는 느낌 */
    setTimeout(function () {
      slogan.style.transition = 'opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease, letter-spacing 0.7s ease';
      slogan.style.opacity = '0';
      slogan.style.transform = 'scale(0.7)';
      slogan.style.filter = 'blur(8px)';
      slogan.style.visibility = 'hidden';

      Array.from(slogan.querySelectorAll('.intro_slogan_line')).forEach(function (line) {
        line.style.transition = 'letter-spacing 0.7s ease';
        line.style.letterSpacing = '0.6em';
      });
    }, 5200);
  }

  function scheduleLogoFade() {
    /* 도시 씬(8.5s) 직전 NOVA SM 텍스트 제거 — CSS 애니메이션 보조 */
    setTimeout(function () {
      var logo = document.getElementById('introLogoWrap');
      var burst = document.querySelector('.intro_logo_burst');

      if (logo) {
        logo.style.animation = 'none';
        logo.style.transition = 'opacity 0.55s ease-in, transform 0.55s ease-in, filter 0.55s ease-in';
        logo.style.opacity = '0';
        logo.style.transform = 'scale(1.06)';
        logo.style.filter = 'blur(10px)';
        logo.style.visibility = 'hidden';
        logo.style.zIndex = '1';
      }

      if (burst) {
        burst.style.opacity = '0';
        burst.style.visibility = 'hidden';
      }
    }, 8200);
  }

  function scheduleCityMontage() {
    var label = document.getElementById('introCityLabel');
    var video = document.querySelector('.intro_city_video');

    /* 도시 씬 시작(8.5s)에 영상 1회 재생 */
    setTimeout(function () {
      if (video) {
        video.currentTime = 0;
        video.play().catch(function () {});
      }
    }, 8500);

    if (!label) return;

    /* GANGNAM은 HTML 기본값 — 이후 3개 지역만 라벨 전환 */
    [
      { name: 'HONGDAE',  at: 9150 },
      { name: 'SEONGSU',  at: 9800 },
      { name: 'CHEONGDAM', at: 10450 },
    ].forEach(function (item) {
      setTimeout(function () {
        label.classList.add('intro_city_label--fade');
        setTimeout(function () {
          label.textContent = item.name;
          label.classList.remove('intro_city_label--fade');
        }, 200);
      }, item.at);
    });
  }

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
    setTimeout(endIntro, 23500);
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
    scheduleLogoFade();
    scheduleCityMontage();
    bindSkip();
    startIntroTimer();
  });

}());
