import numpy as np
import plotly.graph_objects as go

from pages import get_3d_trajectory_folder
from utils.helper import generate_obstacle
from utils.load_csv import load_csv_data


# trajectory Points
csv_data = load_csv_data(get_3d_trajectory_folder() + '/episode_real_2.csv')

trajectory = np.array([row["position_ee_link_ur5_1"] for row in csv_data])

# Extract x, y, and z arrays from the trajectory
x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]

# Load the obstacle
obstacle_vertices, obstacle_faces = generate_obstacle()


# Create the initial figure with the 3D curve, waypoints, and the moving point
fig = go.Figure()
fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='lines', name='Trajectory'))
fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='markers',
              marker=dict(size=4, color='green'), name='Waypoints'))
fig.add_trace(go.Scatter3d(x=[x[0]], y=[y[0]], z=[z[0]], mode='markers', marker=dict(
    size=10, color='red'), name='Endeffector-Movement'))
# add obstacle to graph
fig.add_trace(
    go.Mesh3d(
        x=obstacle_vertices[:, 0],
        y=obstacle_vertices[:, 1],
        z=obstacle_vertices[:, 2],
        i=[face[0] for face in obstacle_faces],
        j=[face[1] for face in obstacle_faces],
        k=[face[2] for face in obstacle_faces],
        color='gray',
        opacity=1.0,
        name='Obstacle'
    )
)
fig.update_layout(scene=dict(
    xaxis_title="X",
    yaxis_title="Y",
    zaxis_title="Z",
    aspectmode='auto',
    camera=dict(
        eye=dict(x=1.5, y=1.5, z=1.5)  # Increase the values here to zoom out.
    )
))


def update_table_data_and_highlight_active_waypoint(n_intervals):
    data = [
        {'waypoints': f'({x[i]:.2f}, {y[i]:.2f}, {z[i]:.2f})', 'velocities': ''}
        for i in range(len(x))
    ]

    style_data_conditional = [
        {
            'if': {'row_index': n_intervals},
            'backgroundColor': 'rgb(164, 185, 191)',
            'color': 'black'
        }
    ]

    return data, style_data_conditional