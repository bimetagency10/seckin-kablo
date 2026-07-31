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
