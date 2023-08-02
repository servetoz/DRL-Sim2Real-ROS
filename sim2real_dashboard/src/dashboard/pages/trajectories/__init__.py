import os
import plotly.graph_objects as go
import numpy as np
from pages import get_csv_folder
from utils.load_csv import load_csv_data, get_csv_filepaths


csv_directory = get_csv_folder()


csv_filepaths = get_csv_filepaths(csv_directory)

csv_data = load_csv_data(csv_filepaths[0])


csv_options = [{'label': f"{os.path.basename(file)} (+)", 'value': file} for file in csv_filepaths]



trajectory = np.array([row["position_ee_link_ur5_1"] for row in csv_data])

x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]

fig = go.Figure()
fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='lines', name='Trajectory'))
#fig.add_trace(go.Scatter3d(x=a, y=b, z=c, mode='lines', name='Trajectory2'))

fig.update_layout(scene=dict(
    xaxis_title="X",
    yaxis_title="Y",
    zaxis_title="Z",
    aspectmode='auto',
    camera=dict(
        eye=dict(x=1.5, y=1.5, z=1.0)  # Increase the values here to zoom out.
    )
))

colors_list = ['red', 'green', 'blue', 'yellow']
colors = [colors_list[i % len(colors_list)] for i in range(len(csv_filepaths))]