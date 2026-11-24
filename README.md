# 13×13 İnovasyon Yarışması — Tek sayfalık web sitesi

Bu dosyalar Başakşehir Living Lab'in 13×13 İnovasyon Yarışması için hazırlanmış, mobil uyumlu ve yerel olarak çalıştırılabilen bir HTML/CSS/JS web sitesi prototipidir.

## Kullanım

- `index.html` dosyasını çift tıklayarak tarayıcıda açabilirsiniz.
- Yerel sunucuyla çalıştırmak isterseniz: `python3 -m http.server 8000` ardından `http://localhost:8000` adresini ziyaret edin.
- Yayına almak için klasör içeriğini bir statik barındırma servisine / web sunucusuna yükleyebilirsiniz. Bir framework veya derleme adımı gerekmez.

## Dosyalar

- `index.html` — Semantik HTML, erişilebilir gezinme, tüm bölümler ve resmî başvuru bağlantıları.
- `styles.css` — Responsive tasarım, tipografi, renkler, X sunumu.
- `script.js` — X için kaydırma animasyonu, problem arama/detay penceresi, ödül sekmeleri, mobil menü.
- `assets/x-original.png` — Kullanıcı tarafından sağlanan 13×13 X logosunun özgün 2D çizimi.
- `assets/logo-white.png` / `assets/logo-ink.png` — Kullanıcı tarafından sağlanan logonun iki zemin uyarlaması.
- `assets/intro-13x13.png` — Açılıştaki birleşik 13×13 logosu.
- `assets/intro-13-13.png` — X ayrıldıktan sonra sahnede kalan iki 13 rakamı.
- `assets/intro-x.png` — Kaydırıldıkça açıklığının etrafında büyüyen ve açılış bittiğinde kaybolan X.

## İçerik kaynakları

Ana yarışma: https://basaksehirlivinglab.com/basaksehir-living-lab-inovasyon-yarismasi-13x13

Şartname: https://basaksehirlivinglab.com/basaksehir-living-lab-inovasyon-yarismasi-13x13-sartnamesi

13 problem alanı: https://basaksehirlivinglab.com/13-x-13-problem-konu-basliklari

Başvuru: https://bllkulucka.basaksehirlivinglab.org/e/basaksehir-living-lab-13-13-inovasyon-yarismasi-basvurusu

İçerik 18 Kasım 2026 tarihindeki kaynaklara göre düzenlendi. Son başvuru: 15 Ocak 2027; diğer 2027 tarihleri ve ödül tutarları resmî şartnameden alındı.

## Yayından önce

- Organizasyonla iletişime geçerek tarih ve ödül bilgilerinin güncelliğini doğrulayın.
- 13×13 ve Başakşehir Living Lab kurumsal kimliği için uygun resmî onayı alın.
- Mevcut başvuru URL'sini ve çalıştığını doğrulayın. Form doğrudan resmî dış platformda açılır; bu site kişisel bilgi toplamaz.
- Animasyon görsel tabanlı 2.5D bir prototiptir. Tam 3D nesne dönüşü ve materyal kontrolü için özgün X'in bir 3D modelinin ayrıca oluşturulması gerekir.

## UX özellikleri

- Mobil menü, klavye erişimi, odak stilleri, gerçek diyalog penceresi, sekmeler, arama, ekrandan ekrana X geçişleri ve `prefers-reduced-motion` desteği.
