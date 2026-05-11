# Plan: Google Analytics 4 (gtag.js) DSGVO-konforme Integration

> **Tracking-ID:** G-M70FMW7025  
> **Status:** Warte auf Go vom Nutzer  
> **Hinweis:** Empfohlen wird Option A (GA4 über GTM), da GTM bereits eingebaut ist

---

## Option A: GA4 über GTM laden (EMPFOHLEN) ✅

### Was?
Statt gtag.js direkt einzubinden, konfigurierst du GA4 im **Google Tag Manager Dashboard**.

### Schritte:
1. [tagmanager.google.com](https://tagmanager.google.com/) öffnen
2. Container → Tags → Neu
3. Tag-Typ: "Google Analytics: GA4-Konfiguration"
4. Mess-ID eingeben: `G-M70FMW7025`
5. Auslöser: "All Pages" (oder "Consent Granted" wenn du Consent-basiertes Tracking willst)
6. Veröffentlichen

### Vorteile:
- ✅ Kein Code-Change nötig
- ✅ Alles zentral im GTM Dashboard verwaltbar
- ✅ DSGVO-konform (da GTM erst nach Consent lädt)
- ✅ Keine doppelte dataLayer-Initialisierung

---

## Option B: gtag.js direkt einbinden (Falls gewünscht)

### Übersicht der Änderungen

| Datei | Änderung |
|-------|----------|
| `src/layouts/Layout.astro` | gtag.js Script blockiert einbauen |
| `src/scripts/cookie-consent.js` | gtag-Aktivierung nach Consent |
| `public/_headers` | Prüfen ob `googletagmanager.com` bereits erlaubt |

### Schritt 1: CSP prüfen
Die CSP wurde bereits in der GTM-Integration erweitert. `googletagmanager.com` ist bereits in `script-src`, `connect-src` und `img-src` erlaubt. **Keine Änderung nötig.**

### Schritt 2: gtag.js in Layout.astro einbauen

Google gibt diesen Code:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-M70FMW7025"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-M70FMW7025');
</script>
```

#### DSGVO-konforme Variante:
Wir bauen ihn so ein, dass er **erst nach Consent** lädt:

**A) Script-Tag blockieren:**
```html
<script type="text/plain" data-cookiecategory="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-M70FMW7025"></script>
```

**B) Inline-Code blockieren:**
```html
<script type="text/plain" data-cookiecategory="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-M70FMW7025');
</script>
```

**Wichtig:** Da `dataLayer` bereits im Cookie-Consent Script initialisiert wird, müssen wir aufpassen, dass wir nicht doppelt initialisieren.

### Schritt 3: Cookie-Consent Script erweitern

Die `activateGTM()` Funktion muss erweitert werden, um auch **externe Scripts mit `data-src`** zu laden:

```javascript
// Externe Scripts aktivieren (z.B. gtag.js)
document.querySelectorAll('script[type="text/plain"][data-src]').forEach(function(script) {
  const newScript = document.createElement('script');
  newScript.src = script.getAttribute('data-src');
  newScript.async = true;
  script.parentNode.insertBefore(newScript, script);
  script.remove();
});
```

### Schritt 4: Testen

1. Seite im Incognito öffnen
2. Netzwerk-Tab: `gtag/js?id=G-M70FMW7025` darf NICHT geladen sein
3. "Akzeptieren" klicken
4. `gtag/js?id=G-M70FMW7025` erscheint im Netzwerk-Tab
5. Google Analytics Realtime berichtet Besucher

---

## ⚠️ Warnung: Konflikt mit GTM

Wenn du **BOTH** GTM UND gtag.js direkt einbindest, passiert Folgendes:
- dataLayer wird doppelt initialisiert
- Google Analytics könnte doppelt tracken
- Consent Mode könnte sich überschreiben

**Lösung:** Entweder GTM ODER gtag.js direkt — nicht beides!

---

## Meine Empfehlung

**Wähle Option A.** Gehe in das GTM Dashboard und erstelle ein GA4-Tag dort. Das ist:
- Sauberer
- Einfacher zu warten
- Kein Code-Change nötig
- DSGVO-konform (da GTM bereits mit Consent Mode v2 arbeitet)

---

**Frage:** Möchtest du **Option A** (GA4 über GTM Dashboard konfigurieren — kein Code nötig) oder **Option B** (gtag.js direkt einbinden — Code-Changes nötig)?
