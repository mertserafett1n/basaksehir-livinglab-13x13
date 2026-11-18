# Hero karakteri

Rive CLI 1.9.2 ile hazırlanmıştır. Proje klasöründen yerel önizlemeyi açabilirsiniz.

```powershell
rive animation/hero-climb --artboard=Preview --viewport=549x672 --fit=contain
```

Kurulumdan önce açık olan terminal `rive` komutunu bulamazsa yeni terminal açın veya tam yolu kullanın.

```powershell
& "$env:USERPROFILE/.rive/bin/rive.exe" animation/hero-climb --artboard=Preview --viewport=549x672 --fit=contain
```

## Kaynaklar

- `scene.rml` düzenlenebilir Rive sahnesidir. Kemikler, dört IK zinciri, temas hedefleri, zaman çizelgeleri ve durum makinesi içerir.
- `build-scene.mjs` poz tablosundan RML üretir. Temas konumlarını ve sürelerini buradan değiştirmek daha kolaydır. Çalıştırılması `scene.rml` üzerindeki elle yapılan değişikliklerin üzerine yazar.
- `x-reference.png` hizalama için kullanılan mevcut X görselinin kopyasıdır.
- `rive.yaml` varsayılan artboard ve yerel derleme ayarlarını içerir.

```powershell
node animation/hero-climb/build-scene.mjs
rive animation/hero-climb --verify
rive inspect animation/hero-climb --summary
```

`Preview` artboard'u X görselini içerir. Web için hazırlanan `Hero` artboard'u şeffaftır. Her ikisi `Greeting` durum makinesini çalıştırır. Çıkış ve tırmanış bir kez oynar, ardından `Seated idle` döngüsüne geçilir.

## Zaman ve temaslar

Koordinatlar 183×164 PNG'ye göre verilmiştir. Artboard'un yüksekliği 224 birimdir ve PNG'nin başlangıcı artboard'da 60 birim aşağıdadır.

| Süre | Hareket |
| --- | --- |
| 0–1 sn | Başlangıç gecikmesi |
| 1–2,45 sn | Merkezden çıkış ve ilk elle çekiş |
| 2,45–3,55 sn | Üst kenara uzanma, ayağı basamağa yerleştirme |
| 3,55–4,25 sn | Sabit el ve ayak temaslarıyla yükselme |
| 4,25–5,7 sn | Kalçayı kenara alma, oturma, bacak salınımının sönmesi |
| 5,7–9,7 sn | Sabit dirsekle önkol ve bilekten selam |
| 9,7–10,6 sn | İki eli kenara koyma |
| 10,6 sn sonrası | Oturarak yavaş baş çevirme |

Kalça `(48,29)`, son el destekleri `(37,29)` ve `(60,29)` noktalarındadır. İtiş sırasında sol ayak `(64,80)` noktasında sabittir. El hedefleri tırmanışta dünya koordinatlarında tutulur ve kollar IK ile çözülür. Selam sırasında sağ kol IK etkisi kapatılır. Üst kolun açısı sabit tutulur, önkol ve bilek ayrı kanallarda hareket eder.

## Dışa aktarım

Yerel önizleme bellekte derlenir. CLI'nin diske `.riv` yazması için hesap oturumu gerekir. Hesap girişi tamamlandı ve `build/hero-climb.riv` dosyası başarıyla üretildi (251475 bayt). Kullanılan çalışma alanının planı nedeniyle çıktı Rive açılış ekranını içeriyor.

```powershell
rive login
rive animation/hero-climb --publish
```

Bu komut yerel `build/hero-climb.riv` dosyasını üretir. Rive hesabının planı dışa aktarım filigranını etkileyebilir. Düzenlemeye görsel Rive Editor'da devam etmek için oturum açıldıktan sonra `.rev` de dışa aktarılabilir.

```powershell
rive animation/hero-climb --rev=build/hero-climb.rev
```

## Web entegrasyonu durumu

Web entegrasyonu `js/hero-greeting.js` içindedir. Rive WebGL2 runtime 2.51.0 ve eşleşen WASM dosyası `assets/vendor/` klasöründedir. Kullanılan sahne `assets/rive/hero-climb.riv` dosyasıdır. 1280 ve 1600 piksel Chrome kontrollerinde hizalama, selam sonrası oturma, mobil ve azaltılmış hareket davranışları doğrulandı.

Mevcut Rive planının açılış ekranı ilk saniyelerde canvas içinde siyah bir alan gösteriyor ve temiz, yaklaşık 1 saniyelik çıkışı geciktiriyor. Bu açılış ekranı kullanıcı tarafından şimdilik kabul edildi. Açılış ekranı içermeyen bir dışa aktarım için uygun Rive planı gerekir.

Yerel web önizlemesi HTTP üzerinden çalıştırılır.

```powershell
node preview.mjs
```

Tarayıcıda `http://127.0.0.1:4173` adresini açın. Yeniden dışa aktardıktan sonra web kopyasını güncelleyin.

```powershell
Copy-Item animation/hero-climb/build/hero-climb.riv assets/rive/hero-climb.riv
```

Dışa aktarımdan sonra runtime `Hero` artboard'unu ve `Greeting` durum makinesini kullanmalı. Canvas, `.hero-x` genişliği / 183 ölçeğiyle boyutlanmalı. Canvas yüksekliği 224 × ölçek, üst konumu PNG üstünden 60 × ölçek yukarı olmalı. Sahnenin kendi 1 saniyelik gecikmesi vardır. Masaüstü ve azaltılmış hareket denetimi web başlatıcısında yapılmalı.
