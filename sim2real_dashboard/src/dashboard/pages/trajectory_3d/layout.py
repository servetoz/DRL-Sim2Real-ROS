import dash
from dash import html
import dash_bootstrap_components as dbc
from dash import dcc
from dash import dash_table


from pages.trajectory_3d import fig, x, update_table_data_and_highlight_active_waypoint
from pages.trajectory_3d.callbacks import *

dash.register_page(__name__, path="/3d-trajectory", title="Trajectory 3D")


def layout() -> html.Div:
    return html.Div([
        dbc.Container([
            html.H3("Trajectory 3D"),
            dbc.Row([
                dbc.Col([
                    dcc.Graph(id='graph-3d-trajectory', figure=fig, style={
                        'height': '80vh', 'width': '100%'}),
                ], width=8, style={'padding-right': '0px'}),
                dbc.Col([
                    html.Div([
                        html.Div([
                            dcc.Dropdown(
                                id='obstacle-dropdown',
                                options=[
                                    {'label': 'Hide Obstacles', 'value': 0},
                                    {'label': 'Show Obstacles', 'value': 1}
                                ],
                                # Set the default value to 0 (Hide Obstacles)
                                value=0,
                                clearable=False,
                                style={'width': '100%', 'margin-bottom': '5px',
                                       'font-family': 'Arial, sans-serif'}
                            ),
                            html.Div([
                                dbc.Button('Load csv', color='secondary', className='mr-1',
                                           style={'margin-top': '0px', 'margin-bottom': '1%'})
                            ], style={'display': 'flex', 'justifyContent': 'center', 'margin-top': '0px', 'margin-bottom': '1%'}),
                            html.Div([
                                dbc.Button('Play', id='play-button', n_clicks=0,
                                           color='primary', className='mr-1'),
                                dbc.Button('Pause', id='pause-button', n_clicks=0,
                                           color='primary', className='mr-1'),
                                dbc.Button('Repeat', id='repeat-button',
                                           n_clicks=0, color='primary', className='mr-1'),
                                # speed in which the red point moves
                                dcc.Interval(id='interval', interval=100,
                                     max_intervals=len(x)-1)
                            ], style={'display': 'flex', 'justifyContent': 'center', 'margin-top': '0px'}),
                            html.Br(),
                            dcc.Dropdown(
                                id='waypoints-dropdown',
                                options=[
                                    {'label': 'Hide Waypoints', 'value': 0},
                                    {'label': 'Show Waypoints', 'value': 1}
                                ],
                                value=1,
                                clearable=False,
                                style={'width': '100%',
                                       'font-family': 'Arial, sans-serif'}
                            ),
                            html.Br(),
                            html.Div([
                                dash_table.DataTable(
                                    id='waypoints-table',
                                    columns=[
                                        {'name': 'Waypoints', 'id': 'waypoints'},
                                        {'name': 'Velocities', 'id': 'velocities'}
                                    ],
                                    data=update_table_data_and_highlight_active_waypoint(0)[
                                        0],
                                    style_data_conditional=update_table_data_and_highlight_active_waypoint(0)[
                                        1],
                                    style_cell={'textAlign': 'center',
                                                'font-family': 'Arial, sans-serif'},
                                    style_header={'fontWeight': 'bold',
                                                  'font-family': 'Arial, sans-serif'}
                                )
                            ], style={'height': '50%', 'overflowY': 'auto'}),
                        ], style={'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'height': '80vh'})
                    ], style={'padding': '0 15px'})
                ], width=4),
            ]),
            dcc.Store(id='n_intervals', data=0),
            dcc.Store(id='is_playing', data=False)
        ], fluid=False)
    ], className="dash-graph-page")
