const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 3000;

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'status']
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);

// Middleware for logging and measuring requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds.labels(req.path).observe(duration);
    httpRequestsTotal.labels(req.path, res.statusCode).inc();
  });
  next();
});

// Simulate an error
function simulateError() {
  if (Math.random() < 0.2) { // 20% chance of error
    throw new Error('Random error occurred');
  }
}

// Root route
app.get('/', (req, res) => {
  try {
    simulateError();
    res.json({ message: 'Welcome to the server. Use /fast or /slow routes.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Fast route
app.get('/fast', (req, res) => {
  try {
    simulateError();
    res.json({ message: 'Hello! This is the fast route.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Slow route with heavy task
app.get('/slow', (req, res) => {
  try {
    simulateError();
    const startTime = Date.now();
    while (Date.now() - startTime < 5000) {
      Math.random() * Math.random();
    }
    res.json({ message: 'Heavy task completed. This was the slow route.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available routes:');
  console.log('  - /');
  console.log('  - /fast');
  console.log('  - /slow');
  console.log('  - /metrics');
});