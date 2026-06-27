const BASE_URL = "http://localhost:8000/api";

export const api = {
  getAssets: async (user_id: string) => {
    const res = await fetch(`${BASE_URL}/assets?user_id=${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch assets");
    return res.json();
  },

  addAsset: async (user_id: string, symbol: string, units: number, avg_price: number) => {
    const res = await fetch(`${BASE_URL}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, symbol, units, avg_price }),
    });
    if (!res.ok) throw new Error("Failed to add asset");
    return res.json();
  },

  deleteAsset: async (user_id: string, asset_id: string) => {
    const res = await fetch(`${BASE_URL}/assets/${asset_id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete asset");
    return res.json();
  },

  getPriceSnapshot: async (symbols: string[]) => {
    const res = await fetch(`${BASE_URL}/prices/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols }),
    });
    if (!res.ok) throw new Error("Failed to fetch price snapshot");
    return res.json();
  }, // <--- FIXED: Added this comma to separate the object properties

  updatePassword: async (user_id: string, new_password: string) => {
    const res = await fetch(`${BASE_URL}/auth/update-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, new_password }),
    });
    if (!res.ok) throw new Error("Failed to update password");
    return res.json();
  }
};