
from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"

files = [
    DATA_DIR / "temperature_jan2023.csv",
    DATA_DIR / "temperature_feb2023.csv",
    DATA_DIR / "temperature_mar_dec2023.csv",
]

print("Loading ocean temperature data...")
frames = [pd.read_csv(file, parse_dates=["time"]) for file in files]
data = pd.concat(frames, ignore_index=True)

data = data.drop_duplicates(
    subset=["time", "latitude", "longitude", "depth"]
).dropna()

data["day_of_year"] = data["time"].dt.dayofyear

features = ["latitude", "longitude", "depth", "day_of_year"]
target = "temperature_c"

train = data[data["time"] < "2023-10-01"]
test = data[
    (data["time"] >= "2023-10-01")
    & (data["time"] < "2024-01-01")
]

if train.empty or test.empty:
    raise ValueError("Training or test data is empty. Check the CSV files.")

print(f"Training rows: {len(train):,}")
print(f"Testing rows: {len(test):,}")
print("Training Random Forest...")

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
)

model.fit(train[features], train[target])
predictions = model.predict(test[features])

results = test[["depth"]].copy()
results["actual"] = test[target].to_numpy()
results["predicted"] = predictions
results["absolute_error"] = (
    results["actual"] - results["predicted"]
).abs()

depth_results = (
    results.groupby("depth")
    .agg(
        MAE=("absolute_error", "mean"),
        actual_mean=("actual", "mean"),
        predicted_mean=("predicted", "mean"),
        observations=("absolute_error", "size"),
    )
    .reset_index()
    .sort_values("depth")
)

output = DATA_DIR / "late_2023_depth_errors.csv"
depth_results.to_csv(output, index=False)

print("\nOverall October-December MAE:",
      round(mean_absolute_error(results["actual"], results["predicted"]), 4))
print("\nMAE by depth:")
print(depth_results[["depth", "MAE", "observations"]].to_string(index=False))
print(f"\nSaved results to: {output}")
