# VendorVoice — All Dependencies

## Quick Install (One Command Each)

### Backend — paste in /backend folder:
```bash
npm install bcryptjs cors dotenv express express-rate-limit jsonwebtoken mongoose nodemon
```

### Frontend — paste in /frontend folder:
```bash
npm install axios chart.js react react-chartjs-2 react-dom react-hot-toast react-router-dom leaflet react-leaflet
```

---

## Full Dependency List

### Backend (`backend/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | Web server framework |
| `mongoose` | ^8.0.3 | MongoDB object modeling |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT token creation & verification |
| `cors` | ^2.8.5 | Allow frontend to call backend |
| `dotenv` | ^16.3.1 | Load .env variables |
| `express-rate-limit` | ^7.1.5 | Rate limiting (anti-abuse) |
| `nodemon` | ^3.0.2 | Auto-restart server on file change (dev) |

### Frontend (`frontend/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI library |
| `react-dom` | ^18.2.0 | React DOM rendering |
| `react-router-dom` | ^6.21.1 | Frontend routing |
| `axios` | ^1.6.2 | HTTP requests to backend |
| `react-hot-toast` | ^2.4.1 | Toast notifications |
| `chart.js` | ^4.4.1 | Chart rendering engine |
| `react-chartjs-2` | ^5.2.0 | React wrapper for Chart.js |
| `leaflet` | ^1.9.4 | Map library |
| `react-leaflet` | ^4.2.1 | React wrapper for Leaflet maps |
| `vite` | ^5.0.8 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.2.1 | Vite plugin for React |

---

## Node.js Requirement
Node.js version **18 or higher** required.
Check: `node --version`
Download: https://nodejs.org

## MongoDB
Free cloud database: https://mongodb.com/atlas
- Sign up → Create cluster → Free tier (M0)
- Network Access → Allow from anywhere (0.0.0.0/0)
- Connect → Drivers → Copy URI
- Paste in `backend/.env` as `MONGO_URI=...`
