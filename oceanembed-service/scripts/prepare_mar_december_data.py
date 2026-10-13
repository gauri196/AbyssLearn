
from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr

ROOT = Path(__file__).resolve().parents[1]
INPUT_FILE = ROOT / "data" / "raw" / "indian_ocean_temperature_mar_dec2023.nc"
OUTPUT_FILE = ROOT / "data" / "processed" / "temperature_mar_dec2023.csv"


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {INPUT_FILE}")

    with xr.open_dataset(INPUT_FILE) as ds:
        if "thetao_mean" not in ds:
            raise ValueError("thetao_mean was not found in the dataset.")

        frame = ds["thetao_mean"].to_dataframe(
            name="temperature_c"
        ).reset_index()

    frame = frame.replace([np.inf, -np.inf], np.nan)
    frame = frame.dropna(
        subset=["time", "depth", "latitude", "longitude", "temperature_c"]
    )

    frame = frame[
        frame["temperature_c"].between(-2.5, 40.0)
        & frame["depth"].ge(0)
    ].copy()

    frame["time"] = pd.to_datetime(frame["time"]).dt.strftime("%Y-%m-%d")
    frame = frame[
        ["time", "latitude", "longitude", "depth", "temperature_c"]
    ].sort_values(["time", "latitude", "longitude", "depth"])

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(OUTPUT_FILE, index=False, float_format="%.5f")

    print(f"Saved: {OUTPUT_FILE}")
    print(f"Valid rows: {len(frame):,}")
    print(f"Dates: {frame['time'].nunique()}")
    print(
        f"Temperature range: {frame['temperature_c'].min():.2f} to "
        f"{frame['temperature_c'].max():.2f} °C"
    )


if __name__ == "__main__":
    main()

