from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import AssetCreate
from database import supabase

app = FastAPI()

# Enable React to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# THE SUPABASE DATABASE ROUTES
# ==========================================

@app.get("/api/assets")
async def get_assets(user_id: str):
    response = supabase.table("portfolio_assets").select("*").eq("user_id", user_id).execute()
    return response.data

@app.post("/api/assets")
async def add_asset(user_id: str, asset: AssetCreate):
    payload = {
        "user_id": user_id,
        "symbol": asset.symbol.upper(),
        "units": asset.units,
        "avg_price": asset.avg_price
    }
    response = supabase.table("portfolio_assets").insert(payload).execute()
    return response.data

@app.delete("/api/assets/{asset_id}")
async def delete_asset(user_id: str, asset_id: str):
    response = supabase.table("portfolio_assets").delete().eq("id", asset_id).eq("user_id", user_id).execute()
    return response.data