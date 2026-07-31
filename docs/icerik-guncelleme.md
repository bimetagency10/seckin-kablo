# İçerik Güncelleme Rehberi

## Yeni ürün kartı ekleme

1. İlgili ürün sayfasını açın (ör. `data-kablolari.html`).
2. Mevcut bir `<div class="product-card acc-item">…</div>` bloğunu kopyalayıp
   grid içinde uygun sıraya yapıştırın.
3. Şunları güncelleyin: `card-name` (ürün adı), görsel `src` + `alt`, spec tablosu
   satırları, `use-note` (kullanım senaryosu — diğer kartlarla aynı cümleyi
   kopyalamayın, ürüne özgü yazın).
4. Görsel için aşağıdaki standarda uyun.

## Görsel standardı

- Format: **WebP**, kalite ~82, maksimum genişlik **1600px**.
- Konum: `assets/img/kablolar/<grup>/` altına.
- Adlandırma: küçük harf, tire ile — ör. `cat6-sftp-23awg.webp`
  (BÜYÜK_HARF_ALTTIRE karışımı kullanmayın).
- `<img>` etiketinde `width`, `height`, `loading="lazy"`, `decoding="async"`
  öznitelikleri zorunlu.

## Menü / footer değişikliği

`partials/header.html` ve `partials/footer.html` dosyalarını düzenleyin —
tüm sayfalara otomatik yayılır. Sayfalardaki HTML'e dokunmayın.

## Yeni sayfa ekleme

1. Mevcut bir sayfayı (ör. `bayilik.html`) kopyalayın.
2. `<title>`, meta description, canonical, `og:*` etiketlerini ve içeriği değiştirin.
3. `vite.config.js` → `rollupOptions.input` listesine ekleyin.
4. `public/sitemap.xml`'e URL satırı ekleyin.
5. Gerekiyorsa partial'lardaki menü/footer'a link ekleyin.

## Çeviri (i18n)

Metinler `js/i18n.js` içindeki TR/EN sözlüklerindedir. HTML'de `data-i18n="anahtar"`
taşıyan öğelerin metnini değiştirirken sözlükteki karşılığını da güncelleyin —
yoksa dil değiştirildiğinde eski metin görünür.

## Telefon / e-posta değişikliği

Site genelinde arayın (`tel:+90...`, `wa.me/90...`, `info@seckinkablo.com`) —
footer partial + iletisim.html + JSON-LD (sayfa head'leri) + `public/llms.txt`.

## Yayına alma

1. Değişikliği branch'te yapın, push edin → Vercel önizleme URL'inde kontrol edin.
2. Onaydan sonra `main`'e merge → otomatik production.
3. Sorun olursa Vercel panelinden **Instant Rollback**.
