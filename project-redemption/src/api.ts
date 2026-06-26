export const api = {
  getAssets: async (user_id: string) => {
    const response = await fetch(`http://localhost:8000/api/assets?user_id=${user_id}`);
    if (!response.ok) throw new Error("Failed to fetch assets");
    return response.json();
  },
  addAsset: async (user_id: string, symbol: string, units: number, avg_price: number) => {
    const response = await fetch(`http://localhost:8000/api/assets?user_id=${user_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, units, avg_price }),
    });
    if (!response.ok) throw new Error("Failed to add asset");
    return response.json();
  },
  deleteAsset: async (user_id: string, asset_id: string) => {
    const response = await fetch(`http://localhost:8000/api/assets/${asset_id}?user_id=${user_id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete asset");
    return response.json();
  }
};