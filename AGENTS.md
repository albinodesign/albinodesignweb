# AlbinoDesign Website – Agenten-Handbuch

Dieses Dokument enthält alle relevanten Informationen, die ein KI-Coding-Agent benötigt, um im AlbinoDesign-Projekt effektiv arbeiten zu können.

---

## Projekt-Übersicht

Die AlbinoDesign-Website ist eine **deutschsprachige Landingpage** für AlbinoDesign – einen Webdesign-Dienstleister aus Krefeld, der sich auf Premium-Websites für Handwerkerbetriebe spezialisiert hat. Die Seite dient der Lead-Generierung über ein mehrstufiges Kontaktformular.

**Live-Domain:** `https://albinodesign.de/`

---

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Framework | [Astro](https://astro.build/) v6.3.1 |
| Ausgabe-Modus | Statisch (`output: 'static'`) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3.4.19 |
| Post-Processing | PostCSS + Autoprefixer |
| Sprache | TypeScript (strict, erweitert `astro/tsconfigs/strict`) |
| Laufzeit | Node.js ≥ 22.12.0 (definiert in `package.json` unter `engines`) |
| Bildoptimierung | Sharp (via `astro:assets`, konfiguriert in `astro.config.mjs`) |
| Formular-Backend | [Web3Forms](https://web3forms.com/) |
| Hosting | Cloudflare Pages (explizit in Datenschutzerklärung genannt) |

---

## Projektstruktur

```
/
├── public/                    # Statische Assets (nicht verarbeitet)
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── manifest.json          # Web-App-Manifest (Theme-Color, Icons)
│   ├── robots.txt             # Erlaubt alle Crawler, verweist auf Sitemap
│   ├── sitemap.xml            # Manuelle Sitemap für Google
│   ├── og-image.jpg           # Open-Graph-Vorschaubild
│   ├── _headers               # Cloudflare Pages Security-Headers (CSP, X-Frame-Options, etc.)
│   └── fonts/                 # Inter Schriftarten (WOFF2, selbst-gehostet)
│       ├── Inter-Regular.woff2
│       ├── Inter-Medium.woff2
│       ├── Inter-SemiBold.woff2
│       └── Inter-Bold.woff2
├── src/
│   ├── pages/                 # Astro-Routen
│   │   ├── index.astro        # Landingpage (Hauptseite)
│   │   ├── datenschutz.astro  # Datenschutzerklärung (DSGVO)
│   │   ├── impressum.astro    # Impressum (TMG)
│   │   └── 404.astro          # Fehlerseite (noindex)
│   ├── layouts/
│   │   └── Layout.astro       # Basis-Layout mit SEO, Cookie-Banner, Fonts, Critical CSS, JSON-LD
│   ├── components/
│   │   ├── Button.astro       # Wiederverwendbarer CTA-Button (href/type/variant/size)
│   │   └── Card.astro         # Container-Komponente mit optionalem Hover-Effekt
│   ├── styles/
│   │   └── global.css         # Tailwind-Direktiven, CSS-Variablen, @font-face, text-balance
│   └── assets/                # Optimierte Bilder (via astro:assets / <Image />)
│       ├── portrait.jpeg      # Hero-Portrait (Albin Salihu)
│       ├── ubermich.jpeg      # Über-mich-Bereich
│       ├── mockup1-3.png      # Portfolio-Mockups (Handy-Rahmen)
│       └── review1-2.jpg      # Kundenbewertungs-Avatare
├── scripts/
│   └── generate-placeholders.mjs  # Node.js-Script mit Sharp zur Erstellung von Platzhalter-Bildern
├── .vscode/
│   ├── extensions.json        # Empfiehlt "astro-build.astro-vscode"
│   └── launch.json            # Debug-Konfiguration für "astro dev"
├── astro.config.mjs
├── tailwind.config.mjs
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Build- und Test-Befehle

```bash
# Entwicklungsserver starten (localhost:4321)
npm run dev

# Produktions-Build (statisch nach ./dist/)
npm run build

# Build lokal previewen
npm run preview

# Astro CLI-Befehle
npm run astro -- [command]
```

**Wichtig:** Vor jedem Deploy muss ein lokaler Build und Preview durchgeführt werden (`npm run build && npm run preview`), um sicherzustellen, dass die statische Ausgabe fehlerfrei ist.

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
  - `--color-accent: #f97316`
  - `--color-accent-hover: #ea580c`
  - `--color-dark: #020617`
  - `--color-light: #f8fafc`
  - `--color-muted: #64748b`
- Die `tailwind.config.mjs` erweitert das Theme um diese Farben als `primary`, `secondary`, `accent`, `dark`, `light`, `muted`.
- Schriftart: **Inter** (selbst-gehostet aus `public/fonts/`, geladen mit `font-display: swap`).
- Wichtige Utility-Klasse: `text-balance` (für bessere Typografie bei Überschriften, via `@layer utilities` in `global.css`).
- Touch-Optimierung: `min-h-[56px]` und `touch-manipulation` auf interaktiven Elementen.
- Moderne CSS-Features werden verwendet, z. B. `has-[:checked]` für Radio-Button-Styles.

### Bilder
- Alle Bilder werden über `astro:assets` und die `<Image />`-Komponente eingebunden.
- `loading="eager"` und `fetchpriority="high"` werden nur für Above-the-Fold-Bilder (Portrait im Hero) verwendet.
- Assets liegen unter `src/assets/` und werden von Astro automatisch optimiert (via Sharp-Service, konfiguriert in `astro.config.mjs`).
- Niedrig-aufgelöste Platzhalter können bei Bedarf mit `scripts/generate-placeholders.mjs` (Sharp + SVG) generiert werden. Das Script ist nicht in `package.json` eingebunden und muss bei Bedarf manuell ausgeführt werden.

### Client-seitige Logik
- Astro verwendet `script is:inline` für Inline-JavaScript, das direkt im HTML ausgeführt wird.
- Es gibt **kein Frontend-Framework** wie React oder Vue – alles ist Vanilla JS innerhalb von `<script is:inline>`.
- Wichtige Skripte im Projekt:
  1. **Cookie-Consent-Banner** (`Layout.astro`) – speichert Zustimmung in `localStorage` unter `albino_cookie_consent`.
  2. **GCLID-Tracking** (`index.astro`) – liest `?gclid=` aus der URL, speichert es in einem Hidden-Formularfeld sowie in `localStorage` unter `albino_gclid`.
  3. **Multi-Step-Formular** (`index.astro`) – 4 Schritte mit client-seitiger Validierung und AJAX-Submit an Web3Forms.

---

## Umgebungsvariablen

Die `.env`-Datei ist **nicht im Git-Repository** enthalten (`.gitignore`).

| Variable | Zweck |
|----------|-------|
| `PUBLIC_WEB3FORMS_KEY` | API-Schlüssel für das Kontaktformular (Web3Forms). Muss mit `PUBLIC_`-Präfix definiert werden, damit Astro ihn an den Client durchreicht. |

> **Hinweis:** Beim Hinzufügen neuer env-Variablen das `PUBLIC_`-Präfix verwenden, wenn sie im Frontend benötigt werden. Ohne Präfix sind sie nur server-seitig verfügbar.

---

## Formular-Logik (CRO-Herzstück)

Das Kontaktformular auf der Startseite ist ein **4-stufiges Multi-Step-Formular**, das via AJAX an Web3Forms gesendet wird:

1. **Schritt 1:** Gewerk auswählen (Radio-Buttons: Sanitär & Heizung, Elektro, Dachdecker, Maler, Sonstiges)
2. **Schritt 2:** Hauptziel auswählen (Radio-Buttons: Neue Premium-Kunden, Fachkräfte & Azubis, Professioneller Internet-Auftritt)
3. **Schritt 3:** Bestehende Website? (Ja/Nein)
4. **Schritt 4:** Kontaktdaten (Name, E-Mail, Telefon) + Datenschutz-Checkbox

**Sicherheitsmerkmale:**
- Honeypot-Feld (`botcheck`, versteckte Checkbox) zur Spam-Abwehr.
- Client-seitige Validierung vor jedem Schritt-Wechsel und vor dem Absenden.
- E-Mail-Validierung via Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- GCLID-Tracking für Google Ads Conversion-Zuordnung (Hidden-Field + localStorage).

**Barrierefreiheit & UX:**
- Fokus-Management: Beim Schritt-Wechsel wird der Fokus auf die Überschrift des neuen Schritts gesetzt.
- Auf Mobilgeräten wird automatisch zum Formularanfang gescrollt.
- Fortschritts-Indikator mit 4 visuellen Punkten.
- **No-JS-Fallback:** Wenn JavaScript deaktiviert ist, werden alle Schritte sichtbar und das Formular wird als normales HTML-Formular abgesendet.

Bei erfolgreicher Übermittlung wird das Formular ausgeblendet und eine Erfolgsmeldung angezeigt.

---

## SEO & Barrierefreiheit

- Jede Seite nutzt das `Layout.astro` mit individuellem `title` und `description`.
- Open Graph und Twitter Card Meta-Tags sind vorhanden.
- Canonical URL ist fest auf `https://albinodesign.de/` gesetzt.
- **JSON-LD Structured Data:** `LocalBusiness`-Schema auf der Startseite (Name, Adresse, Telefon, E-Mail, Gründer).
- Semantisches HTML (`<section>`, `<header>`, `<footer>`, `<main>`).
- ARIA-Attribute werden konsequent verwendet (`aria-label`, `aria-labelledby`, `role`, `aria-live`, `aria-invalid`, `aria-describedby`).
- Touch-Optimierung: `min-h-[56px]` und `touch-manipulation` auf interaktiven Elementen.
- Inter-Font wird mit `preload` für Regular, SemiBold, Bold und Medium im `<head>` vorgeladen.
- `scroll-behavior: smooth` für Anker-Navigation.
- `prefers-reduced-motion` wird für Fade-In-Animationen berücksichtigt.

---

## Security-Headers (Cloudflare Pages)

Die Datei `public/_headers` definiert folgende HTTP-Security-Header für alle Routen:

| Header | Wert |
|--------|------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Deaktiviert Sensoren (Accelerometer, Kamera, Geolocation, etc.) |
| `Content-Security-Policy` | Einschränkung auf `self`, erlaubt `unsafe-inline` für Scripts/Styles, erlaubt Verbindungen zu `https://api.web3forms.com`, erlaubt Form-Action zu Web3Forms |

> **Achtung:** Bei Änderungen an externen Diensten (z. B. neues Formular-Backend, Tracking-Scripts) muss die CSP in `public/_headers` entsprechend angepasst werden, sonst blockiert der Browser die Ressourcen.

---

## Rechtliche Seiten (DSGVO / TMG)

- **`/datenschutz`** – Vollständige Datenschutzerklärung mit Angaben zu Web3Forms, Google Ads/GCLID, Server-Log-Dateien und Cookie-Hinweis.
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
- Keine Tracking-Cookies ohne explizite Zustimmung (Cookie-Banner).
- Das Honeypot-Feld im Formular darf nicht entfernt werden.
- `botcheck` ist eine per CSS versteckte Checkbox – Spam-Bots füllen sie oft aus, was zur Blockierung führt.
- Die CSP in `public/_headers` schränkt externe Ressourcen stark ein – bei neuen Drittanbieter-Services muss sie erweitert werden.

---

## Deployment

- Ausgabeordner: `./dist/` (reiner Static-Site-Export).
- Geeignet für jede Static-Hosting-Plattform (Cloudflare Pages, Netlify, Vercel, GitHub Pages).
- In der Datenschutzerklärung wird explizit **Cloudflare Pages** als Hosting-Provider erwähnt.
- Der Build-Prozess optimiert Bilder automatisch über Sharp.
- `public/_headers` wird von Cloudflare Pages als Quelle für HTTP-Header verwendet.
- `public/sitemap.xml` und `public/robots.txt` sind manuell gepflegt und müssen bei neuen Seiten aktualisiert werden.

---

## VS Code Einrichtung

- Empfohlene Erweiterung: `astro-build.astro-vscode` (siehe `.vscode/extensions.json`).
- Debug-Konfiguration für den Entwicklungsserver ist in `.vscode/launch.json` hinterlegt.
