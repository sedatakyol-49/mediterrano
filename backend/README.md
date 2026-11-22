# Mediterrano CMS — kurulum ve çalışma

Angular 20, PHP 8.3+ ve MariaDB için hazırlanmış küçük bir içerik yönetim sistemi.

## Klasörler

```text
backend/             Özel PHP kodu, şema ve ilk kurulum verileri
public/api/          HTTP API giriş noktası
public/uploads/      Kullanıcıların yüklediği fotoğraflar
src/app/pages/admin/ Angular yönetim paneli
scripts/             Yerel geliştirme, test ve IONOS paketleme
```

Ürünler, kategoriler, sayfalar ve işletme ayarları `cms_documents` tablosunda sürümlü JSON belgeleri olarak tutulur. `draft` ve `published` kayıtları ayrıdır. Bu restoran kataloğu için seçilen belge modeli, tüm menünün tek işlemle yayınlanmasını sağlar. Ürün/kategori kimlikleri kalıcıdır. Kullanıcılar, medya kayıtları ve istek sınırları kendi tablolarındadır. Fiyatlar tam sayı kuruş olarak saklanır. Dosyaların kendisi veritabanında tutulmaz.

## Yerelde başlatma

Node bağımlılıkları kurulu değilse `npm ci` çalıştırın. PHP 8.3+ gereklidir. `PHP_BIN` ile farklı bir PHP çalıştırılabilir dosyası seçilebilir. Yerel yardımcı, Windows PHP kurulumunda bulunan PDO SQLite, PDO MySQL, GD ve Fileinfo uzantılarını yalnızca başlattığı işlem için etkinleştirir.

İlk terminalde:

```sh
npm run api
```

Bu komut `.local/config.php`, `.local/cms.sqlite` ve `.local/public` oluşturur. Başlangıç ürünleri ve mevcut fotoğraflar aktarılır. Tekrar çalıştırmak düzenlenmiş içerikleri sıfırlamaz. Yerel SMTP alanları boştur, gerçek e-posta gönderimi için özel yerel ayar gerekir.

İkinci terminalde:

```sh
npm run admin:create
npm start
```

Yönetici e-posta adresi ve gizli girilen şifre istenir. Varsayılan yönetici hesabı yoktur. Şifre 12–72 bayt olmalıdır. Aynı e-posta ile yeniden çalıştırıldığında ilgili hesabın şifresi güncellenir. Panel `http://localhost:4200/admin` adresindedir. Angular `/api`, `/uploads` ve `/contact.php` isteklerini `127.0.0.1:8081` üzerindeki PHP servisine yönlendirir.

## Panel kullanımı

- Ürün ekleme, düzenleme, kaldırma, gizleme ve sıralama.
- Sabit fiyat, kişi başı, ağırlığa göre veya fiyatı sorunuz seçenekleri.
- Kategori yönetimi. İçinde ürün bulunan kategori kaldırılmadan önce ürünler taşınmalıdır.
- Mevcut fotoğraf arşivinden seçim ve JPG/PNG/WebP yükleme. En fazla 8 MB ve 20 megapiksel kabul edilir. Fotoğraf en uzun kenarı 2000 piksel olacak şekilde WebP'ye dönüştürülür. Fotoğrafın üründen kaldırılması dosyayı silmez.
- Ürün üzerindeki ana sayfa seçimleriyle öneriler, feinkost seçkisi ve kahvaltı fiyatlarını yönetme.
- Ana sayfa ve menü başlıkları, görselleri ve metinlerini düzenleme.
- Hakkımızda ve yasal sayfalar için HTML içerik düzenleme ve fotoğraf ekleme. Angular'ın standart HTML sanitizasyonu aktiftir. Script ve Angular template ifadeleri çalıştırılmaz.
- Adres, iletişim, saatler, sosyal medya, logo ve footer ayarları.
- Sayfa başlığı ve SEO açıklaması.

`Entwurf speichern` taslağı kaydeder. `Vorschau` taslağı kaydedip yönetici oturumu ile yeni sekmede açar. `Veröffentlichen` kaydedilen belgeyi atomik olarak yayına taşır. Başka bir sekmede daha yeni sürüm kaydedilmişse eski sürümle kayıt 409 yanıtı alır. Paneldeki `Exportieren`, düzenlenmekte olan içeriği JSON olarak indirir. Bu dışa aktarım fotoğraf dosyalarını ve yönetici hesaplarını içermez.

Önizleme başlangıç sayfası `/?preview=1` adresindedir. Alt sayfalara normal Angular gezinmesi aynı taslak verisini kullanır. Alt sayfayı doğrudan yeniden açarken `?preview=1` ekleyin. Taslak API'si yönetici oturumu gerektirir.

## IONOS paketi

```sh
npm run package:ionos
```

Çıktı:

```text
deploy/
  backend/
  public/
    index.html
    api/index.php
    assets/
    uploads/.htaccess
    contact.php
    .htaccess
```

1. `deploy` içeriğini IONOS web alanındaki uygulama klasörüne yükleyin.
2. Domain belge kökünü uygulamanın **public** klasörüne yönlendirin. `backend` bunun yanında kalmalıdır.
3. Sunucuda `backend/config.example.php` dosyasını `backend/config.local.php` olarak kopyalayın. Veritabanı şifresini ve SMTP bilgilerini sunucuda doldurun. Örnek DSN ve kullanıcı, paylaşılan IONOS veritabanı ekranındaki değerlere göre hazırlanmıştır.
4. `public_dir` gerçek public klasörünü göstermelidir. Varsayılan kardeş klasör düzeni doğrudur.
5. PHP 8.3+ için PDO MySQL, GD (WebP destekli) ve Fileinfo etkin olmalıdır. Yükleme için `upload_max_filesize=8M`, `post_max_size=10M` veya daha yüksek sınırlar kullanın. `public/uploads` PHP tarafından yazılabilir olmalıdır.
6. HTTPS kullanın ve `secure_cookies` değerini `true` bırakın.

### SSH ile ilk kurulum

Uygulama klasöründe, hostingde PHP 8.3+ sağlayan CLI komutuyla çalıştırın:

```sh
php backend/install.php
```

Bu işlem tabloları kurar, başlangıç içeriğini ve medya arşivini aktarır. Var olan taslak/yayın belgelerini değiştirmez.

`backend/admin-user.php` standart girdiden `{"email":"...","password":"..."}` nesnesi alır. Şifreyi shell komut satırına yazmadan bu script'e aktarın. Alternatif olarak aşağıdaki phpMyAdmin yöntemi yönetici hesabını da oluşturur.

### SSH olmadan phpMyAdmin ile ilk kurulum

Kendi bilgisayarınızda:

```sh
npm run setup:ionos-sql
```

Yönetici e-postası ve gizli şifre girişi sonrasında `.local/ionos-install.sql` hazırlanır. Dosyada yalnızca şifre hash'i vardır. IONOS phpMyAdmin'de doğru veritabanını seçip bu dosyayı içe aktarın. Tablolar, 57 ürün kaydı ve mevcut fotoğraf arşivi ile ilk yönetici oluşturulur. Script mevcut içerik veya yönetici şifresinin üzerine yazmaz. SQL dosyasını herkese açık bir klasöre yüklemeyin.

### Canlı doğrulama

- `/api/index.php?action=content` JSON ve 200 döndürmeli.
- Oturumsuz `/api/index.php?action=draft` 401 döndürmeli.
- `/admin` üzerinden yönetici girişi yapılabilmeli.
- Bir taslak fiyat değişikliği, yayınlamadan genel sayfada görünmemeli.
- Görsel yükleme ve ardından yayınlama denenmeli.
- `/produkte`, `/ueber-uns` ve `/admin` doğrudan açılabilmeli.
- `backend/config.local.php` HTTP üzerinden erişilememeli.
- SMTP ayarları tamamlandıktan sonra iletişim formu gerçek alıcıyla doğrulanmalı.

Güncelleme yüklerken **sunucudaki uploads klasörünü, config.local.php dosyasını ve veritabanını koruyun**. Paketleme bunları yedeklemez. Veritabanı dışa aktarımını ve uploads klasörünü birlikte yedekleyin. Kod güncellemeleri için tekrar ilk kurulum SQL'si aktarmak gerekmez.

## Güvenlik ve sınırlar

Yönetici şifreleri `password_hash` ile saklanır. Oturum çerezi HttpOnly ve SameSite=Strict kullanır. Yazma işlemleri CSRF token gerektirir. Giriş denemeleri IP ve hesap bazında sınırlandırılır. Her API yönetim işlemi sunucuda oturum denetiminden geçer. Ürün ve kategori ilişkileri, fiyatlar ve fotoğraf yolları kayıttan önce doğrulanır.

İletişim formunun kaynak dosyasındaki mevcut SMTP şifresi özel, Git tarafından yok sayılan `backend/config.local.php` dosyasına taşınmıştır. Daha önce kaynakta bulunan şifreyi IONOS'ta yenileyin. Eski Git geçmişindeki şifre bu değişiklikle silinmiş olmaz. Özel config dosyası dağıtım paketine dahil edilmez.

API henüz kurulmadığında veya erişilemediğinde ziyaretçi arayüzü derlemeyle gelen başlangıç içeriğini gösterir. Speisekarte sayfasında fiyatların yerinde teyit edilmesini isteyen durum mesajı görünür. Panel API hatasını gösterir ve kaydı başarılı gibi sunmaz. Üretimde API erişimini izleyin, çünkü başlangıç içeriği en son yayınlanan verinin yedeği değildir.

İlk sürümde tek düzey yönetici yetkisi vardır. Kullanıcı yönetimi CLI üzerinden yapılır. Genel sayfalar için içerik ve SEO Angular tarafından tarayıcıda uygulanır, sunucuda HTML render edilmez. İletişim e-postasının alıcı adresi, paneldeki ziyaretçi iletişim e-postasından ayrı olarak özel SMTP yapılandırmasında yönetilir.

## Doğrulama

### Müşteri teklif talepleri ve hukuki sayfalar

- **Betriebsdaten → Rechtliche Angaben** bölümünden Impressum, Datenschutz ve AGB düzenlenir. Bunlar **Seiten & SEO** ile aynı kayıtlardır; taslak kaydetme ve yayınlama akışı korunur. Hukuki metinler otomatik üretilmez.
- `/angebot-anfragen` sayfasında müşteri yayınlanmış ürünlerden paket oluşturur. Miktarlar istek miktarlarıdır; ağırlıklı ürünlerde gramaj müşteriyle ayrıca netleştirilir. Sunucu ürün adı, fotoğraf ve fiyatını yayınlanmış katalogdan alır. Formun gönderilmesi sipariş veya bağlayıcı teklif değildir.
- Talepler `cms_documents` içinde ayrı `inq-*` kayıtlarında tutulur; yeniden SQL importu gerekmez. **Kundenanfragen** menüsü talep, müşteri bilgileri, durum, dahili notlar ve e-posta durumunu gösterir. Kayıtlar genel içerik API'sine dahil edilmez. Yönetici yazmaları CSRF ve sürüm kontrolü kullanır; anonim form da oturum CSRF tokenı gerektirir. IP başına saatte beş yeni gönderim denemesi sınırı vardır. Aynı formun ağ hatası nedeniyle yeniden gönderilmesi aynı kayıt anahtarıyla tekrar edilir.
- Önce talep kalıcı olarak kaydedilir, sonra SMTP bildirimi denenir. `backend/config.local.php` içindeki mevcut `smtp` bölümünün `host`, `port`, `user`, `password`, `from`, `to` alanları kullanılır. Alıcı adresi public site e-posta alanından bağımsızdır. SMTP kurulmamışsa veya gönderim başarısızsa kayıt korunur; admin sonucu gösterir ve tekrar gönderme düğmesi sunar. `accepted` yalnızca SMTP sunucusunun mesajı kabul ettiğini belirtir, teslimat garantisi değildir. Sunucu kesilirse `pending` kalabilir; yönetici listeden yeniden deneyebilir. Canlı SMTP gerçek alıcıyla ayrıca doğrulanmalıdır.
- WhatsApp otomatik bildirim değildir: müşteri başarılı kayıt sonrası hazır mesaj bağlantısına basar ve WhatsApp'ta kendisi gönderir. İşletme numarası **Betriebsdaten → WhatsApp** alanına ülke koduyla girilip yayınlanır (örnek `+491701234567`). Numara boşsa bağlantı gösterilmez; sabit hat numarası otomatik varsayılmaz. API anahtarı gerekmez.
- Dağıtımda yeni `backend/inquiries.php` ve `backend/mail.php` dosyaları, değişen `backend/content.php`, `public/api/index.php` ve `public/contact.php` birlikte aktarılmalıdır. Önce backend, sonra public PHP ve JS/CSS, son olarak `index.html` yüklenir. Özel config, uploads ve veritabanı korunur. Yeni yasal sayfalar ve talep formu mobil/masaüstü tarayıcıda ayrıca gözden geçirilmelidir.

### İşletme yönetimi

Admin panelindeki **Etiketten & Druck**, **Angebote** ve **Personal & Zeiten** bölümleri, `cms_documents` tablosundaki ayrı `operations` kaydında tutulur. `/api/index.php?action=operations` yalnızca yönetici oturumuyla erişilebilir; PUT için CSRF ve sürüm kontrolü gerekir. Bu veriler yayınlanan web sitesi JSON'una veya başlangıç içeriğine eklenmez. İlk yönetici erişiminde boş kayıt oluşturulur; mevcut kurulum için yeniden SQL importu gerekmez. Bütün mevcut yöneticiler bu bölümlere erişebilir.

- Etiketler web ürünlerinden alınabilir veya bağımsız oluşturulabilir. Kaydedilen etiket fiyatı daha sonra ürün değişince kendiliğinden değişmez; yeniden aktar düğmesi vardır. A4 ölçüleri milimetre olarak ayarlanır. Önizleme taşan metin veya yüklenemeyen görsel varsa baskıyı engeller. Yazıcıda %100 ölçek kullanılmalı ve ilk baskı normal kâğıtta ölçülmelidir. İçerik, alerjen, MHD ve parti verileri kullanıcı tarafından girilir; örnek Mango etiketine son kullanma tarihi varsayılmaz.
- Teklif numarası ilk kayıtta sunucu tarafından verilir ve sonraki kayıtlarda korunur. Kalemler fiyatın net/brüt yorumuna göre kuruş düzeyinde yuvarlanır; vergi oranı kullanıcı seçimine bırakılır. PDF, tarayıcıdaki yazdır/ PDF kaydet işleviyle oluşturulur. Dahili notlar müşteri belgesine girmez. E-posta gönderimi yapılmaz; gönderildi durumu manuel kayıttır. Excel örneğindeki 35 kişilik kalemlerin toplamı 842,91 €; birimler kaynakta açık olmadığından örnekte “Einheit” olarak bırakılır.
- Personel ve plan/gerçekleşen saatler ayrı tutulur. Saatler Europe/Berlin'e göre hesaplanır. Gece vardiyasında bitiş tarihi ayrıca girilir; ay filtresi başlangıç ayına göre çalışır. Aynı kişi ve türde çakışan kayıt, eksik personel, ters zaman aralığı ve vardiyadan uzun mola reddedilir. Sonbahardaki tekrarlanan saatler ayrıca kontrol edilmelidir. Bu bölüm bordro veya çalışan giriş sistemi değildir. CSV dışa aktarımı geçerli filtreye göre yapılır.

Dağıtımda **backend/operations.php** de yüklenmelidir. Önce backend ve public/api, ardından yeni JS/CSS dosyaları, son olarak public/index.html aktarılmalıdır. Yapılandırma, uploads ve mevcut veritabanı korunur.

```sh
npm run test:api
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

Entegrasyon testi geçici SQLite veritabanı ve rastgele yönetici şifresiyle PHP API'sini gerçek HTTP istekleri üzerinden sınar. Kurulumun tekrar çalışması, oturum, CSRF, yetki, fiyat/ilişki/yol doğrulama, taslak izolasyonu, sürüm çakışması, görsel yükleme, yayınlama, gizli kategoriler, çıkış ve giriş sınırlaması kapsanır. Test verileri temizlenir. Canlı MariaDB, IONOS dosya izinleri ve SMTP ayrıca sunucuda doğrulanmalıdır.
