const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));

const users = [];

app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Missing required signup fields.' });
  }
  const exists = users.find((user) => user.email === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Email already registered.' });
  }
  users.push({ id: users.length + 1, fullName, email: email.toLowerCase(), password });
  return res.json({ message: 'Account created successfully.' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email.toLowerCase() && item.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials.' });
  }
  return res.json({ message: 'Login successful.', user: { id: user.id, fullName: user.fullName, email: user.email } });
});

app.get('/api/broker/account', (req, res) => {
  return res.json({
    accountId: 'VIS-123456',
    status: 'verified',
    balance: 12500.50,
    currency: 'USD',
    openPositions: 3,
    marginLevel: '42.3%'
  });
});

app.get('/api/broker/quote', (req, res) => {
  return res.json({
    instrument: 'EUR/USD',
    bid: 1.11324,
    ask: 1.11336,
    timestamp: new Date().toISOString(),
    expiry: '2026-06-17T16:00:00Z'
  });
});

app.use((req, res) => {
  res.status(404).send('Not found');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Server initialization
const server = app.listen(port, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] VISION.COM server running at http://localhost:${port}`);
  console.log(`[${timestamp}] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${timestamp}] Process ID: ${process.pid}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Graceful shutdown initiated...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SIGINT] Graceful shutdown initiated...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('[FATAL ERROR] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL ERROR] Unhandled Rejection at:', promise, 'Reason:', reason);
});
