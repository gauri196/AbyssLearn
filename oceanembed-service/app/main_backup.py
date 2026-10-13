"""OceanEmbed ML service scaffold. Does not generate predictions until a validated model is installed."""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="OceanEmbed Model Service", version="0.1.0", description="Subsurface ocean temperature reconstruction service scaffold")

REGION = {"latitude_min": 5.0, "latitude_max": 30.0, "longitude_min": 45.0, "longitude_max": 105.0}
DEPTHS_M = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
INPUTS = ["sst", "sss", "ssh_sla", "current_u", "current_v", "wind_u", "wind_v"]

class PredictionRequest(BaseModel):
    date: str = Field(description="Observation date in YYYY-MM-DD format")
    latitude: float = Field(ge=5, le=30)
    longitude: float = Field(ge=45, le=105)
    variables: list[str] = Field(min_length=1)
    depths_m: list[int] = DEPTHS_M

@app.get("/health")
def health():
    return {"service": "oceanembed", "status": "setup_required", "model_loaded": False, "dataset_configured": False}

@app.get("/metadata")
def metadata():
    return {"region": REGION, "grid_resolution_degrees": 0.25, "temporal_resolution": "daily", "input_variables": INPUTS, "depths_m": DEPTHS_M, "model_loaded": False}

@app.post("/predict")
def predict(request: PredictionRequest):
    unknown = sorted(set(request.variables) - set(INPUTS))
    if unknown:
        raise HTTPException(status_code=422, detail=f"Unknown input variables: {unknown}")
    # Deliberately fail closed: never return fabricated temperature values.
    raise HTTPException(status_code=503, detail="No trained OceanEmbed model is configured. Add a model trained on documented datasets and validate it against independent observations before enabling predictions.")
