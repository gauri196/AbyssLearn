
from datetime import date
from pathlib import Path
import joblib

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "ocean_temperature_rf.joblib"

app = FastAPI(
    title="OceanEmbed ML Service",
    version="0.2.0",
    description=(
        "Research prototype for reanalysis-based ocean temperature "
        "estimation. Not yet a satellite reconstruction model."
    ),
)

REGION = {
    "latitude_min": 5.0,
    "latitude_max": 30.0,
    "longitude_min": 45.0,
    "longitude_max": 105.0,
}
DEPTHS_M = [
    0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000
]
INPUTS = ["sst", "sss", "ssh_sla", "current_u", "current_v", "wind_u", "wind_v"]

bundle = None
if MODEL_PATH.exists():
    bundle = joblib.load(MODEL_PATH)

class PredictionRequest(BaseModel):
    date: date
    latitude: float = Field(ge=5, le=30)
    longitude: float = Field(ge=45, le=105)
    variables: list[str] = Field(
        default_factory=list,
        description="Satellite/ocean variables supplied by the caller; "
                    "not used by the current prototype model."
    )
    depths_m: list[float] = Field(default_factory=lambda: [0, 10, 20, 50, 100])


@app.get("/health")
def health():
    return {
        "service": "oceanembed",
        "status": "ready" if bundle else "setup_required",
        "model_loaded": bundle is not None,
        "model_type": bundle.get("model_type") if bundle else None,
        "dataset_configured": True if bundle else False,
        "research_stage": "reanalysis_prototype",
    }


@app.get("/metadata")
def metadata():
    return {
        "region": REGION,
        "grid_resolution_degrees": 0.25,
        "temporal_resolution": "daily",
        "input_variables": INPUTS,
        "depths_m": DEPTHS_M,
        "model_loaded": bundle is not None,
        "model_target": "temperature_c",
        "model_features": bundle.get("features") if bundle else [],
        "scientific_note": (
            "Current model uses latitude, longitude, depth and day of year. "
            "It does not yet use satellite observations as model inputs."
        ),
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    if bundle is None:
        raise HTTPException(
            status_code=503,
            detail="No trained model is available.",
        )

    unknown = sorted(set(request.variables) - set(INPUTS))
    if unknown:
        raise HTTPException(
            status_code=422,
            detail=f"Unknown input variables: {unknown}",
        )

    features = bundle["features"]
    model = bundle["model"]
    results = []

    for depth in request.depths_m:
        if depth < 0 or depth > 1000:
            raise HTTPException(
                status_code=422,
                detail=f"Depth must be between 0 and 1000 metres: {depth}",
            )

        row = {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "depth": depth,
            "day_of_year": request.date.timetuple().tm_yday,
        }
        prediction = float(model.predict([[row[name] for name in features]])[0])

        results.append({
            "depth_m": depth,
            "estimated_temperature_c": round(prediction, 3),
        })

    return {
        "date": request.date.isoformat(),
        "latitude": request.latitude,
        "longitude": request.longitude,
        "predictions": results,
        "model_type": bundle["model_type"],
        "research_stage": "reanalysis_prototype",
        "warning": (
            "Estimates use location, depth and day of year only. "
            "Submitted satellite/ocean variables are not used by this model. "
            "This is not validated satellite-to-subsurface reconstruction."
        ),
    }
