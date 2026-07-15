/* NOVA SM 인트로 — 빔 → 슬로건 → 로고 → 서울 → 의료 → 지도 → 최종로고 */
(function () {
  'use strict';

  const FINAL_SCENE_START = 19.0;

  function introScale() {
    const w = window.innerWidth;
    const floor = w < 480 ? 0.32 : w < 768 ? 0.38 : 0.42;
    return Math.min(1, Math.max(floor, w / 1280));
  }

  function applyBeamTravelVars(overlay) {
    const w = window.innerWidth;
    const scale = introScale();
    const halfExtent = Math.max(
      w * 0.8,
      Math.min(1100, w * 1.45) / 2,
      Math.min(700, w * 0.95) / 2,
      (1400 * scale) / 2
    ) + Math.max(32, w * 0.06);

    overlay.style.setProperty('--beam-start-x', (-halfExtent) + 'px');
    overlay.style.setProperty('--beam-end-x', (w + halfExtent) + 'px');
    overlay.style.setProperty('--beam-mid-x', (w / 2) + 'px');
  }

  function scaledCount(base, ratios) {
    const w = window.innerWidth;
    if (w < 480) return Math.round(base * ratios[0]);
    if (w < 768) return Math.round(base * ratios[1]);
    if (w < 1024) return Math.round(base * ratios[2]);
    return base;
  }

  function buildFlareRays(beam) {
    const scale = introScale();

    ['intro_haze', 'intro_haze intro_haze--outer'].forEach((cls) => {
      const haze = document.createElement('div');
      haze.className = cls;
      beam.appendChild(haze);
    });

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

    rays.forEach((r) => {      const el = document.createElement('div');
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

  function spawnBeamParticles(container, count) {
    const scale = introScale();
    const total = scaledCount(count, [0.4, 0.6, 0.8]);
    for (let i = 0; i < total; i++) {
      const p = document.createElement('div');
      const isStreak = i % 5 === 0;
      p.className = isStreak ? 'intro_particle intro_particle--streak' : 'intro_particle';

      const pct = i / Math.max(total - 1, 1);      const baseX = pct * 130 - 15;
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

  function spawnGhostBeams(container) {
    const scale = introScale();
    const w = window.innerWidth;
    const opMul = w < 480 ? 0.55 : w < 768 ? 0.75 : 1;

    const ghosts = [      { offset: 0.22, op: 0.35 * opMul, size: Math.round(160 * scale), blur: Math.round(38 * scale) },
      { offset: 0.44, op: 0.20 * opMul, size: Math.round(110 * scale), blur: Math.round(48 * scale) },
      { offset: 0.66, op: 0.10 * opMul, size: Math.round(80 * scale),  blur: Math.round(56 * scale) },
    ];

    ghosts.forEach((g) => {
      const el = document.createElement('div');
      el.className = 'intro_ghost';
      el.style.cssText = `        --ghost-delay: ${0.15 + g.offset}s;
        --ghost-dur: 2.6s;
        --ghost-op: ${g.op};
        --ghost-size: ${g.size}px;
        --ghost-blur: ${g.blur}px;
      `;
      container.appendChild(el);
    });
  }

  function spawnConvergeParticles(container, count) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const total = scaledCount(count, [0.55, 0.72, 0.88]);

    for (let i = 0; i < total; i++) {
      const isStreak = i % 7 === 0;
      const isBright = !isStreak && i % 2 === 0;
      let cls = 'intro_converge_particle';
      if (isStreak) cls += ' intro_converge_particle--streak';
      else if (isBright) cls += ' intro_converge_particle--bright';

      const p = document.createElement('div');
      p.className = cls;

      const edge = i % 5;
      let startX;
      let startY;
      if (edge === 0) {
        startX = Math.random() * 100;
        startY = -4 - Math.random() * 8;
      } else if (edge === 1) {
        startX = 104 + Math.random() * 8;
        startY = Math.random() * 100;
      } else if (edge === 2) {
        startX = Math.random() * 100;
        startY = 104 + Math.random() * 8;
      } else if (edge === 3) {
        startX = -4 - Math.random() * 8;
        startY = Math.random() * 100;
      } else {
        startX = Math.random() * 100;
        startY = Math.random() * 100;
      }

      const sx = startX / 100 * window.innerWidth;
      const sy = startY / 100 * window.innerHeight;
      const dx = cx - sx;
      const dy = cy - sy;
      const size = (Math.random() * 3 + 3) * Math.max(introScale(), 0.7);
      p.style.cssText = `
        --sz: ${size}px;
        --px: ${startX}vw;
        --py: ${startY}vh;
        --cx: ${dx}px;
        --cy: ${dy}px;
        --cd: ${FINAL_SCENE_START + Math.random() * 0.18}s;
        --dur: ${0.55 + Math.random() * 0.35}s;
      `;
      container.appendChild(p);
    }
  }

  function buildIntro() {
    const overlay = document.getElementById('intro_overlay');
    if (!overlay) return;

    applyBeamTravelVars(overlay);

    overlay.insertAdjacentHTML('beforeend', `      <div class="intro_grain" aria-hidden="true"></div>
      <div class="intro_vignette" aria-hidden="true"></div>
      <div class="intro_screen_flash" aria-hidden="true"></div>
      <div class="intro_beam">
        <div class="intro_anamorphic" aria-hidden="true"></div>
        <div class="intro_core intro_core--hot" aria-hidden="true"></div>
        <div class="intro_core intro_core--gold" aria-hidden="true"></div>
        <div class="intro_core intro_core--bloom" aria-hidden="true"></div>
      </div>
    `);
    const beam = overlay.querySelector('.intro_beam');
    buildFlareRays(beam);
    spawnGhostBeams(overlay);
    spawnBeamParticles(overlay, 72);

    overlay.insertAdjacentHTML('beforeend', `      <div class="intro_slogan" id="introSlogan">
        <span class="intro_slogan_line" style="--s-delay:1.4s;--s-shine:2s;">
          KOREA MEDICAL MARKETING
        </span>
        <span class="intro_slogan_line" style="--s-delay:1.7s;--s-shine:2.3s;">
          NEW STANDARD
        </span>
      </div>
    `);

    overlay.insertAdjacentHTML('beforeend', `      <div class="intro_logo_burst"></div>
      <div class="intro_logo_wrap" id="introLogoWrap">
        <span class="intro_logo_nova">
          N<span class="intro_logo_o">O</span><span class="intro_logo_v">V<span class="intro_logo_v_core" aria-hidden="true"></span></span><span class="intro_logo_a">A</span>
        </span>
        <span class="intro_logo_sm">SM</span>
      </div>
    `);

    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_cities">
        <div class="intro_city_slot">
          <video class="intro_city_video" src="./img/seoul_intro.mp4" muted playsinline loop preload="auto"></video>
        </div>
      </div>
    `);

    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_medical">        <div class="intro_med_panel">
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

    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_map">        <div class="intro_map_figure">
          <svg class="intro_map_svg" viewBox="0 0 1407 802" preserveAspectRatio="xMidYMid meet" role="img" aria-label="한국-중국 연결 지도">
            <defs>
              <filter id="intro_land_filter" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">                <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="sharp_blur"/>
                <feComposite in="SourceGraphic" in2="sharp_blur" operator="arithmetic" k2="1.15" k3="-0.15" result="sharpened"/>
                <feDropShadow in="sharpened" dx="0" dy="2" stdDeviation="5" flood-color="#fff" flood-opacity="0.55" result="lit"/>
                <feDropShadow in="lit" dx="1" dy="10" stdDeviation="20" flood-color="#151F34" flood-opacity="0.10"/>
              </filter>

              <linearGradient id="introGoldGrad" gradientUnits="userSpaceOnUse" x1="1217" y1="486" x2="707" y2="312">                <stop offset="0%"   stop-color="#9a7a3a"/>
                <stop offset="25%"  stop-color="#d4af5e"/>
                <stop offset="45%"  stop-color="#fff8d6"/>
                <stop offset="55%"  stop-color="#fffef0"/>
                <stop offset="75%"  stop-color="#d4af5e"/>
                <stop offset="100%" stop-color="#8a7040"/>
              </linearGradient>

              <filter id="intro_node_glow" x="-120%" y="-120%" width="340%" height="340%">                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <radialGradient id="introDotGrad" cx="35%" cy="30%" r="65%">                <stop offset="0%"   stop-color="#fffef5"/>
                <stop offset="55%"  stop-color="#e8c96a"/>
                <stop offset="100%" stop-color="#a88840"/>
              </radialGradient>
            </defs>

            <image class="intro_map_land" href="./img/한중지도.png" width="1407" height="802" filter="url(#intro_land_filter)"/>

            <path class="intro_map_gold_glow" pathLength="620"              d="M 1217 486 C 1130 355, 835 278, 707 312"
              fill="none" stroke="#d4af5e" stroke-width="6" stroke-linecap="round" opacity="0"/>

            <path class="intro_map_gold_path" pathLength="620"              d="M 1217 486 C 1130 355, 835 278, 707 312"/>

            <g class="intro_map_node" filter="url(#intro_node_glow)">              <circle class="intro_map_dot_ring" cx="1217" cy="486" r="9" fill="none" stroke="#d4af5e" stroke-width="1" opacity="0"/>
              <circle class="intro_map_dot_glow" cx="1217" cy="486" r="10" fill="#d4af5e" opacity="0"/>
              <circle class="intro_map_dot" cx="1217" cy="486" r="5" fill="url(#introDotGrad)" opacity="0"/>
            </g>

            <g class="intro_map_node" filter="url(#intro_node_glow)">
              <circle class="intro_map_city_dot" cx="707" cy="312" r="6.5" fill="url(#introDotGrad)" opacity="0"/>            </g>
          </svg>
        </div>
        <span class="intro_map_tagline">CONNECT KOREA<br>EXPAND CHINA</span>
      </div>
    `);

    overlay.insertAdjacentHTML('beforeend', `
      <div class="intro_final">
        <div class="intro_final_glow"></div>
        <div class="intro_final_logo_wrap">
          <img class="intro_final_logo" src="./img/novasm_logo.png" alt="NOVA SM">
          <p class="intro_final_tagline">Nova seasoned marketers</p>
        </div>
      </div>
    `);

    spawnConvergeParticles(overlay.querySelector('.intro_final'), 220);

    overlay.insertAdjacentHTML('beforeend', `
      <button class="intro_skip" id="introSkip" aria-label="인트로 건너뛰기">
        SKIP ›
      </button>
    `);
  }

  function scheduleSloganFade() {
    const slogan = document.getElementById('introSlogan');
    if (!slogan) return;

    setTimeout(() => {
      slogan.style.transition = 'opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease, letter-spacing 0.7s ease';
      slogan.style.opacity = '0';
      slogan.style.transform = 'scale(0.7)';
      slogan.style.filter = 'blur(8px)';
      slogan.style.visibility = 'hidden';

      slogan.querySelectorAll('.intro_slogan_line').forEach((line) => {
        line.style.transition = 'letter-spacing 0.7s ease';
        line.style.letterSpacing = '0.6em';
      });
    }, 5200);
  }

  function scheduleLogoFade() {
    setTimeout(() => {
      const logo = document.getElementById('introLogoWrap');
      const burst = document.querySelector('.intro_logo_burst');

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

  function scheduleCityVideo() {
    setTimeout(() => {
      const video = document.querySelector('.intro_city_video');
      if (!video) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    }, 8500);
  }

  function lockScroll() {
    document.documentElement.classList.add('intro-active');
  }

  function unlockScroll() {
    document.documentElement.classList.remove('intro-active');
  }

  function endIntro() {
    const overlay = document.getElementById('intro_overlay');
    const skip = document.getElementById('introSkip');

    if (skip) skip.style.display = 'none';
    unlockScroll();
    if (!overlay) return;

    overlay.classList.add('intro--done');
    setTimeout(() => overlay.remove(), 800);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('introPlayed')) {
      document.getElementById('intro_overlay')?.remove();
      return;
    }

    lockScroll();
    try {
      buildIntro();
    } catch (err) {
      console.error('[intro]', err);
      unlockScroll();
      document.getElementById('intro_overlay')?.remove();
      return;
    }

    sessionStorage.setItem('introPlayed', '1');
    scheduleSloganFade();
    scheduleLogoFade();
    scheduleCityVideo();
    document.getElementById('introSkip')?.addEventListener('click', endIntro);
    setTimeout(endIntro, 23500);
  });

}());