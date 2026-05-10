# Plan: Google Tag Manager (GTM) DSGVO-konforme Integration

> **Status:** Warte auf Go vom Nutzer  
> **GTM-ID:** GTM-MDB35QMG  
> **Ziel:** GTM lädt NUR nach aktiver Einwilligung, voll DSGVO-konform

---

## Übersicht der Änderungen

| Datei | Änderung |
|-------|----------|
| `public/_headers` | CSP erweitern (Google-Domains erlauben) |
| `src/layouts/Layout.astro` | GTM-Code einbauen (head + body) |
| `public/scripts/cookie-consent.js` | Consent-Logik erweitern → GTM erst nach Zustimmung laden |
| `src/pages/datenschutz.astro` | Abschnitt "Google Tag Manager" hinzufügen |
| `src/pages/index.astro` | Cookie-Banner ggf. Text anpassen (Analytics/Marketing erwähnen) |

---

## Schritt 1: CSP-Header erweitern (`public/_headers`)

### Was?
Die aktuelle CSP blockiert alle externen Scripts. GTM braucht Erlaubnis für folgende Domains.

### Genauer Code-Change:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://api.web3forms.com https://www.googletagmanager.com https://www.google-analytics.com; frame-src https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com;
```

### Neue Direktiven erklärt:
- `script-src`: + `https://www.googletagmanager.com` + `https://www.google-analytics.com`
- `connect-src`: + `https://www.googletagmanager.com` + `https://www.google-analytics.com`
- `img-src`: + `https://www.googletagmanager.com` + `https://www.google-analytics.com`
- `frame-src`: + `https://www.googletagmanager.com` (für noscript-iframe)

---

## Schritt 2: GTM-Code in Layout einbauen (`src/layouts/Layout.astro`)

### Was?
Google gibt 2 Code-Snippets. Wir bauen sie so ein, dass sie **initial blockiert** sind und erst durch Cookie-Consent aktiviert werden.

### Positionen:
1. **Head-Script:** Direkt nach dem öffnenden `<head>`-Tag (noch vor Preloads)
2. **Noscript-Tag:** Direkt nach dem öffnenden `<body>`-Tag

### DSGVO-konforme Variante (Data-Attribute statt sofort laden):
Statt den GTM-Code sofort auszuführen, speichern wir ihn mit `type="text/plain"` und einem Data-Attribut. Das Cookie-Banner-Script macht daraus später einen echten `<script>`-Tag.

#### Head-Code (blockiert, wartet auf Consent):
```html
<!-- Google Tag Manager — DSGVO-konform, erst nach Consent aktiv -->
<script type="text/plain" data-cookiecategory="analytics">
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MDB35QMG');
</script>
<!-- End Google Tag Manager -->
```

#### Body-Code (noscript, blockiert):
```html
<!-- Google Tag Manager (noscript) — DSGVO-konform -->
<noscript data-cookiecategory="analytics">
<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDB35QMG"
height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

> **Hinweis:** `type="text/plain"` verhindert, dass der Browser das Script ausführt. Das Cookie-Banner-Script konvertiert es bei Zustimmung zu `type="text/javascript"`.

---

## Schritt 3: Cookie-Consent erweitern (`public/scripts/cookie-consent.js`)

### Was?
Das bestehende Cookie-Banner muss lernen, **Analytics/Tracking-Cookies** als separate Kategorie zu behandeln. Erst nach Klick auf "Alle akzeptieren" oder "Nur Analytics" wird GTM aktiviert.

### Neue Funktionen im Cookie-Banner:

#### A) Consent-Kategorien einführen:
- **Notwendig** (immer erlaubt): Seitenfunktionalität, Formularversand
- **Analytics** (nur nach Einwilligung): GTM, Google Analytics, Besucherstatistiken

#### B) Aktivierungs-Logik (neue Funktion):
Wenn Nutzer "Analytics" akzeptiert:
1. Alle `<script type="text/plain" data-cookiecategory="analytics">` → umwandeln in `<script type="text/javascript">`
2. Alle `<noscript data-cookiecategory="analytics">` → umwandeln in normales `<noscript>`
3. GTM startet automatisch

#### C) dataLayer initialisieren (für Google Consent Mode v2):
```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Standard: Kein Consent
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

// Nach Einwilligung:
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});
```

> **Google Consent Mode v2** ist ab 2024 Pflicht für Google Ads und erlaubt "modellierte Conversions" auch ohne Consent. Ohne Consent Mode v2 kann Google Ads in der EU nicht mehr ordentlich tracken.

#### D) Speicherung:
- Consent-Status wird im `localStorage` gespeichert (Key: `cookie-consent`)
- Beim erneuten Seitenbesuch: Wenn bereits Einwilligung vorliegt → GTM sofort laden
- Opt-out jederzeit möglich (Banner erneut öffnen oder Link in Datenschutz)

---

## Schritt 4: Cookie-Banner-UI anpassen

### Was?
Das Banner braucht mindestens **2 Buttons** (besser 3):

| Button | Aktion |
|--------|--------|
| "Alle akzeptieren" | Notwendig + Analytics erlaubt → GTM lädt |
| "Nur notwendige" | Nur Notwendig erlaubt → GTM bleibt blockiert |
| (Optional) "Einstellungen" | Einzelne Kategorien an/aus schalten |

### Text-Anpassung:
Der Banner-Text sollte transparent sein:
> "Wir nutzen Cookies für die Basisfunktionen der Website und optional für anonyme Besucherstatistiken via Google Tag Manager."

---

## Schritt 5: Datenschutzerklärung erweitern (`src/pages/datenschutz.astro`)

### Was?
Neuer Abschnitt über Google Tag Manager mit allen Pflichtangaben nach DSGVO.

### Pflichtinhalte:
1. **Verantwortlicher:** Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
2. **Zweck:** Analyse des Nutzerverhaltens, Optimierung der Website, Conversion-Tracking
3. **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) — NUR nach Consent!
4. **Speicherdauer:** Cookies max. 2 Jahre (je nach Google-Einstellung)
5. **Widerruf:** Nutzer kann Einwilligung jederzeit über Cookie-Banner widerrufen
6. **Datenübermittlung:** Daten können in die USA übermittelt werden (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043). Google verwendet Standardvertragsklauseln der EU-Kommission.
7. **Opt-out-Link:** [https://tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout)

### Optional aber empfohlen:
- Erwähnung des Google Consent Mode v2
- Hinweis auf "modellierte Daten" bei Ablehnung
- Link zur Google-Datenschutzerklärung: https://policies.google.com/privacy

---

## Schritt 6: Impressum prüfen

### Was?
Im Impressum muss nichts zu GTM stehen. Aber falls dort bereits Webanalyse erwähnt wird → auf Consent-Pflicht hinweisen.

---

## Schritt 7: Testplan (nach Umsetzung)

### A) Lokaler Test:
1. `npm run build` → kein Fehler
2. `npm run preview` → Seite lädt normal
3. Browser-DevTools → Netzwerk-Tab
4. GTM-Script darf **NICHT** geladen werden vor Consent
5. Nach Klick "Alle akzeptieren" → GTM-Script erscheint im Netzwerk-Tab

### B) Tag Assistant Test:
1. [tagassistant.google.com](https://tagassistant.google.com/) öffnen
2. Domain eintragen
3. Prüfen, ob GTM-Container erkannt wird

### C) Consent Mode v2 Test:
1. DevTools Console → `dataLayer` eingeben
2. Prüfen, ob `consent` Event mit `default: denied` existiert
3. Nach Consent → `consent` Event mit `update: granted` prüfen

### D) Edge Cases:
- Seite neu laden ohne Consent → GTM lädt nicht
- Seite neu laden mit gespeichertem Consent → GTM lädt automatisch
- "Nur notwendige" klicken → GTM lädt nicht
- Consent widerrufen → GTM deaktiviert (Seite neu laden erforderlich)

---

## Risiken & Mitigationen

| Risiko | Mitigation |
|--------|------------|
| GTM lädt vor Consent (DSGVO-Verstoß) | `type="text/plain"` + Data-Attribut + Script-Umwandlung nur nach Consent |
| CSP blockiert GTM nach Consent | Alle Google-Domains in CSP erlauben (siehe Schritt 1) |
| Nutzer kann Consent nicht widerrufen | Banner bleibt erreichbar (z.B. Link in Footer) |
| Google Analytics ohne Consent Mode | Consent Mode v2 implementieren (siehe Schritt 3C) |
| Cookie-Banner-Text unzureichend | Transparent über GTM & Analytics informieren |

---

## Zusammenfassung der Reihenfolge

1. ✅ CSP-Header erweitern
2. ✅ GTM-Code in Layout.astro (blockiert via `type="text/plain"`)
3. ✅ Cookie-Banner Script erweitern (Consent-Kategorien + GTM-Aktivierung)
4. ✅ Cookie-Banner UI anpassen (2-3 Buttons)
5. ✅ Datenschutzerklärung erweitern
6. ✅ Testen lokal
7. ✅ Deployen

---

**Frage:** Soll ich mit der Umsetzung beginnen? Sag **"Go"** und ich codiere Schritt für Schritt! 🚀
