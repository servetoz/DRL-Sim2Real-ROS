from typing import cast
import dash
import numpy as np
import base64
from dash import Input, Output, State, callback, html
from dash import dash_table
import dash_bootstrap_components as dbc

from pages.graph_plotter.data import ChartType, DynamicPlot

app = dash.get_app()


def get_dynamic_plot() -> DynamicPlot:
    return app.dynamic_plot


@callback(
    Output("dynamic-graph-store", "data", allow_duplicate=True),
    Input("upload-csv-area", "contents"),
    State("upload-csv-area", "filename"),
    State("upload-csv-area", "last_modified"),
    prevent_initial_call=True
)
def upload_csv(content, filename, modified):
    if [content, filename, modified] == [None, None, None]:
        return dash.no_update

    if hasattr(app, 'dynamic_plot') is False:
        app.dynamic_plot = DynamicPlot()

    content_type, content_string = content.split(',')
    decoded = base64.b64decode(content_string)

    if content_type in 'text/csv':
        return {
            'status': 'error',
            'message': 'File extension must be .csv',
            'step': 0
        }

    get_dynamic_plot().set_csv_data(decoded)

    return {
        'status': 'uploaded',
        'step': 1
    }


@callback(
    Output("graph-plotter-tabs", "active_tab"),
    Input("dynamic-graph-store", "data"),
    prevent_initial_call=True
)
def set_activate_step(data):
    if get_dynamic_plot() is None:
        return dash.no_update

    return f"tab-{data['step']}"


@callback(
    Output("dynamic-graph-store", "data", allow_duplicate=True),
    Input("btn-graph-type-bar", "n_clicks"),
    Input("btn-graph-type-radar", "n_clicks"),
    Input("btn-graph-type-3d", "n_clicks"),
    prevent_initial_call=True
)
def select_graph_type(btn_bar, btn_radar, btn_trajectory):
    if get_dynamic_plot() is None:
        return dash.no_update

    if btn_bar is None and btn_radar is None and btn_trajectory is None:
        return dash.no_update

    ctx = dash.callback_context
    if not ctx.triggered:
        return dash.no_update

    button_id = ctx.triggered[0]['prop_id'].split('.')[0]

    chart_types = {
        'btn-graph-type-bar': ChartType.BAR,
        'btn-graph-type-radar': ChartType.RADAR,
        'btn-graph-type-3d': ChartType.TRAJECTORY
    }

    get_dynamic_plot().set_chart_type(chart_types[button_id])

    return {
        'status': 'selected',
        'step': 2
    }


@callback(
    Output("csv-table", "children", allow_duplicate=True),
    Input("dynamic-graph-store", "data"),
    prevent_initial_call=True
)
def draw_csv_table(data):
    if get_dynamic_plot() is None:
        return dash.no_update

    if data['status'] != 'uploaded':
        return dash.no_update

    return get_csv_table()


@callback(
    Output("csv-datatable", "children"),
    Input("csv-datatable", "selected_columns"),
)
def column_selected(columns):
    if get_dynamic_plot() is None:
        return dash.no_update

    get_dynamic_plot().set_selected_columns(columns)

    return dash.no_update


def get_csv_table(row_count=100, load_more_n_clicks=1):
    data = get_dynamic_plot().csv_data.to_dict('records')
    if row_count > -1:
        data = data[:np.min([len(data), row_count])]

    return html.Div(
        [
            html.Div([dash_table.DataTable(
                id='csv-datatable',
                columns=[{"name": i, "id": i, "selectable": True}
                         for i in get_dynamic_plot().csv_data.columns],
                data=data,
                style_cell={'textAlign': 'left'},
                column_selectable="multi",
                page_size=500,
                style_header={
                    'backgroundColor': 'rgb(230, 230, 230)',
                    'fontWeight': 'bold'
                },
                style_data_conditional=[
                    {
                        'if': {'row_index': 'odd'},
                        'backgroundColor': 'rgb(248, 248, 248)'
                    }
                ],
            )], className="mt-3 mb-3 overflow-auto"),
            html.Div(
                [
                    dbc.Button("Load More", id="btn-load-more", n_clicks=load_more_n_clicks,
                               color="primary", className="mr-1"),
                    dbc.Button("Load All CSV", id="btn-load-all",
                               color="warning", className="mr-1"),
                ],
                className="d-flex gap-2 justify-content-center"
            )
        ]
    )


@callback(
    Output("csv-table", "children", allow_duplicate=True),
    Input("btn-load-more", "n_clicks"),
    Input("btn-load-all", "n_clicks"),
    prevent_initial_call=True
)
def load_more_rows(btn_load_more, btn_load_all):
    if get_dynamic_plot() is None:
        return dash.no_update

    if btn_load_more is None and btn_load_all is None:
        return dash.no_update

    ctx = dash.callback_context
    if not ctx.triggered:
        return dash.no_update

    button_id = ctx.triggered[0]['prop_id'].split('.')[0]

    if button_id == 'btn-load-more':
        return get_csv_table(row_count=btn_load_more*100, load_more_n_clicks=btn_load_more)

    if button_id == 'btn-load-all':
        return get_csv_table(row_count=-1)

    return dash.no_update
