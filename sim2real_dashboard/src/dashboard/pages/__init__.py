
import os

class GetPages():
    EVALUATION: dict = {
        "title": "Evaluation",
        "href": "/",
    }
    TRAJECTORIES: dict = {
        "title": "Trajectories",
        "href": "/trajectories",
    }
    TRAJECTORY_3D: dict = {
        "title": "3D Trajectory",
        "href": "/3d-trajectory",
    }
    THREED_VIEWER: dict = {
        "title": "3D Viewer",
        "href": "/3d-viewer",
    }

    @property
    def list(self):
        return [self.EVALUATION, self.TRAJECTORIES, self.TRAJECTORY_3D]


def get_data_folder():
    return os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def get_csv_folder():
    return os.path.join(get_data_folder(), "csv")


def get_3d_trajectory_folder():
    return os.path.join(get_data_folder(), "trajectory_3d")

def get_rosbags_folder():
    return os.path.join(get_data_folder(), "rosbags")
