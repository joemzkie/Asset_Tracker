import os
import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssetCreate(BaseModel):
    user_id: str
    symbol: str
    units: float
    avg_price: float

class SnapshotRequest(BaseModel):
    symbols: list[str]

class PasswordUpdateRequest(BaseModel):
    user_id: str
    new_password: str

@app.get("/api/assets")
async def get_assets(user_id: str):
    response = supabase.table("portfolio_assets").select("*").eq("user_id", user_id).execute()
    return response.data

@app.post("/api/assets")
async def add_asset(asset: AssetCreate):
    payload = {
        "user_id": asset.user_id,
        "symbol": asset.symbol.upper(),
        "units": asset.units,
        "avg_price": asset.avg_price
    }
    response = supabase.table("portfolio_assets").insert(payload).execute()
    return response.data

@app.delete("/api/assets/{asset_id}")
async def delete_asset(asset_id: str):
    response = supabase.table("portfolio_assets").delete().eq("id", asset_id).execute()
    return response.data

@app.post("/api/prices/snapshot")
def get_price_snapshot(req: SnapshotRequest):
    prices = {}
    for sym in req.symbols:
        clean_sym = sym.upper()
        yahoo_query = clean_sym
        
        # Yahoo requires '-USD' at the end of crypto tickers
        if clean_sym in ["BTC", "ETH", "SOL", "DOGE", "XRP", "BNB", "ADA"]:
            yahoo_query = f"{clean_sym}-USD"
            
        try:
            ticker = yf.Ticker(yahoo_query)
            # .fast_info grabs market price in ~100ms
            prices[clean_sym] = round(ticker.fast_info['last_price'], 2)
        except Exception:
            prices[clean_sym] = 0.0 # Safe fallback if Yahoo chokes
            
    return prices

@app.post("/api/auth/update-password")
async def update_password(req: PasswordUpdateRequest):
    try:
        # Calls the Supabase Admin API layer to reset password credentials
        response = supabase.auth.admin.update_user_by_id(
            req.user_id,
            attributes={"password": req.new_password}
        )
        return {"status": "success"}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))