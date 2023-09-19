from datetime import datetime
from pprint import pprint
from typing import cast, List, Dict
import re
import dash
import numpy as np
import base64
from dash import Input, Output, State, callback, html, MATCH, dcc, ALL
from dash.exceptions import PreventUpdate
from dash import dash_table
import dash_bootstrap_components as dbc

from utils.graph_data import DataSource, CSVFile, CalculationMethod, ChartType, DynamicPlot, GraphArguments, csv_row_to_vector

app = dash.get_app()


def get_data_sources() -> List[DataSource]:
    return app.data_sources if hasattr(app, 'data_sources') else []


def get_dynamic_plot() -> DynamicPlot:
    return app.dynamic_plot if hasattr(app, 'dynamic_plot') else None


@callback(
    Output("dynamic-graph-store", "data", allow_duplicate=True),
    Input("upload-csv-area", "contents"),
    State("upload-csv-area", "filename"),
    State("upload-csv-area", "last_modified"),
    prevent_initial_call=True
)
def upload_csv(contents, filenames, modified):
    if [contents, filenames, modified] == [None, None, None]:
        return dash.no_update

    app.data_sources = []
    app.dynamic_plot = None

    for i in range(len(filenames)):
        content_type, content_string = contents[i].split(',')
        decoded = base64.b64decode(content_string)
        if content_type in 'text/csv':
            return {
                'status': 'error',
                'message': 'File extension must be .csv',
                'step': 0
            }
        csv_file = CSVFile(str(filenames[i]), decoded)
        get_data_sources().append(DataSource(csv_file))

    app.dynamic_plot = DynamicPlot()

    return {
        'status': 'uploaded',
        'step': 1
    }


@callback(
    Output("graph-plotter-tabs", "className"),
    Input("dynamic-graph-store", "data"),
    Input("upload-csv-area", "last_modified"),
    prevent_initial_call=True
)
def set_uploading_indicator(
        data,
        last_modified
):
    if data['status'] in ['uploaded', 'selected']:
        return "nav-fill"

    return "nav-fill uploading"


@callback(
    Output("graph-plotter-tabs", "active_tab"),
    Output("tab-graph-type", "disabled"),
    Output("tab-csv-columns", "disabled"),
    Input("dynamic-graph-store", "data"),
    prevent_initial_call=True
)
def set_activate_step(data):
    if get_dynamic_plot() is None:
        return dash.no_update

    return f"tab-{data['step']}", True if data['step'] < 1 else False, True if data['step'] < 2 else False


@callback(
    Output("dynamic-graph-store", "data", allow_duplicate=True),
    Input("btn-graph-type-bar", "n_clicks"),
    Input("btn-graph-type-line", "n_clicks"),
    Input("btn-graph-type-radar", "n_clicks"),
    Input("btn-graph-type-3d", "n_clicks"),
    prevent_initial_call=True
)
def select_graph_type(btn_bar, btn_line, btn_radar, btn_trajectory):
    if get_dynamic_plot() is None:
        return dash.no_update

    if [btn_bar, btn_line, btn_radar, btn_trajectory] == [None, None, None, None]:
        return dash.no_update

    ctx = dash.callback_context
    if not ctx.triggered:
        return dash.no_update

    button_id = ctx.triggered[0]['prop_id'].split('.')[0]

    chart_types = {
        'btn-graph-type-bar': ChartType.BAR,
        'btn-graph-type-line': ChartType.LINE,
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

    if data['status'] != 'selected':
        return dash.no_update

    tables = [dbc.AccordionItem(
        [
            html.Div(
                [
                    dbc.Label("Select Episodes:"),
                    dcc.Dropdown(
                        options=[{"label": eps.number, "value": str(eps.number)}
                                 for eps in get_data_sources()[i].episodes],
                        multi=True,
                        id={"type": "dropdown-episode-selection",
                            "index": str(i)},
                    )
                ]
            ),
            html.Div(
                get_csv_table(i),
                id={"type": "csv-table-accordion", "index": i},
            )
        ],
        title=f"{get_data_sources()[i].csv_file.file_name}",
        className="mt-2"
    ) for i in range(len(get_data_sources()))]

    return dbc.Accordion(
        tables,
        start_collapsed=True,
        always_open=True
    )


@callback(
    Output({"type": "csv-datatable", "index": ALL}, "children"),
    Input({"type": "csv-datatable", "index": ALL}, "selected_columns"),
)
def column_selected(columns):
    if get_dynamic_plot() is None:
        raise PreventUpdate

    ctx = dash.callback_context
    if not ctx.triggered:
        raise PreventUpdate

    graph_id = ctx.triggered[0]['prop_id'].split('.')[0]
    graph_id = eval(graph_id)
    graph_index = graph_id.get('index')

    get_dynamic_plot().set_selected_columns(graph_index, columns[graph_index])

    raise PreventUpdate


def get_csv_table(data_source_index: int, row_count=100, load_more_n_clicks=1):
    data_source = get_data_sources()[data_source_index]
    data = data_source.get_data().to_dict('records')
    if row_count > -1:
        data = data[:np.min([len(data), row_count])]

    selectable = data_source.get_data().columns
    if get_dynamic_plot().chart_type == ChartType.BAR:
        selectable = get_selectable_columns_for_bar(data_source)
    elif get_dynamic_plot().chart_type == ChartType.TRAJECTORY:
        selectable = get_selectable_columns_for_3d(data_source)

    return html.Div(
        [
            html.Div([dash_table.DataTable(
                id={"type": "csv-datatable", "index": data_source_index},
                columns=[{"name": i, "id": i, "selectable": True if i in selectable else False}
                         for i in data_source.columns],
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
            )], className="mt-3 mb-3 overflow-auto csv-table"),
            html.Div(
                [
                    html.Button("Load More", id={"type": "btn-load-more", "index": data_source_index},
                                className="btn btn-primary mr-1", n_clicks=load_more_n_clicks),
                    html.Button("Load All CSV", id={
                                "type": "btn-load-all", "index": data_source_index},  className="btn btn-warning mr-1"),
                ],
                className="d-flex gap-2 justify-content-center"
            )
        ],
        id={"type": "csv-table-container", "index": data_source_index},
    )


@callback(
    Output({"type": "csv-table-accordion", "index": MATCH},
           "children", allow_duplicate=True),
    Input({"type": "btn-load-more", "index": MATCH}, "n_clicks"),
    Input({"type": "btn-load-all", "index": MATCH}, "n_clicks"),
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
    button_id = eval(button_id)
    source_index = button_id.get('index')
    button_id = button_id.get('type')

    if button_id == 'btn-load-more':
        return get_csv_table(source_index, row_count=btn_load_more*100, load_more_n_clicks=btn_load_more)

    if button_id == 'btn-load-all':
        return get_csv_table(source_index, row_count=-1)

    return dash.no_update


@callback(
    Output("arguments-section", "children"),
    Input("dynamic-graph-store", "data"),
    prevent_initial_call=True
)
def render_plot_arguments(data):
    if data is None:
        return dash.no_update

    if data.get("status") not in ["uploaded", "selected"]:
        return dash.no_update

    arguments = [
        dbc.Row(
            [
                dbc.Label("Episode Average:", html_for="arg-ep-avg", width=3),
                dbc.Col(
                    dbc.Checklist(
                        options=[
                            {"label": "Yes", "value": 1},
                        ],
                        id="arg-ep-avg",
                        switch=True,
                    ),
                    width=9,
                    className="flex-wrap align-items-center d-flex"
                ),
            ],
            className="mb-3" + "" if get_dynamic_plot().chart_type == ChartType.TRAJECTORY else "d-none",
        ),
        dbc.Row(
            [
                dbc.Label("Plot Calculation:",
                          html_for="arg-calculation", width=3),
                dbc.Col(
                    dbc.RadioItems(
                        options=[
                            {"label": "Sum", "value": CalculationMethod.SUM.value},
                            {"label": "Average",
                                "value": CalculationMethod.AVERAGE.value},
                            {"label": "Last row",
                                "value": CalculationMethod.LAST_ROW.value},
                            {"label": "Maximum", "value": CalculationMethod.MAX.value},
                            {"label": "Minimum", "value": CalculationMethod.MIN.value},
                        ],
                        value=1,
                        id="arg-calculation",
                        inline=True,
                    ),
                    width=9,
                    className="flex-wrap align-items-center d-flex"
                ),
            ],
            className="mb-3" + "" if get_dynamic_plot().chart_type in [ChartType.BAR, ChartType.RADAR] else "d-none",
        ),
        dbc.Row(
            [
                dbc.Label("Success & Collision & Timeout:",
                          width=3, html_for="suc-col-tout"),
                dbc.Col(
                    dbc.Checklist(
                        options=[
                            {"label": "Yes", "value": 1},
                        ],
                        id="suc-col-tout",
                        switch=True,
                    ),
                    width=9,
                    className="flex-wrap align-items-center d-flex"
                ),
            ],
            className="mt-3 mb-5" + "" if get_dynamic_plot().chart_type == ChartType.BAR else "d-none",
        ),
    ]

    return dbc.Accordion(
        dbc.AccordionItem(
            arguments,
            title="Arguments",
            className="mt-3"
        ),
        start_collapsed=False,
        className="mb-5"
    )


@callback(
    Output({"type": "dropdown-episode-selection", "index": MATCH}, "value"),
    Output({"type": "dropdown-episode-selection", "index": MATCH}, "options"),
    State({"type": "dropdown-episode-selection", "index": MATCH}, "options"),
    State({"type": "dropdown-episode-selection", "index": MATCH}, "value"),
    Input({"type": "dropdown-episode-selection", "index": MATCH}, "search_value"),
    prevent_initial_call=True
)
def episodes_dropdown_interaction(options, val, search_val):
    if search_val is None or search_val == "" or search_val == "," or not search_val.endswith(","):
        raise PreventUpdate
    search_val = search_val[:-1]
    search_val = search_val.strip()
    search_val = search_val.replace(" ", "")
    search_val = "".join([c for c in search_val if c.isdigit() or c == "-"])
    search_val = re.sub(r"-+", "-", search_val)
    if search_val == "":
        raise PreventUpdate
    if search_val.count("-") > 0:
        min_val, max_val = search_val.split("-")
        if int(min_val) > int(max_val):
            search_val = max_val + "-" + min_val
    new_val = search_val
    options.append({"label": new_val, "value": str(new_val)})
    val = [new_val] if val is None else val + [new_val]
    val = list(set(val))
    val.sort(key=lambda x: int(x.replace("-", "")))
    options = [dict(t) for t in {tuple(d.items()) for d in options}]
    options.sort(key=lambda x: int(x["value"].replace("-", "")))
    return val, options


def get_selectable_columns_for_bar(data_source: DataSource):
    columns = data_source.columns
    columns = [column for column in columns if column not in [
        'episodes', 'steps']]
    columns_scalar = [col for col in columns if data_source.get_data()[col].dtype in [
        'float64', 'int64']]

    return columns_scalar


def get_selectable_columns_for_3d(data_source: DataSource):
    columns = data_source.columns
    columns = [
        column for column in columns if column not in ['episodes', 'steps']
    ]
    columns_3d_vector = [
        col for col in columns if data_source.get_data()[col].dtype in ['object'] and len(csv_row_to_vector(data_source.get_data()[col][0])) == 3
    ]
    return columns_3d_vector


@callback(
    Output({"type": "csv-table-container", "index": ALL}, "disabled"),
    Input("suc-col-tout", "value"),
    prevent_initial_call=True
)
def disable_csv_table(suc_col_tout):
    if get_dynamic_plot() is None:
        return dash.no_update

    if suc_col_tout is None:
        return dash.no_update

    return [True if suc_col_tout else False for _ in range(len(get_data_sources()))]


@callback(
    Output("graph-accordion", "children"),
    Output("graph-accordion", "active_item"),
    Input("btn-plot-csv", "n_clicks"),
    State("graph-accordion", "children"),
    Input({"type": "btn-plot-remove", "index": ALL}, "n_clicks"),
    ####
    State({"type": "dropdown-episode-selection", "index": ALL}, "value"),
    State("suc-col-tout", "value"),
    State("arg-ep-avg", "value"),
    State("arg-calculation", "value"),
    ####
    prevent_initial_call=True
)
def plot_csv(btn_plot_csv, children, btn_delete_plot, episodes_selection, suc_col_tout, episode_average, calculation_method):
    if get_dynamic_plot() is None:
        return dash.no_update

    if btn_plot_csv is None:
        return dash.no_update

    ctx = dash.callback_context
    if not ctx.triggered:
        return dash.no_update

    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    if button_id != 'btn-plot-csv':
        button_id = eval(button_id)
        button_id = button_id.get('index')
        children = [child for child in children if child.get("props").get(
            "id") != "graph-accordion-item-" + str(button_id)]
        return children, "item-0"

    children = [child for child in children if child.get("props").get(
        "id") not in ["alert-no-column-selected", "alert-no-episode-selected"]]

    if get_dynamic_plot().is_selected_columns_empty() and (suc_col_tout is None or suc_col_tout == []):
        return [dbc.Alert("Please select at least one column to plot.", color="danger", id="alert-no-column-selected")]+children, "item-0"

    if is_episode_selection_empty(episodes_selection):
        return [dbc.Alert("Please select at least one episode to plot.", color="danger", id="alert-no-episode-selected")]+children, "item-0"

    graph_args = parse_plot_arguments(
        episodes_selection=episodes_selection,
        episode_average=episode_average,
        calculation_method=CalculationMethod(calculation_method),
        suc_col_tout=suc_col_tout
    )
    graph = get_dynamic_plot().plot_data(graph_args)
    children = [
        dbc.AccordionItem(
            [
                html.Div(
                    dcc.Graph(
                        id={"type": "graph", "index": btn_plot_csv},
                        figure=graph,
                        className="generated-graph"
                    ),
                    id={"type": "graph-container", "index": btn_plot_csv},
                    className="mt-3 pt-3 mb-3 overflow-auto"
                ),
                dbc.Button(
                    [html.I(className="fas fa-trash-alt")],
                    id={"type": "btn-plot-remove", "index": btn_plot_csv}, color="danger", className="btn-graph-delete"),
            ],
            title="Graph " + str(btn_plot_csv) + "  |  created at " +
            datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
            className="mt-2",
            id="graph-accordion-item-" + str(btn_plot_csv),
        )
    ] + children

    return children, "item-0"


def parse_plot_arguments(
        episodes_selection: List[List[str]],
        episode_average: bool,
        calculation_method: CalculationMethod,
        suc_col_tout: bool
):
    data_sources = get_data_sources()
    data_sets = []
    ep_avg = " Avg. " if episode_average else ""
    for source_index in range(len(data_sources)):
        if episodes_selection[source_index] is None or len(episodes_selection[source_index]) == 0:
            continue
        for ep in episodes_selection[source_index]:
            if ep.count('-') > 0:
                min_val, max_val = ep.split('-')
                data_sets.append({
                    'title': f"Ep. {ep_avg} {min_val}-{max_val} <br> {data_sources[source_index].csv_file.file_name}",
                    'episodes': [data_sources[source_index].get_episode_by_number(i) for i in range(int(min_val), int(max_val) + 1)],
                    'source_index': source_index,
                })
            else:
                data_sets.append({
                    'title': f"Ep. {ep_avg} {ep} <br> {data_sources[source_index].csv_file.file_name}",
                    'episodes': [data_sources[source_index].get_episode_by_number(int(ep))],
                    'source_index': source_index,
                })

    return GraphArguments(
        data_sets=data_sets,
        episode_average=episode_average,
        calculation_method=calculation_method,
        suc_col_tout=suc_col_tout
    )


def is_episode_selection_empty(episodes_selection: List[List[str]]):
    for source_index in range(len(episodes_selection)):
        if episodes_selection[source_index] is None or len(episodes_selection[source_index]) == 0:
            continue
        return False
    return True


@callback(
    Output("graph-section-title", "className"),
    Input("btn-plot-csv", "n_clicks"),
    prevent_initial_call=True
)
def show_graph_section_title(btn_plot_csv):
    if get_dynamic_plot() is None:
        return dash.no_update

    if btn_plot_csv is None:
        return dash.no_update

    return "d-block"
