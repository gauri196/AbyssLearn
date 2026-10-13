
from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr

ROOT = Path(__file__).resolve().parents[1]

INPUT_FILE = ROOT / "data" / "raw" / "indian_ocean_temperature_jan2023.nc"
OUTPUT_DIR = ROOT / "data" / "processed"
OUTPUT_FILE = OUTPUT_DIR / "temperature_jan2023.csv"

TARGET = "thetao_mean"


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {INPUT_FILE}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading January 2023 temperature dataset...")

    with xr.open_dataset(INPUT_FILE) as ds:
        if TARGET not in ds:
            raise ValueError(f"Target variable '{TARGET}' not found.")

        frame = ds[TARGET].to_dataframe(
            name="temperature_c"
        ).reset_index()

    print("Cleaning and validating observations...")

    frame = frame.replace([np.inf, -np.inf], np.nan)

    frame = frame.dropna(
        subset=[
            "time",
            "depth",
            "latitude",
            "longitude",
            "temperature_c",
        ]
    )

    frame = frame[
        frame["temperature_c"].between(-2.5, 40.0)
        & frame["depth"].ge(0)
    ].copy()

    frame["time"] = pd.to_datetime(frame["time"])

    columns = [
        "time",
        "latitude",
        "longitude",
        "depth",
        "temperature_c",
    ]

    frame = frame[columns].sort_values(
        ["time", "latitude", "longitude", "depth"]
    )

    if frame.empty:
        raise ValueError("No valid observations remain.")

    frame["time"] = frame["time"].dt.strftime("%Y-%m-%d")

    frame.to_csv(
        OUTPUT_FILE,
        index=False,
        float_format="%.5f",
    )

    print("\nJanuary dataset prepared successfully!")
    print(f"Output: {OUTPUT_FILE}")
    print(f"Valid rows: {len(frame):,}")
    print(f"Dates: {frame['time'].nunique()}")
    print(f"Depth levels: {frame['depth'].nunique()}")
    print(
        f"Temperature range: "
        f"{frame['temperature_c'].min():.2f} to "
        f"{frame['temperature_c'].max():.2f} °C"
    )
    print(f"Missing values: {int(frame.isna().sum().sum())}")
    print("\nFirst five rows:")
    print(frame.head().to_string(index=False))


if __name__ == "__main__":
    main()
