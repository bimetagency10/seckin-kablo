/* Vercel Web Analytics olay takibi — data-event öznitelikli tıklamaları raporlar.
   Çerezsiz çalışır; kişisel veri göndermez. */
(function () {
  'use strict';
  function track(name, data) {
    if (typeof window.va === 'function') {
      window.va('event', Object.assign({ name: name }, data || {}));
    }
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-event]') : null;
    if (el) track(el.getAttribute('data-event'));
  });
  window.SK_track = track;
})();

/* Katalog baglantilari: masaustunde interaktif katalog, mobilde PDF
   (kucuk ekranda sayfa cevirme kullanissiz). Derin link korunur:
   ?p=74 -> masaustu /katalog.html?p=74, mobil PDF#page=74 */
(function () {
  var PDF = '/assets/katalog/seckin-katalog.pdf';
  var HTML = '/katalog.html';
  var mq = window.matchMedia('(max-width: 820px)');

  function sayfaNo(href) {
    if (!href) return '';
    var m = href.match(/[?&]p=(\d+)/) || href.match(/#page=(\d+)/);
    return m ? m[1] : '';
  }
  function uygula() {
    document.querySelectorAll('a[data-event="katalog"]').forEach(function (a) {
      if (!a.dataset.skSayfa) a.dataset.skSayfa = sayfaNo(a.getAttribute('href'));
      var p = a.dataset.skSayfa;
      a.setAttribute('href', mq.matches
        ? PDF + (p ? '#page=' + p : '')
        : HTML + (p ? '?p=' + p : ''));
    });
  }
  uygula();
  if (mq.addEventListener) mq.addEventListener('change', uygula);
  else if (mq.addListener) mq.addListener(uygula);
})();
