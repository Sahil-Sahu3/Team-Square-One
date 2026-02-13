import api from "./axiosInstance";
export const authAPI = {
  register: (d) => api.post("/auth/register", d),
  login:    (d) => api.post("/auth/login", d),
  getMe:    ()  => api.get("/auth/me"),
};
export const predictionAPI = {
  logSales:   (d) => api.post("/prediction/log-sales", d),
  getForecast:()  => api.get("/prediction/forecast"),
  getHistory: ()  => api.get("/prediction/history"),
};
export const financeAPI = {
  addIncome:      (d) => api.post("/finance/income", d),
  addExpense:     (d) => api.post("/finance/expense", d),
  getSummary:     ()  => api.get("/finance/summary"),
  getWeeklyReport:()  => api.get("/finance/weekly-report"),
  getTransactions:(p) => api.get("/finance/transactions", { params: p }),
};
export const zoneAPI = {
  getAll:       (p) => api.get("/zones", { params: p }),
  getAvailable: ()  => api.get("/zones/availability"),
  checkIn:      (d) => api.post("/zones/check-in", d),
  checkOut:     (d) => api.post("/zones/check-out", d),
  create:       (d) => api.post("/zones", d),
};
export const communityAPI = {
  getFeed:    (p) => api.get("/community/feed", { params: p }),
  createPost: (d) => api.post("/community/post", d),
  addComment: (d) => api.post("/community/comment", d),
  vote:       (d) => api.post("/community/vote", d),
};
export const legalAPI = {
  getArticles:        (p) => api.get("/legal/articles", { params: p }),
  search:             (q) => api.get("/legal/search", { params: { q } }),
  getSafetyGuidelines:()  => api.get("/legal/safety-guidelines"),
  seed:               ()  => api.post("/legal/seed"),
};
export const alertsAPI = {
  getAlerts: () => api.get("/alerts").catch(() => ({ data: { data: [] } })),
};
