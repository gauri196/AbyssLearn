
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

JANUARY_FILE = ROOT / "data" / "processed" / "temperature_jan2023.csv"
FEBRUARY_FILE = ROOT / "data" / "processed" / "temperature_feb2023.csv"
OUTPUT_FILE = ROOT / "data" / "processed" / "february_evaluation.csv"

FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
TARGET = "temperature_c"


def load_data(path):
    df = pd.read_csv(path, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear
    return df


def main():
    train = load_data(JANUARY_FILE)
    test = load_data(FEBRUARY_FILE)

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
        "Random Forest": RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        ),
    }

    results = []

    print(f"Training rows: {len(train):,}")
    print(f"Testing rows:  {len(test):,}")
    print(
        f"Training dates: {train['time'].min().date()} to "
        f"{train['time'].max().date()}"
    )
    print(
        f"Testing dates:  {test['time'].min().date()} to "
        f"{test['time'].max().date()}\n"
    )

    for name, model in models.items():
        print(f"Training {name} on January...")
        model.fit(X_train, y_train)

        # February is held out and is never used for model fitting.
        predictions = model.predict(X_test)

        results.append({
            "model": name,
            "MAE_C": mean_absolute_error(y_test, predictions),
            "RMSE_C": np.sqrt(
                mean_squared_error(y_test, predictions)
            ),
            "R2": r2_score(y_test, predictions),
        })

    report = pd.DataFrame(results).sort_values("RMSE_C")
    report.to_csv(OUTPUT_FILE, index=False)

    print("\nFebruary evaluation results:")
    print(report.to_string(index=False, float_format=lambda x: f"{x:.4f}"))
    print(f"\nSaved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
