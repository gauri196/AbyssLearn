
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

files = [
    DATA_DIR / "temperature_jan2023.csv",
    DATA_DIR / "temperature_feb2023.csv",
    DATA_DIR / "temperature_mar_dec2023.csv",
]

print("Loading temperature data...")
frames = [pd.read_csv(file, parse_dates=["time"]) for file in files]
data = pd.concat(frames, ignore_index=True)

data = data.drop_duplicates(
    subset=["time", "latitude", "longitude", "depth"]
).dropna()

data["day_of_year"] = data["time"].dt.dayofyear

features = ["latitude", "longitude", "depth", "day_of_year"]
target = "temperature_c"

# Train on January through September only.
train = data[data["time"] < "2023-10-01"].copy()

if train.empty:
    raise ValueError("No training data found.")

print(f"Training rows: {len(train):,}")
print("Training Random Forest...")

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
)

model.fit(train[features], train[target])

model_path = MODEL_DIR / "ocean_temperature_rf.joblib"

joblib.dump(
    {
        "model": model,
        "features": features,
        "target": target,
        "training_period": "2023-01-01 to 2023-09-30",
        "model_type": "RandomForestRegressor",
    },
    model_path,
)

print(f"\nModel saved successfully: {model_path}")
print("Features:", features)
print("Target:", target)
print("Next step: connect this saved model to the FastAPI service.")
