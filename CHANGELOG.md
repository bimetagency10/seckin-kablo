# Değişiklik Günlüğü

## [1.1.0] — 2026-07-31 (blok-b / blok C-D)

### Blok A — Kırık işlevler ve KVKK
- İletişim formu Web3Forms backend'ine bağlandı; KVKK onay kutusu eklendi
- 24 ölü Katalog CTA'sı PDF kataloğa bağlandı
- KVKK Aydınlatma Metni + Çerez Politikası sayfaları (avukat onaylı) ve çerez banner'ı
- Google Fonts yerelleştirildi; Google Translate çerez onayına bağlandı
- "Türkiyenin" → "Türkiye'nin" (~39 düzeltme); ölü sosyal ikonlar kaldırıldı
- Telefon 0537 297 65 45 olarak güncellendi (50 yerde)

### Blok B — Performans, SEO, dönüşüm
- 51 görsel WebP (57 MB → 2 MB); tüm görsellere boyut + lazy loading
- Hero yenilendi: slider kaldırıldı, statik foto+metin; tema F5F5F5 + gölgeli geçişler
- WhatsApp navbar/footer/teklif bantlarında; canonical, sitemap, robots, JSON-LD
- Vercel Web Analytics + özel olaylar; klavye erişimi ve kontrast düzeltmeleri

### Blok C — Yapısal
- Header/footer tek kaynak (partials + Vite plugin)
- JS'ler tek hash'li Vite bundle'ında (gzip ~40 KB)
- 7 ürün sayfasına SSS + FAQPage schema
- Ürün bağlamlı teklif formu (ürün grubu + metraj alanları, URL ön-doldurma)
- CCTV boş spec satırları kaldırıldı; 29 kullanım cümlesi ürün-özel yazıldı
- vercel.json (cache + güvenlik başlıkları), GitHub Actions build kontrolü
- Inline CSS'ler style.css'e taşındı; ölü slider CSS silindi; 170 SVG'ye aria-hidden

### Katalog
- İnteraktif ürün kataloğu (75 sayfa) `/katalog.html` olarak yayına alındı;
  tüm "Katalog" butonları buraya yönlendirildi, PDF indirme katalog içinde

### Blok D — Fırsatlar
- Kablo Seçim Rehberi sayfası; public/llms.txt (AI arama)
- Ürün sayfalarına arama/filtre; CTA "Aynı Gün Teklif Al"
- README + içerik güncelleme rehberi; CHANGELOG başlatıldı

## [1.0.0] — 2026-07-30 öncesi
- Sitenin ilk yayın hâli (13 sayfa, slider'lı hero, mailto formu)
