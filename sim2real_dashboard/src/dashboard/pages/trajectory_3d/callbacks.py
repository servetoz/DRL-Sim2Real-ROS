from dash import callback, Input, Output, State, callback_context

from pages.trajectory_3d import update_table_data_and_highlight_active_waypoint, x, y, z


@callback(
    Output('is_playing', 'data'),
    [Input('play-button', 'n_clicks'), Input('pause-button', 'n_clicks')],
    [State('is_playing', 'data')]
)
def toggle_play_pause(play_clicks, pause_clicks, is_playing):
    ctx = callback_context
    if not ctx.triggered:
        return is_playing
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]

    if button_id == 'play-button':
        return True
    elif button_id == 'pause-button':
        return False


# Callback to update the moving point, waypoints visibility, and handle repeat button

@callback(
    [Output('graph-3d-trajectory', 'figure'), Output('n_intervals', 'data'), Output('waypoints-table', 'data'),
     Output('waypoints-table', 'style_data_conditional')],
    [Input('interval', 'n_intervals'), Input('waypoints-dropdown', 'value'), Input('repeat-button', 'n_clicks'),
     Input('obstacle-dropdown', 'value'), Input('play-button', 'n_clicks'), Input('pause-button', 'n_clicks')],
    [State('graph-3d-trajectory', 'figure'), State('is_playing', 'data'),
     State('n_intervals', 'data')]
)
def update_graph_and_csv(_, waypoints_dropdown_value, repeat_clicks, obstacle_dropdown_value, play_clicks, pause_clicks, figure, is_playing, stored_n_intervals):

    ctx = callback_context
    if ctx.triggered:
        input_id = ctx.triggered[0]['prop_id'].split('.')[0]

        # Handle repeat button click
        if input_id == 'repeat-button':
            stored_n_intervals = 0
            figure['data'][2].update(x=[x[stored_n_intervals]], y=[
                                     y[stored_n_intervals]], z=[z[stored_n_intervals]])

            # Reset n_intervals
            stored_n_intervals = 0

    # Update waypoints visibility
    figure['data'][1].update(
        visible=True if waypoints_dropdown_value == 1 else False)
    # Update visibility of obstacles
    figure['data'][3].update(
        visible=True if obstacle_dropdown_value == 1 else False)

    # Update the moving point
    if not is_playing:
        data, style_data_conditional = update_table_data_and_highlight_active_waypoint(
            stored_n_intervals)
        return figure, stored_n_intervals, data, style_data_conditional

    if stored_n_intervals < len(x) - 1:
        figure['data'][2].update(x=[x[stored_n_intervals]], y=[
                                 y[stored_n_intervals]], z=[z[stored_n_intervals]])
        stored_n_intervals += 1

    data, style_data_conditional = update_table_data_and_highlight_active_waypoint(
        stored_n_intervals)
    return figure, stored_n_intervals, data, style_data_conditional
