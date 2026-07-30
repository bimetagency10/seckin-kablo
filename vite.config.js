import { resolve } from 'path'
import { cpSync, existsSync } from 'fs'
import { defineConfig } from 'vite'

// js/ ve assets/ klasörlerini dist/ içine olduğu gibi kopyalar.
// Böylece <script src="js/main.js"> ve çalışma anında yüklenen
// slider görselleri (assets/slider/...) gibi göreli yollar derlemeden
// sonra da birebir çalışır.
function copyStaticDirs() {
  return {
    name: 'copy-static-dirs',
    closeBundle() {
      for (const dir of ['js', 'assets']) {
        if (existsSync(dir)) {
          cpSync(dir, resolve(__dirname, 'dist', dir), { recursive: true })
        }
      }
    },
  }
}

// Çok sayfalı (multi-page) statik site derlemesi.
// Her HTML sayfası ayrı bir rollup girdisidir.
export default defineConfig({
  root: '.',
  base: './',
  plugins: [copyStaticDirs()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        urunler: resolve(__dirname, 'urunler.html'),
        hakkimizda: resolve(__dirname, 'hakkimizda.html'),
        'vizyon-misyon': resolve(__dirname, 'vizyon-misyon.html'),
        iletisim: resolve(__dirname, 'iletisim.html'),
        'data-kablolari': resolve(__dirname, 'data-kablolari.html'),
        'koaksiyel-kablolar': resolve(__dirname, 'koaksiyel-kablolar.html'),
        'cctv-kablolari': resolve(__dirname, 'cctv-kablolari.html'),
        'yangin-alarm-kablolari': resolve(__dirname, 'yangin-alarm-kablolari.html'),
        'sinyal-kontrol-kablolari': resolve(__dirname, 'sinyal-kontrol-kablolari.html'),
        'telefon-kablolari': resolve(__dirname, 'telefon-kablolari.html'),
        'kumanda-kablolari': resolve(__dirname, 'kumanda-kablolari.html'),
        politikalarimiz: resolve(__dirname, 'politikalarimiz.html'),
        'kvkk-aydinlatma-metni': resolve(__dirname, 'kvkk-aydinlatma-metni.html'),
        'cerez-politikasi': resolve(__dirname, 'cerez-politikasi.html'),
      },
    },
  },
})
