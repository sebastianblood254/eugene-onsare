document.addEventListener('DOMContentLoaded', function () {
  const kycForm = document.getElementById('kycForm');
  const nextButton = document.getElementById('nextStep');
  const prevButton = document.getElementById('prevStep');
  const successPanel = document.getElementById('kycSuccess');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  let activeStep = 0;

  function showStep(index) {
    steps.forEach((step, idx) => {
      step.classList.toggle('form-step-active', idx === index);
    });
    activeStep = index;
  }

  function validateStep(index) {
    const inputs = Array.from(steps[index].querySelectorAll('input, select'));
    return inputs.every((input) => input.checkValidity());
  }

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      if (!validateStep(activeStep)) {
        alert('Please complete all required fields before continuing.');
        return;
      }
      showStep(activeStep + 1);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      showStep(activeStep - 1);
    });
  }

  if (kycForm) {
    kycForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validateStep(activeStep)) {
        alert('Please complete all required fields before submitting.');
        return;
      }
      kycForm.hidden = true;
      successPanel.hidden = false;
    });
  }

  showStep(0);
});
