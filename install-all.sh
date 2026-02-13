#!/bin/bash
# ─────────────────────────────────────────────────────────────
# VendorVoice — Install Everything & Start
# Run this once after unzipping:  bash install-all.sh
# ─────────────────────────────────────────────────────────────

echo ""
echo "🛒  VendorVoice — Installing all dependencies..."
echo ""

# Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅  All dependencies installed!"
echo ""
echo "─────────────────────────────────────────────────"
echo "  NEXT STEPS:"
echo ""
echo "  1. cd backend"
echo "     cp .env.example .env"
echo "     → Edit .env: paste your MONGO_URI and set JWT_SECRET"
echo ""
echo "  2. Open TWO terminals:"
echo ""
echo "     Terminal 1:  cd backend  && npm run dev"
echo "     Terminal 2:  cd frontend && npm run dev"
echo ""
echo "  3. Open: http://localhost:5173"
echo ""
echo "  4. After first login, go to Legal tab → Populate DB"
echo "─────────────────────────────────────────────────"
