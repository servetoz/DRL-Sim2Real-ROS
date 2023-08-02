from dash import callback, Input, Output, State, ALL
from dash.exceptions import PreventUpdate
import numpy as np
import plotly.graph_objects as go

from utils.load_csv import load_csv_data
from utils.helper import count_episodes, count_number_of_episodes
from pages.trajectories import csv_filepaths

@callback(
    Output('graph', 'figure'),
    [
        Input('csv-dropdown', 'value'),
        Input('waypoints-dropdown', 'value'),
        Input({'type': 'data-name', 'index': ALL}, 'value'),
        Input({'type': 'color-picker', 'index': ALL}, 'color'),
    ],
)
def update_trajectories(selected_csv_files, show_waypoints, data_names, selected_colors):
    if not selected_csv_files:
        raise PreventUpdate

    fig = go.Figure()

    for i, (file, color, name) in enumerate(zip(selected_csv_files, selected_colors, data_names)):
        csv_data = load_csv_data(file)
        count_ep = int(count_episodes(csv_data))
        # check if there are multiple episodes, if yes then add a trajectory for every episode on its own
        if count_ep > 1:
            # count all ones, twos etc..
            number_ep = count_number_of_episodes(csv_data)
            # set lower and upper bounds
            num_lower_bound = 0
            num_upper_bound = 0
            ee_pos = np.array([row["position_ee_link_ur5_1"]
                              for row in csv_data])
            for i in range(count_ep):
                num_upper_bound = num_upper_bound + number_ep[i]
                trajectory = ee_pos[num_lower_bound:num_upper_bound]
                x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]
                fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='lines',
                              name=name + "_" + str(i+1), line=dict(color=color)))
                num_lower_bound = num_upper_bound
                if show_waypoints:
                    fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='markers',
                                  name=f'Waypoints {i+1}', marker=dict(size=4, color=color)))

        else:
            trajectory = np.array([row["position_ee_link_ur5_1"]
                                  for row in csv_data])
            x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]
            fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='lines',
                          name=name, line=dict(color=color)))

        if show_waypoints:
            fig.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='markers',
                          name=f'Waypoints {i+1}', marker=dict(size=4, color=color)))

    fig.update_layout(scene=dict(
        xaxis_title="X",
        yaxis_title="Y",
        zaxis_title="Z",
        aspectmode='auto',
        camera=dict(
            # Increase the values here to zoom out.
            eye=dict(x=1.5, y=1.5, z=1.0)
        )
    ))

    return fig


# seperate callback only for the table to be able to hide/show it
for i in range(len(csv_filepaths)):
    @callback(
        Output({'type': 'table-collapse', 'index': i}, 'is_open'),
        Input({'type': 'toggle-table-btn', 'index': i}, 'n_clicks'),
        State({'type': 'table-collapse', 'index': i}, 'is_open')
    )
    def toggle_table(n_clicks, is_open):
        if n_clicks:
            return not is_open
        return is_open

# functionality to hide the data names, tables and colorpicker function of the .csv data that is not chosen


@callback(
    Output({'type': 'csv-elements', 'index': ALL}, 'style'),
    Input('csv-dropdown', 'value'),
    [State({'type': 'csv-elements', 'index': ALL}, 'id')],
)
def update_csv_elements_visibility(selected_csv_files, element_ids):
    selected_indices = [csv_filepaths.index(
        file) for file in selected_csv_files]
    return [{'display': 'block' if id['index'] in selected_indices else 'none'} for id in element_ids]


# Functionality for user being able to change names of csv and trajectories
@callback(
    Output({'type': 'data-name', 'index': ALL}, 'value'),
    Input({'type': 'data-name', 'index': ALL}, 'value'),
    [State({'type': 'data-name', 'index': ALL}, 'id')],
)
def update_data_names(new_data_names, element_ids):
    return new_data_names
