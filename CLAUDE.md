# Seçkin Kablo — Kurumsal Web Sitesi

Kablo üreticisi için çok sayfalı statik kurumsal site. Vite ile derlenir, Vercel'de yayındadır:
https://seckin-kablo.vercel.app/

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — üretim derlemesi (her değişiklikten sonra çalıştırıp doğrula)
- `npm run preview` — derleme önizlemesi

## Yapı

- Sayfalar kök dizinde ayrı `.html` dosyaları (index, urunler, kategori sayfaları, iletisim…)
- Stiller `css/`, scriptler `js/`, görseller `assets/` ve `public/` içinde
- Bilinçli olarak framework'süz ve sade tutulmuştur — gereksiz bağımlılık ekleme

## Uzman Ajanlar (subagent)

Bu projede 7 uzman subagent tanımlıdır (`.claude/agents/`). İş, ilgili uzmana devredilir:

| Ajan | Alan |
|---|---|
| `developer` | Kod, özellik, hata, build |
| `design` | UI/UX, görsel tasarım, erişilebilirlik |
| `marketing` | SEO, AI-SEO, dönüşüm (CRO), reklam |
| `social-content` | Site metinleri, içerik, sosyal medya |
| `finance` | Fiyatlandırma, finansal model, sunum |
| `operations` | SOP, süreç, lansman, raporlama |
| `legal` | KVKK/çerez uyumu, sözleşme, NDA |

Skill'ler `.claude/skills/` altındadır (53 adet) ve otomatik algılanır. Bir işe
başlamadan önce ilgili skill çağrılır (Superpowers disiplini: TDD, systematic-debugging,
verification-before-completion).

## Güvenlik Kuralları

1. `main` branch'e doğrudan büyük değişiklik yapma; işleri branch'te yürüt.
2. Her değişiklikten sonra `npm run build` ile derlemenin kırılmadığını kanıtla.
3. Yayındaki siteyi etkileyen kararlarda (deploy, silme, köklü tasarım değişimi) önce onay al.
4. Kablo ürün spesifikasyonlarını uydurma; mevcut içerikten veya kullanıcıdan doğrula.
