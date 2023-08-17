import dash
import os
import sys
import dash_bootstrap_components as dbc
import dash_mantine_components as dmc
from dash import html, Output, Input, dcc, State
import flask
from pages import GetPages
from components.navbar import navbar
sys.path.append(os.path.dirname(__file__))


def sim2real_dashboard(DEV_MODE, TRAINING_CONFIG_FOLDER, SIM2REAL_CONFIG_FOLDER) -> dash.Dash:
    assets_path = os.path.join(os.path.dirname(__file__), "assets")
    external_js = [
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js'
    ]
    if DEV_MODE:
        external_js.append("http://localhost:8080/studio-main.js")

    app = dash.Dash(
        name="sim2real_dashboard",
        external_stylesheets=[
            dbc.themes.FLATLY,
            dbc.icons.FONT_AWESOME,
        ],
        external_scripts=external_js,
        assets_folder=assets_path,
        pages_folder=os.path.join(os.path.dirname(__file__), "pages"),
        assets_ignore=r"(studio-\d*\.js)|(.*worker.*)|favicon.ico",
        use_pages=True,
        suppress_callback_exceptions=True,
    )

    def serve_layout():
        return html.Div([
            html.Div(
                [
                    dcc.Location(id="url", refresh=True),
                    html.Div([
                        dmc.Button(
                            html.I(className="fas fa-bars"),
                            id="menu-button",
                            variant="outline", color="blue", className="rounded"),
                        dmc.Button(
                            html.I(className="fas fa-bars"),
                            id="menu-button-2",
                            variant="outline", color="blue", className="ms-2 rounded d-none"),
                    ],
                        className="floating-menu-button"
                    ),
                    dmc.Drawer(
                        children=navbar(),
                        title=dbc.NavbarBrand(
                            "Sim2Real Dashboard", className="mx-auto fw-bold fs-5"),
                        id="navigation-drawer",
                        padding="md",
                        zIndex=10000,
                    ),
                ]
            ),
            html.Div(dash.page_container),
        ])

    @app.callback(
        Output("navigation-drawer", "opened", allow_duplicate=True),
        Output("3d-panel-nav-link", "className"),
        Input("menu-button", "n_clicks"),
        Input("menu-button-2", "n_clicks"),
        State("url", "pathname"),
        prevent_initial_call=True,
    )
    def navigation_drawer(n_clicks, n_clicks2, pathname):
        if pathname == GetPages().THREED_VIEWER["href"]:
            return True, "nav-link active"
        return True, "nav-link"

    @app.callback(
        Output("navigation-drawer", "opened", allow_duplicate=True),
        Input("url", "pathname"),
        prevent_initial_call=True,
    )
    def navigate(pathname):
        return False

    app.index_string = """<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        <link rel="icon" href="data:,">
        {%css%}
    </head>
    <body>
        <!--[if IE]><script>
        alert("Dash v2.7+ does not support Internet Explorer. Please use a newer browser.");
        </script><![endif]-->
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>"""
    app.layout = serve_layout

    app.sim2real_config_folder = SIM2REAL_CONFIG_FOLDER
    app.training_config_folder = TRAINING_CONFIG_FOLDER

    from api import config_file_list

    return app


if __name__ == "__main__":
    app = sim2real_dashboard()
    app.run_server(debug=True)
