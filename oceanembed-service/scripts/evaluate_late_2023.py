
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "processed"
OUTPUT = DATA / "late_2023_evaluation.csv"

FILES = [
    DATA / "temperature_jan2023.csv",
    DATA / "temperature_feb2023.csv",
    DATA / "temperature_mar_dec2023.csv",
]
FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
target = "temperature_c"


def load_data(path):
    df = pd.read_csv(path, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear
    return df


def main():
    data = pd.concat(
        [load_data(path) for path in FILES],
        ignore_index=True,
    )
    data = data.drop_duplicates(
        subset=["time", "latitude", "longitude", "depth"]
    ).dropna(subset=FEATURES + [TARGET])

    train = data[data["time"] < "2023-10-01"]
    test = data[
        (data["time"] >= "2023-10-01")
        & (data["time"] < "2024-01-01")
    ]

    if train.empty or test.empty:
        raise ValueError("Training or testing data is empty.")

    print(f"Training rows: {len(train):,}")
    print(f"Testing rows: {len(test):,}")
    print(f"Training dates: {train.time.min().date()} to {train.time.max().date()}")
    print(f"Testing dates: {test.time.min().date()} to {test.time.max().date()}")

    models = {
        "Mean baseline": DummyRegressor(strategy="mean"),
        "Ridge regression": make_pipeline(
            StandardScaler(), Ridge(alpha=1.0)
        ),
        "Random Forest": RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        ),
    }

    results = []
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(train[FEATURES], train[TARGET])
        predictions = model.predict(test[FEATURES])
        results.append({
            "model": name,
            "MAE_C": mean_absolute_error(test[TARGET], predictions),
            "RMSE_C": np.sqrt(
                mean_squared_error(test[TARGET], predictions)
            ),
            "R2": r2_score(test[TARGET], predictions),
        })

    report = pd.DataFrame(results).sort_values("RMSE_C")
    report.to_csv(OUTPUT, index=False)
    print("\nOctober-December 2023 results:")
    print(report.to_string(index=False, float_format=lambda x: f"{x:.4f}"))
    print(f"Saved to: {OUTPUT}")


if __name__ == "__main__":
    main()
