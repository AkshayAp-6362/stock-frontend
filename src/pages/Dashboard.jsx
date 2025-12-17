import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [portfolio, setPortfolio] = useState(user.portfolio || []);
  const [balance, setBalance] = useState(user.balance || 10000);
  const [prices, setPrices] = useState({});
  const [action, setAction] = useState({ type: 'BUY', ticker: 'GOOG', units: 1 });

  // 1. WebSocket Connection for Real-Time Prices
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PRICES') {
        setPrices(data.payload);
      }
    };

    return () => ws.close();
  }, []);

  // 2. Handle Buy/Sell
  const handleTrade = async () => {
    const endpoint = action.type === 'BUY' ? '/buy' : '/sell';
    try {
      const res = await axios.post(`https://stock-backend-1-fd5l.onrender.com`, {
        email: user.email,
        ticker: action.ticker,
        units: action.units
      });
      // Update local state with new portfolio data from server
      setPortfolio(res.data.portfolio);
      setBalance(res.data.balance);
    } catch (err) {
      alert(err.response?.data?.error || 'Trade failed');
    }
  };

  // 3. Calculations
  let totalPortfolioValue = 0;
  let totalInvested = 0;

  const portfolioItems = portfolio.map(item => {
    const currentPrice = parseFloat(prices[item.ticker]) || 0;
    const currentValue = currentPrice * item.units;
    const invested = item.avgCost * item.units;
    const pl = currentValue - invested;
    const plPercent = invested > 0 ? (pl / invested) * 100 : 0;

    totalPortfolioValue += currentValue;
    totalInvested += invested;

    return { ...item, currentPrice, currentValue, pl, plPercent };
  });

  const totalPL = totalPortfolioValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>TradePro Dashboard</h1>
        <div className="user-info">
          <span>{user.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="stats-container">
        <div className="card">
          <h3>Net Worth</h3>
          <h1>${(totalPortfolioValue + balance).toFixed(2)}</h1>
        </div>
        <div className="card">
          <h3>Portfolio Value</h3>
          <h2>${totalPortfolioValue.toFixed(2)}</h2>
        </div>
        <div className="card">
          <h3>Total P/L</h3>
          <h2 className={totalPL >= 0 ? 'green' : 'red'}>
            ${totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
          </h2>
        </div>
        <div className="card">
          <h3>Cash Balance</h3>
          <h2>${balance.toFixed(2)}</h2>
        </div>
      </div>

      <div className="main-content">
        {/* PORTFOLIO TABLE */}
        <div className="portfolio-section">
          <h3>Your Holdings</h3>
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Units</th>
                <th>Avg Cost</th>
                <th>Live Price</th>
                <th>Total Value</th>
                <th>P/L ($)</th>
                <th>P/L (%)</th>
              </tr>
            </thead>
            <tbody>
              {portfolioItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ticker}</td>
                  <td>{item.units}</td>
                  <td>${item.avgCost.toFixed(2)}</td>
                  <td className="live-price">${item.currentPrice.toFixed(2)}</td>
                  <td>${item.currentValue.toFixed(2)}</td>
                  <td className={item.pl >= 0 ? 'green' : 'red'}>
                    {item.pl >= 0 ? '+' : ''}{item.pl.toFixed(2)}
                  </td>
                  <td className={item.plPercent >= 0 ? 'green' : 'red'}>
                    {item.plPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TRADE FORM */}
        <div className="trade-section">
          <h3>Place Order</h3>
          <div className="trade-form">
            <select onChange={e => setAction({...action, type: e.target.value})}>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
            <select onChange={e => setAction({...action, ticker: e.target.value})}>
              {['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input 
              type="number" 
              min="1" 
              value={action.units} 
              onChange={e => setAction({...action, units: e.target.value})} 
            />
            <button 
              className={action.type === 'BUY' ? 'buy-btn' : 'sell-btn'} 
              onClick={handleTrade}
            >
              {action.type} {action.ticker}
            </button>
            <div className="est-price">
              Est. Price: ${(prices[action.ticker] * action.units || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
