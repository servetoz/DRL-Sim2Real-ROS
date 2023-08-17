from enum import Enum
from io import StringIO
import pandas as pd


class ChartType(Enum):
    BAR = 1
    RADAR = 2
    TRAJECTORY = 3


class DynamicPlot():

    def __init__(self) -> None:
        self.csv_data = None
        self.chart_type = None
        self.selected_columns = None

    def set_csv_data(self, csv_data: str):
        self.csv_data = pd.read_csv(StringIO(csv_data.decode('utf-8')))

    def set_chart_type(self, chart_type: ChartType):
        self.chart_type = chart_type

    def set_selected_columns(self, selected_columns: list):
        self.selected_columns = selected_columns

    def get_csv_columns(self):
        return self.csv_data.columns.tolist()
