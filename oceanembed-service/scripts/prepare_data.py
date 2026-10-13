
from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr


# Project paths
ROOT = Path(__file__).resolve().parents[1]
INPUT_FILE = ROOT / "data" / "raw" / "indian_ocean_temperature_sample.nc"
OUTPUT_DIR = ROOT / "data" / "processed"
OUTPUT_FILE = OUTPUT_DIR / "temperature_samples.csv"

TARGET = "thetao_mean"


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {INPUT_FILE}\n"
            "Download the Copernicus sample first."
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading ocean temperature dataset...")
    with xr.open_dataset(INPUT_FILE) as ds:
        if TARGET not in ds:
            raise ValueError(f"Target variable '{TARGET}' not found.")

        temp = ds[TARGET]

        required_dims = {"time", "depth", "latitude", "longitude"}
        if not required_dims.issubset(temp.dims):
            raise ValueError(
                f"Expected dimensions {required_dims}; got {temp.dims}"
            )

        # Convert the four-dimensional grid into one row per observation.
        frame = temp.to_dataframe(name="temperature_c").reset_index()

    print("Checking and cleaning data...")

    # Remove missing or non-finite target values.
    frame = frame.replace([np.inf, -np.inf], np.nan)
    frame = frame.dropna(
        subset=["time", "depth", "latitude", "longitude", "temperature_c"]
    )

    # Keep only physically plausible values for this dataset.
    # These bounds are a broad quality-control filter, not a scientific
    # guarantee that every retained value is correct.
    frame = frame[
        frame["temperature_c"].between(-2.5, 40.0)
        & frame["depth"].ge(0)
    ].copy()

    frame["time"] = pd.to_datetime(frame["time"]).dt.strftime("%Y-%m-%d")

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
        raise ValueError("No valid observations remain after cleaning.")

    frame.to_csv(OUTPUT_FILE, index=False, float_format="%.5f")

    print("\n=== PREPARATION SUMMARY ===")
    print(f"Input file: {INPUT_FILE}")
    print(f"Output file: {OUTPUT_FILE}")
    print(f"Valid rows: {len(frame)}")
    print(f"Unique dates: {frame['time'].nunique()}")
    print(f"Unique depths: {frame['depth'].nunique()}")
    print(f"Latitude range: {frame['latitude'].min()} to "
          f"{frame['latitude'].max()}")
    print(f"Longitude range: {frame['longitude'].min()} to "
          f"{frame['longitude'].max()}")
    print(f"Temperature range: {frame['temperature_c'].min():.2f} to "
          f"{frame['temperature_c'].max():.2f} °C")
    print("\nFirst five rows:")
    print(frame.head().to_string(index=False))
    print("\nData preparation completed successfully.")


if __name__ == "__main__":
    main()
