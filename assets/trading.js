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

const botSignal = {
  digit: 5,
  percent: 10.0,
  time: new Date()
};

function updateBotSignalDisplay() {
  const digitEl = document.getElementById('last-cursor-digit');
  const percentEl = document.getElementById('last-cursor-percent');
  const timeEl = document.getElementById('last-cursor-time');
  const instrumentEl = document.getElementById('bot-selected-instrument');
  const instrument = document.getElementById('instrument-select')?.value || 'VOL10';

  if (digitEl) digitEl.textContent = botSignal.digit;
  if (percentEl) percentEl.textContent = `${botSignal.percent.toFixed(1)}%`;
  if (timeEl) timeEl.textContent = botSignal.time.toLocaleTimeString();
  if (instrumentEl) instrumentEl.textContent = instrument;
}

function recordBotSignal(item) {
  botSignal.digit = item.digit;
  botSignal.percent = item.percent;
  botSignal.time = new Date();
  updateBotSignalDisplay();
}


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

function getAccountBalance(account) {
  const stored = localStorage.getItem(account === 'real' ? 'visionRealBalance' : 'visionDemoBalance');
  return stored ? parseFloat(stored) : account === 'real' ? 0 : 10000;
}

function setAccountBalance(account, value) {
  const key = account === 'real' ? 'visionRealBalance' : 'visionDemoBalance';
  localStorage.setItem(key, value.toFixed(2));
}

function formatAmount(value) {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function executeTrade(instrument, stake) {
  const account = currentMode === 'real' ? 'real' : 'demo';
  const balance = getAccountBalance(account);
  const stakeAmount = parseFloat(stake);

  if (Number.isNaN(stakeAmount) || stakeAmount <= 0) {
    alert('Enter a valid stake amount.');
    return false;
  }

  if (stakeAmount > balance) {
    alert(`Insufficient ${account} balance. Please deposit funds or reduce the stake.`);
    return false;
  }

  const pnl = (Math.random() - 0.5) * stakeAmount * 0.8;
  const updatedBalance = balance + pnl;
  setAccountBalance(account, updatedBalance);
  const result = pnl >= 0 ? 'profit' : 'loss';

  alert(`Trade ${currentMode === 'real' ? 'REAL' : 'DEMO'} Account:\nInstrument: ${instrument}\nStake: $${formatAmount(stakeAmount)}\nResult: ${result} ${formatAmount(Math.abs(pnl))}\nNew ${account} balance: $${formatAmount(updatedBalance)}`);
  console.log('Trade executed:', { instrument, stake: stakeAmount, account, pnl, updatedBalance });
  return true;
}

// Trade Execution
document.getElementById('trade-submit').addEventListener('click', function() {
  const instrument = document.getElementById('instrument-select').value;
  const rangeMin = document.getElementById('range-min').value;
  const rangeMax = document.getElementById('range-max').value;
  const percentage = document.getElementById('percentage').value;
  const stake = document.getElementById('stake').value;

  if (executeTrade(instrument, stake)) {
    const accountType = currentMode === 'real' ? 'visionRealBalance' : 'visionDemoBalance';
    const newBalance = getAccountBalance(currentMode === 'real' ? 'real' : 'demo');
    localStorage.setItem(accountType, newBalance.toFixed(2));
  }
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

// Trade Chart controls
const chartMarketSelect = document.getElementById('chart-market-select');
const chartTimeframeSelect = document.getElementById('chart-timeframe-select');
const chartResetBtn = document.getElementById('chart-reset');
const chartPlaceholder = document.getElementById('chart-placeholder');
const chartSeriesEl = document.getElementById('chart-series');
const chartIndicatorLayer = document.getElementById('chart-indicator-layer');
const chartBottomAxis = document.getElementById('chart-bottom-axis');
const indicatorPills = Array.from(document.querySelectorAll('.indicator-pill'));
const indicatorSummary = document.getElementById('indicator-summary');

function getSelectedIndicators() {
  return indicatorPills.filter(btn => btn.classList.contains('active')).map(btn => btn.dataset.indicator);
}

function getChartMarketText(key) {
  if (key.startsWith('VOL')) {
    return `Volatility ${key.replace('VOL', '')} Index`;
  }
  if (key === 'CFD') return 'CFD Index';
  if (key === 'STEP') return 'Step Index';
  return key;
}

function getTimeframePoints(timeframe) {
  switch (timeframe) {
    case '1m': return 24;
    case '5m': return 28;
    case '15m': return 32;
    case '1h': return 36;
    case '4h': return 38;
    case '24h': return 40;
    case '1w': return 44;
    default: return 36;
  }
}

function getMarketVolatility(market) {
  if (market.startsWith('VOL')) {
    return parseInt(market.replace('VOL', ''), 10) || 20;
  }
  if (market === 'CFD') return 25;
  if (market === 'STEP') return 35;
  return 20;
}

function generateChartSeries(market, timeframe) {
  const count = getTimeframePoints(timeframe);
  const basePrice = tickerData[market]?.price || 5000;
  const volatility = getMarketVolatility(market) / 50;
  const series = [];
  let previousClose = basePrice * (0.98 + Math.random() * 0.04);

  for (let index = 0; index < count; index += 1) {
    const open = previousClose;
    const range = previousClose * volatility * (0.15 + Math.random() * 0.35);
    const change = (Math.random() - 0.5) * range;
    const close = Math.max(10, open + change);
    const high = Math.max(open, close) + Math.abs(range * (0.1 + Math.random() * 0.15));
    const low = Math.min(open, close) - Math.abs(range * (0.1 + Math.random() * 0.15));
    const timestamp = new Date(Date.now() - (count - index - 1) * 1000 * 60 * Math.max(1, parseInt(timeframe, 10) || 60));

    series.push({ open, high, low, close, timestamp });
    previousClose = close;
  }

  return series;
}

function formatChartLabel(timestamp, timeframe, index, count) {
  const options = { hour: '2-digit', minute: '2-digit' };
  if (timeframe === '1w') {
    return timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (timeframe === '24h' || timeframe === '4h' || timeframe === '1h') {
    return timestamp.toLocaleTimeString(undefined, options);
  }
  if (timeframe === '15m' || timeframe === '5m' || timeframe === '1m') {
    return timestamp.toLocaleTimeString(undefined, options);
  }
  return timestamp.toLocaleDateString();
}

function calculateIndicator(values, type) {
  if (!values || !values.length) return [];
  const period = 8;
  const result = [];

  if (type === 'SMA') {
    for (let i = 0; i < values.length; i += 1) {
      const slice = values.slice(Math.max(0, i - period + 1), i + 1);
      const avg = slice.reduce((sum, value) => sum + value, 0) / slice.length;
      result.push(avg);
    }
    return result;
  }

  if (type === 'EMA') {
    const k = 2 / (period + 1);
    let ema = values[0];
    result.push(ema);
    for (let i = 1; i < values.length; i += 1) {
      ema = values[i] * k + ema * (1 - k);
      result.push(ema);
    }
    return result;
  }

  if (type === 'RSI') {
    let gain = 0;
    let loss = 0;
    for (let i = 1; i < values.length; i += 1) {
      const diff = values[i] - values[i - 1];
      gain += Math.max(0, diff);
      loss += Math.max(0, -diff);
      if (i >= period) {
        const avgGain = gain / period;
        const avgLoss = loss / period || 1;
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
        const prevDiff = values[i - period + 1] - values[i - period];
        gain -= Math.max(0, prevDiff);
        loss -= Math.max(0, -prevDiff);
      } else {
        result.push(50);
      }
    }
    result.unshift(50);
    return result;
  }

  if (type === 'MACD') {
    const fast = calculateIndicator(values, 'EMA');
    const slow = calculateIndicator(values, 'SMA');
    const macd = values.map((_, index) => {
      const f = fast[index] || values[index];
      const s = slow[index] || values[index];
      return f - s;
    });
    return macd;
  }

  return [];
}

function buildSvgLine(values, min, max, color, dashArray) {
  if (!values.length) return '';
  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - ((value - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  });
  return `<polyline fill="none" stroke="${color}" stroke-width="2" ${dashArray ? `stroke-dasharray="${dashArray}"` : ''} points="${coords.join(' ')}" />`;
}

function renderCandleSeries(series) {
  if (!chartSeriesEl) return;
  chartSeriesEl.innerHTML = '';
  const highs = series.map(c => c.high);
  const lows = series.map(c => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  series.forEach(candle => {
    const candleEl = document.createElement('div');
    candleEl.className = 'chart-candle';
    const bodyHeight = Math.max(2, Math.abs(candle.close - candle.open) / range * 100);
    const wickTop = (max - candle.high) / range * 100;
    const wickBottom = (max - candle.low) / range * 100;
    const bodyTop = (max - Math.max(candle.open, candle.close)) / range * 100;
    const bodyColor = candle.close >= candle.open ? '#16a34a' : '#dc2626';

    const wick = document.createElement('div');
    wick.className = 'candle-wick';
    wick.style.top = `${wickTop}%`;
    wick.style.height = `${Math.max(2, wickBottom - wickTop)}%`;

    const body = document.createElement('div');
    body.className = 'candle-body';
    body.style.top = `${bodyTop}%`;
    body.style.height = `${bodyHeight}%`;
    body.style.background = bodyColor;

    candleEl.appendChild(wick);
    candleEl.appendChild(body);
    chartSeriesEl.appendChild(candleEl);
  });
}

function renderIndicatorOverlay(series, indicators) {
  if (!chartIndicatorLayer) return;
  chartIndicatorLayer.innerHTML = '';
  const closeValues = series.map(c => c.close);
  const highs = series.map(c => c.high);
  const lows = series.map(c => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);

  const activeIndicators = indicators.filter(name => ['EMA', 'SMA', 'RSI', 'MACD', 'Bollinger'].includes(name));
  if (!activeIndicators.length) return;

  const lines = activeIndicators.map(name => {
    const values = calculateIndicator(closeValues, name);
    const color = name === 'EMA' ? '#2563eb' : name === 'SMA' ? '#f59e0b' : name === 'RSI' ? '#8b5cf6' : name === 'MACD' ? '#10b981' : '#0ea5e9';
    const dash = name === 'RSI' || name === 'MACD' ? '6 4' : '';
    return buildSvgLine(values, min, max, color, dash);
  }).join('');

  chartIndicatorLayer.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>`;
}

function renderBottomAxis(series) {
  if (!chartBottomAxis) return;
  chartBottomAxis.innerHTML = '';
  const timeframe = chartTimeframeSelect?.value || '24h';
  const count = series.length;
  const markers = [0, Math.floor(count / 2), count - 1];
  markers.forEach(index => {
    const label = document.createElement('span');
    label.textContent = formatChartLabel(series[index].timestamp, timeframe, index, count);
    chartBottomAxis.appendChild(label);
  });
}

function updateChartDisplay() {
  const market = chartMarketSelect?.value || 'VOL25';
  const timeframe = chartTimeframeSelect?.value || '24h';
  const title = document.getElementById('chart-title');
  const indicators = getSelectedIndicators();

  if (title) {
    title.textContent = `${getChartMarketText(market)} • ${timeframe}`;
  }
  if (chartPlaceholder) {
    const overlay = chartPlaceholder.querySelector('.chart-overlay');
    if (overlay) {
      overlay.textContent = `${getChartMarketText(market)} • ${timeframe} • ${indicators.join(', ') || 'No indicators'}`;
    }
  }
  if (indicatorSummary) {
    indicatorSummary.textContent = indicators.join(', ') || 'None';
  }

  const series = generateChartSeries(market, timeframe);
  renderCandleSeries(series);
  renderIndicatorOverlay(series, indicators);
  renderBottomAxis(series);
}

if (chartMarketSelect) {
  chartMarketSelect.addEventListener('change', updateChartDisplay);
}
if (chartTimeframeSelect) {
  chartTimeframeSelect.addEventListener('change', updateChartDisplay);
}
if (chartResetBtn) {
  chartResetBtn.addEventListener('click', function () {
    if (chartMarketSelect) chartMarketSelect.value = 'VOL25';
    if (chartTimeframeSelect) chartTimeframeSelect.value = '24h';
    indicatorPills.forEach(btn => {
      btn.classList.remove('active');
    });
    indicatorPills.slice(0, 3).forEach(btn => btn.classList.add('active'));
    updateChartDisplay();
  });
}

indicatorPills.forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('active');
    updateChartDisplay();
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

  recordBotSignal(item);
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
updateBotSignalDisplay();

const botTradeBtn = document.getElementById('bot-trade-btn');
const botTradeMessage = document.getElementById('bot-trade-message');
if (botTradeBtn) {
  botTradeBtn.addEventListener('click', function () {
    const instrument = document.getElementById('instrument-select')?.value || 'VOL10';
    const lastTick = botSignal.digit;
    const lastWeight = botSignal.percent.toFixed(1);
    const tradeValue = tickerData[instrument]?.price.toFixed(2) || 'N/A';
    const tradeResult = `Bot trade executed on ${instrument} at ${tradeValue} using tick ${lastTick} (${lastWeight}%)`;

    if (botTradeMessage) {
      botTradeMessage.hidden = false;
      botTradeMessage.textContent = tradeResult;
      botTradeMessage.className = 'bot-trade-message bot-trade-success';
    }

    console.log(tradeResult);
  });
}

// Form Validation
const instrumentSelect = document.getElementById('instrument-select');
if (instrumentSelect) {
  instrumentSelect.addEventListener('change', function() {
    updateBotSignalDisplay();
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
