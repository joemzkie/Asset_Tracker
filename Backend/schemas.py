from pydantic import BaseModel
from typing import Optional

# What React MUST send us when creating an asset
class AssetCreate(BaseModel):
    symbol: str
    units: float
    avg_price: float

# What React sends us when updating (fields are optional)
class AssetUpdate(BaseModel):
    symbol: Optional[str] = None
    units: Optional[float] = None
    avg_price: Optional[float] = None