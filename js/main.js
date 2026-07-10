/* ============================================================
   Muhammad Asif — AI Video Portfolio
   Motion: canvas cosmos, GSAP reveals, counters, orbit carousel.
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const driveThumb = (id, w = 900) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview`;
const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

/* ---------- cosmic canvas: slow spiral starfield ---------- */

(function cosmos() {
  const canvas = document.getElementById("cosmos");
  const ctx = canvas.getContext("2d");
  let w, h, cx, cy, stars = [];

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    cx = w / 2;
    cy = -h * 0.25; // spiral center sits above the viewport, like the reference
    stars = Array.from({ length: Math.min(520, (w * h) / 4200) }, () => spawn());
  }

  function spawn() {
    const r = Math.sqrt(Math.random()) * Math.hypot(w, h) * 0.9 + 40;
    return {
      r,
      a: Math.random() * Math.PI * 2,
      size: Math.random() * 2.1 + 0.5,
      speed: (0.0005 + Math.random() * 0.0008) * (prefersReducedMotion ? 0 : 1),
      tw: Math.random() * Math.PI * 2,
    };
  }

  /* shooting stars: occasional meteors streaking down through the field */
  let meteors = [];
  let nextMeteorAt = 2500;

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.5;
    const angle = (fromLeft ? 0.35 : Math.PI - 0.35) + (Math.random() - 0.5) * 0.25;
    return {
      x: Math.random() * w,
      y: Math.random() * h * 0.45,
      vx: Math.cos(angle) * (9 + Math.random() * 7) * (fromLeft ? 1 : -1) * -1,
      vy: Math.sin(angle) * (9 + Math.random() * 7),
      life: 1,
      tail: 90 + Math.random() * 70,
    };
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.speed;
      const x = cx + Math.cos(s.a) * s.r;
      const y = cy + Math.sin(s.a) * s.r * 0.82;
      if (y < -20 || y > h + 20 || x < -20 || x > w + 20) continue;
      const twinkle = 0.6 + 0.4 * Math.sin(t / 700 + s.tw);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = "#dbe7ff";
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      if (t > nextMeteorAt) {
        meteors.push(spawnMeteor());
        nextMeteorAt = t + 5000; // one shooting star every 5 seconds
      }
      meteors = meteors.filter((m) => m.life > 0);
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.016;
        const tx = m.x - m.vx * (m.tail / 10);
        const ty = m.y - m.vy * (m.tail / 10);
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(220, 233, 255, ${0.9 * m.life})`);
        grad.addColorStop(0.3, `rgba(150, 185, 255, ${0.45 * m.life})`);
        grad.addColorStop(1, "rgba(120, 160, 255, 0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = `rgba(235, 243, 255, ${m.life})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();

/* ---------- lantern: a soft light that drifts after the cursor ---------- */

(function lantern() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;left:0;top:0;width:560px;height:560px;margin:-280px 0 0 -280px;" +
    "pointer-events:none;z-index:55;border-radius:50%;mix-blend-mode:screen;" +
    "background:radial-gradient(circle, rgba(127,168,255,0.07) 0%, rgba(127,168,255,0.028) 40%, transparent 70%);" +
    "opacity:0;transition:opacity 0.6s;will-change:transform;";
  document.body.appendChild(el);

  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = 1; }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => (el.style.opacity = 0));

  (function tick() {
    x += (tx - x) * 0.07; // trails gently behind the cursor
    y += (ty - y) * 0.07;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    requestAnimationFrame(tick);
  })();
})();

/* ---------- scroll progress: a thread of starlight along the top ---------- */

(function scrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- tilt: media tiles lean toward the cursor ---------- */

(function tilt() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll(".media-tile").forEach((tile) => {
    tile.addEventListener("mousemove", (e) => {
      const r = tile.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform =
        `perspective(700px) translateY(-5px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    }, { passive: true });
    tile.addEventListener("mouseleave", () => { tile.style.transform = ""; });
  });
})();

/* ---------- card glow: a soft light that follows the cursor inside cards ---------- */

(function cardGlow() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const cards = document.querySelectorAll(
    ".door, .service-card, .cert-card, .spec-card, .path-card, .work-card, .project, .case, .proof-item, .t-card, .pipe-step"
  );
  cards.forEach((card) => {
    card.classList.add("glow-card");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  });
})();

/* ---------- hero video: local showreel, else Drive embed ---------- */

(function heroReel() {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  // sound toggle: browsers require muted autoplay, so audio arrives on tap
  const toggle = document.getElementById("soundToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      video.muted = !video.muted;
      const on = !video.muted;
      toggle.classList.toggle("on", on);
      toggle.innerHTML = on
        ? '<span class="sound-icon">&#128266;</span> Sound on'
        : '<span class="sound-icon">&#128263;</span> Tap for sound';
      toggle.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      if (video.paused) video.play();
    });
  }

  const fallback = () => {
    const iframe = document.createElement("iframe");
    iframe.src = drivePreview("1OubFjqldX9GONWNDCWjMmr72waNxKMIb");
    iframe.allow = "autoplay; encrypted-media";
    iframe.loading = "lazy";
    iframe.title = "Nescafé Latte: Cinematic AI Product Ad";
    video.replaceWith(iframe);
    if (toggle) toggle.remove(); // Drive embed has its own controls
  };

  video.addEventListener("error", fallback, true);
  const src = video.querySelector("source");
  if (src) src.addEventListener("error", fallback);
})();

/* ---------- lightbox: Drive video, YouTube, or image ---------- */

const lightboxAPI = (function lightbox() {
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightboxFrame");
  const close = document.getElementById("lightboxClose");
  if (!lightbox || !frame || !close) return { open: () => {} }; // page has no lightbox

  function open(mode, content, tall = false) {
    frame.className = "lightbox-frame" + (tall ? " tall" : "") + (mode === "image" ? " image" : "");
    if (mode === "image") {
      frame.innerHTML = `<img src="${content}" alt="Portfolio piece" />`;
    } else {
      frame.innerHTML = `<iframe src="${content}" allow="autoplay; encrypted-media" allowfullscreen title="Portfolio video"></iframe>`;
    }
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function shut() {
    lightbox.hidden = true;
    frame.innerHTML = "";
    document.body.style.overflow = "";
  }

  close.addEventListener("click", shut);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) shut(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) shut(); });

  return { open };
})();

/* ---------- media tiles: thumbnails + click handlers ---------- */

(function mediaTiles() {
  document.querySelectorAll(".media-tile").forEach((tile) => {
    const { drive, yt, ytShort } = tile.dataset;

    if (drive) {
      tile.style.backgroundImage = `url("${driveThumb(drive)}")`;
      tile.addEventListener("click", () =>
        lightboxAPI.open("video", drivePreview(drive), tile.classList.contains("t916")));
    } else if (yt) {
      tile.style.backgroundImage = `url("https://i.ytimg.com/vi/${yt}/hqdefault.jpg")`;
      tile.addEventListener("click", () => lightboxAPI.open("video", ytEmbed(yt)));
    } else if (ytShort) {
      // shorts have a vertical thumb (oar2); fall back to hqdefault if missing
      const probe = new Image();
      probe.onload = () => { tile.style.backgroundImage = `url("https://i.ytimg.com/vi/${ytShort}/oar2.jpg")`; };
      probe.onerror = () => { tile.style.backgroundImage = `url("https://i.ytimg.com/vi/${ytShort}/hqdefault.jpg")`; };
      probe.src = `https://i.ytimg.com/vi/${ytShort}/oar2.jpg`;
      tile.addEventListener("click", () => lightboxAPI.open("video", ytEmbed(ytShort), true));
    } else if (tile.dataset.img) {
      tile.style.backgroundImage = `url("${tile.dataset.img}")`;
      tile.addEventListener("click", () => lightboxAPI.open("image", tile.dataset.img));
    }

    // keyboard access for div tiles
    if (tile.tagName === "DIV") {
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tile.click(); }
      });
    }
  });
})();

/* ---------- view more projects ---------- */

(function viewMore() {
  const btn = document.getElementById("viewMoreBtn");
  const more = document.getElementById("moreProjects");
  if (!btn || !more) return;
  btn.addEventListener("click", () => {
    const opening = more.hidden;
    more.hidden = !opening;
    btn.textContent = opening ? "Show fewer projects" : "View more projects";
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    if (!opening) document.getElementById("work").scrollIntoView({ behavior: "smooth" });
  });
})();

/* ---------- orbit carousel (vortex-studio reference) ---------- */

(function orbit() {
  const stage = document.getElementById("orbitStage");
  if (!stage) return;
  const cards = [...stage.querySelectorAll(".orbit-card")];
  const n = cards.length;
  let angle = 0;
  let paused = false;

  cards.forEach((card) => {
    const { drive, ytShort, img } = card.dataset;
    if (drive) {
      card.style.backgroundImage = `url("${driveThumb(drive, 500)}")`;
      card.addEventListener("click", () =>
        lightboxAPI.open("video", drivePreview(drive), card.classList.contains("oc-v")));
    } else if (ytShort) {
      const probe = new Image();
      probe.onload = () => { card.style.backgroundImage = `url("https://i.ytimg.com/vi/${ytShort}/oar2.jpg")`; };
      probe.onerror = () => { card.style.backgroundImage = `url("https://i.ytimg.com/vi/${ytShort}/hqdefault.jpg")`; };
      probe.src = `https://i.ytimg.com/vi/${ytShort}/oar2.jpg`;
      card.addEventListener("click", () => lightboxAPI.open("video", ytEmbed(ytShort), true));
    } else if (img) {
      card.style.backgroundImage = `url("${img}")`;
      card.addEventListener("click", () => lightboxAPI.open("image", img));
    }
    card.addEventListener("mouseenter", () => (paused = true));
    card.addEventListener("mouseleave", () => (paused = false));
  });

  function layout() {
    const rect = stage.getBoundingClientRect();
    // tight ring: cards sit close together, a dense band of work around the CTA
    const rx = Math.min(rect.width * 0.38, 520);
    const ry = rect.height * 0.22;
    const yOffset = rect.height * 0.15; // ring rides low so front cards pass under the CTA

    cards.forEach((card, i) => {
      const a = angle + (i * Math.PI * 2) / n;
      const x = Math.cos(a) * rx;
      const y = Math.sin(a) * ry + yOffset;
      // depth: cards at the bottom of the ellipse are "front"
      const depth = (Math.sin(a) + 1) / 2; // 0 back — 1 front
      const scale = 0.5 + depth * 0.5;
      card.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      card.style.opacity = (0.3 + depth * 0.7).toFixed(2);
      card.style.zIndex = depth > 0.72 ? 20 : Math.round(depth * 9); // front cards above center text
      card.style.filter = `blur(${(1 - depth) * 1.6}px)`;
    });
  }

  function tick() {
    if (!paused && !prefersReducedMotion) angle += 0.0032;
    layout();
    requestAnimationFrame(tick);
  }

  addEventListener("resize", layout);
  layout(); // position immediately; rAF only animates from here
  requestAnimationFrame(tick);
})();

/* ---------- counters ---------- */

(function counters() {
  const nums = document.querySelectorAll(".proof-num");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (prefersReducedMotion) { el.textContent = target + suffix; return; }
      const start = performance.now();
      const dur = 1600;
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => io.observe(el));
})();

/* ---------- GSAP reveals ---------- */

(function reveals() {
  if (!window.gsap || prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // hero intro: staggered rise
  gsap.to(".hero .reveal", {
    opacity: 1,
    y: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.15,
  });

  // everything else: reveal on scroll
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  // subtle parallax on the hero reel
  gsap.to("#heroReel", {
    yPercent: -6,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
})();

/* ---------- marquee duplication (seamless loop) ---------- */

document.querySelectorAll("[data-marquee] .marquee-track").forEach((track) => {
  track.innerHTML += track.innerHTML;
});
