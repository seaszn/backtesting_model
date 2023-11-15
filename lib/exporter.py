
import pandas as pd
from pathlib import Path

def export_data(object, name): 
    data_frame = pd.DataFrame(object)
    filepath = Path(f'data/exports/{name}.csv')  
    filepath.parent.mkdir(parents=True, exist_ok=True)
    data_frame.to_csv(filepath, index=False)
