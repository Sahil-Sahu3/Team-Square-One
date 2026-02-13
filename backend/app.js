require("dotenv").config();

const express   = require("express");
const cors      = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/prediction", require("./routes/predictionRoutes"));
app.use("/api/finance",    require("./routes/financeRoutes"));
app.use("/api/zones",      require("./routes/zoneRoutes"));
app.use("/api/community",  require("./routes/communityRoutes"));
app.use("/api/legal",      require("./routes/legalRoutes"));

app.get("/api/health", (_, res) => res.json({ success: true, message: "VendorVoice API running ✅" }));
app.all("*", (req, res) => res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 VendorVoice API running on http://localhost:${PORT}`);
  console.log(`
  📋 FIRST TIME SETUP:
  1. POST /api/auth/register  → create your account
  2. POST /api/auth/login     → get your token
  3. POST /api/legal/seed     → populate legal articles
  4. POST /api/zones          → seed some zones
  `);
});
