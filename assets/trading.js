// Trading Mode Management
let currentMode = 'real';

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const mode = this.dataset.mode;
    currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('mode-active'));
    this.classList.add('mode-active');
    
    const modeText = mode === 'real' ? 'Real Trading' : 'Demo Trading';
    document.getElementById('current-mode').textContent = modeText;
    
    console.log(`Switched to ${modeText} mode`);
  });
});

// Ticker Updates - Simulate live price movements
const tickerData = {
  VOL10: { price: 6432.10, change: 1.12 },
  VOL25: { price: 5980.25, change: 0.95 },
  VOL50: { price: 5234.50, change: 2.45 },
  VOL75: { price: 4812.80, change: -0.28 },
  VOL100: { price: 4304.15, change: 1.76 },
  VOL200: { price: 3920.60, change: 0.32 },
  CFD: { price: 3821.75, change: 1.82 },
  STEP: { price: 2156.25, change: -0.95 }
};

function updateTickers() {
  Object.keys(tickerData).forEach(symbol => {
    const ticker = tickerData[symbol];
    
    // Simulate random price movement
    const randomChange = (Math.random() - 0.5) * 0.7;
    ticker.price += randomChange;
    ticker.change += randomChange * 0.12;
    
    // Update display
    const tickerElement = document.querySelector(`[data-ticker="${symbol}"]`);
    if (tickerElement) {
      const valueEl = tickerElement.querySelector('.ticker-value');
      const changeEl = tickerElement.querySelector('.ticker-change');
      
      valueEl.textContent = ticker.price.toFixed(2);
      
      const changeClass = ticker.change >= 0 ? 'positive' : 'negative';
      changeEl.textContent = `${ticker.change >= 0 ? '+' : ''}${ticker.change.toFixed(2)}%`;
      changeEl.className = `ticker-change ${changeClass}`;
    }
  });
  
  // Update moving ticker
  updateMovingTicker();
}

function updateMovingTicker() {
  const movingTicker = document.getElementById('moving-ticker');
  if (movingTicker) {
    const items = [
      `VOL10: ${tickerData.VOL10.price.toFixed(2)}`,
      `VOL25: ${tickerData.VOL25.price.toFixed(2)}`,
      `VOL50: ${tickerData.VOL50.price.toFixed(2)}`,
      `VOL75: ${tickerData.VOL75.price.toFixed(2)}`,
      `VOL100: ${tickerData.VOL100.price.toFixed(2)}`,
      `VOL200: ${tickerData.VOL200.price.toFixed(2)}`,
      `CFD: ${tickerData.CFD.price.toFixed(2)}`,
      `STEP: ${tickerData.STEP.price.toFixed(2)}`
    ];
    
    const tickerHtml = items.map(item => 
      `<span class="ticker-item">${item}</span>`
    ).join('');

    movingTicker.innerHTML = tickerHtml + tickerHtml;
  }
}

// Update tickers every second
setInterval(updateTickers, 1000);
updateTickers(); // Initial update

// Trade Execution
document.getElementById('trade-submit').addEventListener('click', function() {
  const instrument = document.getElementById('instrument-select').value;
  const rangeMin = document.getElementById('range-min').value;
  const rangeMax = document.getElementById('range-max').value;
  const percentage = document.getElementById('percentage').value;
  const stake = document.getElementById('stake').value;
  
  const tradeDetails = {
    instrument,
    rangeMin,
    rangeMax,
    percentage,
    stake,
    mode: currentMode,
    timestamp: new Date().toLocaleTimeString()
  };
  
  console.log('Trade Executed:', tradeDetails);
  alert(`
Trade ${currentMode === 'real' ? 'REAL' : 'DEMO'} Account:
Instrument: ${instrument}
Entry Range: ${rangeMin} - ${rangeMax}
Expected Change: ${percentage}%
Stake: $${stake}
Time: ${tradeDetails.timestamp}

Note: This is a prototype. Actual trades require broker integration.
  `);
});

// Instrument Quick Trade Buttons
document.querySelectorAll('.trade-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const instrument = this.dataset.instrument;
    document.getElementById('instrument-select').value = instrument;
    
    // Scroll to manual trading section
    document.querySelector('.manual-trading').scrollIntoView({ behavior: 'smooth' });
  });
});

// Trade Analyzer - Weighted digit cursor and active selection
function getDigitInfos() {
  return Array.from(document.querySelectorAll('.digit-circle')).map(circle => ({
    element: circle,
    digit: parseInt(circle.dataset.digit, 10),
    percent: parseFloat(circle.dataset.percent) || 0
  }));
}

function chooseWeightedDigit(digits) {
  const totalWeight = digits.reduce((sum, digit) => sum + digit.percent, 0);
  const threshold = Math.random() * totalWeight;
  let accumulator = 0;

  for (const item of digits) {
    accumulator += item.percent;
    if (threshold <= accumulator) {
      return item;
    }
  }

  return digits[digits.length - 1] || null;
}

function setActiveDigit(item) {
  if (!item) return;

  document.querySelectorAll('.digit-circle').forEach(circle => circle.classList.remove('active'));
  item.element.classList.add('active');

  const activeDigit = document.getElementById('active-digit');
  const activePercent = document.getElementById('active-percent');
  if (activeDigit) activeDigit.textContent = item.digit;
  if (activePercent) activePercent.textContent = `${item.percent.toFixed(1)}%`;

  const cursor = document.getElementById('digit-cursor');
  const row = document.getElementById('digit-circle-row');
  if (cursor && row && item.element) {
    const rowRect = row.getBoundingClientRect();
    const circleRect = item.element.getBoundingClientRect();
    const offset = circleRect.left - rowRect.left + (circleRect.width - cursor.offsetWidth) / 2;

    cursor.style.width = `${Math.max(50, circleRect.width * 0.85)}px`;
    cursor.style.transform = `translateX(${offset}px)`;
  }
}

function animateDigitCursor() {
  const digits = getDigitInfos();
  if (!digits.length) return;

  const selected = chooseWeightedDigit(digits);
  setActiveDigit(selected);
}

function attachDigitClickHandlers() {
  document.querySelectorAll('.digit-circle').forEach(circle => {
    circle.addEventListener('click', function() {
      const digit = parseInt(this.dataset.digit, 10);
      const percent = parseFloat(this.dataset.percent) || 0;
      setActiveDigit({ element: this, digit, percent });
    });
  });
}

attachDigitClickHandlers();
animateDigitCursor();
setInterval(animateDigitCursor, 1000);

// Form Validation
const instrumentSelect = document.getElementById('instrument-select');
if (instrumentSelect) {
  instrumentSelect.addEventListener('change', function() {
    console.log('Instrument selected:', this.value);
  });}


document.getElementById('range-min').addEventListener('input', function() {
  const maxInput = document.getElementById('range-max');
  if (parseInt(this.value) > parseInt(maxInput.value)) {
    maxInput.value = this.value;
  }
});

document.getElementById('range-max').addEventListener('input', function() {
  const minInput = document.getElementById('range-min');
  if (parseInt(this.value) < parseInt(minInput.value)) {
    minInput.value = this.value;
  }
});

// Log trading page loaded
console.log('Trading module loaded successfully');
