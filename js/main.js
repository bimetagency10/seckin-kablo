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
    /* Mobil menü paneli üstüne marka satırı (logo + kapat) — her sayfaya
       tek noktadan eklenir; HTML dosyalarında tekrar edilmez. */
    if (!navMenu.querySelector('.nav-brand-row')) {
      var brandRow = document.createElement('li');
      brandRow.className = 'nav-brand-row';
      brandRow.innerHTML =
        '<a class="brand-logo brand-logo--md" href="/" aria-label="Seçkin Kablo — Anasayfa">' +
          '<img src="assets/img/logo.png" alt="Seçkin Kablo" width="234" height="106">' +
        '</a>' +
        '<button type="button" class="nav-brand-close" aria-label="Menüyü kapat">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
            '<path d="M6 6l12 12M18 6L6 18"/>' +
          '</svg>' +
        '</button>';
      navMenu.insertBefore(brandRow, navMenu.firstChild);
    }

    /* Body scroll kilidi: menü açıkken sayfa kaymasın; kapanınca eski konum korunur. */
    var lockedScrollY = 0;
    function lockScroll() {
      lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + lockedScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }
    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, lockedScrollY);
    }

    /* Menü arkası karartma katmanı — <body>'ye eklenir; tıklanınca menüyü kapatır. */
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    function isMobile() { return window.innerWidth <= 820; }
    function openMenu() {
      navMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      if (isMobile()) lockScroll();
    }
    function closeMenu() {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      /* Açık kalmış tüm alt menüleri de kapat */
      document.querySelectorAll('.has-drop.open').forEach(function (li) { li.classList.remove('open'); });
      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        unlockScroll();
      }
    }

    hamburger.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) closeMenu(); else openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    var brandClose = navMenu.querySelector('.nav-brand-close');
    if (brandClose) brandClose.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
    /* Ekran mobilden desktop'a genişlerse kilidi bırak */
    window.addEventListener('resize', function () {
      if (!isMobile() && document.body.classList.contains('nav-open')) closeMenu();
    });

    document.querySelectorAll('.has-drop > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (isMobile()) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
      });
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.parentElement.classList.contains('has-drop') && isMobile()) return;
        closeMenu();
      });
    });
  }

  /* -------- Scroll reveal (opt-in gizleme) --------
     Strateji:
     1) reduced-motion veya IO desteği yoksa hiç gizleme, tüm reveal .in.
     2) Sayfa yüklendiğinde viewport içindeki reveal'ları anında .in yap
        (fade beklemesin — kullanıcı boş sayfa görmesin).
     3) Sonra <html>'a .js-reveal ekle → henüz .in olmayan (kritik-altı)
        öğeler CSS ile gizlenir; scroll'da IO ile fade-in olur.
     Her öğe için animasyon tek seferliktir (unobserve). */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      /* 1) İlk paint'te viewport içinde olanları anında .in yap */
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) el.classList.add('in');
      });
      /* 2) Off-screen öğeler için CSS gizlemesini aç */
      document.documentElement.classList.add('js-reveal');
      /* 3) IO: kaydırma ile görünür olanları .in yap ve unobserve et */
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          if (!el.classList.contains('in')) {
            var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
            var i = sibs.indexOf(el);
            el.style.transitionDelay = (Math.max(Math.min(i, 4), 0) * 60) + 'ms';
            el.classList.add('in');
          }
          io.unobserve(el);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) {
        if (!el.classList.contains('in')) io.observe(el);
      });
    }
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

  /* -------- WhatsApp yüzen buton --------
     Her sayfaya tek noktadan eklenir (paylaşımlı include); HTML dosyalarında
     tekrar edilmez. Sabit sağ-alt köşe, şirket numarasına önyazılı mesajla açılır. */
  if (!document.querySelector('.wa-float')) {
    var wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = 'https://wa.me/905334795530?text=Merhaba,%20Se%C3%A7kin%20Kablo%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp ile iletişime geçin');
    wa.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.005c6.582 0 11.943-5.334 11.945-11.892a11.821 11.821 0 00-3.47-8.404"/>' +
      '</svg>';
    document.body.appendChild(wa);
  }

  /* -------- Footer yılı -------- */
  var y = document.querySelector('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
