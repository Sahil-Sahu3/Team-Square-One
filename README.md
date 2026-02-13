# 🛒 VendorVoice — Street Vendor Empowerment Platform

## QUICK START (5 minutes)

### 1. MongoDB Atlas
1. Go to mongodb.com/atlas → free account → free M0 cluster
2. Network Access → Allow from anywhere (0.0.0.0/0)
3. Connect → Drivers → copy the URI string

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
# → http://localhost:5000/api/health 
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173 
```

### 4. First time setup (after logging in)
- Go to  Legal tab → click "Populate DB" to seed legal articles
- Go to  Zones tab → click "+ Add Zone" to create vending zones

---

## API ENDPOINTS

### Auth
```
POST /api/auth/register   { name, phone, password }
POST /api/auth/login      { phone, password }
GET  /api/auth/me         (token required)
```

### Demand Prediction
```
POST /api/prediction/log-sales   { date, itemsSold, revenue }
GET  /api/prediction/forecast
GET  /api/prediction/history
```

### Finance
```
POST /api/finance/income        { amount, category, note }
POST /api/finance/expense       { amount, category, note }
GET  /api/finance/summary
GET  /api/finance/weekly-report
GET  /api/finance/transactions
```

### Zones
```
GET  /api/zones
GET  /api/zones/availability
POST /api/zones/check-in    { zoneId }
POST /api/zones/check-out   { zoneId }
POST /api/zones             { name, city, capacity, coordinates }
```

### Community
```
GET  /api/community/feed
POST /api/community/post     { title, content, category }
POST /api/community/comment  { postId, content }
POST /api/community/vote     { postId }
```

### Legal
```
GET  /api/legal/articles
GET  /api/legal/search?q=keyword
GET  /api/legal/safety-guidelines
POST /api/legal/seed   (run once to populate)
```

---

## 5 BACKEND IMPLEMENTATIONS

1. **JWT Auth** — register/login with bcrypt + JWT tokens
2. **Demand Prediction** — linear regression on 7-day sales history
3. **Finance Engine** — MongoDB aggregation for income/expense/profit
4. **Zone Management** — capacity tracking, check-in/out system
5. **Community Board** — posts, nested comments, upvote system

---

## DEPLOY

### Backend → Render.com
- Build: `npm install`
- Start: `node app.js`
- Add env vars from .env

### Frontend → Vercel
- Framework: Vite
- Add env: `VITE_API_URL=https://your-backend.onrender.com`
