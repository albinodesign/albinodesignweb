<!-- AlbinoDesign Website – Agenten-Handbuch -->

Dieses Dokument enthält alle relevanten Informationen, die ein KI-Coding-Agent benötigt, um im AlbinoDesign-Projekt effektiv arbeiten zu können.

---

## Projekt-Übersicht

Die AlbinoDesign-Website ist eine **deutschsprachige Landingpage** für AlbinoDesign – einen Webdesign-Dienstleister aus Krefeld, der sich auf moderne Handwerker-Websites spezialisiert hat. Die Seite dient der Lead-Generierung über ein mehrstufiges Kontaktformular.

**Live-Domain:** `https://albinodesign.de/`

**Projekttyp:** Astro v6.3.1 mit statischem Export (`output: 'static'`).

**Hinweis:** Die `README.md` im Projekt-Root ist noch das Standard-Template aus `npm create astro@latest -- --template minimal` und wurde bisher nicht projektspezifisch angepasst. Als verlässliche Quelle gilt dieses `AGENTS.md`.

---

## Technologie-Stack

| Bereich | Technologie | Version / Details |
|---------|-------------|-------------------|
| Framework | [Astro](https://astro.build/) | v6.3.1 |
| Ausgabe-Modus | Statisch | `output: 'static'` in `astro.config.mjs` |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | v3.4.19 |
| Post-Processing | PostCSS + Autoprefixer + cssnano | konfiguriert in `postcss.config.js` |
| Sprache | TypeScript | strict, erweitert `astro/tsconfigs/strict` |
| Laufzeit | Node.js | ≥ 22.12.0 (lokal aktuell v22.22.3) |
| Bildoptimierung | Sharp | via `astro:assets` konfiguriert, aktuell aber nicht aktiv für `public/images/` genutzt |
| Formular-Backend | [Web3Forms](https://web3forms.com/) | AJAX-Submit an `https://api.web3forms.com/submit` |
| Hosting / Deploy | Vercel | `vercel.json` + Vercel Git-Integration |

**Wichtig:** Es gibt **kein Frontend-Framework** wie React, Vue oder Svelte. Alle interaktiven Elemente werden mit Vanilla JS in `public/scripts/` realisiert.

---

## Projektstruktur

```
/
├── public/                    # Statische Assets (werden 1:1 kopiert)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── manifest.json          # Web-App-Manifest (Theme-Color, Icons)
│   ├── robots.txt             # Erlaubt alle Crawler, verweist auf Sitemap
│   ├── sitemap.xml            # Manuelle Sitemap für Google
│   ├── og-image.jpg           # Open-Graph-Vorschaubild
│   ├── scripts/               # Client-seitige JavaScript-Dateien
│   │   ├── cookie-consent.js  # Cookie-Banner + Google Consent Mode v2 + GTM-Aktivierung
│   │   └── form.js            # Multi-Step-Formular + GCLID-Tracking + AJAX-Submit
│   ├── images/                # Optimierte WebP-Bilder (direkte Verwendung per <img>)
│   │   ├── portrait.webp
│   │   ├── ubermich.webp
│   │   ├── mockup1.webp
│   │   ├── mockup2.webp
│   │   └── mockup3.webp
│   └── fonts/                 # Selbst-gehostete Inter (WOFF2)
│       ├── Inter-Regular.woff2
│       ├── Inter-Medium.woff2
│       ├── Inter-SemiBold.woff2
│       └── Inter-Bold.woff2
├── src/
│   ├── pages/                 # Astro-Routen (Datei-basiert)
│   │   ├── index.astro        # Landingpage (Hauptseite)
│   │   ├── datenschutz.astro  # Datenschutzerklärung (DSGVO)
│   │   ├── impressum.astro    # Impressum (TMG)
│   │   └── 404.astro          # Fehlerseite (noindex)
│   ├── layouts/
│   │   └── Layout.astro       # Basis-Layout mit SEO, Cookie-Banner, Fonts, Critical CSS, JSON-LD
│   ├── components/
│   │   ├── Button.astro       # Wiederverwendbarer CTA-Button (href/type/variant/size)
│   │   ├── Card.astro         # Container-Komponente mit optionalem Hover-Effekt
│   │   ├── Footer.astro       # Seitenfuß mit rechtlichen Links und Cookie-Einstellungen
│   │   └── Header.astro       # Kopfzeile mit Logo-Link (nur auf Unterseiten)
│   └── styles/
│       └── global.css         # Tailwind-Direktiven, CSS-Variablen, @font-face, text-balance
├── .vscode/
│   ├── extensions.json        # Empfiehlt "astro-build.astro-vscode"
│   └── launch.json            # Debug-Konfiguration für "astro dev"
├── .kimi/
│   └── plans/                 # Implementierungspläne für abgeschlossene/zukünftige Features
│       ├── form-step4-update.md       # Plan: Step-4-Titel + E-Mail-Pflichtfeld (umgesetzt)
│       ├── gtm-dsgvo-integration.md   # Plan für GTM-Integration (umgesetzt)
│       └── ga4-gtag-integration.md    # Plan für GA4-Integration (empfohlen: über GTM-Dashboard)
├── scripts/                   # Leer – Projekt-root-Script-Verzeichnis (nicht in Verwendung)
├── astro.config.mjs
├── tailwind.config.mjs
├── postcss.config.js
├── vercel.json                # Vercel Build-Konfiguration + Security-Headers
├── tsconfig.json
└── package.json
```

> **Hinweis:** Alle Bilder liegen unter `public/images/`; es gibt kein `src/assets/`-Verzeichnis. Das Verzeichnis `scripts/` auf Projekt-Root-Ebene ist aktuell leer. Client-seitige JavaScript-Dateien befinden sich ausschließlich unter `public/scripts/`.

---

## Build- und Test-Befehle

```bash
# Entwicklungsserver starten (localhost:4321)
npm run dev

# Produktions-Build (statisch nach ./dist/)
npm run build

# Build lokal previewen (via npx serve dist)
npm run preview

# Astro CLI-Befehle
npm run astro -- [command]
```

**Deployment:** Das Deployment läuft über die Vercel Git-Integration. Das `deploy`-Script in `package.json` gibt nur einen Hinweis aus.

**Wichtig:** Vor jedem Deploy muss ein lokaler Build und Preview durchgeführt werden (`npm run build && npm run preview`), um sicherzustellen, dass die statische Ausgabe fehlerfrei ist.

**Test-Setup:** Das Projekt verfügt aktuell **über kein automatisiertes Test-Setup** (kein Jest, Vitest, Playwright, Cypress o.ä.). Alle Tests werden manuell durchgeführt (siehe Abschnitt „Teststrategie").

---

## Code-Style-Guidelines

### Sprache & Inhalt
- **Alle Nutzer-Inhalte sind auf Deutsch.** HTML-Attribut: `lang="de"`.
- Meta-Daten, Open Graph und strukturierte Texte sind ebenfalls deutsch.
- Komponenten-Props und Variablennamen können deutsch sein (z. B. `gewerk`, `ziel`, `website_vorhanden`).

### Styling
- **Tailwind CSS** ist das einzige Styling-Framework.
- CSS-Variablen für das Farbschema sind in `src/styles/global.css` definiert:
  - `--color-primary: #0f172a`
  - `--color-secondary: #1e293b`
  - `--color-accent: #fa7315`
  - `--color-accent-hover: #e0600e`
  - `--color-dark: #020617`
  - `--color-light: #f8fafc`
  - `--color-muted: #475569`
- Die `tailwind.config.mjs` erweitert das Theme um diese Farben als `primary`, `secondary`, `accent`, `dark`, `light`, `muted`.
- Schriftart: **Inter** (selbst-gehostet aus `public/fonts/`, geladen mit `font-display: swap`).
- Wichtige Utility-Klasse: `text-balance` (für bessere Typografie bei Überschriften, via `@layer utilities` in `global.css`).
- Touch-Optimierung: `min-h-[56px]` und `touch-manipulation` auf interaktiven Elementen.
- Moderne CSS-Features werden verwendet, z. B. `has-[:checked]` für Radio-Button-Styles.

### Astro-Komponenten
- Komponenten verwenden TypeScript-Interfaces für Props (z. B. `export interface Props { ... }`).
- Tailwind-Klassen werden direkt im Markup verwendet.
- Inline-Scripts werden mit `<script src="..." is:inline defer></script>` eingebunden.

### Bilder
- Alle Bilder werden aktuell über **direkte `<img>`-Tags** mit Pfaden aus `public/images/` eingebunden (WebP-Formate).
- `loading="eager"` und `fetchpriority="high"` werden nur für Above-the-Fold-Bilder (Portrait im Hero) verwendet.
- Es gibt kein `src/assets/`-Verzeichnis; alle Bilder liegen unter `public/images/` und `public/`.

---

## Komponenten-Architektur

### `Layout.astro`
Zentrales Layout für alle Seiten. Verantwortlich für:
- HTML-Grundgerüst (`lang="de"`)
- SEO-Meta-Tags, Open Graph, Twitter Card, Canonical URL
- Preloading der Inter-Font-Dateien
- Google Tag Manager (blockiert via `type="text/plain"`)
- Cookie-Banner (Bottom-Banner mit Akzeptieren/Ablehnen)
- Skip-Link („Zum Inhalt springen")
- JSON-LD-Slot (`<slot name="head" />`)

Props:
- `title`, `description`, `ogImage`, `robots`

### `Button.astro`
Wiederverwendbarer Button/Link.
- Props: `href`, `type`, `variant` (`primary` | `secondary` | `outline`), `size` (`default` | `large`), `class`, `id`
- Rendert `<a>` wenn `href` gesetzt, sonst `<button>`.

### `Card.astro`
Container-Komponente mit weißem Hintergrund, Schatten und abgerundeten Ecken.
- Props: `class`, `hover` (bool)

### `Header.astro`
Einfache Kopfzeile mit Logo-Link. Wird nur auf Unterseiten (`datenschutz`, `impressum`, `404`) verwendet.

### `Footer.astro`
Seitenfuß mit Copyright, rechtlichen Links und Button zum erneuten Öffnen des Cookie-Banners.

---

## Client-seitige Logik

Astro verwendet `<script src="...">` für externe JavaScript-Dateien, die direkt im HTML eingebunden werden. Es gibt kein Frontend-Framework.

### `public/scripts/cookie-consent.js`
- Speichert die Cookie-Entscheidung im `localStorage` unter dem Key `albino_cookie_consent`.
- Implementiert Google Consent Mode v2 (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`).
- Standard-Consent: `denied`.
- Nach Einwilligung: GTM wird aktiviert und Consent auf `granted` gesetzt.
- GTM-Lazy-Load: Aktivierung bei erster Nutzerinteraktion (`scroll`, `mousemove`, `touchstart`, `keydown`) oder spätestens nach 3,5 Sekunden.
- Stellt globale Hilfsfunktionen bereit: `window.getCookieConsent()`, `window.setCookieConsent()`, `window.hasCookieConsent()`, `window.showCookieBanner()`.
- Migriert alte Consent-Formate (`{ value: boolean }` oder Raw-String `"true"`/`"false"`) in das aktuelle Format `{ necessary: true, analytics: boolean, date: string }`.

### `public/scripts/form.js`
- **GCLID-Tracking:** Liest `?gclid=` aus der URL, speichert es in einem Hidden-Formularfeld sowie in `localStorage` unter `albino_gclid` mit Timestamp unter `albino_gclid_ts` (max. 90 Tage Haltbarkeit).
- **Multi-Step-Formular:** 4 Schritte mit client-seitiger Validierung und AJAX-Submit an Web3Forms.

---

## Formular-Logik (CRO-Herzstück)

Das Kontaktformular auf der Startseite ist ein **4-stufiges Multi-Step-Formular**, das via AJAX an Web3Forms gesendet wird:

1. **Schritt 1:** Gewerk auswählen (Radio-Buttons: Sanitär & Heizung, Elektro, Dachdecker, Maler, Sonstiges)
2. **Schritt 2:** Hauptziel auswählen (Radio-Buttons: Neue lukrative Aufträge, Fachkräfte & Azubis, Professioneller Internet-Auftritt)
3. **Schritt 3:** Bestehende Website? (Ja/Nein)
4. **Schritt 4:** Kontaktdaten (Name, E-Mail, Telefon) + Datenschutz-Checkbox

**Sicherheitsmerkmale:**
- Honeypot-Feld (`botcheck`, versteckte Checkbox) zur Spam-Abwehr.
- Client-seitige Validierung vor jedem Schritt-Wechsel und vor dem Absenden.
- E-Mail-Validierung via Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- GCLID-Tracking für Google Ads Conversion-Zuordnung (Hidden-Field + localStorage, 90 Tage Haltbarkeit).
- Submit-Timeout von 10 Sekunden via `AbortController`.

**Barrierefreiheit & UX:**
- Fokus-Management: Beim Schritt-Wechsel wird der Fokus auf die Überschrift (`legend` oder `h3`) des neuen Schritts gesetzt.
- Auf Mobilgeräten wird automatisch zum Formularanfang gescrollt.
- Fortschritts-Indikator mit 4 visuellen Punkten.
- **No-JS-Fallback:** Wenn JavaScript deaktiviert ist, werden alle Schritte sichtbar und das Formular wird als normales HTML-Formular abgesendet.

Bei erfolgreicher Übermittlung wird das Formular ausgeblendet und eine Erfolgsmeldung angezeigt. Bei Fehlern wird eine Fehlermeldung mit Telefonnummer eingeblendet und der Submit-Button reaktiviert.

---

## SEO & Barrierefreiheit

- Jede Seite nutzt das `Layout.astro` mit individuellem `title` und `description`.
- Open Graph und Twitter Card Meta-Tags sind vorhanden.
- Canonical URL wird aus `Astro.url.pathname` und `https://albinodesign.de/` generiert.
- **JSON-LD Structured Data:** `LocalBusiness`-Schema auf der Startseite (Name, Adresse, Telefon, E-Mail, Gründer).
- Semantisches HTML (`<section>`, `<header>`, `<footer>`, `<main>`, `<article>`).
- ARIA-Attribute werden konsequent verwendet (`aria-label`, `aria-labelledby`, `role`, `aria-live`, `aria-invalid`, `aria-describedby`).
- Touch-Optimierung: `min-h-[56px]` und `touch-manipulation` auf interaktiven Elementen.
- Inter-Font wird mit `preload` für Regular, Medium, SemiBold und Bold im `<head>` vorgeladen.
- `scroll-behavior: smooth` für Anker-Navigation.
- `prefers-reduced-motion` wird für Fade-In-Animationen berücksichtigt.
- Skip-Link („Zum Inhalt springen") ist im Layout vorhanden.

---

## Umgebungsvariablen

Die `.env`-Datei ist **nicht im Git-Repository** enthalten (`.gitignore`).

| Variable | Zweck |
|----------|-------|
| `PUBLIC_WEB3FORMS_KEY` | API-Schlüssel für das Kontaktformular (Web3Forms). Muss mit `PUBLIC_`-Präfix definiert werden, damit Astro ihn an den Client durchreicht. |

> **Hinweis:** Beim Hinzufügen neuer env-Variablen das `PUBLIC_`-Präfix verwenden, wenn sie im Frontend benötigt werden. Ohne Präfix sind sie nur server-seitig verfügbar.

---

## Security-Headers (Vercel)

Die Datei `vercel.json` definiert folgende HTTP-Security-Header für alle Routen:

| Header | Wert |
|--------|------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` |

> **Wichtig:** Aktuell ist **kein Content-Security-Policy (CSP)** definiert. Bei der Hinzufügung einer CSP müssen Verbindungen zu `https://api.web3forms.com`, Google-Domains für GTM und Inline-Scripts/Styles berücksichtigt werden.
>
> Hinweis: Die Security-Header werden über `vercel.json` für Vercel konfiguriert. Beim Wechsel zu einem anderen Hosting-Provider müssen sie dort neu hinterlegt werden.

---

## Rechtliche Seiten (DSGVO / TMG)

- **`/datenschutz`** – Vollständige Datenschutzerklärung mit Angaben zu Web3Forms, Google Ads/GCLID, Server-Log-Dateien, Google Tag Manager, Cookie-Hinweis und Vercel als Hosting-Provider.
- **`/impressum`** – Impressum mit Kontaktdaten (AlbinoDesign, Albin Salihu, De-Greiff-Straße 229, 47803 Krefeld), USt-ID (DE357374586) und Haftungsausschluss.
- **`/404`** – Fehlerseite mit "Zurück zur Startseite"-Link, `robots="noindex, follow"`.

> **Wichtig:** Änderungen an Kontaktdaten oder rechtlichen Texten müssen auf **allen drei Seiten** (Startseite Footer, Datenschutz, Impressum) synchron gehalten werden.

---

## Teststrategie

Das Projekt verfügt aktuell **über kein automatisiertes Test-Setup** (kein Jest, Vitest, Playwright o.ä.).

**Manuelle Tests, die vor jedem Deploy durchgeführt werden sollten:**
1. Formular komplett durchklicken (alle 4 Schritte) und absenden – Erfolgsmeldung prüfen.
2. Mobile Ansicht prüfen (Touch-Targets, Scroll-Verhalten im Formular).
3. Cookie-Banner: Annehmen / Ablehnen und Seiten-Reload testen.
4. GCLID-Tracking: URL mit `?gclid=test123` aufrufen und Hidden-Field prüfen.
5. Build lokal previewen (`npm run build && npm run preview`) vor jedem Deploy.
6. No-JS-Fallback testen: JavaScript im Browser deaktivieren und prüfen, ob das Formular als Einzelseite funktioniert.
7. Security-Header prüfen (z. B. via `curl -I` auf der deployeden URL).

---

## Sicherheitshinweise

- Die `.env`-Datei enthält den Web3Forms-API-Key und darf **niemals committet** werden.
- Keine Tracking-Cookies ohne explizite Zustimmung (Cookie-Banner mit Google Consent Mode v2).
- Das Honeypot-Feld im Formular darf nicht entfernt werden.
- `botcheck` ist eine per CSS versteckte Checkbox – Spam-Bots füllen sie oft aus, was zur Blockierung führt.
- GTM lädt erst nach aktiver Cookie-Einwilligung. Der GTM-Code ist in `Layout.astro` mit `type="text/plain"` blockiert und wird erst durch `public/scripts/cookie-consent.js` aktiviert.

---

## Deployment

- Ausgabeordner: `./dist/` (reiner Static-Site-Export).
- Hosting erfolgt über **Vercel**.
- In der Datenschutzerklärung wird explizit **Vercel** als Hosting-Provider erwähnt.
- Der Build-Prozess ist für Sharp-Bildoptimierung konfiguriert; die aktuell genutzten Bilder liegen jedoch bereits als WebP in `public/images/` und werden direkt per `<img>` eingebunden.
- `vercel.json` wird von Vercel als Quelle für HTTP-Header verwendet.
- `public/sitemap.xml` und `public/robots.txt` sind manuell gepflegt und müssen bei neuen Seiten aktualisiert werden.
- Deploy läuft über die Vercel Git-Integration. Das `deploy`-Script in `package.json` gibt nur einen Hinweis aus.

---

## VS Code Einrichtung

- Empfohlene Erweiterung: `astro-build.astro-vscode` (siehe `.vscode/extensions.json`).
- Debug-Konfiguration für den Entwicklungsserver ist in `.vscode/launch.json` hinterlegt.

---

## Feature-Pläne

Implementierungspläne für abgeschlossene und zukünftige Features liegen im Verzeichnis `.kimi/plans/`:

- **`form-step4-update.md`** – Plan für die Änderung des Step-4-Titels und die Pflicht-E-Mail im Formular (bereits umgesetzt).
- **`gtm-dsgvo-integration.md`** – Plan für die DSGVO-konforme GTM-Integration (bereits umgesetzt).
- **`ga4-gtag-integration.md`** – Plan für GA4-Integration (empfohlen: Konfiguration über GTM-Dashboard statt direkter Code-Integration).
