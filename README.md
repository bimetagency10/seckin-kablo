# Seçkin Kablo — Kurumsal Web Sitesi

Kablo üreticisi Seçkin Kablo (BTK Kablo A.Ş.) için çok sayfalı statik kurumsal site.
Vite ile derlenir, Vercel'de yayınlanır: https://seckinkablo.com

## Komutlar

| Komut | İş |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:5173) |
| `npm run build` | Üretim derlemesi → `dist/` |
| `npm run preview` | Derleme önizlemesi |

## Mimari

- **Sayfalar:** kök dizinde ayrı `.html` dosyaları; her sayfa `vite.config.js` içindeki
  `rollupOptions.input` listesine kayıtlıdır (yeni sayfa eklerken oraya da ekleyin).
- **Header/Footer:** tek kaynak — [partials/header.html](partials/header.html) ve
  [partials/footer.html](partials/footer.html). Sayfalarda `<!--sk:header active="..."-->`
  ve `<!--sk:footer-->` tokenları bulunur; derlemede otomatik enjekte edilir.
  Menüye link eklemek = yalnızca partial dosyasını düzenlemek.
- **JS:** `src/entry.js` → `js/cookie-consent.js`, `js/i18n.js`, `js/main.js`,
  `js/events.js` sırasıyla; Vite tek hash'li bundle üretir.
- **Stiller:** `css/style.css` (tek dosya) + `css/fonts.css` (yerel Google Fonts).
- **Form:** İletişim formu Web3Forms'a POST atar (access key `iletisim.html` içinde).
- **Analitik:** Vercel Web Analytics (`@vercel/analytics` inject) + `data-event`
  öznitelikli özel olaylar (katalog, whatsapp, telefon, form-gonderildi).
- **KVKK:** çerez banner'ı (`js/cookie-consent.js`) onay vermeden Google Translate
  yüklemez; fontlar yereldir.

## İçerik Güncelleme

Ürün kartı ekleme, görsel standartları ve sık işlemler için:
[docs/icerik-guncelleme.md](docs/icerik-guncelleme.md)

## Deploy ve Geri Alma

- `main`'e push → Vercel otomatik production deploy'u.
- Diğer branch'lere push → otomatik önizleme URL'i.
- Geri alma: Vercel panelinde ilgili deployment → **Instant Rollback**; veya
  `git revert <commit>` + push.
- Her push'ta GitHub Actions `npm run build` doğrulaması yapar
  ([.github/workflows/build.yml](.github/workflows/build.yml)).
