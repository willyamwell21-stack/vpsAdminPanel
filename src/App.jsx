import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Для розробки: http://localhost:3002/api
// Для продакшену: замініть на URL вашого хостингу (наприклад: https://your-app.vercel.app/api)
const API_URL = import.meta.env.PROD 
  ? 'https://your-app.vercel.app/api'  // Замініть на ваш домен після деплою
  : 'http://localhost:3002/api'

function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const loadOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_URL}/order`,
        headers: { 
          'Authorization': API_TOKEN
        }
      }

      const response = await axios(config)
      setOrders(response.data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="container">
      <div className="header">
        <h1>🖥️ VPS Orders Dashboard</h1>
        <p>Управління замовленнями VPS серверів</p>
      </div>

      <div className="controls">
        <div className="info-text">
          {loading ? 'Завантаження...' : `Всього замовлень: ${orders.length}`}
        </div>
        <button 
          className="btn" 
          onClick={loadOrders}
          disabled={loading}
        >
          🔄 Оновити дані
        </button>
      </div>

      <div className="content">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Завантаження даних...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <h3>❌ Помилка завантаження даних</h3>
            <p><strong>Повідомлення:</strong> {error.message}</p>
            {error.response && <p><strong>Статус:</strong> {error.response.status}</p>}
            <p>Перевірте з'єднання з API та токен авторизації.</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="no-data">
            <p>📭 Немає даних для відображення</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID Замовлення</th>
                  <th>Продукт</th>
                  <th>ОС</th>
                  <th>Панель управління</th>
                  <th>Дані сервера</th>
                  <th>Статус</th>
                  <th>Дата створення</th>
                  <th>Дата закінчення</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.order_id}</strong></td>
                    <td>
                      <div className="product-info">
                        <span className="product-title">{order.product.title}</span>
                        <span className="product-details">
                          {order.product.type} | {order.product.country} | ${order.product.price}
                        </span>
                      </div>
                    </td>
                    <td>{order.os || 'N/A'}</td>
                    <td>{order.control_panel?.name || 'N/A'}</td>
                    <td>
                      {order.issued_order ? (
                        <div className="server-info">
                          <strong>IP:</strong> {order.issued_order.ip}<br />
                          <strong>Port:</strong> {order.issued_order.port}<br />
                          <strong>User:</strong> {order.issued_order.superuser}<br />
                          <strong>Pass:</strong> {order.issued_order.password}
                        </div>
                      ) : (
                        'Не видано'
                      )}
                    </td>
                    <td>
                      <span className="status-badge status-issued">{order.status}</span>
                    </td>
                    <td>{formatDate(order.date_create)}</td>
                    <td>{formatDate(order.date_end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
