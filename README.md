# ZabieramyTo — company website

A business-card website for a service company based in Poznań, Poland (apartment
clearouts, moving services, furniture removal, tiled stove demolition).

**Live site: [zabieramyto.pl](https://zabieramyto.pl)**

## Tech stack

- Plain HTML / CSS / JavaScript — no framework, no build step
- Hosting: Cloudflare Pages (deploys the contents of the `site/` folder)
- Contact form: EmailJS + WhatsApp integration
- Analytics: Google Tag Manager + GA4 (loaded on the production domain only)

## Features

- Responsive, mobile-first design
- Project gallery with a before/after slider and lightbox
- Quote request form with photo attachment
- Animated counters in the trust section
- SEO: canonical tags, Open Graph, sitemap, clean URLs

## Structure

```
site/                          # deployed by Cloudflare Pages
├── index.html                 # home page
├── uslugi.html                # services & pricing
├── polityka-prywatnosci.html  # privacy policy
├── script.js                  # UI behaviors + form configuration
├── style.css                  # design tokens + styles
├── sitemap.xml
└── images/                    # only images actually referenced by the pages

zrodla/                        # NOT deployed — source material
└── nieuzywane/                # superseded duplicates (kept for reference)
```

### `zrodla/` — source images

Original, unedited photos from completed jobs. They are deliberately kept
outside `site/` so Cloudflare does not deploy them.

These originals are **larger and uncropped** compared to the versions on the
site, which were cropped to fit the layout — for example
`opróżnianie strychu.jpeg` is 1536×1024 while the deployed
`oproznianie-strychu-przed.jpg` is 1200×400. Use `zrodla/` as the starting
point for any new crop, a redesign, or social media material.

`zrodla/nieuzywane/` holds files superseded by lighter formats (`logo.png` →
`logo.webp`, raster maps → `mapa-wielkopolska.svg`). Nothing references them;
they are kept only so nothing is lost.

## Form configuration

EmailJS keys are not versioned — `site/script.js` contains placeholders
(`PODMIEN_SERVICE_ID`, etc.) that must be replaced with your own values
from an [EmailJS](https://www.emailjs.com/) account before deployment.

---

Built as a client project. Source published for portfolio purposes.
