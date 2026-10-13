# OceanEmbed model service (scaffold)

This separate Python/FastAPI service is added alongside the existing Kotlin/Spring Boot API. It intentionally does not return fabricated predictions.

## Run locally

```powershell
cd oceanembed-service
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8090
```

- Health: `http://localhost:8090/health`
- Metadata: `http://localhost:8090/metadata`
- Interactive API docs: `http://localhost:8090/docs`

`POST /predict` returns HTTP 503 until a real trained model is integrated. This is intentional.

## Before enabling predictions

1. Document data sources, units, temporal coverage and quality flags for SST, SSS, SSH/SLA, surface-current U/V and surface-wind U/V.
2. Regrid and align all inputs and subsurface temperature targets to the 0.25-degree daily grid over 5–30°N, 45–105°E.
3. Prevent leakage with time-aware train/validation/test splits.
4. Train a baseline before CNN/ViT/autoencoder/GNN or attention-based experiments.
5. Report RMSE, bias and correlation by depth on independent held-out observations; document missing-data handling and uncertainty.
