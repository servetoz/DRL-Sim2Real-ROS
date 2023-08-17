import os
import dash
from dash import html
import dash_bootstrap_components as dbc
from dash import dcc
from dash_color_picker import ColorPicker
from dash import dash_table

from pages import GetPages
from utils.load_csv import load_csv_data
from pages.trajectories import colors, csv_filepaths, csv_options, fig
from pages.trajectories.callbacks import *

dash.register_page(
    __name__, path=GetPages.TRAJECTORIES["href"], title=GetPages.TRAJECTORIES["title"])


def layout() -> html.Div:
    return html.Div([
        dbc.Container([
            html.H3("Trajectories"),
            dbc.Row([
                dbc.Col([
                    dcc.Graph(id='graph', figure=fig, style={
                              'height': '80vh', 'width': '100%'}),
                ], width=8, style={'padding-right': '0px'}),
                dbc.Col([
                    html.Div([
                        html.Div([
                            dcc.Dropdown(
                                id='csv-dropdown',
                                options=csv_options,
                                # Set the first CSV file as the default selected value
                                value=[csv_filepaths[0]],
                                multi=True,  # Allow multiple selections
                                style={
                                    'width': '100%', 'font-family': 'Arial, sans-serif', 'margin-bottom': '10px'},
                                clearable=False
                            ),
                            dcc.Dropdown(
                                id='waypoints-dropdown',
                                options=[
                                    {'label': 'Hide Waypoints', 'value': 0},
                                    {'label': 'Show Waypoints', 'value': 1}
                                ],
                                value=0,
                                clearable=False,
                                style={
                                    'width': '100%', 'font-family': 'Arial, sans-serif', 'margin-bottom': '10px'}
                            ),
                        ]),
                    ], style={'flex': '0 0 auto'}),
                    html.Div(
                        [
                            html.Div([
                                dbc.Row([
                                    dbc.Col(dcc.Input(id={'type': 'data-name', 'index': i}, value=os.path.basename(
                                        file), type='text', style={'width': '100%'})),
                                    dbc.Col(html.Div(
                                        ColorPicker(
                                            id={'type': 'color-picker',
                                                'index': i},
                                            color=colors[i],
                                        ),
                                        style={'position': 'relative',
                                               'z-index': '1000'}
                                    ), width=6),
                                ]),
                                html.Button("Toggle Table", id={
                                    'type': 'toggle-table-btn', 'index': i}, n_clicks=0),
                                dbc.Collapse(
                                    dash_table.DataTable(
                                        id={'type': 'waypoints-table', 'index': i},
                                        columns=[
                                            {'name': 'Episodes', 'id': 'episodes'},
                                            {'name': 'Waypoints',
                                                'id': 'waypoints'},
                                            {'name': 'Velocities',
                                                'id': 'velocities'}
                                        ],
                                        data=[
                                            {
                                                'episodes': f'{int(row["episodes"])}',
                                                'waypoints': f'({row["position_ee_link_ur5_1"][0]:.2f}, {row["position_ee_link_ur5_1"][1]:.2f}, {row["position_ee_link_ur5_1"][2]:.2f})',
                                                'velocities': f'({row["velocity_ee_link_ur5_1"][0]:.2f}, {row["velocity_ee_link_ur5_1"][1]:.2f}, {row["velocity_ee_link_ur5_1"][2]:.2f})'
                                            } for row in load_csv_data(file)
                                        ],

                                        fixed_rows={
                                            'headers': True, 'data': 0},
                                        style_table={'overflowY': 'auto',
                                                     'maxWidth': '100%'},
                                        style_data={
                                            'textAlign': 'center',
                                        },
                                    ),
                                    id={'type': 'table-collapse', 'index': i},
                                    is_open=False,
                                ),
                            ], id={'type': 'csv-elements', 'index': i}, style={'margin-bottom': '10px', 'border': '1px solid', 'padding': '5px', 'display': 'none'}) for i, file in enumerate(csv_filepaths)
                        ],
                        style={'max-height': '65vh',
                               'overflow-y': 'auto', 'flex': '1 1 auto'}
                    )
                ], width=4, style={'padding': '0 15px', 'display': 'flex', 'flex-direction': 'column', 'height': '80vh'})
            ]),
        ], fluid=False)
    ], className="dash-graph-page")
