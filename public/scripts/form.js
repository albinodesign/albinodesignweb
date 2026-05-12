// GCLID Tracking
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const GCLID_KEY = 'albino_gclid';
const GCLID_TIMESTAMP_KEY = 'albino_gclid_ts';
const GCLID_MAX_AGE_DAYS = 90;

function storeGclid(value) {
  localStorage.setItem(GCLID_KEY, value);
  localStorage.setItem(GCLID_TIMESTAMP_KEY, Date.now().toString());
}

function getStoredGclid() {
  const stored = localStorage.getItem(GCLID_KEY);
  const ts = localStorage.getItem(GCLID_TIMESTAMP_KEY);
  if (!stored || !ts) return null;
  const ageMs = Date.now() - parseInt(ts, 10);
  const maxAgeMs = GCLID_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  if (ageMs > maxAgeMs) {
    localStorage.removeItem(GCLID_KEY);
    localStorage.removeItem(GCLID_TIMESTAMP_KEY);
    return null;
  }
  return stored;
}

const gclid = getUrlParam('gclid');
if (gclid) {
  const gclidField = document.getElementById('gclid_field');
  if (gclidField) {
    gclidField.value = gclid;
  }
  storeGclid(gclid);
} else {
  const storedGclid = getStoredGclid();
  if (storedGclid) {
    const gclidField = document.getElementById('gclid_field');
    if (gclidField) {
      gclidField.value = storedGclid;
    }
  }
}

// Multi-Step Form Logic
const form = document.getElementById('multi-step-form');
if (form) {
  const steps = form.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('[data-indicator]');
  let currentStep = 1;

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
      }
      if (window.innerWidth < 640) {
        const formSection = document.getElementById('formular');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    indicators.forEach(function (ind) {
      const indStep = parseInt(ind.dataset.indicator);
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

    if (stepNum === 1) {
      const gewerk = form.querySelector('input[name="gewerk"]:checked');
      const error = document.getElementById('error-step-1');
      if (!gewerk) {
        valid = false;
        if (error) error.classList.remove('hidden');
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
      } else {
        if (error) error.classList.add('hidden');
      }
    }

    if (stepNum === 4) {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const telefon = document.getElementById('telefon');
      const datenschutz = form.querySelector('input[name="datenschutz"]');
      const datenschutzCheckbox = document.getElementById('datenschutz');

      const errorName = document.getElementById('error-name');
      const errorEmail = document.getElementById('error-email');
      const errorTelefon = document.getElementById('error-telefon');
      const errorDatenschutz = document.getElementById('error-datenschutz');

      if (!name.value.trim()) {
        valid = false;
        if (errorName) errorName.classList.remove('hidden');
        name.setAttribute('aria-invalid', 'true');
      } else {
        if (errorName) errorName.classList.add('hidden');
        name.setAttribute('aria-invalid', 'false');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailValue = email.value.trim();
      if (emailValue && !emailRegex.test(emailValue)) {
        valid = false;
        if (errorEmail) errorEmail.classList.remove('hidden');
        email.setAttribute('aria-invalid', 'true');
      } else {
        if (errorEmail) errorEmail.classList.add('hidden');
        email.setAttribute('aria-invalid', 'false');
      }

      if (!telefon.value.trim()) {
        valid = false;
        if (errorTelefon) errorTelefon.classList.remove('hidden');
        telefon.setAttribute('aria-invalid', 'true');
      } else {
        if (errorTelefon) errorTelefon.classList.add('hidden');
        telefon.setAttribute('aria-invalid', 'false');
      }

      if (!datenschutz.checked) {
        valid = false;
        if (errorDatenschutz) errorDatenschutz.classList.remove('hidden');
      } else {
        if (errorDatenschutz) errorDatenschutz.classList.add('hidden');
      }
    }

    return valid;
  }

  form.querySelectorAll('.step-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const nextStep = parseInt(this.dataset.next);
      if (validateStep(currentStep)) {
        showStep(nextStep);
      }
    });
  });

  form.querySelectorAll('.step-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const prevStep = parseInt(this.dataset.prev);
      showStep(prevStep);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const errorMsg = document.getElementById('form-error');
    if (errorMsg) {
      errorMsg.classList.add('hidden');
      errorMsg.innerHTML = '<p class="text-red-600 font-medium">Es ist ein Fehler aufgetreten.</p><p class="text-red-500 text-sm mt-1">Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter <a href="tel:+4915679755137" class="underline">+49 15679 755137</a>.</p>';
    }

    if (!validateStep(4)) return;

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
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';
    }

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
        clearTimeout(timeoutId);
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function (data) {
        if (data.success) {
          form.classList.add('hidden');
          document.getElementById('form-progress').classList.add('hidden');
          const successMsg = document.getElementById('form-success');
          if (successMsg) {
            successMsg.classList.remove('hidden');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function (error) {
        clearTimeout(timeoutId);
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
      });
  });
}
