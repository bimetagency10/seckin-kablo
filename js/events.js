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

/* Mobilde interaktif katalog yerine PDF ac (kucuk ekranda sayfa cevirme kullanissiz) */
(function () {
  var PDF = '/assets/katalog/seckin-katalog.pdf';
  var HTML = '/katalog.html';
  var mq = window.matchMedia('(max-width: 820px)');
  function uygula() {
    var hedef = mq.matches ? PDF : HTML;
    document.querySelectorAll('a[data-event="katalog"]').forEach(function (a) {
      a.setAttribute('href', hedef);
    });
  }
  uygula();
  if (mq.addEventListener) mq.addEventListener('change', uygula);
  else if (mq.addListener) mq.addListener(uygula);
})();
