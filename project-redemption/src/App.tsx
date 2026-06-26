import React, { useState, useEffect } from 'react';
import Login from './Login';
import { api } from './api';
import './App.css';

// Reconciled strictly to match Supabase database schema
interface Asset {
  id: string;
  symbol: string;
  units: number;
  avg_price: number;
}

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [assets, setAssets] = useState<Asset[]>([]);

  // Modal States
  const [modalMode, setModalMode] = useState<'ADD' | null>(null);
  const [formSymbol, setFormSymbol] = useState('');
  const [formUnits, setFormUnits] = useState('');
  const [formPrice, setFormPrice] = useState('');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // TRIGGER: Fetch live Postgres data the moment userId sets
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const data = await api.getAssets(userId);
        setAssets(data);
      } catch (err) {
        console.error("FastAPI connection failed:", err);
      }
    };

    loadData();
  }, [userId]);

  // ACTION: Save to Supabase via FastAPI
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const uNum = parseFloat(formUnits) || 0;
    const pNum = parseFloat(formPrice) || 0;

    try {
      const savedRows = await api.addAsset(userId, formSymbol, uNum, pNum);
      // Supabase returns an array of inserted objects; take the first one
      const newRow = savedRows[0]; 
      setAssets([...assets, newRow]);
      setModalMode(null);
    } catch (err) {
      alert("Failed to save to database!");
    }
  };

  // ACTION: Delete from Supabase via FastAPI
  const handleDelete = async (id: string, symbol: string) => {
    if (!userId) return;
    if (!window.confirm(`Delete ${symbol}?`)) return;

    try {
      await api.deleteAsset(userId, id);
      setAssets(assets.filter(a => a.id !== id));
    } catch (err) {
      alert("Failed to delete from database!");
    }
  };

  const totalInvested = assets.reduce((sum, a) => sum + (a.units * a.avg_price), 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + (a.units * a.avg_price), 0);
  
  const overallProfit = totalCurrentValue - totalInvested;
  const isOverallPositive = overallProfit >= 0;

  if (!userId) {
    return (
      <div className={`app-container ${theme}`}>
        <Login onLoginSuccess={(id) => setUserId(id)} theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      <nav className="navbar">
        <div className="nav-brand"><span className="red-dot"></span> ASSET TRACKER</div>
        <div className="nav-actions">
          <div className="theme-switch-compact">
            <label className="switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>
          </div>
          <button className="btn btn-red-action" onClick={() => { setFormSymbol(''); setFormUnits(''); setFormPrice(''); setModalMode('ADD'); }}>
            + Add Asset
          </button>
          <span className="user-greeting">Hello, Joem</span>
          <button className="btn btn-logout" onClick={() => setUserId(null)}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-body">
        <main className="asset-list">
          <h2>Your Portfolio</h2>
          {assets.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No assets found in database. Add one above!</p>
          ) : (
            assets.map((asset) => {
              const currentP = asset.avg_price;
              const profit = (currentP - asset.avg_price) * asset.units;
              const isPositive = profit >= 0;

              return (
                <div key={asset.id} className="asset-card">
                  <div className="asset-info">
                    <h3>{asset.symbol.toUpperCase()}</h3>
                    <p>{asset.units} units @ ${asset.avg_price}</p>
                  </div>
                  <div className="asset-card-right">
                    <div className="asset-price">
                      <p className="current-text">Value: ${currentP.toFixed(2)}</p>
                      <h4 className={isPositive ? 'text-green' : 'text-red'}>
                        {isPositive ? '+' : ''}{profit.toFixed(2)}
                      </h4>
                    </div>
                    <div className="card-crud-buttons">
                      <button className="btn-icon delete" onClick={() => handleDelete(asset.id, asset.symbol)}>Del</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>

        <aside className="summary-sidebar">
          <h2>Summary</h2>
          <div className="summary-stat">
            <p>Total Invested:</p>
            <h3>${totalInvested.toFixed(2)}</h3>
          </div>
          <div className="summary-stat">
            <p>Current Value:</p>
            <h3>${totalCurrentValue.toFixed(2)}</h3>
          </div>
          <div className="summary-stat total-profit">
            <p>Overall PnL:</p>
            <h2 className={isOverallPositive ? 'text-green' : 'text-red'}>
              {isOverallPositive ? '+' : ''}{overallProfit.toFixed(2)}
            </h2>
          </div>
        </aside>
      </div>

      {modalMode && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Add New Asset</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Ticker Symbol</label>
                <input type="text" placeholder="e.g. BTC, TSLA" value={formSymbol} onChange={e => setFormSymbol(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Units Owned</label>
                <input type="number" step="any" placeholder="1.5" value={formUnits} onChange={e => setFormUnits(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Average Buy Price ($)</label>
                <input type="number" step="any" placeholder="62000" value={formPrice} onChange={e => setFormPrice(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setModalMode(null)}>Cancel</button>
                <button type="submit" className="btn btn-red-action">Save to Supabase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;