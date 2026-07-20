# ZabieramyTo — strona firmowa

Strona-wizytówka dla firmy usługowej z Poznania (opróżnianie mieszkań, przeprowadzki,
wywóz mebli, rozbiórki pieców kaflowych).

**Strona na żywo: [zabieramyto.pl](https://zabieramyto.pl)**

## Technologia

- Czysty HTML / CSS / JavaScript — bez frameworka i bez systemu budowania
- Hosting: Cloudflare Pages (deploy zawartości folderu `site/`)
- Formularz kontaktowy: EmailJS + integracja z WhatsApp
- Analityka: Google Tag Manager + GA4

## Funkcje

- Responsywny design (mobile-first)
- Galeria realizacji z suwakiem „przed / po" i lightboxem
- Formularz wyceny z możliwością załączenia zdjęcia
- Animowane liczniki w sekcji zaufania
- SEO: canonical, Open Graph, sitemap, czyste adresy URL

## Struktura

```
site/
├── index.html                 # strona główna
├── uslugi.html                # oferta i cennik
├── polityka-prywatnosci.html
├── script.js                  # zachowania UI + konfiguracja formularza
├── style.css                  # design tokens + style
├── sitemap.xml
└── images/
```

## Konfiguracja formularza

Klucze EmailJS nie są wersjonowane — w `site/script.js` znajdują się placeholdery
(`PODMIEN_SERVICE_ID` itd.), które przed wdrożeniem należy podmienić na własne wartości
z konta [EmailJS](https://www.emailjs.com/).

---

Projekt zrealizowany na zamówienie klienta. Kod udostępniony w celach portfolio.
