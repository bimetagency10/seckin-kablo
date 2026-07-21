/* =========================================================
   SEÇKİN KABLO — main.js
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Navbar: scroll + mobil menü + dropdown -------- */
  var navbar = document.querySelector('.navbar');
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.nav-menu');

  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.has-drop > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.innerWidth <= 820) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
      });
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.parentElement.classList.contains('has-drop') && window.innerWidth <= 820) return;
        navMenu.classList.remove('open'); hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------- Scroll reveal + kardeş gecikmesi (stagger) -------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (Math.max(i, 0) * 80) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -------- Animasyonlu sayaçlar -------- */
  var counters = document.querySelectorAll('[data-count]');
  function finalVal(el) {
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = parseFloat(el.getAttribute('data-count')).toLocaleString('tr-TR') + suffix;
  }
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(finalVal);
    } else {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target, target = parseFloat(el.getAttribute('data-count'));
          var suffix = el.getAttribute('data-suffix') || '', dur = 1600, t0 = performance.now();
          (function tick(now) {
            var p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('tr-TR') + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
          cObs.unobserve(el);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cObs.observe(c); });
    }
  }

  /* -------- Hero 3D kablo: fare takibi (lerp + rAF) -------- */
  var scenes = document.querySelectorAll('.cable-scene');
  if (scenes.length && !reduce) {
    scenes.forEach(function (scene) {
      var host = scene.closest('.hero-visual') || scene.closest('.mini-cable') || scene.parentElement;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      function loop() {
        cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
        scene.style.transform = 'rotateX(' + cy.toFixed(2) + 'deg) rotateY(' + cx.toFixed(2) + 'deg)';
        if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) { raf = requestAnimationFrame(loop); }
        else { raf = null; }
      }
      function kick() { if (!raf) raf = requestAnimationFrame(loop); }
      host.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = px * 16; ty = -py * 16;
        if (tx > 8) tx = 8; if (tx < -8) tx = -8;
        if (ty > 8) ty = 8; if (ty < -8) ty = -8;
        kick();
      });
      host.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    });
  }

  /* -------- Tilt kartlar (rAF) -------- */
  if (!reduce) {
    document.querySelectorAll('.cat-card, .big-cat').forEach(function (card) {
      var raf = null, rx = 0, ry = 0;
      function apply() { card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)'; raf = null; }
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry = px * 10; rx = -py * 10;
        if (ry > 5) ry = 5; if (ry < -5) ry = -5;
        if (rx > 5) rx = 5; if (rx < -5) rx = -5;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* -------- Akordeon (ürün detay) -------- */
  document.querySelectorAll('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.acc-item');
      var body = item.querySelector('.acc-body');
      var open = item.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.style.maxHeight = open ? (body.scrollHeight + 'px') : '0px';
    });
  });

  /* =========================================================
     HERO MEDYA SLIDER
     ---------------------------------------------------------
     ⇩⇩ SLAYT METİNLERİNİ BURADAN DÜZENLEYİN ⇩⇩
     Her slayt için: eyebrow (üst etiket), title (başlık — <span
     class="gradient-text"> ile bir kelime vurgulanabilir), subtitle
     (alt metin), primaryLabel/primaryHref (dolgu buton),
     ghostLabel/ghostHref (cam buton). Boş bırakılan alan gösterilmez.
     ========================================================= */
  var SLIDES = [
    {
      eyebrow: 'TÜRKİYENİN EN SEÇKİN KABLOSU',
      title: 'Enerjiyi ve veriyi, <span class="gradient-text">seçkin</span> standartlarda taşıyoruz.',
      subtitle: 'Data, koaksiyel görüntü, CCTV, yangın alarm, sinyal-kontrol, telefon ve kumanda kablolarında; yüksek saflıkta bakır iletken ve uluslararası standartlarla üretilmiş geniş ürün gamı.',
      primaryLabel: 'Ürünleri Keşfet', primaryHref: 'urunler.html',
      ghostLabel: 'Katalog PDF', ghostHref: '#'
    },
    {
      eyebrow: 'BELGELİ ÜRETİM',
      title: 'Kaliteyi <span class="gradient-text">belgelerle</span> kanıtlıyoruz.',
      subtitle: 'TSE, CE, VDE ve RoHS standartlarına uygun üretim; yüksek saflıkta bakır iletken ve LSZH-HFFR halojensiz seçeneklerle güvenli, izlenebilir kablo çözümleri.',
      primaryLabel: 'Standartlarımız', primaryHref: 'hakkimizda.html',
      ghostLabel: 'Katalog PDF', ghostHref: '#'
    },
    {
      eyebrow: 'YURT İÇİ & İHRACAT',
      title: 'Projelerinize <span class="gradient-text">güvenle</span> ulaşan çözümler.',
      subtitle: 'Yedi ana üründe geniş stok ve hızlı sevkiyat; yurt içi ve ihracat projelerinde tercih edilen, metraj baskılı ve izlenebilir üretim.',
      primaryLabel: 'Ürün Gruplarımız', primaryHref: 'urunler.html',
      ghostLabel: 'Teklif Al', ghostHref: 'iletisim.html'
    }
  ];

  (function initSlider() {
    var slider = document.querySelector('.hero-slider');
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.slider-dots .dot'));
    var prevBtn = slider.querySelector('.slider-arrow.prev');
    var nextBtn = slider.querySelector('.slider-arrow.next');
    if (!slides.length) return;

    var idx = 0, timer = null, paused = false;
    var INTERVAL = 10000;

    /* Her slaytın metin overlay'ini SLIDES dizisinden oluştur
       (imza slaytı .slide--light kendi özel içeriğini taşır; atlanır) */
    slides.forEach(function (slide, i) {
      if (slide.classList.contains('slide--light')) return;
      var ov = slide.querySelector('.slide-overlay');
      if (ov && SLIDES[i]) ov.innerHTML = buildOverlay(SLIDES[i]);
    });
    function buildOverlay(d) {
      var h = '';
      if (d.eyebrow) h += '<span class="eyebrow slide-eyebrow">' + d.eyebrow + '</span>';
      if (d.title) h += '<h2 class="slide-title">' + d.title + '</h2>';
      if (d.subtitle) h += '<p class="slide-subtitle">' + d.subtitle + '</p>';
      var b = '';
      if (d.primaryLabel) b += '<a class="btn btn-grad" href="' + (d.primaryHref || '#') + '">' + d.primaryLabel + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
      if (d.ghostLabel) b += '<a class="btn btn-glass" href="' + (d.ghostHref || '#') + '">' + d.ghostLabel + '</a>';
      if (b) h += '<div class="slide-actions">' + b + '</div>';
      return h;
    }

    /* Medya yükleyici: gerçek dosya varsa yükle (.jpg → resim, .mp4 → video),
       yoksa placeholder kalır. Overlay metni her zaman medyanın ÜSTÜNde durur.
       Sadece assets/slider/ içine dosya koymak yeterli. */
    slides.forEach(function (slide) {
      if (slide.classList.contains('slide--light')) return; /* imza slaytı: medya yok */
      var name = slide.getAttribute('data-name');
      if (!name) return;
      var base = 'assets/slider/' + name;
      var probe = new Image();
      probe.onload = function () { setMedia(slide, buildImg(base + '.jpg')); };
      probe.onerror = function () {
        var v = document.createElement('video');
        v.muted = true; v.loop = false; v.preload = 'metadata';
        v.setAttribute('playsinline', ''); v.playsInline = true;
        v.addEventListener('loadeddata', function () {
          slide._video = v; setMedia(slide, v);
          if (slide.classList.contains('is-active')) playActive();
        }, { once: true });
        v.addEventListener('error', function () { /* placeholder kalsın */ }, { once: true });
        v.addEventListener('ended', function () {
          if (slide.classList.contains('is-active')) go(idx + 1, true);
        });
        v.src = base + '.mp4';
      };
      probe.src = base + '.jpg';
    });
    function buildImg(src) { var im = document.createElement('img'); im.src = src; im.alt = ''; im.decoding = 'async'; return im; }
    function setMedia(slide, el) {
      el.classList.add('slide-media');
      var wrap = slide.querySelector('.slide-media-wrap');
      if (!wrap) return;
      wrap.innerHTML = ''; wrap.appendChild(el);
    }
    function playActive() {
      var v = slides[idx] && slides[idx]._video;
      if (v) { try { v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    }

    function render() {
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        try { s.inert = !on; } catch (e) {}
        Array.prototype.forEach.call(s.querySelectorAll('a,button'), function (el) { el.tabIndex = on ? 0 : -1; });
        if (!on && s._video) { try { s._video.pause(); } catch (e) {} }
      });
      dots.forEach(function (d, i) {
        var on = i === idx;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      /* açık zeminli imza slaytı aktifse ok/nokta/çip koyu varyanta geçsin */
      var activeLight = slides[idx] && slides[idx].classList.contains('slide--light');
      slider.classList.toggle('slider-light', !!activeLight);
      playActive();
    }
    function go(n, manual) {
      idx = (n + slides.length) % slides.length;
      render();
      if (manual) restart();
    }
    function start() {
      if (reduce || paused) return;
      stop();
      timer = setTimeout(function () { go(idx + 1, false); }, INTERVAL);
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1, true); });
    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1, true); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1, true); }
    });

    slider.addEventListener('mouseenter', function () { paused = true; stop(); });
    slider.addEventListener('mouseleave', function () { paused = false; start(); });

    var tsX = null, tsY = null;
    slider.addEventListener('touchstart', function (e) {
      if (!e.touches[0]) return;
      tsX = e.touches[0].clientX; tsY = e.touches[0].clientY;
      paused = true; stop();
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (tsX === null) return;
      var t = e.changedTouches && e.changedTouches[0];
      if (t) {
        var dx = t.clientX - tsX, dy = t.clientY - tsY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { go(idx + (dx < 0 ? 1 : -1), true); }
      }
      tsX = null; tsY = null; paused = false; start();
    }, { passive: true });

    render();
    start();
  })();

  /* -------- İletişim formu -------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form-success');
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
      form.reset();
      setTimeout(function () { if (ok) ok.classList.remove('show'); }, 6000);
    });
  }

  /* -------- Footer yılı -------- */
  var y = document.querySelector('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
