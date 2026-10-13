
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "processed" / "temperature_samples.csv"
RESULTS_DIR = ROOT / "data" / "processed"

FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
TARGET = "temperature_c"


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Missing {DATA_FILE}. Run prepare_data.py first."
        )

    df = pd.read_csv(DATA_FILE, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear

    # Keep dates in chronological order. With only three days, this is
    # strictly a pipeline demonstration, not a reliable evaluation.
    dates = sorted(df["time"].dropna().unique())
    if len(dates) < 3:
        raise ValueError("At least three distinct dates are required.")

    train_dates = dates[:-1]
    test_date = dates[-1]

    train = df[df["time"].isin(train_dates)].copy()
    test = df[df["time"] == test_date].copy()

    X_train, y_train = train[FEATURES], train[TARGET]
    X_test, y_test = test[FEATURES], test[TARGET]

    models = {
        "Mean baseline": DummyRegressor(strategy="mean"),
        "Ridge regression": make_pipeline(
            StandardScaler(),
            Ridge(alpha=1.0),
        ),
    }

    rows = []
    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        rows.append({
            "model": name,
            "test_date": str(pd.Timestamp(test_date).date()),
            "train_rows": len(train),
            "test_rows": len(test),
            "MAE_C": mean_absolute_error(y_test, predictions),
            "RMSE_C": np.sqrt(mean_squared_error(y_test, predictions)),
            "R2": r2_score(y_test, predictions),
        })

    results = pd.DataFrame(rows)
    output = RESULTS_DIR / "baseline_metrics.csv"
    results.to_csv(output, index=False)

    print("=== BASELINE EXPERIMENT ===")
    print("Training dates:", [str(pd.Timestamp(d).date()) for d in train_dates])
    print("Test date:", pd.Timestamp(test_date).date())
    print("Training rows:", len(train))
    print("Test rows:", len(test))
    print("\nMetrics (lower MAE/RMSE is better):")
    print(results.to_string(index=False))
    print("\nSaved results to:", output)
    print(
        "\nCaution: this three-day sample is only a pipeline test. "
        "Do not interpret these metrics as model validation."
    )


if __name__ == "__main__":
    main()
