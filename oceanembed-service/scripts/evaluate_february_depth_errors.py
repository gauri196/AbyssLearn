
from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor

ROOT = Path(__file__).resolve().parents[1]

JANUARY_FILE = ROOT / "data" / "processed" / "temperature_jan2023.csv"
FEBRUARY_FILE = ROOT / "data" / "processed" / "temperature_feb2023.csv"
OUTPUT_FILE = ROOT / "data" / "processed" / "february_depth_errors.csv"

FEATURES = ["latitude", "longitude", "depth", "day_of_year"]
TARGET = "temperature_c"


def load_data(path):
    df = pd.read_csv(path, parse_dates=["time"])
    df["day_of_year"] = df["time"].dt.dayofyear
    return df


def main():
    train = load_data(JANUARY_FILE)
    test = load_data(FEBRUARY_FILE)

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
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

    report.to_csv(OUTPUT_FILE, index=False)

    print("February Random Forest errors by depth:")
    print(
        report.to_string(
            index=False,
            float_format=lambda value: f"{value:.3f}",
        )
    )
    print(f"\nSaved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
