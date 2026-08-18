# ZabieramyTo — company website

A business-card website for a service company based in Poznań, Poland (apartment
clearouts, moving services, furniture removal, tiled stove demolition).

**Live site: [zabieramyto.pl](https://zabieramyto.pl)**

## Tech stack

- Plain HTML / CSS / JavaScript — no framework, no build step
- Hosting: Cloudflare (static assets), custom domain `zabieramyto.pl`
- Contact form: WhatsApp hand-off (EmailJS wired up but not configured — see below)
- Measurement: Google Tag Manager, GA4 and Google Ads, loaded on the production
  domain only and gated behind a cookie consent banner

## Features

- Responsive, mobile-first design
- Project gallery with a before/after slider and lightbox
- Quote request form with photo attachment
- Animated counters in the trust section
- Cookie consent banner with Google Consent Mode v2
- SEO: canonical tags, Open Graph, sitemap, clean URLs

## Structure

```
site/                          # everything that gets deployed
├── index.html                 # home page
├── uslugi.html                # services & pricing
├── polityka-prywatnosci.html  # privacy policy
├── zgody.js                   # cookie consent banner + Consent Mode v2
├── script.js                  # UI behaviors + form handling
├── style.css                  # design tokens + styles
├── sitemap.xml
└── images/                    # only images actually referenced by the pages
```

Source photos used to live in `zrodla/`. They were removed — nothing in the
project referenced them. If uncropped originals are ever needed again (a
redesign, a different aspect ratio, social media), they are still in the git
history: `git checkout bd7a431 -- zrodla/`.

## Consent and measurement

`zgody.js` **must be loaded synchronously, before the GTM snippet**, on every
page. It sets Consent Mode v2 defaults to `denied`, so no analytics or
advertising identifiers are stored until the visitor agrees. After a choice is
made it sends a `consent update` and remembers the decision in `localStorage`
under `zt_zgody`.

Bump the `WERSJA` constant at the top of the file whenever the consent
categories change — visitors will then be asked again.

To reopen the settings from anywhere: `ZTZgody.otworz()`. The footer link on
each page uses exactly that.

The Google tag for this site is consolidated under the Google Ads ID
`AW-17742216287`; the GA4 property `G-L9D2X3SK4G` is configured as one of its
destinations. Loading the GA4 ID on its own returns 404 — the Ads ID is the
correct one, and it is what GA4's own "Install manually" instructions provide.

## Form configuration

The form hands the enquiry over to WhatsApp: it builds a prefilled message and
opens it in the visitor's own WhatsApp account.

EmailJS is wired up as an optional second channel but **not configured** —
`site/script.js` still holds the placeholders (`PODMIEN_SERVICE_ID` and
friends). The code detects this and silently skips the email path, so the form
works without it. Replace the three values with your own from an
[EmailJS](https://www.emailjs.com/) account to enable it, and update section 3
and 6 of the privacy policy to mention the extra data processor.

## Deployment

`site/` is deployed to Cloudflare. Production is **not** connected to this
repository — deployments are made manually from the Cloudflare dashboard, so
pushing to `main` does not update the live site on its own.

---

Built as a client project. Source published for portfolio purposes.
