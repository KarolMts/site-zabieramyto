// ZabieramyTo — zachowania interfejsu

// ============================================
// KONFIGURACJA — PODMIEŃ na właściwe dane
// ============================================
const CONFIG = {
  // Numer WhatsApp odbierający zgłoszenia, format międzynarodowy BEZ "+" i spacji
  whatsappNumber: '48727193543',

  // Adres e-mail odbierający zgłoszenia (wstrzykiwany do ukrytego pola "to_email" w formularzu)
  recipientEmail: 'kontakt@zabieramyto.pl',

  // EmailJS — załóż darmowe konto na https://www.emailjs.com/
  // i podmień poniższe 3 wartości (Service ID, Template ID, Public Key)
  emailjs: {
    serviceId: 'PODMIEN_SERVICE_ID',
    templateId: 'PODMIEN_TEMPLATE_ID',
    publicKey: 'PODMIEN_PUBLIC_KEY',
  },
};
// ============================================
// FUNKCJE DODATKOWE — żeby wyłączyć funkcję, zmień true na false
// ============================================
var FEATURES = {
  suwakPrzedPo: true,   // suwak przed/po w galerii (pary oznaczone data-suwak w index.html)
  lightbox: true,       // powiększanie zdjęć galerii na pełnym ekranie po kliknięciu
  liczbyOdZera: true,   // liczby w sekcji zaufania "nabijają się" przy przewinięciu
  heroIlustracja: false, // ilustracja ekipy z kanapą w nagłówku strony (wyłączona)
};
// ============================================

// W szablonie EmailJS użyj zmiennych: {{imie}}, {{telefon}}, {{uslugi}}
// oraz w polu "To Email" szablonu wpisz {{to_email}} (przekazywane z ukrytego pola formularza).
// Dodaj też załącznik plikowy powiązany z polem formularza "zdjecie"
// (EmailJS: Template > Attachments > "Add attachment" > wybierz zmienną formularza).
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Nagłówek: logo kurczy się, pasek telefonu rośnie przy scrollu ----------
  var header = document.querySelector('.header');
  var topbar = document.querySelector('.topbar');
  var SCROLL_THRESHOLD = 40;

  function syncTopbarHeight() {
    var topbarH = topbar ? topbar.getBoundingClientRect().height : 0;
    var headerH = header ? header.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--topbar-height', topbarH + 'px');
    // + mały margines, żeby tytuł sekcji nie stykał się od razu z krawędzią nagłówka
    document.documentElement.style.setProperty('--header-offset', (topbarH + headerH + 16) + 'px');
  }

  function updateHeaderOnScroll() {
    var scrolled = window.scrollY > SCROLL_THRESHOLD;
    document.body.classList.toggle('is-scrolled', scrolled);
    if (header) header.classList.toggle('header--scrolled', scrolled);
    // wysokość paska telefonu i nagłówka zmienia się przy scrollu — dopasuj offsety
    syncTopbarHeight();
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  window.addEventListener('resize', syncTopbarHeight);
  window.addEventListener('load', syncTopbarHeight); // przelicz po doładowaniu czcionek/obrazków
  updateHeaderOnScroll();

  // ---------- Menu mobilne (hamburger) ----------
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Scroll reveal: elementy płynnie wjeżdżają przy przewijaniu ----------
  var motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionOk && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.section__title, .card, .step, .opinia, .galeria__temat, .cennik__intro, .cennik__item, .cennik__cta, .zaufanie__item, .faq__item, .o-nas__inner, .piece__inner, .kontakt__inner'
    );
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    // kaskada: kolejne elementy tej samej siatki wjeżdżają z lekkim opóźnieniem
    revealTargets.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (s) {
        return s.classList.contains('reveal');
      });
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
    });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---------- Galeria: zdjęcie "przed" nabiera koloru po najechaniu / dotknięciu ----------
  // (przełącznik kliknięciem tylko, gdy lightbox jest wyłączony — inaczej kliknięcie otwiera podgląd)
  if (!FEATURES.lightbox) {
    document.querySelectorAll('.galeria__item--przed').forEach(function (item) {
      item.addEventListener('click', function () { item.classList.toggle('show-color'); });
    });
  }

  // ---------- Ilustracja hero ----------
  if (FEATURES.heroIlustracja) {
    var heroEl = document.querySelector('.hero');
    if (heroEl) heroEl.classList.add('hero--ilustracja');
  }

  // ---------- Suwak przed/po w galerii (pionowy: "przed" u góry, "po" na dole) ----------
  if (FEATURES.suwakPrzedPo) {
    document.querySelectorAll('.galeria__para[data-suwak]').forEach(function (para) {
      var przedImg = para.querySelector('.galeria__item--przed img');
      var poImg = para.querySelector('.galeria__item--po img');
      if (!przedImg || !poImg) return;

      var suwak = document.createElement('div');
      suwak.className = 'suwak suwak--pion';
      suwak.innerHTML =
        '<img class="suwak__po" src="' + poImg.src + '" alt="' + poImg.alt + '">' +
        '<div class="suwak__przed"><img src="' + przedImg.src + '" alt="' + przedImg.alt + '"></div>' +
        '<div class="suwak__uchwyt" aria-hidden="true"><span></span></div>' +
        '<span class="suwak__label suwak__label--przed">Przed</span>' +
        '<span class="suwak__label suwak__label--po">Po</span>';

      para.classList.add('galeria__para--suwak');
      para.innerHTML = '';
      para.appendChild(suwak);

      var przedWarstwa = suwak.querySelector('.suwak__przed');
      var uchwyt = suwak.querySelector('.suwak__uchwyt');

      function ustaw(procent) {
        procent = Math.max(0, Math.min(100, procent));
        przedWarstwa.style.height = procent + '%';
        uchwyt.style.top = procent + '%';
      }
      ustaw(50);

      function naPozycje(clientY) {
        var r = suwak.getBoundingClientRect();
        ustaw(((clientY - r.top) / r.height) * 100);
      }
      var drag = false;
      suwak.addEventListener('pointerdown', function (e) {
        drag = true;
        suwak.setPointerCapture(e.pointerId);
        naPozycje(e.clientY);
      });
      suwak.addEventListener('pointermove', function (e) { if (drag) naPozycje(e.clientY); });
      suwak.addEventListener('pointerup', function () { drag = false; });
      suwak.addEventListener('pointercancel', function () { drag = false; });
    });
  }

  // ---------- Lightbox galerii ----------
  if (FEATURES.lightbox) {
    var zdjecia = Array.prototype.slice.call(document.querySelectorAll('.galeria__item img'));
    if (zdjecia.length) {
      var lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.hidden = true;
      lb.innerHTML =
        '<button type="button" class="lightbox__zamknij" aria-label="Zamknij podgląd">&times;</button>' +
        '<button type="button" class="lightbox__strzalka lightbox__strzalka--lewa" aria-label="Poprzednie zdjęcie">&#8249;</button>' +
        '<img class="lightbox__foto" alt="">' +
        '<button type="button" class="lightbox__strzalka lightbox__strzalka--prawa" aria-label="Następne zdjęcie">&#8250;</button>';
      document.body.appendChild(lb);

      var lbFoto = lb.querySelector('.lightbox__foto');
      var aktualny = 0;

      function pokaz(i) {
        aktualny = (i + zdjecia.length) % zdjecia.length;
        lbFoto.src = zdjecia[aktualny].src;
        lbFoto.alt = zdjecia[aktualny].alt;
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
      }
      function zamknijLb() {
        lb.hidden = true;
        document.body.style.overflow = '';
      }

      zdjecia.forEach(function (img, i) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () { pokaz(i); });
      });
      lb.querySelector('.lightbox__zamknij').addEventListener('click', zamknijLb);
      lb.querySelector('.lightbox__strzalka--lewa').addEventListener('click', function () { pokaz(aktualny - 1); });
      lb.querySelector('.lightbox__strzalka--prawa').addEventListener('click', function () { pokaz(aktualny + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) zamknijLb(); });
      document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') zamknijLb();
        if (e.key === 'ArrowLeft') pokaz(aktualny - 1);
        if (e.key === 'ArrowRight') pokaz(aktualny + 1);
      });
    }
  }

  // ---------- Nabijające się liczby w sekcji zaufania ----------
  if (FEATURES.liczbyOdZera && motionOk && 'IntersectionObserver' in window) {
    document.querySelectorAll('.zaufanie__num').forEach(function (el) {
      var m = el.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!m) return; // element bez liczby zostaje bez animacji
      var cel = parseFloat(m[1]);
      var miejsca = (m[1].split('.')[1] || '').length; // obsługa np. "4.9"
      var sufiks = m[2];
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(el);
          var start = null;
          var czas = 1400;
          function krok(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / czas, 1);
            p = 1 - Math.pow(1 - p, 3); // wolniejszy koniec
            el.textContent = (cel * p).toFixed(miejsca) + sufiks;
            if (p < 1) requestAnimationFrame(krok);
          }
          requestAnimationFrame(krok);
        });
      }, { threshold: 0.4 });
      obs.observe(el);
    });
  }

  // ---------- Rok w stopce ----------
  var rokEl = document.getElementById('rok');
  if (rokEl) rokEl.textContent = new Date().getFullYear();

  // ---------- Adres e-mail do ukrytego pola formularza ----------
  var toEmailField = document.getElementById('to_email');
  if (toEmailField) toEmailField.value = CONFIG.recipientEmail;

  // ---------- Linki WhatsApp (pasek górny + stopka) — ten sam numer co w formularzu ----------
  var waLink = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent('Cześć! Chciałbym/chciałabym zapytać o wycenę.');
  ['topbar-wa', 'footer-wa', 'mobile-cta-wa'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = waLink;
  });

  // ---------- EmailJS init ----------
  if (window.emailjs && CONFIG.emailjs.publicKey) {
    emailjs.init(CONFIG.emailjs.publicKey);
  }

  // ---------- Formularz wyceny ----------
  var form = document.getElementById('wycena-form');

  // Formularz jest ukryty — pokazują go kliknięcia w "Bezpłatna wycena" (boczna zakładka)
  // oraz "Wypełnij formularz" (sekcja kontakt)
  document.querySelectorAll('.js-pokaz-formularz').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!form) return;
      e.preventDefault();
      form.hidden = false;
      form.scrollIntoView({ behavior: motionOk ? 'smooth' : 'auto', block: 'center' });
      setTimeout(function () {
        var imieEl = document.getElementById('imie');
        if (imieEl) imieEl.focus({ preventScroll: true });
      }, 650);
    });
  });
  // Wejście z podstrony usług linkiem "index.html#formularz" — od razu otwórz formularz
  if (form && location.hash === '#formularz') {
    form.hidden = false;
    setTimeout(function () {
      form.scrollIntoView({ behavior: motionOk ? 'smooth' : 'auto', block: 'center' });
    }, 150);
  }

  var status = document.getElementById('form-status');
  var fileInput = document.getElementById('zdjecie');
  var photoDrop = document.getElementById('photo-drop');
  var pickBtn = document.getElementById('photo-pick-btn');
  var previewWrap = document.getElementById('photo-preview-wrap');
  var previewImg = document.getElementById('photo-preview');
  var removeBtn = document.getElementById('photo-remove');

  function showPreview(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewWrap.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    fileInput.value = '';
    previewImg.src = '';
    previewWrap.hidden = true;
  }

  if (pickBtn && fileInput) {
    pickBtn.addEventListener('click', function () {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) {
        showPreview(fileInput.files[0]);
      }
    });
  }

  // Wklejanie zdjęcia ze schowka (Ctrl+V) — działa, gdy pole ma fokus
  if (photoDrop && fileInput) {
    photoDrop.addEventListener('paste', function (e) {
      var items = (e.clipboardData || window.clipboardData).items;
      if (!items) return;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          var blob = items[i].getAsFile();
          var namedFile = new File([blob], 'zdjecie-wklejone.png', { type: blob.type });
          // Wstrzykujemy plik do prawdziwego <input type="file">,
          // żeby wysyłka (EmailJS sendForm) traktowała go tak samo jak wybrany z dysku/aparatu.
          var dt = new DataTransfer();
          dt.items.add(namedFile);
          fileInput.files = dt.files;
          showPreview(namedFile);
          e.preventDefault();
          break;
        }
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', clearPhoto);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Uzupełnij poprawnie wszystkie wymagane pola.';
        return;
      }

      var uslugiZaznaczone = Array.prototype.map.call(
        form.querySelectorAll('input[name="uslugi"]:checked'),
        function (c) { return c.value; }
      );
      if (uslugiZaznaczone.length === 0) {
        status.textContent = 'Zaznacz przynajmniej jedną usługę.';
        return;
      }

      var imie = document.getElementById('imie').value.trim();
      var telefon = document.getElementById('telefon').value.trim();
      var opis = uslugiZaznaczone.join(', ');
      var maZdjecie = fileInput && fileInput.files && fileInput.files.length > 0;
      var photoFile = maZdjecie ? fileInput.files[0] : null;

      status.textContent = 'Wysyłanie...';

      var waText = 'Zapytanie o wycenę ze strony ZabieramyTo:\n'
        + 'Imię: ' + imie + '\n'
        + 'Telefon: ' + telefon + '\n'
        + 'Usługi: ' + opis;

      function openWaLink(noteSuffix) {
        var waUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(waText + (noteSuffix || ''));
        window.open(waUrl, '_blank');
      }

      // ---------- 2) Email w tle (bonus — działa dopiero po uzupełnieniu danych EmailJS) ----------
      var emailReady = window.emailjs
        && CONFIG.emailjs.serviceId.indexOf('PODMIEN') === -1
        && CONFIG.emailjs.templateId.indexOf('PODMIEN') === -1
        && CONFIG.emailjs.publicKey.indexOf('PODMIEN') === -1;
      if (emailReady) {
        emailjs.sendForm(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, form)
          .catch(function (err) { console.error('EmailJS error:', err); });
      }

      // ---------- 1) WhatsApp — główny kanał zgłoszenia (razem ze zdjęciem, jeśli dodane) ----------
      var canShareFile = photoFile
        && window.navigator && navigator.share && navigator.canShare
        && navigator.canShare({ files: [photoFile] });

      if (canShareFile) {
        // Telefon: otwiera natywne okno "Udostępnij" ze zdjęciem — klient wybiera tam WhatsApp
        navigator.share({
          files: [photoFile],
          title: 'Zapytanie o wycenę — ZabieramyTo',
          text: waText,
        }).then(function () {
          status.textContent = 'Gotowe! W oknie udostępniania wybierz WhatsApp, żeby wysłać zgłoszenie razem ze zdjęciem.';
          form.reset();
          clearPhoto();
        }).catch(function () {
          // anulowane albo niewspierane — zapasowo otwórz zwykły czat z prośbą o ręczne dołączenie zdjęcia
          openWaLink('\n\n(Dodałem/-am zdjęcie w formularzu — dołączam je tutaj ręcznie.)');
          status.textContent = 'WhatsApp otworzył się w nowej karcie — dołącz tam zdjęcie ręcznie i wyślij wiadomość.';
          form.reset();
          clearPhoto();
        });
      } else {
        // Komputer / brak wsparcia Web Share z plikami — zwykły link tekstowy
        openWaLink(maZdjecie ? '\n\n(Dodałem/-am zdjęcie w formularzu — dołączam je tutaj ręcznie.)' : '');
        status.textContent = maZdjecie
          ? 'WhatsApp otworzył się w nowej karcie — dołącz tam zdjęcie ręcznie i wyślij wiadomość.'
          : 'WhatsApp otworzył się w nowej karcie — potwierdź tam wysyłkę.';
        form.reset();
        clearPhoto();
      }
    });
  }
});
