# Team-Square-One
 
# Vikreta Vikas
A full-stack web application built using modern technologies.

## Project Overview
Vikreta Vikas is a web application designed to manage vendors, zones, earnings, and settings through a clean dashboard interface.

This project includes:
- Frontend built with React + Vite
- Backend built with Node.js & Express
- MongoDB database

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Project Structure
                ┌──────────────────────────────┐
                │         STREET VENDOR        │
                │  (Mobile / Low-end Device)   │
                └──────────────┬───────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  React Frontend UI  │
                    │ (Vite Web App)      │
                    │ Home | Alerts |     │
                    │ Zones | Income |    │
                    │ Community | Legal   │
                    └─────────┬───────────┘
                              │ API Calls (Axios)
                              ▼
                 ┌──────────────────────────────┐
                 │        Express Server        │
                 │         (app.js)             │
                 └───────┬───────────┬─────────┘
                         │           │
                         ▼           ▼
          ┌──────────────────┐   ┌──────────────────┐
          │ Auth Middleware  │   │ Error Middleware │
          │ (JWT Verify)     │   │ Validation       │
          └───────┬──────────┘   └─────────┬────────┘
                  │                          │
                  ▼                          ▼

        ┌──────────────────────────────────────────────┐
        │                API ROUTES                    │
        │ authRoutes | financeRoutes | zoneRoutes      │
        │ communityRoutes | legalRoutes | prediction    │
        └───────────────┬──────────────────────────────┘
                        ▼

        ┌──────────────── CONTROLLERS ────────────────┐
        │                                              │
        │ AuthController       → Login / Register      │
        │ FinanceController    → Income / Expenses     │
        │ ZoneController       → Smart Vending Zones   │
        │ CommunityController  → Posts & Groups        │
        │ LegalController      → Safety Guidelines     │
        │ PredictionController → Demand Forecast       │
        │                                              │
        └───────────────┬──────────────────────────────┘
                        ▼

            ┌─────────────────────────────────┐
            │        BUSINESS SERVICES        │
            │ PredictionService (AI Logic)    │
            │ Profit Calculations             │
            │ Data Aggregation                │
            └───────────────┬─────────────────┘
                            ▼

                 ┌──────────────────────────┐
                 │        MongoDB Atlas     │
                 │                          │
                 │ Users                    │
                 │ Sales                    │
                 │ Transactions             │
                 │ Zones                    │
                 │ Community Posts          │
                 │ Legal Records            │
                 └─────────────┬────────────┘
                               ▼

                   ┌────────────────────────┐
                   │ AI Prediction Output   │
                   │ Recommended Zone       │
                   │ Expected Demand        │
                   │ Profit Insights        │
                   └────────────┬───────────┘
                                ▼
                    Back to Vendor Dashboard





