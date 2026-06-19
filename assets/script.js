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

  const signupForm = document.getElementById('signupForm');
  const signupSuccess = document.getElementById('signupSuccess');
  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!signupForm.checkValidity()) {
        alert('Please complete all required fields before creating your account.');
        return;
      }
      const email = signupForm.email.value;
      localStorage.setItem('visionUserEmail', email);
      localStorage.setItem('visionLoggedIn', 'true');
      signupForm.hidden = true;
      if (signupSuccess) {
        signupSuccess.hidden = false;
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!loginForm.checkValidity()) {
        alert('Please enter your email and password to log in.');
        return;
      }
      localStorage.setItem('visionLoggedIn', 'true');
      location.href = 'trade.html';
    });
  }

  const sidebarTabs = document.querySelectorAll('.sidebar-tab');
  const sidebarPanels = document.querySelectorAll('.sidebar-panel');
  sidebarTabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
      sidebarTabs.forEach((t) => t.classList.remove('active'));
      sidebarPanels.forEach((panel) => panel.hidden = true);
      tab.classList.add('active');
      sidebarPanels[index].hidden = false;
    });
  });

  const importXmlBtn = document.getElementById('importXmlBtn');
  const xmlUpload = document.getElementById('xmlUpload');
  if (importXmlBtn && xmlUpload) {
    importXmlBtn.addEventListener('click', () => xmlUpload.click());
    xmlUpload.addEventListener('change', () => {
      if (xmlUpload.files.length) {
        alert(`Imported XML bot: ${xmlUpload.files[0].name}`);
      }
    });
  }

  const uploadBotBtn = document.getElementById('uploadBotBtn');
  const botUpload = document.getElementById('botUpload');
  if (uploadBotBtn && botUpload) {
    uploadBotBtn.addEventListener('click', () => botUpload.click());
    botUpload.addEventListener('change', () => {
      if (botUpload.files.length) {
        alert(`Uploaded bot file: ${botUpload.files[0].name}`);
      }
    });
  }

  const createDefaultBot = document.getElementById('createDefaultBot');
  if (createDefaultBot) {
    createDefaultBot.addEventListener('click', () => {
      alert('Default bot created. You can now run it from the Trade page.');
      localStorage.setItem('visionDefaultBot', 'created');
    });
  }

  showStep(0);
});
