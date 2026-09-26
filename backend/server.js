const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const jobListingRoutes = require('./routes/jobListings');
const workerListingRoutes = require('./routes/workerListings');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/job-listings', jobListingRoutes);
app.use('/api/worker-listings', workerListingRoutes);

app.use((error, _request, response, _next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError' || error instanceof SyntaxError) {
    return response.status(400).json({ error: error.message });
  }

  console.error('API error:', error);
  return response.status(500).json({ error: 'Sunucuda beklenmeyen bir hata oluştu.' });
});

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGO_URI tanımlı değil. backend/.env dosyasını kontrol edin.');
  }

  await mongoose.connect(mongoUri);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Ustamol API http://0.0.0.0:${port} adresinde çalışıyor.`);
    console.log('MongoDB bağlantısı kuruldu.');
  });
}

startServer().catch((error) => {
  console.error('Sunucu başlatılamadı:', error.message);
  process.exit(1);
});
