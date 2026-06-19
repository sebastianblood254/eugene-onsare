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
  SI: { price: 5234.50, change: 2.45 },
  CFD: { price: 3821.75, change: 1.82 },
  STEP: { price: 2156.25, change: -0.95 }
};

function updateTickers() {
  Object.keys(tickerData).forEach(symbol => {
    const ticker = tickerData[symbol];
    
    // Simulate random price movement
    const randomChange = (Math.random() - 0.5) * 0.5;
    ticker.price += randomChange;
    ticker.change += randomChange * 0.1;
    
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
      `SI: ${tickerData.SI.price.toFixed(2)}`,
      `CFD: ${tickerData.CFD.price.toFixed(2)}`,
      `STEP: ${tickerData.STEP.price.toFixed(2)}`
    ];
    
    movingTicker.innerHTML = items.map(item => 
      `<span class="ticker-item">${item}</span>`
    ).join('');
  }
}

// Update tickers every 2 seconds
setInterval(updateTickers, 2000);
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

// Trade Analyzer - Update digit percentages dynamically
function updateDigitAnalyzer() {
  document.querySelectorAll('.digit-card').forEach(card => {
    const digit = card.dataset.digit;
    
    // Simulate percentage changes
    const randomPercentage = (Math.random() - 0.5) * 10;
    const percentageEl = card.querySelector('.digit-percentage');
    
    if (percentageEl) {
      percentageEl.textContent = `${randomPercentage >= 0 ? '+' : ''}${randomPercentage.toFixed(1)}%`;
      const percentageClass = randomPercentage >= 0 ? 'positive' : 'negative';
      percentageEl.className = `digit-percentage ${percentageClass}`;
    }
    
    // Simulate digit value changes
    const randomDigit = Math.floor(Math.random() * 10);
    const valueEl = card.querySelector('.digit-value');
    if (valueEl) {
      valueEl.textContent = randomDigit;
    }
  });
}

// Update analyzer every 3 seconds
setInterval(updateDigitAnalyzer, 3000);

// Digit Card Click - Show detailed analysis
document.querySelectorAll('.digit-card').forEach(card => {
  card.addEventListener('click', function() {
    const digit = this.dataset.digit;
    const percentage = this.querySelector('.digit-percentage').textContent;
    const frequency = this.querySelector('.digit-frequency').textContent;
    
    console.log(`Digit ${digit} Analysis:`, { percentage, frequency });
    alert(`
Digit ${digit} Analysis:
${percentage}
${frequency}

Recommendation: Monitor this digit for trading patterns.
    `);
  });
});

// Form Validation
document.getElementById('instrument-select').addEventListener('change', function() {
  console.log('Instrument selected:', this.value);
});

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
