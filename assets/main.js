(() => {
  "use strict";

  const projects = [
    { n: '01', tag: 'Residencial', img: 'assets/img/proj-01.webp' },
    { n: '02', tag: 'Residencial', img: 'assets/img/proj-02.webp' },
    { n: '03', tag: 'Residencial', img: 'assets/img/proj-03.webp' },
    { n: '04', tag: 'Residencial', img: 'assets/img/proj-04.webp' },
    { n: '05', tag: 'Residencial', img: 'assets/img/proj-05.webp' },
    { n: '06', tag: 'Residencial', img: 'assets/img/proj-06.webp' },
    { n: '07', tag: 'Residencial', img: 'assets/img/proj-07.webp' },
    { n: '08', tag: 'Interiores', img: 'assets/img/proj-08.webp' },
    { n: '09', tag: 'Interiores', img: 'assets/img/proj-09.webp' },
    { n: '10', tag: 'Interiores', img: 'assets/img/proj-10.webp' }
  ];

  // ---- preloader ----
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('logo-in'), 140);
  setTimeout(() => preloader.classList.add('done'), 1300);

  // ---- mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
  };
  hamburger.addEventListener('click', () => setMenu(!hamburger.classList.contains('open')));
  mobileMenu.querySelectorAll('.menu-link, .btn').forEach((el) => {
    el.addEventListener('click', () => setTimeout(() => setMenu(false), 300));
  });

  // ---- scroll reveal ----
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
  }

  // ---- portfolio track ----
  const track = document.getElementById('track');
  let dragged = false;
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    card.addEventListener('click', () => { if (!dragged) openLightbox(i); });

    const img = document.createElement('img');
    img.src = p.img;
    img.alt = 'Projeto ' + p.n;
    img.loading = 'lazy';
    img.draggable = false;

    const shade = document.createElement('div');
    shade.className = 'shade';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<span class="pill">Ampliar</span><span class="meta"><span class="num">Projeto ${p.n}</span><span class="tag">${p.tag}</span></span>`;

    card.append(img, shade, info);
    track.appendChild(card);
  });

  {
    let isDown = false, startX = 0, startScroll = 0, moved = 0;
    const down = (e) => { isDown = true; moved = 0; track.style.cursor = 'grabbing'; startX = e.pageX; startScroll = track.scrollLeft; };
    const up = () => { isDown = false; track.style.cursor = 'grab'; setTimeout(() => { dragged = false; }, 40); };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      moved = Math.abs(e.pageX - startX);
      if (moved > 6) dragged = true;
      track.scrollLeft = startScroll - (e.pageX - startX);
    };
    track.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
  }

  const scrollTrack = (dir) => {
    const card = track.children[0];
    const step = card ? card.getBoundingClientRect().width + 2 : 320;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  document.getElementById('prev-slide').addEventListener('click', () => scrollTrack(-1));
  document.getElementById('next-slide').addEventListener('click', () => scrollTrack(1));

  // ---- lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbLabel = document.getElementById('lb-label');
  let lightboxIndex = null;

  function syncLightbox() {
    if (lightboxIndex === null) { lightbox.classList.remove('open'); return; }
    const p = projects[lightboxIndex];
    lbImg.src = p.img;
    lbLabel.textContent = `Projeto ${p.n} — ${p.tag}`;
    lightbox.classList.add('open');
  }
  function openLightbox(i) { lightboxIndex = i; syncLightbox(); }
  function closeLightbox() { lightboxIndex = null; syncLightbox(); }
  function shiftLightbox(dir) {
    if (lightboxIndex === null) return;
    lightboxIndex = (lightboxIndex + dir + projects.length) % projects.length;
    syncLightbox();
  }
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => shiftLightbox(-1));
  document.getElementById('lb-next').addEventListener('click', () => shiftLightbox(1));
  window.addEventListener('keydown', (e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') shiftLightbox(1);
    if (e.key === 'ArrowLeft') shiftLightbox(-1);
  });

  // ---- CTA photo stack ----
  (function initStack() {
    const host = document.getElementById('stack');
    if (!host) return;
    const imgs = projects.map((p) => p.img);
    const tilt = [-7, 5, -3, 2];
    let cards = imgs.slice(0, 4).map((src, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = `url('${src}')`;
      card.style.transform = `rotate(${tilt[i]}deg) translateY(${i * -4}px) scale(${1 - i * 0.03})`;
      card.style.zIndex = String(10 - i);
      host.appendChild(card);
      return card;
    });

    let next = 4, dir = -1;
    const cycle = () => {
      const front = cards.shift();
      dir = -dir;
      front.style.transform = `rotate(${dir * 18}deg) translate(${dir * 115}%,-10%) scale(.9)`;
      setTimeout(() => {
        front.style.backgroundImage = `url('${imgs[next % imgs.length]}')`;
        next++;
        front.style.transition = 'none';
        front.style.transform = `rotate(${tilt[3]}deg) translateY(-12px) scale(.91)`;
        front.style.zIndex = '6';
        void front.offsetWidth;
        front.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)';
        cards.push(front);
        cards.forEach((c, i) => {
          c.style.transform = `rotate(${tilt[i]}deg) translateY(${i * -4}px) scale(${1 - i * 0.03})`;
          c.style.zIndex = String(10 - i);
        });
      }, 850);
    };
    setInterval(cycle, 2600);
  })();

  // ---- hero dots canvas ----
  (function initDots() {
    const canvas = document.getElementById('dots');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gap = 22;
    let w = 0, h = 0, dots = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) dots.push({ x, y });
      }
    };
    new ResizeObserver(resize).observe(canvas.parentElement);
    requestAnimationFrame(resize);
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        const t = Math.max(0, 1 - dist / 120);
        const r = 0.8 + t * 0.9;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.09 + t * 0.22})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  })();

  // ---- background music (Web Audio, decoded buffer for instant seek/loop) ----
  const musicBtn = document.getElementById('music-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const audioEl = document.getElementById('audio-el');
  const bars = [0, 1, 2, 3, 4].map((i) => document.getElementById('bar' + i));
  const barIdx = [1, 3, 6, 10, 15];
  const barsIdle = [40, 70, 30, 85, 50];

  let audioCtx = null, analyser = null, freqData = null;
  let buffer = null, srcNode = null, offset = 0, startedAt = 0, playing = false, barsRAF = null;

  function initAudioGraph() {
    if (audioCtx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.connect(audioCtx.destination);
    freqData = new Uint8Array(analyser.frequencyBinCount);
  }
  function stopNode() {
    if (srcNode) {
      try { srcNode.stop(); } catch (err) { /* already stopped */ }
      srcNode.disconnect();
      srcNode = null;
    }
  }
  function playBuffer(startOffset) {
    if (!buffer) return;
    stopNode();
    const node = audioCtx.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    node.connect(analyser);
    node.start(0, startOffset % buffer.duration);
    srcNode = node;
    offset = startOffset;
    startedAt = audioCtx.currentTime;
  }
  function currentPos() {
    if (!buffer) return 0;
    if (!srcNode) return offset;
    return ((audioCtx.currentTime - startedAt) + offset) % buffer.duration;
  }
  function startBars() {
    const loop = () => {
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        bars.forEach((b, i) => {
          const v = freqData[Math.min(barIdx[i], freqData.length - 1)] / 255;
          b.style.height = (15 + v * 80) + '%';
        });
      }
      barsRAF = requestAnimationFrame(loop);
    };
    loop();
  }
  function stopBars() {
    cancelAnimationFrame(barsRAF);
    bars.forEach((b, i) => { b.style.height = barsIdle[i] + '%'; });
  }
  function setIcons() {
    iconPlay.classList.toggle('show', !playing);
    iconPause.classList.toggle('show', playing);
  }

  musicBtn.addEventListener('click', async () => {
    initAudioGraph();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    if (playing) {
      offset = currentPos();
      stopNode();
      playing = false;
      setIcons();
      stopBars();
      return;
    }
    if (!buffer) {
      try {
        const res = await fetch(audioEl.getAttribute('src'));
        buffer = await audioCtx.decodeAudioData(await res.arrayBuffer());
      } catch (err) { console.error('Audio decode failed', err); return; }
    }
    playBuffer(offset || 0);
    playing = true;
    setIcons();
    startBars();
  });

  // ---- GSAP parallax / reveal polish ----
  function waitForGsap(tries) {
    tries = tries || 0;
    if (window.gsap && window.ScrollTrigger) { initGsap(); return; }
    if (tries > 40) return;
    setTimeout(() => waitForGsap(tries + 1), 100);
  }

  function initGsap() {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    const par = (el, distance) => {
      if (!el) return;
      gsap.to(el, {
        y: distance, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    };
    par(document.getElementById('hero-tile-a'), -70);
    par(document.getElementById('hero-tile-b'), 60);
    par(document.getElementById('hero-portrait'), -24);
    par(document.getElementById('proposta-img'), -50);

    const ctaBg = document.getElementById('cta-bg');
    if (ctaBg) {
      gsap.fromTo(ctaBg, { y: -60 }, {
        y: 60, ease: 'none',
        scrollTrigger: { trigger: ctaBg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    document.querySelectorAll('.mark-plus').forEach((el, i) => {
      gsap.to(el, {
        rotation: i % 2 === 0 ? 220 : -200, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });

    document.querySelectorAll('.rule-mark .short').forEach((el) => {
      window.ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.1, ease: 'power3.out' })
      });
    });
    window.addEventListener('load', () => window.ScrollTrigger.refresh());
    setTimeout(() => window.ScrollTrigger.refresh(), 1200);

    const rows = Array.from(document.querySelectorAll('.dif-row'));
    if (rows.length) {
      window.ScrollTrigger.create({
        trigger: rows[0].parentElement,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.fromTo(rows, { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)', duration: 0.9, stagger: 0.09, ease: 'power3.out',
            onComplete: () => rows.forEach((r) => { r.style.clipPath = 'none'; })
          });
          gsap.fromTo(document.querySelectorAll('.dif-row .n'), { y: 18 }, { y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out' });
        }
      });
    }

    const blendText = document.getElementById('blend-text');
    if (blendText) {
      gsap.fromTo(blendText, { letterSpacing: '0.2em', scale: 0.94 }, {
        letterSpacing: '0em', scale: 1, ease: 'none',
        scrollTrigger: { trigger: blendText, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    }

    // word-by-word reveal for headlines marked with data-splittext
    document.querySelectorAll('[data-splittext]').forEach((el) => {
      const words = el.textContent.split(' ');
      el.innerHTML = words.map((w) => `<span style="opacity:0.18;">${w}</span>`).join(' ');
      const spans = el.querySelectorAll('span');
      gsap.to(spans, {
        opacity: 1, stagger: { each: 1 / spans.length, ease: 'none' }, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true }
      });
    });
  }
  waitForGsap();
})();
