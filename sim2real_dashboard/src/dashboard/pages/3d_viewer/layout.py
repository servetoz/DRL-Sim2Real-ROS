import dash
import dash_bootstrap_components as dbc
from dash import dcc
from dash import html
from pages import GetPages


dash.register_page(
    __name__, path=GetPages.THREED_VIEWER["href"], name=GetPages.THREED_VIEWER["title"])


def layout(**args) -> html.Div:
    return html.Div(
        [
            html.Div("", id="studio-root"),
        ]
    )
