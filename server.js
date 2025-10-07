import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3002;

const API_URL = 'https://backend.psb.hosting';

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
        'Authorization': "5wBLu8g6mhRkXf1WySLOgiOmj5F2Go_F0x0VVN4ryh9xUPZhA2nzfEGG7FXeX_WJfQRLIMXowLkxh-PjfLJTQyyAZbB7ZxafiaXwZUwD_0tmur6Rt6lRe-71guOvcQnhoD8u3iXT3wi-dAostaxl93a7yFMwKEspujmANA",
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
