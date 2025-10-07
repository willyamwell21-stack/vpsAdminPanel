# 🚀 Інструкції для деплою (Реліз)

## Проблема з Cloudflare

API `backend.psb.hosting` захищений Cloudflare і блокує всі автоматичні запити з браузера та Node.js. Тому потрібен **серверний проксі**.

---

## ✅ Рішення 1: Деплой на Vercel (РЕКОМЕНДОВАНО)

### Крок 1: Підготовка

```bash
npm install
npm run build
```

### Крок 2: Встановіть Vercel CLI

```bash
npm install -g vercel
```

### Крок 3: Деплой

```bash
vercel
```

Vercel автоматично:
- Задеплоїть React додаток
- Запустить Express сервер як serverless function
- Надасть вам URL (наприклад: `https://your-app.vercel.app`)

### Крок 4: Оновіть API_URL

У файлі `src/App.jsx` змініть:

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://your-app.vercel.app/api'  // Замініть на ваш реальний URL
  : 'http://localhost:3002/api'
```

### Крок 5: Передеплойте

```bash
vercel --prod
```

---

## ✅ Рішення 2: PHP хостинг

Якщо у вас є PHP хостинг:

### Крок 1: Завантажте файли

1. Збудуйте React: `npm run build`
2. Завантажте папку `dist/` на хостинг
3. Завантажте файл `api.php` в корінь

### Крок 2: Оновіть API_URL

У `src/App.jsx`:

```javascript
const API_URL = 'https://your-domain.com/api.php'
```

### Крок 3: Перебудуйте та завантажте

```bash
npm run build
```

Завантажте оновлену папку `dist/`

---

## ✅ Рішення 3: Власний VPS

### Крок 1: Встановіть Node.js на сервері

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Крок 2: Завантажте проект

```bash
git clone your-repo
cd vpsAdminPanels
npm install
npm run build
```

### Крок 3: Запустіть сервер з PM2

```bash
pm2 start server.js --name vps-proxy
pm2 startup
pm2 save
```

### Крок 4: Налаштуйте Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # React додаток
    location / {
        root /path/to/vpsAdminPanels/dist;
        try_files $uri $uri/ /index.html;
    }

    # API проксі
    location /api/ {
        proxy_pass http://localhost:3002/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ⚠️ Важливо!

### Якщо Cloudflare все одно блокує:

1. **Зверніться до власника API** `backend.psb.hosting`:
   - Попросіть додати ваш домен/IP до whitelist
   - Попросіть налаштувати CORS
   - Можливо, потрібен інший токен

2. **Перевірте токен**:
   - Токен може бути застарілим
   - Спробуйте отримати новий токен

3. **Використайте Postman**:
   - Якщо в Postman працює, а на сервері ні - проблема в Cloudflare
   - Потрібно whitelist IP вашого хостингу

---

## 📝 Змінні оточення (опціонально)

Створіть `.env` файл:

```env
VITE_API_URL=https://your-app.vercel.app/api
```

У `App.jsx`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
```

---

## 🧪 Тестування

### Локально:
```bash
npm run server  # Термінал 1
npm run dev     # Термінал 2
```

### Продакшн:
```bash
npm run build
npm run preview
```

---

## 📞 Підтримка

Якщо виникають проблеми з Cloudflare - це **не помилка вашого коду**. Потрібно звернутися до власника API для налаштування доступу.
