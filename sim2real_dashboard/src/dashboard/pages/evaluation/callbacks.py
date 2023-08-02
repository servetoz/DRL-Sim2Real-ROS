from dash import Input, Output, callback
import dash
import plotly.graph_objs as go
from pages.evaluation import colors, DRL_array, RRT_array, PRM_array, plan_DRL, plan_RRT, plan_PRM, exec_DRL, exec_RRT, exec_PRM, steps_DRL, steps_RRT, steps_PRM, distance_obst_DRL, distance_obst_RRT, distance_obst_PRM


# Graph 1: Planning and execution time
@callback(
    Output('planning-execution-time', 'figure'),
    [Input('planning-execution-time-dropdown', 'value')]
)
def update_planning_execution_chart(episode):
    episode_index = int(episode.split(" ")[-1]) - 1

    planning_values = [plan_DRL[episode_index],
                       plan_RRT[episode_index], plan_PRM[episode_index]]
    execution_values = [exec_DRL[episode_index],
                        exec_RRT[episode_index], exec_PRM[episode_index]]

    return {
        'data': [
            go.Bar(x=['DRL'], y=[planning_values[0]],
                   name='Computation Time DRL', marker_color=colors[0]),
            go.Bar(x=['RRT'], y=[planning_values[1]],
                   name='Computation Time RRT', marker_color=colors[1]),
            go.Bar(x=['PRM'], y=[planning_values[2]],
                   name='Computation Time PRM', marker_color=colors[2]),
            go.Bar(x=['DRL', 'RRT', 'PRM'], y=execution_values,
                   name='Execution Time', marker_color='#5CB85C')
        ],
        'layout': go.Layout(barmode='stack', xaxis={'title': ''}, yaxis={'title': 'Time'})
    }

# Graph 2: Number of steps


@callback(
    Output('number-of-steps', 'figure'),
    [Input('number-of-steps-dropdown', 'value')]
)
def update_number_of_steps_chart(episode):
    episode_index = int(episode.split(" ")[-1]) - 1

    steps_values = [steps_DRL[episode_index],
                    steps_RRT[episode_index], steps_PRM[episode_index]]

    return {
        'data': [
            go.Bar(x=['DRL'], y=[steps_values[0]],
                   name='DRL Number of Steps', marker_color=colors[0]),
            go.Bar(x=['RRT'], y=[steps_values[1]],
                   name='RRT Number of Steps', marker_color=colors[1]),
            go.Bar(x=['PRM'], y=[steps_values[2]],
                   name='PRM Number of Steps', marker_color=colors[2]),
        ],
        'layout': go.Layout(xaxis={'title': ''}, yaxis={'title': 'Number of Steps'})
    }

# Graph 3: Distance to obstacles


@callback(
    Output('distance-to-obstacle', 'figure'),
    [Input('distance-to-obstacle-dropdown', 'value')]
)
def update_distance_to_obstacle_chart(episode):
    episode_index = int(episode.split(" ")[-1]) - 1

    return {
        'data': [
            go.Scatter(x=list(range(1, 10000)), y=distance_obst_DRL[episode_index],
                       mode='lines+markers', name='DRL Distance', marker_color=colors[0]),
            go.Scatter(x=list(range(1, 10000)), y=distance_obst_RRT[episode_index],
                       mode='lines+markers', name='RRT Distance', marker_color=colors[1]),
            go.Scatter(x=list(range(1, 10000)), y=distance_obst_PRM[episode_index],
                       mode='lines+markers', name='PRM Distance', marker_color=colors[2])
        ],
        'layout': go.Layout(
            xaxis={'title': 'Steps'},
            yaxis={'title': 'Distance'}
        )
    }


@callback(
    Output('radar-chart', 'figure'),
    [Input('radar-chart-dropdown', 'value')]
)
def update_radar_chart(episode):
    episode_index = int(episode.split(" ")[-1]) - 1

    return {
        'data': [
            go.Scatterpolar(
                r=DRL_array[episode_index],
                theta=['computation Time', 'distance_to_obstacle',
                       'number of steps', 'execution time', 'roughness index'],
                fill='toself',
                name='DRL'
            ),
            go.Scatterpolar(
                r=RRT_array[episode_index],
                theta=['computation Time', 'distance_to_obstacle',
                       'number of steps', 'execution time', 'roughness index'],
                fill='toself',
                name='RRT'
            ),
            go.Scatterpolar(
                r=PRM_array[episode_index],
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
