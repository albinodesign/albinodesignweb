// GCLID Tracking
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const gclid = getUrlParam('gclid');
if (gclid) {
  const gclidField = document.getElementById('gclid_field');
  if (gclidField) {
    gclidField.value = gclid;
  }
  localStorage.setItem('albino_gclid', gclid);
} else {
  const storedGclid = localStorage.getItem('albino_gclid');
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
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
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
        if (datenschutzCheckbox) datenschutzCheckbox.setAttribute('aria-invalid', 'true');
      } else {
        if (errorDatenschutz) errorDatenschutz.classList.add('hidden');
        if (datenschutzCheckbox) datenschutzCheckbox.setAttribute('aria-invalid', 'false');
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
    if (errorMsg) errorMsg.classList.add('hidden');

    if (!validateStep(4)) return;

    const botcheck = form.querySelector('input[name="botcheck"]');
    if (botcheck && botcheck.checked) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';
    }

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
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
