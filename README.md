# 📈 Real-Time Stock Trading Simulator (MERN Stack)

A full-stack web application that simulates a real-time stock market. Users can register, manage a portfolio, and buy/sell stocks using virtual currency. The app features live price updates via WebSockets and a secure authentication system.

## 🚀 Live Demo
* **Frontend (Vercel):** [Click Here to View App](https://stock-frontend88.vercel.app/login) 
* **Backend hosted on Render and is live.

---

## ✨ Features
* **User Authentication:** Secure Login and Registration system using JWT and Bcrypt.
* **Real-Time Market Data:** Live stock price updates every second using **WebSockets**.
* **Virtual Trading:** Buy and Sell stocks (GOOG, TSLA, AMZN, etc.) with a virtual cash balance.
* **Portfolio Management:** Track holdings, average cost, and real-time Profit/Loss calculation.
* **Responsive Dashboard:** Clean UI to view net worth, available cash, and transaction history.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, CSS3, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud)
* **Real-Time Communication:** `ws` (WebSocket)
* **Authentication:** JSON Web Tokens (JWT)

---

## 📂 Project Structure
```bash
/stock-app
├── frontend/       # React Client Application
│   ├── src/
│   │   ├── pages/  # Dashboard, Login, Register
│   │   └── App.js
├── backend/        # Node/Express Server
│   ├── server.js   # Main entry point (API + WebSockets)
│   ├── models/     # Mongoose Schemas
└── README.md
