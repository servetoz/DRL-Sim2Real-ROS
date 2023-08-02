
import dash_bootstrap_components as dbc
from dash import html

from pages import GetPages


def navbar():
    return html.Div(
        dbc.Nav(
            [
                dbc.NavItem(
                    dbc.NavLink(page["title"],
                                href=page["href"], active="exact")
                ) for page in GetPages().list

            ] +
            [
                html.A("3D Viewer",
                       href="/3d-viewer",
                       id="3d-panel-nav-link",
                       className="nav-link"
                       ),
            ],
            className="flex-column mb-auto text-left",
            navbar=True,
            pills=True,
        ),
        className="d-flex flex-column flex-shrink-0 p-3"
    )
