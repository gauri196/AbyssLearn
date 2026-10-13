
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]

DATA_FILE = ROOT / "data" / "processed" / "temperature_jan2023.csv"
OUTPUT_FILE = ROOT / "data" / "processed" / "ridge_depth_errors.csv"

FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
TARGET = "temperature_c"


def main():
    df = pd.read_csv(DATA_FILE, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear

    train = df[df["time"] <= "2023-01-25"].copy()
    test = df[df["time"] >= "2023-01-26"].copy()

    model = make_pipeline(
        StandardScaler(),
        Ridge(alpha=1.0),
    )

    model.fit(train[FEATURES], train[TARGET])
    test["prediction_c"] = model.predict(test[FEATURES])
    test["absolute_error_c"] = (
        test[TARGET] - test["prediction_c"]
    ).abs()

    report = (
        test.groupby("depth", as_index=False)
        .agg(
            observations=("temperature_c", "size"),
            actual_mean_c=("temperature_c", "mean"),
            predicted_mean_c=("prediction_c", "mean"),
            mae_c=("absolute_error_c", "mean"),
        )
        .sort_values("depth")
    )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    report.to_csv(OUTPUT_FILE, index=False)

    print("Ridge regression errors by depth:")
    print(report.to_string(index=False, float_format=lambda x: f"{x:.3f}"))
    print(f"\nSaved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
