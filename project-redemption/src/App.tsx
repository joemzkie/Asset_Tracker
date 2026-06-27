import React, { useState, useEffect } from 'react';
import Login from './Login';
import { api } from './api';
import './App.css';

interface Asset {
  id: string;
  symbol: string;
  units: number;
  avg_price: number;
}

const App: React.FC = () => {
  // FIX ISSUE #2: Initialize from localStorage so refresh doesn't log you out
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('portfolio_user_id');
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  // UI State Controls
  const [modalMode, setModalMode] = useState<'ADD' | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Form States
  const [formSymbol, setFormSymbol] = useState('');
  const [formUnits, setFormUnits] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Settings Password Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // FIX ISSUE #2: Sync userId changes to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem('portfolio_user_id', userId);
    } else {
      localStorage.removeItem('portfolio_user_id');
    }
  }, [userId]);

  const refreshMarketPrices = async (symbolList: string[]) => {
    if (symbolList.length === 0) return;
    try {
      const freshPrices = await api.getPriceSnapshot(symbolList);
      setLivePrices(freshPrices);
    } catch (err) {
      console.error("Snapshot engine failed:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const init = async () => {
      try {
        const data = await api.getAssets(userId);
        setAssets(data);
        const symbols = data.map((a: any) => a.symbol);
        await refreshMarketPrices(symbols);
      } catch (err) {
        console.error("Backend connection failed:", err);
      }
    };
    init();
  }, [userId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const uNum = parseFloat(formUnits) || 0;
    const pNum = parseFloat(formPrice) || 0;
    setIsSaving(true); // FIX ISSUE #4: Loading indicator state

    try {
      const savedRows = await api.addAsset(userId, formSymbol, uNum, pNum);
      const newRow = savedRows[0]; 
      const updatedList = [...assets, newRow];
      
      setAssets(updatedList);
      setModalMode(null);

      const allSymbols = updatedList.map(a => a.symbol);
      await refreshMarketPrices(allSymbols);
    } catch (err) {
      alert("Failed to save asset!");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await api.updatePassword(userId!, newPassword);
      alert("Password updated successfully!");
      setShowSettings(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      alert("Failed to update password.");
    }
  };

  const handleDelete = async (id: string, symbol: string) => {
    if (!userId) return;
    if (!window.confirm(`Delete ${symbol}?`)) return;

    try {
      await api.deleteAsset(userId, id);
      setAssets(assets.filter(a => a.id !== id));
    } catch (err) {
      alert("Failed to delete asset!");
    }
  };

  const totalInvested = assets.reduce((sum, a) => sum + (a.units * a.avg_price), 0);
  const totalCurrentValue = assets.reduce((sum, a) => {
    const marketPrice = livePrices[a.symbol.toUpperCase()] || a.avg_price;
    return sum + (a.units * marketPrice);
  }, 0);

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
          
          {/* FIX ISSUE #3: Dropdown Button Integration */}
          <div className="dropdown-container" style={{ position: 'relative' }}>
            <button className="btn btn-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              Hello, Joem ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu-box" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1000 }}>
                <button onClick={() => { setShowSettings(true); setDropdownOpen(false); }}>Settings</button>
                <button onClick={() => { setUserId(null); setDropdownOpen(false); }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        <main className="asset-list">
          <h2>Your Portfolio</h2>
          {assets.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No assets found in database. Add one above!</p>
          ) : (
            assets.map((asset) => {
              const sym = asset.symbol.toUpperCase();
              const marketP = livePrices[sym] || asset.avg_price;
              const livePositionValue = asset.units * marketP;
              const cardProfit = livePositionValue - (asset.units * asset.avg_price);
              const isCardPositive = cardProfit >= 0;

              return (
                <div key={asset.id} className="asset-card">
                  <div className="asset-info">
                    <h3>{sym}</h3>
                    <p>{asset.units} units @ ${asset.avg_price}</p>
                  </div>
                  <div className="asset-card-right">
                    <div className="asset-price">
                      <p className="current-text">Value: ${livePositionValue.toFixed(2)}</p>
                      <h4 className={isCardPositive ? 'text-green' : 'text-red'}>
                        {isCardPositive ? '+' : ''}{cardProfit.toFixed(2)}
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

      {/* ADD ASSET MODAL */}
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
                {/* FIX ISSUE #4: Cleaner action text */}
                <button type="submit" className="btn btn-red-action" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIX ISSUE #3: SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Account Settings</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowSettings(false)}>Cancel</button>
                <button type="submit" className="btn btn-red-action">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;