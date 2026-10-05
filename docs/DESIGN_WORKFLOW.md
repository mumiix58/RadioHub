# Mega Radio — Figma tasarım çalışma notları

## Başlangıç

- İnceleme tarihi: 5 Ekim 2026.
- Kaynak: https://github.com/mumiix58/RadioHub
- Başlangıç commit'i: `add2ba492dd2eb450a706fcb8440dba6262cbbbd` (`origin/main`).
- Tasarım branch'i: `codex/design` (yerel).
- Hedef: Kullanıcının seçtiği sayfaları Mega Radio Figma tasarımıyla karşılaştırıp
  farkları mevcut web uygulamasına aşamalı olarak uygulamak.
- Figma dosyası: [Mega Radio](https://www.figma.com/design/Jf3ZOklsARouzh5Mop0rRz/Mega-Radio?node-id=2035-6194).
  İlk sayfa favoriler; uygulanan kapsam aşağıdaki çalışma kaydında açıklanıyor.
  Sonraki sayfaların sırasını kullanıcı belirleyecek.

## Güncel yapı

Proje bir pnpm monoreposudur. Ana arayüz `artifacts/megaradio` içinde React 19.1,
TypeScript, Vite 7, Tailwind CSS 3, Wouter ve TanStack Query 5 kullanır. Radix UI
primitifleri, Lucide ikonları ve bazı Heroicons bileşenleri vardır.

API, `artifacts/api-server` içindeki Express 5 uygulamasıdır. Güncel
`src/index-api.ts`, `src/postgres-runtime.ts` ve `scripts/start-postgres.mjs`
PostgreSQL kullanır. Eski `CLAUDE.md` / `replit.md` belgelerindeki MongoDB'nin ana
veritabanı olduğu bilgisi bu commit için güncel değildir.

`lib/db-shared` ortak tipleri/şemaları, `lib/seo-shared` yerelleştirilmiş SEO ve
URL yardımcılarını, `lib/api-client-react` API istemcisini içerir. Investor deck
ve mockup sandbox ayrı uygulamalardır.

## Ekran ve dosya haritası

Aşağıdaki yollar `artifacts/megaradio/src` klasörüne göredir. URL'ler İngilizce
kanonik örneklerdir; dil önekleri ve çevrilmiş yollar `useSeoRouting` ile çözülür.

| Ekran | URL örneği | Temel dosya |
| --- | --- | --- |
| Ana sayfa | `/` | `pages/radio-frontend.tsx` |
| Radyo listesi | `/radios`, `/stations` | `pages/radios.tsx` |
| Radyo detayı | `/station/:slug` | `pages/stations/[id].tsx` |
| Arama | `/search` | `pages/search.tsx` |
| Türler | `/genres` | `pages/genres.tsx` |
| Tür açılışı / detayı | `/genres/:slug` ve alt yollar | `pages/genres/genre-landing.tsx`, `pages/genres/[slug].tsx` |
| Bölgeler / ülkeler / şehirler | `/regions` ve alt yollar | `pages/RegionsPage.tsx`, `RegionCountriesPage.tsx`, `CountryCitiesPage.tsx`, `RegionStationsPage.tsx` |
| Öneriler / trendler | `/recommendations`, `/trending` | `pages/recommendations.tsx`, `pages/TrendingStations.tsx` |
| Giriş / kayıt | `/login`, `/signup` | `pages/login.tsx`, `pages/signup.tsx` |
| Alternatif auth ekranları | `/auth/login`, `/auth/signup` | `pages/auth/login.tsx`, `pages/auth/signup.tsx` |
| Profil | `/profile` | `pages/profile.tsx`, `components/layout/ProfileLayout.tsx` |
| Favoriler / keşfet | `/profile/favorites`, `/profile/discover` | `pages/favorites.tsx`, `pages/profile-discover.tsx` |
| Profil ayarları / bildirimler | `/profile/settings`, `/profile/notifications` | `pages/profile-settings.tsx`, `pages/notifications-view.tsx` |
| Mesajlar | `/profile/messages` | `pages/messages.tsx` |
| Topluluk / kullanıcı | `/users`, `/users/:id` | `pages/users/index.tsx`, `pages/UserProfile.tsx` |
| Premium | `/premium` | `pages/premium.tsx` |
| Bilgi sayfaları | `/about`, `/contact`, `/applications`, `/faq` | İlgili `pages/*.tsx` dosyaları |

Benzer isimli eski/alternatif ekranlar bulunduğundan dosya seçerken önce
`App.tsx` içindeki `renderByCleanPath` ve lazy import eşleşmesini kontrol et.

## Paylaşılan tasarım alanları

| Alan | Dosyalar (`artifacts/megaradio` altında) |
| --- | --- |
| Üst menü / marka | `src/components/layout/radio-header.tsx`, `header-brand.tsx`, `header-brand.css` |
| Mobil gezinme / hızlı arama | `src/components/layout/mobile-navigation.tsx`, `quick-search-dialog.tsx`, `quick-search-dialog.css` |
| Alt bölüm | `src/components/layout/footer.tsx` |
| Radyo kartı / logo / ızgara | `src/components/ui/station-card.tsx`, `station-logo.tsx`, `stations-grid.tsx` |
| Ana sayfa başlığı ve görseli | `src/components/HomeHeroCopy.tsx`, `HomeHeroPicture.tsx` |
| Global oynatıcı | `src/components/global-player.tsx`, `src/hooks/useGlobalPlayer.tsx`, `useGlobalPlayer.shell.tsx`, `LazyGlobalPlayerProvider.tsx` |
| Tema / tipografi | `src/index.css`, `tailwind.config.ts`, `src/lib/theme-provider.tsx` |
| Statik varlıklar | `public/fonts`, `public/icons`, `public/images`, repo kökündeki `attached_assets` |

Kodda görülen mevcut görsel temel: Ubuntu, pembe vurgu `#FF4199`, koyu yüzey
`#0E0E0E`. Tailwind container ayarlarında 1512 px ve geniş ekranlarda 153 px yatay
padding referansı var. Bunlar mevcut uygulamanın değerleridir; güncel Figma
tasarımının doğrulanmış ölçüleri olarak kabul edilmemelidir. Bazı stiller global
CSS, bazıları sayfa içi Tailwind sınıflarında bulunduğundan ikisini birlikte incele.

## Yerel çalışma

Node.js 24 ve pnpm ile, repo kökünden:

```sh
pnpm install --frozen-lockfile
PORT=22507 BASE_PATH=/ pnpm --filter @workspace/megaradio run dev
```

Vite adresi: `http://localhost:22507`. Bu yalnızca frontend sunucusudur.
Mevcut Vite config'inde `/api` proxy'si yoktur. Repo geliştirme düzeninde ayrı
reverse proxy, `/api` isteklerini backend'e yönlendirir. Ortak API yardımcıları
`VITE_API_BASE_URL` destekler; kaynakta doğrudan `/api` fetch çağrıları da vardır,
bu yüzden bu değişken tek başına bütün ekranların bağlantısını garanti etmez.

Tam veriyle çalışmak için geliştirme API'si ve PostgreSQL kurulumu gerekir.
API başlangıç betiği şema migrasyonlarını uyguladığından veri kaynağı belirlenmeden
çalıştırılmamalıdır. Bu hazırlık sırasında API/veritabanı başlatılmadı.

Mac'te ilk build, `@rollup/rollup-darwin-arm64` bulunamadığı için durdu.
`pnpm-workspace.yaml` içindeki esbuild, Rollup, Lightning CSS ve Tailwind Oxide
Darwin hariç tutmaları kaldırıldı; lockfile aynı sürümlerin macOS bağımlılıklarını
içerecek şekilde yenilendi. Linux ve Windows destekleri korundu.

## Hazırlık doğrulaması

5 Ekim 2026, Node.js 24.19.0 / pnpm 11.19.0 / macOS arm64:

- `pnpm install --frozen-lockfile`: başarılı; güncellenmiş lockfile ile tekrar doğrulandı.
- `pnpm run typecheck:libs`: başarılı.
- `pnpm --filter @workspace/megaradio run typecheck`: başarılı.
- Frontend production build: başarılı. Mevcut büyük chunk uyarıları devam ediyor.
- Frontend Vitest: 139 test dosyası, 2.010 test başarılı.
- Vite geliştirme sunucusu: başlangıç başarılı; `/` ve `/src/main.tsx` HTTP 200.
- Tam API/veritabanı entegrasyonu ve tarayıcıda Figma karşılaştırması yapılmadı.
- Backend testleri ve bütün workspace build'i bu hazırlığın doğrulamasına dahil değil.
- Branch ve hazırlık değişiklikleri yereldir; commit/push/PR oluşturulmadı.

## Her sayfa için izlenecek kayıt

- Figma bağlantısı ve frame/node kimliği.
- Uygulama URL'si, dil, ekran genişliği ve oturum/veri durumu.
- Tespit edilen farklar ve değiştirilen dosyalar.
- Masaüstü/mobil karşılaştırma sonucu ve çalıştırılan ilgili testler.
- Kalan farklar veya gerçekten eksik bağımlılıklar.

## 5 Ekim 2026 — Profil / Favoriler

- Referans: Web / `your-favorites` (`2035:6194`), ortak profil shell'i
  `2035:9624`; mesaj ikonu `1339:6118`.
- Ekran: `/tr/profil/favoriler`, giriş yapılmış kullanıcı.
- Kullanıcı kapsamı: sol profil menü ikonları ve seçili ikon rengi, sol logo
  hizası, breadcrumb'ın Favorileriniz başlığıyla hizası.
- Figma Vuesax bold ikonları `public/icons/profile/` altına orijinal SVG olarak
  alındı. 24 px maskeler ikon rengini uyguluyor; yalnız aktif menü ikonu
  `#FF4199`, diğerleri beyaz. Seçili satırın gri arka planı korundu.
- Figma'da Records olan menü yerine uygulamadaki Mesajlar işlevi korundu ve
  Figma dosyasının mesaj ikonu kullanıldı. Yeni kayıt özelliği eklenmedi.
- Masaüstü profil header'ı tam genişlikte, logo soldan 30 px. Sidebar 250 px;
  breadcrumb ve içerik aynı inset'i kullanıyor (250 + 30 = 280 px).
  Oynatıcının profil sidebar'ı için görsel offset'i de 250 px'e uyarlandı.
- 1512 px genişlikte DOM ölçümü: logo x=30, breadcrumb x=280, başlık x=280.
  Seçili ikon `rgb(255, 65, 153)`, diğer beş ikon beyaz, ikon slotları 24×24 px.
- 390 px mobil kontrolde breadcrumb ve başlık x=8; yatay taşma yok.
- Figma'daki diğer header menü öğeleri, logo boyutu, radyo kartları ve
  oynatıcı içeriği bu talebin dışında bırakıldı.
- Görsel inceleme için `.local/profile-preview.config.mts` gerçek uygulamayı
  salt okunur örnek API yanıtlarıyla başlatır. Üretim build'ine dahil değildir;
  gerçek kullanıcı oturumu veya veritabanı kullanmaz. Yeniden başlatma:

```sh
PORT=22508 BASE_PATH=/ pnpm --filter @workspace/megaradio exec vite --config ../../.local/profile-preview.config.mts
```

Önizleme: `http://127.0.0.1:22508/tr/profil/favoriler`. Örnek hesap ve radyo
isimleri kullanır. Standart geliştirme sunucusu 22507 portunda ayrı kalır.
Ekran görüntüleri `.local/design-checks/profile-desktop.jpg` ve
`.local/design-checks/profile-mobile.jpg` içinde tutulur.

Doğrulama: frontend TypeScript kontrolü, production build ve 139 dosyadaki
2.010 test başarılı. Masaüstü/mobil görsel kontrol örnek API verileriyle yapıldı;
gerçek hesap işlemleri ve yayın oynatma bu tasarım kontrolünde denenmedi.

### Tarayıcı yorumları — logo yazısı ve başlık sırası

- Figma wordmark referansı: `2035:9858`. Profil header'ında 1024 px ve üzerinde
  `megaradio` yazısı görünür; Ubuntu 20.384 px, mega 700 / radio 400 ağırlığında,
  ikon ile yazı arasında 11 px boşluk kullanılır.
- Favoriler başlığı, adet ve sıralama aynı üst satıra alındı. Breadcrumb bu
  satırın 8 px altında, başlıkla aynı sol hizada gösterilir. App seviyesindeki
  breadcrumb bu sayfa için kaldırıldı; diğer sayfalardaki konumu korunur.
- İçeriğin üst boşluğu 20 px, adet rozeti 32 px, breadcrumb sonrası boşluk
  20 px olarak sıkılaştırıldı.
- 1218 px genişlikte başlık y=110, breadcrumb y=150; ikisi de x=280.
  1512 px genişlikte logo x=30, başlık ve breadcrumb x=280. 390 px mobilde
  başlık ve breadcrumb x=8; üç genişlikte de yatay taşma yok.
- Sıralama menüsünün açılması ve seçim değişimi örnek verili önizlemede
  doğrulandı. Kontrol sonunda başlangıç seçimine dönüldü.
- TypeScript kontrolü, production build ve 139 dosyadaki 2.010 test başarılı.
  Mevcut build chunk boyutu uyarıları sürüyor.
- Ekran görüntüleri: `.local/design-checks/profile-comments-final.jpg` ve
  `.local/design-checks/profile-comments-mobile.jpg`.
