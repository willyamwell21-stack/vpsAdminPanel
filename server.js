import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3002;

const API_URL = 'https://backend.psb.hosting';
const API_TOKEN = 'JbUTdTAnkxT6XJbD7MaxxFYWTnbdeZV8l0eShp2NkgvU9sBiNRZvZKIpAroZdPHpK4H4F_WsHSrPZGX1kyYoWiIbXLaqFndaqx-wfa6GnrFYv_sWnziwfe8vYAsDBENSMG_Zl7q3_MjpbFFiVrDB3XG8kXDaobgX5sr1Kg';

// Дозволяємо CORS для всіх запитів
app.use(cors());

// Endpoint для отримання замовлень
app.get('/api/order', async (req, res) => {
  try {
    console.log('📡 Proxy request to:', `${API_URL}/order`);
    
    const response = await axios({
      method: 'get',
      url: `${API_URL}/order`,
      headers: {
        'Authorization': API_TOKEN,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,uk;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Referer': 'https://backend.psb.hosting/',
        'Origin': 'https://backend.psb.hosting'
      },
      timeout: 30000,
      validateStatus: function (status) {
        return status < 500; // Не викидати помилку для статусів < 500
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.status === 403) {
      console.log('⚠️  Cloudflare blocked the request (403)');
      console.log('Response data:', typeof response.data === 'string' ? response.data.substring(0, 200) : response.data);
      return res.status(403).json({
        error: 'Cloudflare Protection',
        message: 'API is protected by Cloudflare and blocks automated requests',
        suggestion: 'Try accessing the API from Postman or contact API owner to whitelist your IP'
      });
    }
    
    console.log('✅ Success! Orders received:', response.data.length);
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      // Сервер відповів з помилкою
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      res.status(error.response.status).json({
        error: 'API Error',
        message: error.message,
        status: error.response.status,
        details: error.response.data
      });
    } else if (error.request) {
      // Запит був відправлений, але відповіді не отримано
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'No response from API server',
        details: error.message
      });
    } else {
      // Помилка при налаштуванні запиту
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('🚀 Proxy server started!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/order`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('\n⏳ Waiting for requests...\n');
});
