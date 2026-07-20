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
site/
├── index.html                 # home page
├── uslugi.html                # services & pricing
├── polityka-prywatnosci.html  # privacy policy
├── script.js                  # UI behaviors + form configuration
├── style.css                  # design tokens + styles
├── sitemap.xml
└── images/
```

## Form configuration

EmailJS keys are not versioned — `site/script.js` contains placeholders
(`PODMIEN_SERVICE_ID`, etc.) that must be replaced with your own values
from an [EmailJS](https://www.emailjs.com/) account before deployment.

---

Built as a client project. Source published for portfolio purposes.
