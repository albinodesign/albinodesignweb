// AlbinoDesign – Formular-Logik
// Multi-Step-Formular mit GCLID-Tracking und AJAX-Submit an Web3Forms

const SITE_PHONE = '+4915679755137';
const SITE_PHONE_FORMATTED = '+49 15679 755137';
const GCLID_KEY = 'albino_gclid';
const GCLID_TIMESTAMP_KEY = 'albino_gclid_ts';
const GCLID_MAX_AGE_DAYS = 90;
const GCLID_MAX_LENGTH = 200;

// --- localStorage-Hilfsfunktionen ---
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Private Mode oder blockierte Cookies – stille Ignorierung
  }
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // noop
  }
}

// --- GCLID Tracking ---
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function storeGclid(value) {
  safeSetItem(GCLID_KEY, value);
  safeSetItem(GCLID_TIMESTAMP_KEY, Date.now().toString());
}

function getStoredGclid() {
  const stored = safeGetItem(GCLID_KEY);
  const ts = safeGetItem(GCLID_TIMESTAMP_KEY);
  if (!stored || !ts) return null;
  const ageMs = Date.now() - parseInt(ts, 10);
  const maxAgeMs = GCLID_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  if (ageMs > maxAgeMs) {
    safeRemoveItem(GCLID_KEY);
    safeRemoveItem(GCLID_TIMESTAMP_KEY);
    return null;
  }
  return stored;
}

function setGclidField(value) {
  const gclidField = document.getElementById('gclid_field');
  if (gclidField && value) {
    // Länge begrenzen, um Missbrauch zu erschweren
    gclidField.value = String(value).slice(0, GCLID_MAX_LENGTH);
  }
}

const gclid = getUrlParam('gclid');
if (gclid) {
  setGclidField(gclid);
  storeGclid(gclid);
} else {
  const storedGclid = getStoredGclid();
  if (storedGclid) {
    setGclidField(storedGclid);
  }
}

// --- Multi-Step Form Logic ---
const form = document.getElementById('multi-step-form');
if (form) {
  const steps = form.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('[data-indicator]');
  const validationLive = document.getElementById('form-validation-live');
  let currentStep = 1;

  function announceValidation(message) {
    if (validationLive) {
      validationLive.textContent = message;
      // Nach kurzer Zeit wieder leeren, damit dieselbe Meldung erneut angekündigt wird
      setTimeout(function () {
        validationLive.textContent = '';
      }, 1000);
    }
  }

  function showStep(stepNum) {
    steps.forEach(function (step) {
      step.classList.add('hidden');
    });
    const target = document.getElementById('step-' + stepNum);
    if (target) {
      target.classList.remove('hidden');
      const heading = target.querySelector('legend, h3');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
        // Nach dem Fokussieren tabindex wieder entfernen
        setTimeout(function () {
          heading.removeAttribute('tabindex');
        }, 100);
      }
      if (window.innerWidth < 640) {
        const formSection = document.getElementById('formular');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    indicators.forEach(function (ind) {
      const indStep = parseInt(ind.dataset.indicator, 10);
      if (indStep <= stepNum) {
        ind.classList.remove('bg-slate-200');
        ind.classList.add('bg-accent');
      } else {
        ind.classList.remove('bg-accent');
        ind.classList.add('bg-slate-200');
      }
    });

    currentStep = stepNum;
  }

  function validateStep(stepNum) {
    let valid = true;
    let firstErrorMessage = '';

    if (stepNum === 1) {
      const gewerk = form.querySelector('input[name="gewerk"]:checked');
      const error = document.getElementById('error-step-1');
      if (!gewerk) {
        valid = false;
        if (error) error.classList.remove('hidden');
        firstErrorMessage = error ? error.textContent : 'Bitte wählen Sie ein Gewerk aus.';
      } else {
        if (error) error.classList.add('hidden');
      }
    }

    if (stepNum === 2) {
      const ziel = form.querySelector('input[name="ziel"]:checked');
      const error = document.getElementById('error-step-2');
      if (!ziel) {
        valid = false;
        if (error) error.classList.remove('hidden');
        firstErrorMessage = error ? error.textContent : 'Bitte wählen Sie ein Ziel aus.';
      } else {
        if (error) error.classList.add('hidden');
      }
    }

    if (stepNum === 3) {
      const website = form.querySelector('input[name="website_vorhanden"]:checked');
      const error = document.getElementById('error-step-3');
      if (!website) {
        valid = false;
        if (error) error.classList.remove('hidden');
        firstErrorMessage = error ? error.textContent : 'Bitte treffen Sie eine Auswahl.';
      } else {
        if (error) error.classList.add('hidden');
      }
    }

    if (stepNum === 4) {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const telefon = document.getElementById('telefon');
      const datenschutzCheckbox = document.getElementById('datenschutz');

      const errorName = document.getElementById('error-name');
      const errorEmail = document.getElementById('error-email');
      const errorTelefon = document.getElementById('error-telefon');
      const errorDatenschutz = document.getElementById('error-datenschutz');

      if (!name || !name.value.trim()) {
        valid = false;
        if (errorName) errorName.classList.remove('hidden');
        name.setAttribute('aria-invalid', 'true');
        if (!firstErrorMessage) firstErrorMessage = errorName ? errorName.textContent : 'Bitte geben Sie Ihren Namen ein.';
      } else {
        if (errorName) errorName.classList.add('hidden');
        name.setAttribute('aria-invalid', 'false');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailValue = email ? email.value.trim() : '';
      if (!emailValue) {
        valid = false;
        if (errorEmail) errorEmail.classList.remove('hidden');
        email.setAttribute('aria-invalid', 'true');
        if (!firstErrorMessage) firstErrorMessage = errorEmail ? errorEmail.textContent : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      } else if (!emailRegex.test(emailValue)) {
        valid = false;
        if (errorEmail) errorEmail.classList.remove('hidden');
        email.setAttribute('aria-invalid', 'true');
        if (!firstErrorMessage) firstErrorMessage = errorEmail ? errorEmail.textContent : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      } else {
        if (errorEmail) errorEmail.classList.add('hidden');
        email.setAttribute('aria-invalid', 'false');
      }

      if (!telefon || !telefon.value.trim()) {
        valid = false;
        if (errorTelefon) errorTelefon.classList.remove('hidden');
        telefon.setAttribute('aria-invalid', 'true');
        if (!firstErrorMessage) firstErrorMessage = errorTelefon ? errorTelefon.textContent : 'Bitte geben Sie Ihre Handynummer ein.';
      } else {
        if (errorTelefon) errorTelefon.classList.add('hidden');
        telefon.setAttribute('aria-invalid', 'false');
      }

      if (!datenschutzCheckbox || !datenschutzCheckbox.checked) {
        valid = false;
        if (errorDatenschutz) errorDatenschutz.classList.remove('hidden');
        datenschutzCheckbox.setAttribute('aria-invalid', 'true');
        if (!firstErrorMessage) firstErrorMessage = errorDatenschutz ? errorDatenschutz.textContent : 'Bitte akzeptieren Sie die Datenschutzerklärung.';
      } else {
        if (errorDatenschutz) errorDatenschutz.classList.add('hidden');
        datenschutzCheckbox.setAttribute('aria-invalid', 'false');
      }
    }

    if (!valid && firstErrorMessage) {
      announceValidation(firstErrorMessage);
    }

    return valid;
  }

  form.querySelectorAll('.step-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const nextStep = parseInt(this.dataset.next, 10);
      if (validateStep(currentStep)) {
        showStep(nextStep);
      }
    });
  });

  form.querySelectorAll('.step-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const prevStep = parseInt(this.dataset.prev, 10);
      showStep(prevStep);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const errorMsg = document.getElementById('form-error');
    if (errorMsg) {
      errorMsg.classList.add('hidden');
      errorMsg.innerHTML = '<p class="text-red-600 font-medium">Es ist ein Fehler aufgetreten.</p><p class="text-red-500 text-sm mt-1">Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter <a href="tel:' + SITE_PHONE + '" class="underline">' + SITE_PHONE_FORMATTED + '</a>.</p>';
    }

    if (!validateStep(4)) return;

    // HTML5-Validierung zusätzlich zur manuellen Prüfung
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const botcheck = form.querySelector('input[name="botcheck"]');
    if (botcheck && botcheck.checked) {
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.innerHTML = '<p class="text-red-600 font-medium">Spam-Erkennung ausgelöst.</p><p class="text-red-500 text-sm mt-1">Bitte laden Sie die Seite neu und versuchen Sie es erneut.</p>';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';

    const formData = new FormData(form);
    const controller = new AbortController();
    const timeoutId = setTimeout(function () {
      controller.abort();
    }, 10000);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function (data) {
        if (data.success) {
          window.location.href = '/danke';
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
        const errorMsg = document.getElementById('form-error');
        if (errorMsg) {
          errorMsg.classList.remove('hidden');
          errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      })
      .finally(function () {
        clearTimeout(timeoutId);
      });
  });
}
