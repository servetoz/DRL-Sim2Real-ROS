import re
from enum import Enum
import numpy as np
from typing import List, Dict, Union
from io import StringIO
import pandas as pd
import plotly.express as px
import plotly.graph_objs as go
from pprint import pprint


class CSVFile:
    file_name: str = None
    data: pd.DataFrame = None
    columns: list = None
    rows: list = None

    def __init__(self, file_name: str, data: str):
        self.file_name = file_name
        self.data = pd.read_csv(StringIO(data.decode('utf-8')))
        self.columns = self.data.columns.tolist()
        self.rows = self.data.values.tolist()


class Episode:
    def __init__(self, number: int, data_frame: pd.DataFrame, columns: list):
        self.number = number
        self.data_frame = data_frame
        self.columns = columns

    def get_row_by_step(self, step: int) -> list:
        return self.data_frame[self.data_frame['step'] == step].values.tolist()[0]


class DataSource:
    def __init__(self, csv_file: CSVFile):
        self.csv_file = csv_file
        self.episodes = self._get_episodes()
        self.columns = self._get_columns()
        self.rows = self._get_rows()

    def get_data(self) -> pd.DataFrame:
        return self.csv_file.data

    def _get_episodes(self) -> List[Episode]:
        episodes = self.csv_file.data['episodes'].unique().tolist()
        episodes.sort()
        episodes = [
            Episode(
                episode,
                self.csv_file.data[
                    self.csv_file.data['episodes'] == episode
                ],
                self.csv_file.data.columns.tolist()
            ) for episode in episodes
        ]
        return episodes

    def _get_columns(self) -> List[str]:
        return self.csv_file.data.columns.tolist()

    def _get_rows(self) -> List[list]:
        return self.csv_file.data.values.tolist()

    def get_episode_by_number(self, number: int) -> Episode:
        return self.episodes[number - 1]


class ChartType(Enum):
    BAR = 1
    LINE = 2
    RADAR = 3
    TRAJECTORY = 4


class CalculationMethod(Enum):
    SUM = 1
    AVERAGE = 2
    LAST_ROW = 3
    MAX = 4
    MIN = 5
    
class Scaling(Enum):
    DOWN = 0
    UP = 1


class GraphArguments:
    def __init__(
        self,
        data_sets: Dict[str, Union[str, List[Episode]]],
        episode_average: bool,
        calculation_method: CalculationMethod,
        suc_col_tout: bool,
        scaling: Scaling
    ):
        self.data_sets = data_sets
        self.episode_average = episode_average
        self.calculation_method = calculation_method
        self.suc_col_tout = suc_col_tout
        self.scaling = scaling


class DynamicPlot():

    def __init__(self) -> None:
        self.chart_type = None
        self.selected_columns = {}

    def set_chart_type(self, chart_type: ChartType):
        self.chart_type = chart_type

    def set_selected_columns(self, source_index: int, selected_columns: list):
        self.selected_columns[str(source_index)] = selected_columns

    def is_selected_columns_empty(self) -> bool:
        res = True
        for key in self.selected_columns:
            if len(self.selected_columns[key]) > 0:
                res = False
        return res

    def _get_color_palette(self) -> List[str]:
        return px.colors.qualitative.Plotly + px.colors.qualitative.Pastel + px.colors.qualitative.Bold + px.colors.qualitative.Light24 + px.colors.qualitative.Dark24

    def plot_data(self, graph_args: GraphArguments):
        if self.chart_type == ChartType.BAR:
            return self._plot_bar(graph_args)
        elif self.chart_type == ChartType.LINE:
            return self._plot_line(graph_args)
        elif self.chart_type == ChartType.RADAR:
            return self._plot_radar(graph_args)
        elif self.chart_type == ChartType.TRAJECTORY:
            return self._plot_trajectory(graph_args)

    def _plot_bar(self, graph_args: GraphArguments) -> go.Figure:
        def _plot_bar_success_rate():
            data_sets = graph_args.data_sets
            x = []
            y = []

            for data_set in data_sets:
                x.append("<b>Success</b> - (" + data_set.get("title") + ")")
                x.append("<b>Collision</b> - (" + data_set.get("title") + ")")
                x.append("<b>Timeout</b> - (" + data_set.get("title") + ")")
                is_success = 0
                collision = 0
                timeout = 0
                for ep in data_set.get("episodes"):
                    is_success += ep.data_frame["is_success"].astype(int).sum()
                    collision += ep.data_frame["collision"].astype(int).sum()
                    timeout += ep.data_frame["timeout"].astype(int).sum()

                y.append(is_success)
                y.append(collision)
                y.append(timeout)

            return go.Figure(data=[go.Bar(x=x, y=y)])

        def _plot_bar_general():
            data_sets = graph_args.data_sets
            x = []
            y = []
            for data_set in data_sets:
                for col in self.selected_columns[str(data_set.get("source_index"))]:
                    x.append("<b>" + str(col) + "</b>" + " - " + data_set.get("title"))
                    y_data = []
                    for ep in data_set.get("episodes"):
                        y_data += ep.data_frame[col].tolist()

                    y.append(self._calculate_graph_val_by_method(y_data, graph_args))
                    
            return go.Figure(data=[go.Bar(x=x, y=y)])

        if graph_args.suc_col_tout:
            return _plot_bar_success_rate()
        else:
            return _plot_bar_general()

    def _plot_line(self, graph_args: GraphArguments):
        pass

    def _plot_radar(self, graph_args: GraphArguments):
        data_sets = graph_args.data_sets
        plot_data = []
        for data_set in data_sets:
            x = []
            y = []
            for col in self.selected_columns[str(data_set.get("source_index"))]:
                x.append("<b>" + str(col) + "</b>" + " - " + data_set.get("title"))
                y_data = []
                for ep in data_set.get("episodes"):
                    y_data += ep.data_frame[col].tolist()

                y.append(self._calculate_graph_val_by_method(y_data, graph_args))
            # print("before scaling: ", y)
            if graph_args.scaling == Scaling.DOWN:
                min_val = min(y)
                if min_val == 0:
                    min_val = 1e-10
                for i in range(len(y)):
                    scaling_factor = y[i] / min_val
                    pow = len(str(scaling_factor).split(".")[0])
                    if y[i] == min_val or pow < 2:
                        continue
                    y[i] = y[i] * (10**(-pow))
            elif graph_args.scaling == Scaling.UP:
                max_val = max(y)
                for i in range(len(y)):
                    if y[i] == 0:
                        scaling_factor = max_val / 1e-10
                    else:  
                        scaling_factor = max_val / y[i]
                    pow = len(str(scaling_factor).split(".")[0])
                    if y[i] == max_val or pow < 2:
                        continue
                    y[i] = y[i] * (10**(pow))
            # print("after scaling: ", y)
                        
            plot_data.append(go.Scatterpolar(
                r=y,
                theta=x,
                fill='toself',
                name=data_set.get("title")
            ))
                
        return go.Figure(data=plot_data)
            

    def _plot_trajectory(self, graph_args: GraphArguments):
        fig = go.Figure()

        if graph_args.episode_average:
            fig = self._process_data_trajectory_ep_average(graph_args, fig)
        else:
            fig = self._process_data_trajectory(graph_args, fig)

        fig.update_layout(
            showlegend=True,
            scene=dict(
                xaxis_title="X",
                yaxis_title="Y",
                zaxis_title="Z",
                aspectmode='auto',
                camera=dict(
                    eye=dict(x=1.5, y=1.5, z=1.0)
                )
            )
        )

        return fig

    def _process_data_trajectory(self, graph_args: GraphArguments,  figure: go.Figure) -> go.Figure:
        data_sets = graph_args.data_sets
        color_palette = self._get_color_palette()
        color_index = 0
        for data_set in data_sets:
            source_index = str(data_set.get("source_index"))
            if self.selected_columns.get(source_index) is None:
                continue
            for col in self.selected_columns[source_index]:
                for ep in data_set.get("episodes"):
                    trajectory = ep.data_frame[col].tolist()
                    trajectory = [csv_row_to_vector(row) for row in trajectory]
                    trajectory = np.array(trajectory)
                    x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]
                    trace_name = "<b>" + str(col) + "</b>" + f" [{ep.number}] - " + data_set.get("title")
                    figure.add_trace(go.Scatter3d(x=x, y=y, z=z, mode='lines',
                                                  name=trace_name, legendgroup=trace_name,
                                                  line=dict(color=color_palette[color_index])
                                                  )
                                     )
                    figure.add_trace(go.Scatter3d(x=[x[0]], y=[y[0]], z=[z[0]], mode='markers', name="start " + trace_name,
                                     marker=dict(size=5, color=color_palette[color_index], symbol='diamond'), showlegend=False, legendgroup=trace_name))
                    color_index += 1 if color_index < len(color_palette) - 1 else -color_index
        figure.add_annotation(dict(font=dict(color='gray',size=12),
                                        x=0,
                                        y=-0.12,
                                        showarrow=False,
                                        text="◆ - Start of trajectory",
                                        textangle=0,
                                        xanchor='left',
                                        xref="paper",
                                        yref="paper"))
        return figure

    def _process_data_trajectory_ep_average(self, graph_args: GraphArguments, figure: go.Figure):
        data_sets = graph_args.data_sets
        color_palette = self._get_color_palette()
        color_index = 0
        for data_set in data_sets:
            source_index = str(data_set.get("source_index"))
            if self.selected_columns.get(source_index) is None:
                continue
            for col in self.selected_columns[source_index]:
                max_step = np.max([ep.data_frame["step"].max() for ep in data_set.get("episodes")])
                x_data = pd.DataFrame(index=range(max_step), columns=range(len(data_set.get("episodes"))))
                y_data = pd.DataFrame(index=range(max_step), columns=range(len(data_set.get("episodes"))))
                z_data = pd.DataFrame(index=range(max_step), columns=range(len(data_set.get("episodes"))))

                for ep in data_set.get("episodes"):
                    trajectory = ep.data_frame[col].tolist()
                    trajectory = [csv_row_to_vector(row) for row in trajectory]
                    trajectory = np.array(trajectory)
                    x, y, z = trajectory[:, 0], trajectory[:, 1], trajectory[:, 2]
                    x_data.loc[range(len(x)), ep.number - 1] = x
                    y_data.loc[range(len(y)), ep.number - 1] = y
                    z_data.loc[range(len(z)), ep.number - 1] = z

                x_data = x_data.mean(axis=1)
                y_data = y_data.mean(axis=1)
                z_data = z_data.mean(axis=1)
                trace_name = "<b>" + str(col) + "</b> - " + data_set.get("title")
                figure.add_trace(go.Scatter3d(x=x_data, y=y_data, z=z_data, mode='lines', name="<b>" + str(col) + "</b> - " + data_set.get("title"), legendgroup=trace_name, line=dict(color=color_palette[color_index])))
                figure.add_trace(go.Scatter3d(x=[x_data[0]], y=[y_data[0]], z=[z_data[0]], mode='markers', name="start " + trace_name,
                                 marker=dict(size=5, color=color_palette[color_index], symbol='diamond'), showlegend=False, legendgroup=trace_name))
                color_index += 1 if color_index < len(color_palette) - 1 else -color_index

        figure.add_annotation(dict(font=dict(color='gray',size=12),
                                        x=0,
                                        y=-0.12,
                                        showarrow=False,
                                        text="◆ - Start of trajectory",
                                        textangle=0,
                                        xanchor='left',
                                        xref="paper",
                                        yref="paper"))
        return figure

    def _calculate_graph_val_by_method(self, y_data: list, graph_args: GraphArguments) -> float:
        if graph_args.calculation_method == CalculationMethod.SUM:
            return np.sum(y_data)
        elif graph_args.calculation_method == CalculationMethod.AVERAGE:
            return np.mean(y_data)
        elif graph_args.calculation_method == CalculationMethod.LAST_ROW:
            return y_data[-1]
        elif graph_args.calculation_method == CalculationMethod.MAX:
            return np.max(y_data)
        elif graph_args.calculation_method == CalculationMethod.MIN:
            return np.min(y_data)

def csv_row_to_vector(str_vector: str) -> List[float]:
    if str_vector is None or str_vector == "" or str_vector.count("[") != 1:
        return []
    str_vector = re.sub(r"\[ +", "[", str_vector)
    str_vector = re.sub(r" +\]", "]", str_vector)
    str_vector = re.sub(r" +", ",", str_vector).replace(",,", ",")
    return eval(str_vector)
