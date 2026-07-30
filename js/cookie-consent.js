/* Çerez onay banner'ı — tercihe bağlı çerezler (Google Translate) yalnızca onayla yüklenir.
   Tercih localStorage 'sk-cerez-tercihi' anahtarında tutulur: 'tum' | 'zorunlu' */
(function () {
  'use strict';
  var KEY = 'sk-cerez-tercihi';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var pendingAccept = null;

  function hideBanner() {
    var b = document.getElementById('sk-cerez-banner');
    if (b) b.remove();
  }

  function showBanner(vurgu) {
    if (document.getElementById('sk-cerez-banner')) return;
    var b = document.createElement('div');
    b.id = 'sk-cerez-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Çerez tercihleri');
    b.innerHTML =
      '<p>' + (vurgu
        ? 'Çeviri özelliği, Google Translate çerezi gerektirir ve sayfa içeriğini Google sunucularına iletir. Kullanmak için tercihe bağlı çerezlere izin verin.'
        : 'Sitemiz zorunlu çerezlerin yanında, yalnızca onayınızla çalışan tercihe bağlı çerezler (Google Translate çevirisi) kullanır.') +
      ' Ayrıntılar: <a href="cerez-politikasi.html">Çerez Politikası</a></p>' +
      '<div class="sk-cerez-btns">' +
      '<button type="button" class="btn-cerez kabul">Kabul Et</button>' +
      '<button type="button" class="btn-cerez red">Yalnızca Zorunlu</button>' +
      '</div>';
    document.body.appendChild(b);
    b.querySelector('.kabul').addEventListener('click', function () {
      set('tum'); hideBanner();
      if (pendingAccept) { var f = pendingAccept; pendingAccept = null; f(); }
    });
    b.querySelector('.red').addEventListener('click', function () {
      set('zorunlu'); hideBanner(); pendingAccept = null;
    });
  }

  window.SK_consent = {
    ok: function () { return get() === 'tum'; },
    request: function (onAccept) { pendingAccept = onAccept || null; showBanner(true); }
  };

  if (!get()) {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', function () { showBanner(false); });
    else showBanner(false);
  }
})();
