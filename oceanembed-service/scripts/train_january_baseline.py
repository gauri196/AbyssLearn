
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "processed" / "temperature_jan2023.csv"
OUTPUT_FILE = ROOT / "data" / "processed" / "january_baseline_metrics.csv"

FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
TARGET = "temperature_c"
TRAIN_END_DATE = "2023-01-25"


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_FILE}")

    df = pd.read_csv(DATA_FILE, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear

    split_date = pd.Timestamp(TRAIN_END_DATE)

    train = df[df["time"] <= split_date].copy()
    test = df[df["time"] > split_date].copy()

    if train.empty or test.empty:
        raise ValueError("Training or test data is empty.")

    X_train = train[FEATURES]
    y_train = train[TARGET]
    X_test = test[FEATURES]
    y_test = test[TARGET]

    models = {
        "Mean baseline": DummyRegressor(strategy="mean"),
        "Ridge regression": make_pipeline(
            StandardScaler(),
            Ridge(alpha=1.0),
        ),
    }

    results = []

    print(f"Training dates: {train['time'].min().date()} to {train['time'].max().date()}")
    print(f"Testing dates:  {test['time'].min().date()} to {test['time'].max().date()}")
    print(f"Training rows:  {len(train):,}")
    print(f"Testing rows:   {len(test):,}\n")

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        results.append({
            "model": name,
            "train_end_date": TRAIN_END_DATE,
            "test_start_date": str(test["time"].min().date()),
            "test_end_date": str(test["time"].max().date()),
            "train_rows": len(train),
            "test_rows": len(test),
            "MAE_C": mean_absolute_error(y_test, predictions),
            "RMSE_C": np.sqrt(mean_squared_error(y_test, predictions)),
            "R2": r2_score(y_test, predictions),
        })

    results_df = pd.DataFrame(results)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    results_df.to_csv(OUTPUT_FILE, index=False)

    print("Baseline results:")
    print(results_df.to_string(index=False, float_format=lambda x: f"{x:.4f}"))
    print(f"\nSaved results to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
