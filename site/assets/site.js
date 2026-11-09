/* ==========================================================================
   Moments Paris — hero de scrub + camada de movimento
   Padrão de engenharia de pipeline-scrub.md aplicado ao pé da letra.
   ========================================================================== */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var stage = document.querySelector(".stage");
  var video = document.getElementById("hero-video");
  var poster = document.querySelector(".poster");
  var ring = document.querySelector(".ring");
  var bands = Array.prototype.slice.call(document.querySelectorAll(".band"));
  var reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- divisão de texto em spans (semente fixa) ---------------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function split(el) {
    if (el.dataset.split === "1") return;
    el.dataset.split = "1";
    var text = (el.textContent || "").trim();
    var rand = rng(text.length * 2654435761);
    var entry = el.dataset.entry || "scatter";
    var spread = parseFloat(el.dataset.spread || "0.55");
    var sr = document.createElement("span");
    sr.className = "sr";
    sr.textContent = text;
    var visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    var words = text.split(/\s+/);
    var charIndex = 0;
    var totalChars = text.replace(/\s/g, "").length;
    words.forEach(function (word, wi) {
      var w = document.createElement("span");
      w.className = "w";
      w.style.setProperty("--th", (wi / words.length) * 0.5 + rand() * 0.1);
      if (entry === "punch" && /^(Londrina|frasco|perfume|escolhe|revela)$/i.test(word.replace(/[.,]/g, ""))) {
        w.classList.add("em");
      }
      for (var i = 0; i < word.length; i++) {
        var c = document.createElement("span");
        c.className = "c";
        c.textContent = word[i];
        var th = entry === "grid"
          ? (charIndex / totalChars) * spread + rand() * 0.06
          : rand() * 0.55;
        c.style.setProperty("--th", th.toFixed(3));
        c.style.setProperty("--jx", ((rand() * 2 - 1) * 26).toFixed(1) + "px");
        c.style.setProperty("--jy", ((rand() * 2 - 1) * 26).toFixed(1) + "px");
        c.style.setProperty("--jr", ((rand() * 2 - 1) * 9).toFixed(1) + "deg");
        w.appendChild(c);
        charIndex++;
      }
      visual.appendChild(w);
      if (wi < words.length - 1) visual.appendChild(document.createTextNode(" "));
    });
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(visual);
    el.dataset.entry = entry;
  }

  bands.forEach(function (b) {
    var s = b.querySelector(".split");
    if (s) split(s);
    b._a = parseFloat(b.dataset.a);
    b._b = parseFloat(b.dataset.b);
    b._op = -1;
    b._k = -1;
    b._fit = b.dataset.fit === "1";
    b._cta = !!b.querySelector(".settle-cta");
  });

  /* ---------------- estado do scrub ---------------- */
  var scrubOn = false;
  var scrubQueued = false;
  var html = document.documentElement;
  var inited = false;
  var rafId = null;
  var target = 0, shown = 0, lastTick = 0;
  var heroOnScreen = true;
  var seekBusy = false, pendingTime = null;
  var loadK = 0, loadStart = 0, firstBandSettled = false;

  var RAMP_PX = 420;      // distância de scroll em que o título se monta
  var VIDEO_URL = "assets/hero-scrub.mp4";
  var VIDEO_BYTES = 4349545;

  var _span = 0;
  function scrollSpan() {
    if (!_span) _span = Math.max(1, hero.offsetHeight - innerHeight);
    return _span;
  }

  function heroProgress() {
    var r = hero.getBoundingClientRect();
    var span = r.height - innerHeight;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / span));
  }

  /* ---------------- busca do vídeo como Blob ---------------- */
  function initHeroOnce() {
    if (inited) return;
    inited = true;
    /* O pôster já vem do CSS (.webp ou JPG, decidido no <head>). Aqui só se
       confirma que ele carrega antes de pedir o vídeo. */
    var started = false;
    function startBlobFetch() {
      if (started) return;
      started = true;
      loadHeroBlob().catch(failVideo);
    }
    var img = new Image();
    img.onload = startBlobFetch;
    img.onerror = startBlobFetch;
    img.src = "assets/hero-poster.webp";
    img.onerror = startBlobFetch;
    setTimeout(startBlobFetch, 4000);
  }

  async function loadHeroBlob() {
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
    var res = await fetch(VIDEO_URL, { priority: "low", signal: ctrl.signal });
    if (!res.ok) throw new Error("hero " + res.status);
    var total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
    var reader = res.body.getReader();
    var chunks = [], got = 0, lastRing = 0;
    for (;;) {
      var step = await reader.read();
      if (step.done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
      chunks.push(step.value);
      got += step.value.length;
      var frac = Math.min(1, got / total);
      var now = performance.now();
      if (ring && (now - lastRing > 100 || frac === 1)) {
        lastRing = now;
        ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
      }
    }
    clearTimeout(watchdog);
    if (ring) ring.style.setProperty("--ld", 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
    video.load();
    video.addEventListener("canplay", function () {
      requestSeek(heroProgress() * (video.duration || 0));
      stage.classList.add("video-ready");
    }, { once: true });
  }

  function failVideo() {
    stage.classList.add("video-failed");
    var wrap = document.querySelector(".ring-wrap");
    if (wrap) wrap.style.display = "none";
  }

  /* ---------------- seeks travados ---------------- */
  function requestSeek(t) {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener("seeked", function () {
    seekBusy = false;
    if (pendingTime !== null) {
      var t = pendingTime; pendingTime = null; requestSeek(t);
    }
  });
  video.addEventListener("error", function () {
    seekBusy = false; pendingTime = null;
    if (!stage.classList.contains("video-ready")) failVideo();
  });

  /* ---------------- loop rAF que descansa ---------------- */
  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) {
      shown = target;
      rafId = null;
      lastTick = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
    requestSeek(shown * (video.duration || 0));
    updateCaptions(shown, now);
  }

  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }

  /* ---------------- legendas ---------------- */
  function smoothstep(p, e0, e1) {
    var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }

  function animateLoadK() {
    var t0 = performance.now();
    (function step(now) {
      var u = Math.min(1, (now - t0) / 900);          // 0,9 s para montar
      loadK = u * u * (3 - 2 * u);                     // smoothstep
      if (scrubOn) updateCaptions(heroProgress(), now);
      if (u < 1) requestAnimationFrame(step);
      else { loadK = 1; firstBandSettled = true; }
    })(t0);
  }
  var loadKStarted = false;

  function updateCaptions(p, now) {
    if (!loadStart) loadStart = now;

    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      var a = b._a, e = b._b;
      var f = Math.min(0.02, (e - a) / 3);
      var op;
      if (b._fit) {
        // faixa de encaixe: entra depois da última legenda e nunca sai
        op = smoothstep(p, a, a + 0.03);
      } else if (i === 0) {
        op = 1 - smoothstep(p, e - f, e);
      } else {
        op = smoothstep(p, a, a + f) * (1 - smoothstep(p, e - f, e));
      }
      op = Math.round(op * 100) / 100;
      if (op !== b._op) {
        b._op = op;
        b.style.opacity = op;
        b.style.pointerEvents = (b._cta && op > 0.95) ? "auto" : "none";
      }
      // A montagem é calibrada em PIXELS de scroll, não em fração do hero:
      // em telas pequenas o hero encurta e uma fração fixa vira um piscar.
      // 420px é cerca de três flicks de roda, tempo de o olho ver a entrada.
      var ramp = parseFloat(b.dataset.ramp) || (RAMP_PX / Math.max(1, scrollSpan()));
      var inStart = a;
      var kk = Math.min(1, Math.max(0, (p - inStart) / ramp));
      if (i === 0 && !firstBandSettled) kk = Math.max(kk, loadK);
      var kkR = Math.round(kk * 125) / 125;
      if (kkR !== b._k) {
        b._k = kkR;
        b.style.setProperty("--k", kkR);
      }
    }
  }

  /* ---------------- cinco portões, decididos ao vivo ---------------- */
  var GATES = [
    "(max-width: 720px)",
    "(orientation: portrait) and (max-width: 1024px)",
    "(orientation: portrait) and (pointer: coarse)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)"
  ];

  /* O hero passava de auto para 400vh e de estático para fixed-assim que o
     JS rodava. Se o primeiro quadro ainda não tinha sido pintado, o navegador
     media a página duas vezes e a seção seguinte "pulava" (CLS 0,15). Dois
     quadros de espera resolvem sem custo perceptível. */
  function startScrub() {
    scrubOn = true;
    html.classList.add("js");   /* o CSS do hero depende disto */
    hero.classList.add("scrub");
    initHeroOnce();
    addEventListener("scroll", onScroll, { passive: true });
    for (var i = 0; i < bands.length; i++) { bands[i]._op = -1; bands[i]._k = -1; }
    unpinFinalStates();
    onScroll();
    if (!loadKStarted) { loadKStarted = true; animateLoadK(); }
  }

  function enableScrub() {
    if (scrubOn || scrubQueued) return;
    scrubQueued = true;
    /* duas passadas de quadro garantem que o layout de 400vh já foi aplicado
       e pintado quando a troca de modo acontece */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scrubQueued = false;
        if (!blockedNow()) startScrub();
      });
    });
  }

  function blockedNow() {
    for (var i = 0; i < MQLS.length; i++) if (MQLS[i].matches) return true;
    return false;
  }

  function disableScrub() {
    scrubQueued = false;
    if (!scrubOn) return;
    scrubOn = false;
    html.classList.remove("js");
    hero.classList.remove("scrub");
    removeEventListener("scroll", onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function applyHeroMode() {
    var blocked = false;
    for (var i = 0; i < MQLS.length; i++) if (MQLS[i].matches) blocked = true;
    if (blocked) disableScrub(); else enableScrub();
  }

  addEventListener("resize", function () {
    _span = 0;
    for (var i = 0; i < bands.length; i++) { bands[i]._op = -1; bands[i]._k = -1; }
    if (scrubOn) onScroll();
  }, { passive: true });

  var MQLS = GATES.map(function (q) { return matchMedia(q); });
  if (MQLS[0].addEventListener) {
    MQLS.forEach(function (m) { m.addEventListener("change", applyHeroMode); });
  } else if (MQLS[0].addListener) {
    MQLS.forEach(function (m) { m.addListener(applyHeroMode); });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      heroOnScreen = entries[0].isIntersecting;
      if (heroOnScreen && scrubOn && rafId === null) rafId = requestAnimationFrame(tick);
    }, { threshold: 0 }).observe(hero);
  }

  /* ---------------- entradas por seção ---------------- */
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          el.classList.add("in");
          var kids = el.querySelectorAll("[data-stagger] > *");
          setTimeout(function () { el.classList.add("done"); }, 1400);
          io.unobserve(el);
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" })
    : null;

  document.querySelectorAll("[data-stagger], .sec-proc").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("in");
  });

  /* linha do scarpin: mede o comprimento real do path */
  var sp = document.querySelector(".scarpin-path");
  if (sp && sp.getTotalLength) {
    var len = Math.ceil(sp.getTotalLength());
    sp.style.setProperty("--len", len);
    sp.style.strokeDasharray = len;
    sp.style.strokeDashoffset = len;
  }

  /* ---------------- contadores ---------------- */
  function animateCount(el) {
    var to = parseInt(el.dataset.count, 10) || 0;
    var suffix = el.dataset.suffix || "";
    if (!to) { el.textContent = "0" + suffix; return; }
    var t0 = performance.now(), dur = 1300;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        animateCount(en.target);
        cio.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".num[data-count]").forEach(function (n) { cio.observe(n); });
  }

  /* ---------------- momento interativo: segurar para abrir a pirâmide ---------------- */
  var hold = document.getElementById("hold");
  var holdBtn = document.getElementById("hold-btn");
  var holdFill = holdBtn && holdBtn.querySelector(".hold-fill");
  var holdLabel = holdBtn && holdBtn.querySelector(".hold-label");
  var pyrs = Array.prototype.slice.call(document.querySelectorAll("#pyramid .pyr"));
  var holdProg = 0, holdRAF = null, holding = false, holdDone = false;

  function paintHold() {
    if (holdFill) holdFill.style.transform = "scaleX(" + holdProg + ")";
    pyrs.forEach(function (li, i) {
      var threshold = (i + 1) / (pyrs.length + 0.6);
      li.classList.toggle("lit", holdProg >= threshold);
    });
  }

  function finishHold() {
    holdBtn.classList.add("done");
    if (holdLabel) holdLabel.textContent = "A pirâmide está aberta";
    pyrs.forEach(function (li) { li.classList.add("lit"); });
    setTimeout(function () {
      holdProg = 0;
      holdDone = false;
      holding = false;
      holdBtn.classList.remove("done");
      paintHold();
      if (holdLabel) holdLabel.textContent = "Pressione e segure";
    }, 2600);
  }

  function holdLoop() {
    holdProg += holding ? 0.014 : -0.045;
    holdProg = Math.max(0, Math.min(1, holdProg));
    paintHold();
    if (holdProg >= 1 && !holdDone) { holdDone = true; finishHold(); }
    var running = (holding && holdProg < 1) || (!holding && holdProg > 0);
    holdRAF = running ? requestAnimationFrame(holdLoop) : null;
  }

  function startHold(e) {
    if (holdDone) return;
    if (e && e.type === "keydown" && e.key !== " " && e.key !== "Enter") return;
    if (e && e.type === "keydown") e.preventDefault();
    holding = true;
    if (holdRAF === null) holdRAF = requestAnimationFrame(holdLoop);
  }
  function endHold() {
    if (!holding || holdDone) return;
    holding = false;
    if (holdRAF === null) holdRAF = requestAnimationFrame(holdLoop);
  }

  if (holdBtn) {
    holdBtn.addEventListener("pointerdown", startHold);
    holdBtn.addEventListener("pointerup", endHold);
    holdBtn.addEventListener("pointerleave", endHold);
    holdBtn.addEventListener("pointercancel", endHold);
    holdBtn.addEventListener("keydown", startHold);
    holdBtn.addEventListener("keyup", endHold);
    holdBtn.addEventListener("blur", endHold);
  }

  /* ---------------- movimento reduzido: estado final fixado ---------------- */
  function pinToFinalStates() {
    document.querySelectorAll("[data-stagger]").forEach(function (el) {
      el.classList.add("in", "done");
    });
    document.querySelectorAll(".sec-proc").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".num[data-count]").forEach(function (n) {
      n.textContent = n.dataset.count + (n.dataset.suffix || "");
    });
    pyrs.forEach(function (li) { li.classList.add("lit"); });
    if (holdFill) holdFill.style.transform = "scaleX(1)";
    if (holdLabel) holdLabel.textContent = "A pirâmide está aberta";
  }

  function unpinFinalStates() {
    if (reduceMQ.matches) return;
    document.querySelectorAll(".num[data-count]").forEach(function (n) {
      n.textContent = "0" + (n.dataset.suffix || "");
    });
  }

  if (reduceMQ.addEventListener) {
    reduceMQ.addEventListener("change", function (e) {
      if (e.matches) { pinToFinalStates(); applyHeroMode(); }
      else applyHeroMode();
    });
  }

  if (reduceMQ.matches) pinToFinalStates();

  /* ---------------- pausa tudo em aba escondida ---------------- */
  document.addEventListener("visibilitychange", function () {
    document.body.classList.toggle("paused", document.hidden);
  });


  /* ---------------- endereços: loja e domínio do site ----------------
     O assets/config.js guarda os dois endereços. Aqui eles são aplicados:
       1. todos os links da loja passam a apontar para MOMENTS.storeUrl;
       2. og:url e og:image recebem o domínio real, para o link compartilhado
          no WhatsApp mostrar o endereço certo. */
  (function () {
    var cfg = window.MOMENTS || {};
    var store = String(cfg.storeUrl || "").replace(/\/+$/, "");
    /* Os links do HTML apontam para um domínio provisório. Aqui todos passam a
       apontar para o storeUrl do config.js, preservando o caminho de cada um. */
    var PLACEHOLDERS = ["https://www.seudominio.com.br", "https://3000-"];
    PLACEHOLDERS.forEach(function (base) {
      if (!store) return;
      document.querySelectorAll('a[href^="' + base + '"]').forEach(function (a) {
        var href = a.getAttribute("href");
        a.setAttribute("href", store + href.slice(base.length));
      });
    });
    /* Em domínio próprio nada mais é preciso: os links já apontam para o
       storeUrl. (O suporte ao preview local ficou fora do repositório.) */
    var site = String(cfg.siteUrl || "").replace(/\/+$/, "");
    if (site) {
      var og = document.querySelector('meta[property="og:url"]');
      if (!og) { og = document.createElement("meta"); og.setAttribute("property", "og:url"); document.head.appendChild(og); }
      og.setAttribute("content", site + "/");
      var img = document.querySelector('meta[property="og:image"]');
      if (img) img.setAttribute("content", site + "/assets/hero-poster.jpg");
    }
  })();

  /* ---------------- início ---------------- */
  applyHeroMode();
  if (scrubOn) updateCaptions(heroProgress(), performance.now());
  window.__momentsOK = true;   /* avisa o vigia do <head> que o JS assumiu */
})();
