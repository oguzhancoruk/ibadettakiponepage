# İbadet Takip Web

Mobil uygulamayla aynı API ve hesap kayıtlarını kullanan React web uygulaması.

## Yerel çalıştırma

MongoDB Community Server (`mongod`) ve Node.js gerekir. İki terminalde:

```sh
cd ../prayer
npm install
npm run web:local
```

```sh
cd ../ibadettakiponepage
npm install
REACT_APP_API_BASE=http://127.0.0.1:3009 npm start
```

Web `http://localhost:3000`, API `http://127.0.0.1:3009` adresindedir. `web:local`, yalnızca `127.0.0.1:27029/prayer_web_test` veritabanını kullanır; üretim `.env` dosyasını yüklemez, e-posta göndermez. MongoDB'yi gerekiyorsa ayrı geçici veri klasöründe ve `prayerLocal` replica setiyle başlatır. Site üzerinden yerel test hesabı oluşturabilirsin. Yerel VAPID anahtarları `prayer/.local/` içinde saklanır; Git'e eklenmez.

API adresi `REACT_APP_API_BASE` ile değiştirilebilir; varsayılan `https://api.prayertrack.app` adresidir. `.env.development.local` yalnızca geliştirme çalıştırmasını etkiler. Üretim derlemesi varsayılan canlı API'ye bağlanır.

## Ekranlar

- `/dashboard`, `/daily`, `/kaza`, `/fasting`: Namaz/nafile kayıtları, iki günlük vakitler ve geri sayım, kaza planları ve oruç takvimi.
- `/tools`, `/search`: Tüm araçlar ve Türkçe/İngilizce özellik araması.
- `/reports`: Aylık/yıllık raporlar, vakit dağılımı, dönem grafikleri; tarayıcının yazdır/PDF kaydet penceresi.
- `/journal`: Tarihe göre ruh hali, enerji, şükür listesi ve günlük; son 30 kayıt.
- `/challenges`, `/activity`: Hedef başlatma, tamamlanan adımları kaydetme, hedefi bırakma ve arkadaş etkinlikleri.
- `/qibla`, `/mosques`, `/guide`: Kıble açısı ve destekleyen cihazlarda pusula, cami arama/harita/yol tarifi, mobildeki görselli namaz rehberi.
- `/tesbih`: Ortak günlük sayacı yükleme ve açık kullanıcı eylemiyle kaydetme.
- `/duas`: Kategori/arama, İngilizce mevcut içerikler ve favoriler.
- `/hatim`: Kur’an okuma, ayet/sure arama, Diyanet ses kayıtları, yer imleri, büyük yazı ve sıralı hatim ilerlemesi. Meal içeriği Türkçedir.
- `/family`, `/friends`, `/achievements`: İzinli aile istatistikleri/davetler, arkadaşlık/engelleme/sıralama, rozetler ve XP.
- `/games`, `/games/:gameKey`: Günlük bilgi, kelime bulmaca ve sıralama oyunları; puan ve ödüller sunucudan alınır.
- `/settings`: Açık/koyu/cihaz teması, Türkçe/İngilizce arayüz, bildirim ve kurulum tercihleri.
- `/subscription`, `/support`: Satın alma durumu ve mağaza yönetim bağlantıları; destek talebi oluşturma ve yanıtları okuma.
- `/account`: Profil, çıkış ve şifre/onay gerektiren gerçek hesap silme.

## Kayıt ve gizlilik davranışı

Namaz, oruç, tesbih, günlük, hedef, aile, arkadaş, oyun ve hatim kayıtları mevcut sunucuda tutulur. Aynı hesapla bağımsız oturumlardan okunabilir. Dua favorileri ve Kur’an yer imleri **bu tarayıcıdaki hesaba özeldir**; mobil cihazla bulut üzerinden eşitlenmez. Tema ve dil tarayıcı tercihidir.

Başarısız okuma işlemleri boş bir kayıt gibi kaydedilmez. Başarısız yazmalarda başarı mesajı gösterilmez. Hesap silme `/api/account` uç noktasında JWT ve mevcut şifreyle doğrulanır; kullanıcı, ibadet kayıtları, günlük, destek talepleri, yedekler, sosyal ilişkiler ve oyun verileri tek MongoDB transaction'ında silinir. Replica set veya sharded MongoDB gerekir. Mağaza aboneliği iptali mağazada yapılır.

API'nin eski uç noktaları mobildeki gibi kullanıcı kimliği, yeni uç noktaları JWT bekler. Bu uyumluluk `src/services/api.js` içinde korunur.

## Web bildirimleri ve PWA

Üretim çıktısı servis çalışanını kaydeder; arayüz JS/CSS dosyaları ve genel uygulama kabuğu önbelleğe alınır. Özel API yanıtları önbelleğe alınmaz. Çevrimdışı açılışta bağlantı durumu gösterilir; sunucu kayıtlarını okumak/yazmak internet gerektirir. Geliştirme sunucusunda PWA kaydı yapılmaz; `npm run build` çıktısıyla kontrol edilir.

Backend'de `web-push` ve 30 saniyelik zamanlayıcı, kullanıcının saat diliminde 10 dakika önce/vakit hatırlatmaları gönderir. Beş vaktin mesajı farklıdır. Gönderilen hatırlatmalar abonelik üzerinde kalıcı anahtarla işaretlenerek tekrar gönderim engellenir. Son 90 saniyelik pencere dışındaki kaçırılmış hatırlatmalar topluca gönderilmez. Tarayıcı/işletim sistemi teslim süresini etkileyebilir.

Kalıcı sunucu anahtarlarını bir kez oluştur:

```sh
cd ../prayer
npm run web:push-keys
```

Oluşturulan `.env.web-push.local` içindeki `WEB_PUSH_SUBJECT`, `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` değerlerini hosting ortamına aktar ve aynı anahtarları koru. HTTPS, çalışan API süreci ve tarayıcı izni gerekir. iPhone/iPad'de siteyi ana ekrana ekleyip oradan açmak gerekir ([WebKit açıklaması](https://webkit.org/blog/13878/)). Anahtarlar yoksa arayüz bunu açıkça gösterir. Çıkışta bu tarayıcının push aboneliği kapatılır.

## Doğrulama

```sh
CI=true npm test -- --watchAll=false --runInBand
CI=true npm run build
```

```sh
cd ../prayer
npm run web:test
# Yerel MongoDB çalışırken; üretim veritabanı kullanılamaz:
npm run web:test:integration
```

İstemci testleri hata durumları, veri kaybını önleme, hesap onayı, tercih değişimi ve favori ayrımını kapsar. API entegrasyonu ayrı `prayer_web_integration` veritabanında kayıt/giriş, bağımsız oturumlarda ortak kayıt okuma, raporlar, günlük, arkadaş akışı/sıralaması, push tekrar kontrolü ve hesap silme/rollback senaryolarını çalıştırır.

## Yayınlama

`build/` statik hosting'e, `prayer/` değişiklikleri mevcut API sunucusuna dağıtılmalıdır. SPA yolları `index.html` dosyasına yönlendirilmeli; `sw.js` ve `index.html` için yeniden doğrulama, hash'li `/static/` dosyaları için uzun önbellek kullanılmalıdır. Derleme sonrası script servis çalışanının sürümünü paket hash'ine bağlar.

Bu çalışma canlı sunucuya yayınlanmadı. Üretimde yeni API rotaları, MongoDB transaction desteği ve kalıcı VAPID ortam değişkenleri birlikte dağıtılmalıdır.
