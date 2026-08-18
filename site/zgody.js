// ZabieramyTo — baner zgody na cookies + Google Consent Mode v2
//
// WAŻNE: ten plik musi być wczytany SYNCHRONICZNIE (bez async/defer)
// i BEZPOŚREDNIO PRZED snippetem GTM w sekcji <head>.
// Ustawia domyślną odmowę, zanim jakikolwiek tag zdąży zapisać cookie.
//
// Ponowne otwarcie ustawień z dowolnego miejsca:  ZTZgody.otworz()

(function () {
  'use strict';

  var KLUCZ = 'zt_zgody';
  var WERSJA = 1;   // podnieś, gdy zmienią się kategorie — użytkownicy zostaną zapytani ponownie

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // ---------- pamięć wyboru ----------

  function odczytaj() {
    try {
      var s = window.localStorage.getItem(KLUCZ);
      if (!s) return null;
      var o = JSON.parse(s);
      return (o && o.wersja === WERSJA) ? o : null;
    } catch (e) { return null; }
  }

  function zapisz(analityka, marketing) {
    try {
      window.localStorage.setItem(KLUCZ, JSON.stringify({
        wersja: WERSJA,
        analityka: !!analityka,
        marketing: !!marketing,
        data: new Date().toISOString()
      }));
    } catch (e) { /* tryb prywatny — wybór zadziała do końca sesji */ }
  }

  // ---------- sygnały Consent Mode v2 ----------

  function sygnaly(analityka, marketing) {
    return {
      analytics_storage:       analityka ? 'granted' : 'denied',
      ad_storage:              marketing ? 'granted' : 'denied',
      ad_user_data:            marketing ? 'granted' : 'denied',
      ad_personalization:      marketing ? 'granted' : 'denied',
      functionality_storage:   'granted',
      personalization_storage: 'granted',
      security_storage:        'granted'
    };
  }

  // ---------- 1. domyślna odmowa (wykonuje się przed GTM) ----------

  var zapisane = odczytaj();

  gtag('consent', 'default', {
    analytics_storage:       'denied',
    ad_storage:              'denied',
    ad_user_data:            'denied',
    ad_personalization:      'denied',
    functionality_storage:   'granted',
    personalization_storage: 'granted',
    security_storage:        'granted',
    wait_for_update:         500
  });

  // ---------- 2. odtworzenie wcześniejszego wyboru ----------

  if (zapisane) {
    gtag('consent', 'update', sygnaly(zapisane.analityka, zapisane.marketing));
    window.dataLayer.push({ event: 'zgody_wczytane' });
  }

  function zatwierdz(analityka, marketing) {
    zapisz(analityka, marketing);
    gtag('consent', 'update', sygnaly(analityka, marketing));
    window.dataLayer.push({
      event: 'zgody_zapisane',
      zgoda_analityka: !!analityka,
      zgoda_marketing: !!marketing
    });
    zamknij();
  }

  // ---------- 3. interfejs ----------

  var STYLE = [
    '.zt-zgody{position:fixed;left:0;right:0;bottom:0;z-index:9999;',
    'background:var(--bg-dark,#132a42);color:var(--cream,#f0ece1);',
    'border-top:2px solid var(--orange,#e8811f);',
    'font-family:var(--font-body,system-ui,sans-serif);',
    'box-shadow:0 -6px 24px rgba(0,0,0,.28)}',
    '.zt-zgody__inner{max-width:1120px;margin:0 auto;padding:20px 24px;',
    'display:flex;gap:20px;align-items:center;flex-wrap:wrap}',
    '.zt-zgody__tekst{flex:1 1 340px;font-size:14px;line-height:1.6;margin:0}',
    '.zt-zgody__tekst a{color:var(--orange,#e8811f);text-decoration:underline}',
    '.zt-zgody__akcje{display:flex;gap:10px;flex-wrap:wrap}',
    '.zt-zgody__btn{font:inherit;font-size:14px;font-weight:600;cursor:pointer;',
    'padding:11px 20px;border-radius:8px;border:1px solid transparent;white-space:nowrap}',
    '.zt-zgody__btn--tak{background:var(--orange,#e8811f);color:#fff}',
    '.zt-zgody__btn--nie{background:var(--orange,#e8811f);color:#fff}',
    '.zt-zgody__btn--ust{background:transparent;color:var(--cream,#f0ece1);',
    'border-color:var(--stone,#9aa7b5)}',
    '.zt-zgody__btn:hover{filter:brightness(1.1)}',
    '.zt-zgody__btn:focus-visible{outline:3px solid #fff;outline-offset:2px}',
    '.zt-zgody__panel{border-top:1px solid var(--stone-dark,#2c4a65);',
    'max-width:1120px;margin:0 auto;padding:4px 24px 22px}',
    '.zt-zgody__poz{display:flex;gap:12px;align-items:flex-start;padding:14px 0;',
    'border-bottom:1px solid var(--stone-dark,#2c4a65)}',
    '.zt-zgody__poz:last-of-type{border-bottom:0}',
    '.zt-zgody__poz input{width:20px;height:20px;margin-top:2px;flex:none;accent-color:var(--orange,#e8811f)}',
    '.zt-zgody__poz label{font-size:14px;font-weight:600;cursor:pointer}',
    '.zt-zgody__poz p{margin:3px 0 0;font-size:13px;line-height:1.55;color:var(--stone,#9aa7b5)}',
    '.zt-zgody__poz--stala label{cursor:default}',
    '@media (max-width:640px){',
    '.zt-zgody__inner{padding:16px;gap:14px}',
    '.zt-zgody__akcje{width:100%}',
    '.zt-zgody__btn{flex:1 1 auto;text-align:center}}',
    '@media (prefers-reduced-motion:no-preference){',
    '.zt-zgody{animation:ztWjazd .28s ease-out}',
    '@keyframes ztWjazd{from{transform:translateY(100%)}to{transform:none}}}'
  ].join('');

  var box = null;

  function zamknij() {
    if (box && box.parentNode) box.parentNode.removeChild(box);
    box = null;
    document.removeEventListener('keydown', naEscape);
  }

  function naEscape(e) {
    if (e.key === 'Escape') zamknij();
  }

  function pozycja(id, tytul, opis, zaznaczone, zablokowane) {
    return '<div class="zt-zgody__poz' + (zablokowane ? ' zt-zgody__poz--stala' : '') + '">' +
      '<input type="checkbox" id="' + id + '"' +
        (zaznaczone ? ' checked' : '') + (zablokowane ? ' disabled' : '') + '>' +
      '<div><label for="' + id + '">' + tytul + '</label><p>' + opis + '</p></div>' +
    '</div>';
  }

  function pokaz(odRazuUstawienia) {
    if (box) return;

    if (!document.getElementById('zt-zgody-style')) {
      var st = document.createElement('style');
      st.id = 'zt-zgody-style';
      st.textContent = STYLE;
      document.head.appendChild(st);
    }

    var zap = odczytaj() || { analityka: false, marketing: false };

    box = document.createElement('div');
    box.className = 'zt-zgody';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'false');
    box.setAttribute('aria-label', 'Ustawienia plików cookies');
    box.innerHTML =
      '<div class="zt-zgody__inner">' +
        '<p class="zt-zgody__tekst">Używamy plików cookies, żeby sprawdzać, jak korzystacie ze strony, ' +
        'i mierzyć skuteczność naszych reklam. Możesz to przyjąć albo odrzucić — strona działa tak samo. ' +
        'Szczegóły opisaliśmy w <a href="/polityka-prywatnosci">polityce prywatności</a>.</p>' +
        '<div class="zt-zgody__akcje">' +
          '<button type="button" class="zt-zgody__btn zt-zgody__btn--tak" id="zt-tak">Akceptuj wszystkie</button>' +
          '<button type="button" class="zt-zgody__btn zt-zgody__btn--nie" id="zt-nie">Odrzuć wszystkie</button>' +
          '<button type="button" class="zt-zgody__btn zt-zgody__btn--ust" id="zt-ust">Ustawienia</button>' +
        '</div>' +
      '</div>' +
      '<div class="zt-zgody__panel" id="zt-panel" hidden>' +
        pozycja('zt-nieodzowne', 'Niezbędne',
          'Konieczne do działania strony i zapamiętania Twojego wyboru. Nie da się ich wyłączyć.', true, true) +
        pozycja('zt-analityka', 'Analityczne',
          'Google Analytics — liczba odwiedzin, oglądane podstrony, źródło wejścia. Nie poznajemy Twojej tożsamości.',
          zap.analityka, false) +
        pozycja('zt-marketing', 'Marketingowe',
          'Google Ads — sprawdzamy, które reklamy prowadzą do kontaktu, i możemy wyświetlać Ci nasze reklamy na innych stronach.',
          zap.marketing, false) +
        '<div class="zt-zgody__akcje" style="margin-top:16px">' +
          '<button type="button" class="zt-zgody__btn zt-zgody__btn--tak" id="zt-zapisz">Zapisz wybór</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(box);

    var panel = box.querySelector('#zt-panel');

    box.querySelector('#zt-tak').addEventListener('click', function () { zatwierdz(true, true); });
    box.querySelector('#zt-nie').addEventListener('click', function () { zatwierdz(false, false); });
    box.querySelector('#zt-ust').addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      this.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
      if (!panel.hidden) box.querySelector('#zt-analityka').focus();
    });
    box.querySelector('#zt-zapisz').addEventListener('click', function () {
      zatwierdz(box.querySelector('#zt-analityka').checked,
                box.querySelector('#zt-marketing').checked);
    });

    if (odRazuUstawienia) {
      panel.hidden = false;
      box.querySelector('#zt-ust').setAttribute('aria-expanded', 'true');
    }

    document.addEventListener('keydown', naEscape);
  }

  // ---------- 4. start ----------

  function start() {
    if (!odczytaj()) pokaz(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // ponowne otwarcie — np. z linku „Ustawienia cookies" w stopce
  window.ZTZgody = {
    otworz: function () { zamknij(); pokaz(true); },
    stan: odczytaj
  };

})();
