const CONSENT_KEY = 'albino_cookie_consent';

// ── Google Consent Mode v2 ──
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

// ── Hilfsfunktionen ──

function migrateOldConsent(raw) {
  try {
    const parsed = JSON.parse(raw);
    // Altes Format: { value: true/false, date: "..." }
    if (parsed && typeof parsed.value === 'boolean') {
      return {
        necessary: true,
        analytics: parsed.value,
        date: parsed.date || new Date().toISOString(),
      };
    }
    // Bereits neues Format
    if (parsed && typeof parsed.analytics === 'boolean') {
      return parsed;
    }
  } catch (e) {
    // raw war möglicherweise direkt "true" / "false" (sehr altes Format)
    if (raw === 'true') return { necessary: true, analytics: true, date: new Date().toISOString() };
    if (raw === 'false') return { necessary: true, analytics: false, date: new Date().toISOString() };
  }
  return null;
}

window.getCookieConsent = function () {
  const raw = localStorage.getItem(CONSENT_KEY);
  return raw ? migrateOldConsent(raw) : null;
};

window.setCookieConsent = function (consent) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      necessary: true,
      analytics: consent.analytics,
      date: new Date().toISOString(),
    })
  );
  document.dispatchEvent(
    new CustomEvent('cookieConsentChanged', { detail: consent })
  );
};

window.hasCookieConsent = function () {
  const c = window.getCookieConsent();
  return c && c.analytics === true;
};

window.showCookieBanner = showBanner;

// ── GTM Lazy Loading ──

let gtmScheduled = false;

function scheduleGTM() {
  if (gtmScheduled) return;
  gtmScheduled = true;

  // Remove interaction listeners
  ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (evt) {
    window.removeEventListener(evt, onUserInteraction, { passive: true });
  });

  activateGTM();
}

function onUserInteraction() {
  scheduleGTM();
}

function lazyLoadGTM() {
  // Activate GTM on first user interaction or after 3.5s (whichever comes first)
  ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, onUserInteraction, { passive: true, once: true });
  });
  setTimeout(scheduleGTM, 3500);
}

// ── GTM Aktivierung ──

function activateGTM() {
  // Blockierte <script type="text/plain" data-cookiecategory="analytics"> aktivieren
  const scripts = document.querySelectorAll(
    'script[type="text/plain"][data-cookiecategory="analytics"]'
  );
  scripts.forEach(function (script) {
    const newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.textContent = script.textContent;
    script.parentNode.insertBefore(newScript, script);
    script.remove();
  });

  // Blockierte <noscript data-cookiecategory="analytics"> aktivieren
  const noscripts = document.querySelectorAll(
    'noscript[data-cookiecategory="analytics"]'
  );
  noscripts.forEach(function (ns) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = ns.innerHTML;
    ns.parentNode.insertBefore(wrapper, ns);
    ns.remove();
  });

  // Google Consent Mode: Zustimmung senden
  gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

// ── Banner Logik ──

const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('cookie-accept');
const declineBtn = document.getElementById('cookie-decline');

function showBanner() {
  if (banner) {
    banner.style.display = 'block';
    void banner.offsetWidth;
    banner.classList.remove('translate-y-full');
  }
}

function hideBanner() {
  if (banner) {
    banner.classList.add('translate-y-full');
    setTimeout(function () {
      banner.style.display = 'none';
    }, 300);
  }
}

// ── Init ──

const consent = window.getCookieConsent();

if (!consent) {
  // Noch keine Entscheidung → Banner zeigen
  setTimeout(showBanner, 1000);
} else if (consent.analytics === true) {
  // Bereits zugestimmt → GTM verzögert laden (bei Interaktion oder nach 3.5s)
  lazyLoadGTM();
}

// ── Event Listener ──

if (acceptBtn) {
  acceptBtn.addEventListener('click', function () {
    window.setCookieConsent({ necessary: true, analytics: true });
    scheduleGTM();
    hideBanner();
  });
}

if (declineBtn) {
  declineBtn.addEventListener('click', function () {
    window.setCookieConsent({ necessary: true, analytics: false });
    // GTM bleibt blockiert, Consent Mode bleibt auf 'denied'
    hideBanner();
  });
}
