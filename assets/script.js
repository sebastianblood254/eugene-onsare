document.addEventListener('DOMContentLoaded', function () {
  const kycForm = document.getElementById('kycForm');
  const nextButton = document.getElementById('nextStep');
  const prevButton = document.getElementById('prevStep');
  const successPanel = document.getElementById('kycSuccess');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  let activeStep = 0;

  function isLoggedIn() {
    return localStorage.getItem('visionLoggedIn') === 'true';
  }

  function ensureAccountBalances() {
    if (localStorage.getItem('visionDemoBalance') === null) {
      localStorage.setItem('visionDemoBalance', '10000.00');
    }
    if (localStorage.getItem('visionRealBalance') === null) {
      localStorage.setItem('visionRealBalance', '0.00');
    }
  }

  function getBalance(key) {
    return parseFloat(localStorage.getItem(key) || '0');
  }

  function updateCashierDisplay() {
    const cashierPanel = document.querySelector('.cashier-panel');
    if (!cashierPanel) return;

    if (!isLoggedIn()) {
      cashierPanel.style.display = 'none';
      return;
    }

    cashierPanel.style.display = 'grid';
    const demoBalance = document.getElementById('demo-balance');
    const realBalance = document.getElementById('real-balance');
    if (demoBalance) {
      demoBalance.textContent = `${getBalance('visionDemoBalance').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    if (realBalance) {
      realBalance.textContent = `${getBalance('visionRealBalance').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
  }

  function updateBalance(key, amount) {
    const current = getBalance(key);
    localStorage.setItem(key, amount.toFixed(2));
    updateCashierDisplay();
    return current;
  }

  function promptAccountAmount(action) {
    if (!isLoggedIn()) {
      alert('Please log in to use deposit and withdrawal features.');
      return;
    }

    const account = prompt('Choose account type (demo or real):', 'demo');
    if (!account) return;
    const normalized = account.trim().toLowerCase();
    const key = normalized === 'real' ? 'visionRealBalance' : 'visionDemoBalance';
    const current = getBalance(key);

    const amountText = prompt(`${action} amount for ${normalized} account:`, '100');
    if (!amountText) return;
    const amount = parseFloat(amountText);
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Enter a valid numeric amount.');
      return;
    }

    if (action === 'Withdraw' && amount > current) {
      alert('Insufficient funds for withdrawal.');
      return;
    }

    const newBalance = action === 'Deposit' ? current + amount : current - amount;
    localStorage.setItem(key, newBalance.toFixed(2));
    updateCashierDisplay();
    alert(`${action} successful. New ${normalized} balance: ${newBalance.toFixed(2)} USD`);
  }

  function bindCashierActions() {
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    if (depositBtn) {
      depositBtn.addEventListener('click', () => promptAccountAmount('Deposit'));
    }
    if (withdrawBtn) {
      withdrawBtn.addEventListener('click', () => promptAccountAmount('Withdraw'));
    }
  }

  ensureAccountBalances();
  updateCashierDisplay();
  bindCashierActions();

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
