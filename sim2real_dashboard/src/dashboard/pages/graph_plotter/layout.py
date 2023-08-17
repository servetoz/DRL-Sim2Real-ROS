import dash
import dash_bootstrap_components as dbc
import numpy as np
import plotly.graph_objs as go
from dash import html, dcc

from dashboard.pages import GetPages
from dashboard.pages.graph_plotter.callbacks import *

dash.register_page(
    __name__,
    path=GetPages.GRAPH_PLOTTER["href"],
    title=GetPages.GRAPH_PLOTTER["title"],
)


def layout() -> html.Div:
    return html.Div([
        dbc.Container(fluid=False, children=[
            html.H3(GetPages.GRAPH_PLOTTER["title"]),
            html.Br(),
            dcc.Store(id='dynamic-graph-store',
                      data={'status': 'init', 'step': 0}),
            dbc.Row([
                dbc.Col([
                    dbc.Card(
                        dbc.CardBody(
                            [
                                dbc.Tabs(
                                    [
                                        dbc.Tab(tab_csv_upload(), id="tab-csv-upload", tab_id="tab-0",
                                                label="Upload CSV"),
                                        dbc.Tab(tab_select_graph_type(), id="tab-graph-type", tab_id="tab-1",
                                                label="Graph Type"),
                                        dbc.Tab(tab_select_csv_columns(), id="tab-csv-columns", tab_id="tab-2",
                                                label="CSV Columns"),
                                    ],
                                    id="graph-plotter-tabs",
                                    className="nav-fill"
                                )
                            ]
                        ),
                    )
                ]),
            ]),
        ])
    ], className="dash-graph-page")


def tab_csv_upload() -> html.Div:
    return html.Div([
        html.H5("Upload CSV"),
        html.Br(),
        html.Div([
            dcc.Upload(
                id='upload-csv-area',
                children=html.Div([
                    'Drag and Drop or ',
                    html.A('Select Files')
                ]),
            ),
            html.Div(id='output-data-upload'),
        ]),
    ],
        className="mt-3"
    )


def tab_select_graph_type() -> html.Div:
    return html.Div([
        html.H5("Select Graph Type"),
        html.Br(),
        html.Div(
            [
                dbc.Row([
                    dbc.Col([
                        dbc.Button(
                            [
                                html.Img(
                                    src=dash.get_asset_url(
                                        'img/bar-chart.svg'),
                                    height="80px",
                                    width="80px"
                                ),
                                html.H5("Bar")
                            ],
                            id="btn-graph-type-bar",
                            color="primary",
                            className="mr-1 btn-graph-type",
                            outline=True,
                        ),
                    ], className="text-center"),
                    dbc.Col([
                        dbc.Button(
                            [
                                html.Img(
                                    src=dash.get_asset_url(
                                        'img/radar-chart.svg'),
                                    height="80px",
                                    width="80px"
                                ),
                                html.H5("Radar")
                            ],
                            id="btn-graph-type-radar",
                            color="primary",
                            className="mr-1 btn-graph-type",
                            outline=True,
                        ),
                    ], className="text-center"),
                    dbc.Col([
                        dbc.Button(
                            [
                                html.Img(
                                    src=dash.get_asset_url(
                                        'img/3d-chart.svg'),
                                    height="80px",
                                    width="80px"
                                ),
                                html.H5("3D Trajectory")
                            ],
                            id="btn-graph-type-3d",
                            color="primary",
                            className="mr-1 btn-graph-type",
                            outline=True,
                        ),
                    ], className="text-center"),
                ]),
            ], id="graph-type"),
    ],
        className="mt-3"
    )


def tab_select_csv_columns() -> html.Div:
    return html.Div([
        html.Div(
            [
                html.H5("Select CSV Columns"),
                dbc.Button([
                    html.I(className="fas fa-bolt"),
                    html.Span("Plot", className="ms-2")
                ], color="success", size="lg", id="btn-plot-csv", className="mt-3"),
            ],
            className="mt-3 d-flex justify-content-between align-items-center"
        ),
        html.Br(),
        html.Div("", id="csv-table"),
    ],
        className="mt-3"
    )
