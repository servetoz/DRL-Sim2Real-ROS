import dash
import dash_bootstrap_components as dbc
import numpy as np
import plotly.graph_objs as go
from dash import html, dcc

from pages.evaluation import colors, RRT_array, PRM_array, steps_DRL, steps_RRT, steps_PRM, distance_obst_DRL, distance_obst_RRT, distance_obst_PRM, DRL_array, planning, execution
from pages.evaluation.callbacks import *
from pages import GetPages

dash.register_page(
    __name__, path=GetPages.EVALUATION["href"], title=GetPages.EVALUATION["title"])


def layout() -> html.Div:

    return html.Div([
        dbc.Container(fluid=False, children=[
            html.H3("Evaluation"),
            html.Br(),
            dbc.Row([
                dbc.Col([
                    html.H3('Planning and Execution Time', style={
                        'textAlign': 'center', 'font-family': 'Arial, sans-serif'}),
                    dcc.Graph(
                        id='planning-execution-time',
                        figure={
                            'data': [
                                go.Bar(x=['DRL'], y=[
                                    planning[0]], name='Computation Time DRL', marker_color=colors[0]),
                                go.Bar(x=['RRT'], y=[
                                    planning[1]], name='Computation Time RRT', marker_color=colors[1]),
                                go.Bar(x=['PRM'], y=[
                                    planning[2]], name='Computation Time PRM', marker_color=colors[2]),
                                go.Bar(x=['DRL', 'RRT', 'PRM'], y=execution,
                                       name='Execution Time', marker_color='#5CB85C')
                            ],
                            'layout': go.Layout(barmode='stack', xaxis={'title': ''}, yaxis={'title': 'Time'})
                        }
                    ),
                    dcc.Dropdown(
                        id='planning-execution-time-dropdown',
                        options=[{'label': f'Episode {i}', 'value': f'Episode {i}'} for i in range(
                            1, 11)] + [{'label': 'Average', 'value': 'Episode 11'}],
                        value='Episode 11',
                        clearable=False,
                        style={'width': '100%',
                               'font-family': 'Arial, sans-serif'}
                    ),
                ], width=4),
                dbc.Col([
                    html.H3('Number of Steps', style={
                        'textAlign': 'center', 'font-family': 'Arial, sans-serif'}),
                    dcc.Graph(
                        id='number-of-steps',
                        figure={
                            'data': [
                                go.Bar(x=['DRL'], y=[steps_DRL[0]],
                                       name='DRL Number of Steps', marker_color=colors[0]),
                                go.Bar(x=['RRT'], y=[steps_RRT[1]],
                                       name='RRT Number of Steps', marker_color=colors[1]),
                                go.Bar(x=['PRM'], y=[steps_PRM[2]],
                                       name='PRM Number of Steps', marker_color=colors[2]),
                            ],
                            'layout': go.Layout(xaxis={'title': ''}, yaxis={'title': 'Number of Steps'})
                        }
                    ),
                    dcc.Dropdown(
                        id='number-of-steps-dropdown',
                        options=[{'label': f'Episode {i}', 'value': f'Episode {i}'} for i in range(
                            1, 11)] + [{'label': 'Average', 'value': 'Episode 11'}],
                        value='Episode 11',
                        clearable=False,
                        style={'width': '100%',
                               'font-family': 'Arial, sans-serif'}
                    ),
                ], width=4),
                dbc.Col([
                    html.H3('Distance to Obstacle', style={
                            'textAlign': 'center', 'font-family': 'Arial, sans-serif'}),
                    dcc.Graph(
                        id='distance-to-obstacle',
                        figure={
                            'data': [
                                go.Scatter(x=list(range(
                                    1, 10000)), y=distance_obst_DRL[0], mode='lines+markers', name='DRL Distance', marker_color=colors[0]),
                                go.Scatter(x=list(range(
                                    1, 10000)), y=distance_obst_RRT[0], mode='lines+markers', name='RRT Distance', marker_color=colors[1]),
                                go.Scatter(x=list(range(
                                    1, 10000)), y=distance_obst_PRM[0], mode='lines+markers', name='PRM Distance', marker_color=colors[2])
                            ],
                            'layout': go.Layout(
                                xaxis={'title': 'Steps'},
                                yaxis={'title': 'Distance'}
                            )
                        }
                    ),
                    dcc.Dropdown(
                        id='distance-to-obstacle-dropdown',
                        options=[{'label': f'Episode {i}', 'value': f'Episode {i}'} for i in range(
                            1, 11)] + [{'label': 'Average', 'value': 'Episode 11'}],
                        value='Episode 11',
                        clearable=False,
                        style={'width': '100%',
                               'font-family': 'Arial, sans-serif'}
                    ),
                ], width=4),
                dbc.Col([
                    html.H3('Radar Chart', style={
                            'textAlign': 'center', 'font-family': 'Arial, sans-serif'}),
                    dcc.Graph(
                        id='radar-chart',
                        figure={
                            'data': [
                                go.Scatterpolar(
                                    r=DRL_array[0],
                                    theta=['computation Time', 'distance_to_obstacle',
                                           'number of steps', 'execution time', 'roughness index'],
                                    fill='toself',
                                    name='DRL'
                                ),
                                go.Scatterpolar(
                                    r=RRT_array[0],
                                    theta=['computation Time', 'distance_to_obstacle',
                                           'number of steps', 'execution time', 'roughness index'],
                                    fill='toself',
                                    name='RRT'
                                ),
                                go.Scatterpolar(
                                    r=PRM_array[0],
                                    theta=['computation Time', 'distance_to_obstacle',
                                           'number of steps', 'execution time', 'roughness index'],
                                    fill='toself',
                                    name='PRM',
                                    marker_color='#8E6BB4'
                                )
                            ],
                            'layout': go.Layout(
                                polar=dict(
                                    radialaxis=dict(visible=True, range=[1, 0])
                                ),
                                showlegend=True
                            )
                        }
                    ),
                    dcc.Dropdown(
                        id='radar-chart-dropdown',
                        options=[{'label': f'Episode {i}', 'value': f'Episode {i}'}
                                 for i in range(1, 11)] + [{'label': 'Average', 'value': 'Episode 11'}],
                        value='Episode 11',
                        clearable=False,
                        style={'width': '100%',
                               'font-family': 'Arial, sans-serif'}
                    ),
                ], width=4),

            ]),
        ])
    ], className="dash-graph-page")
