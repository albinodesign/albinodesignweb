const CONSENT_KEY = 'albino_cookie_consent';

window.getCookieConsent = function () {
  const raw = localStorage.getItem(CONSENT_KEY);
  return raw ? JSON.parse(raw) : null;
};

window.setCookieConsent = function (consent) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      value: consent,
      date: new Date().toISOString(),
    })
  );
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
};

window.hasCookieConsent = function () {
  const c = window.getCookieConsent();
  return c && c.value === true;
};

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

const consent = window.getCookieConsent();
if (!consent) {
  setTimeout(showBanner, 1000);
}

if (acceptBtn) {
  acceptBtn.addEventListener('click', function () {
    window.setCookieConsent(true);
    hideBanner();
  });
}

if (declineBtn) {
  declineBtn.addEventListener('click', function () {
    window.setCookieConsent(false);
    hideBanner();
  });
}
