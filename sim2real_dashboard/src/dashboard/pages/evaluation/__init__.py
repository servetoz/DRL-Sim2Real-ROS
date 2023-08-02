import numpy as np
from pages import get_csv_folder
from utils.load_csv import load_csv_data, get_csv_filepaths
from pages.evaluation.data import calc_average, distance_to_obstacles, planning_execution_average
from utils.helper import count_number_of_episodes


colors = ['#4E79A7', '#F28E2C', '#8E6BB4']

RRT_array = [[0.2868269537609386, 0.9170617314598207, 0.4475316863179496, 0.05608282983976365, 0.0],
             [0.8261362559755113, 0.6494670519862822,
                 0.5219236139903745, 0.8092907171845747, 0.0],
             [0.1517715598021, 0.7982994063979079,
                 0.2588579887699962, 0.257523025834015, 0.0],
             [0.7258762640108746, 0.8589356111987257,
                 0.44327004115840163, 0.09330232540890204, 0.0],
             [0.42529887525026244, 0.7455527683364909,
                 0.21583761513137822, 0.3954040111190482, 0.0],
             [0.47241874357988023, 0.4221197620209567,
                 0.39338546332397883, 0.04899298208483327, 0.0],
             [0.31335910668148503, 0.9833606581498897,
                 0.8762276871042998, 0.8178781085758806, 0.0],
             [0.7221653562887994, 0.5898657780886235,
                 0.972709625876824, 0.7118000290083163, 0.0],
             [0.683420204628211, 0.472130235002039,
                 0.06872851667161417, 0.1819996148690467, 0.0],
             [0.5813712222698265, 0.03389949124416658, 0.9293615182962907, 0.8021025187297883, 0.0]]
RRT_array.append([0.09, 0.15, 0.16, 0.23, 0.0])

PRM_array = [[0.18021308541192116, 0.32007261488446326, 0.43937810850737236, 0.3956950700645051, 0.0],
             [0.6675917234788222, 0.6826835413580034,
                 0.4016436341273857, 0.023519086512638787, 0.0],
             [0.6529656973098361, 0.5074225318967271,
                 0.47749705457905467, 0.6585648892761593, 0.0],
             [0.8250793543651704, 0.3949361902026256,
                 0.9642532065576624, 0.9714896485368797, 0.0],
             [0.14530679650451472, 0.09119218446359945,
                 0.49675023263945717, 0.7102197620355362, 0.0],
             [0.9497329673598982, 0.7744059979527139,
                 0.6568029112651473, 0.15803604633085, 0.0],
             [0.1820749744488629, 0.8861033857680668,
                 0.7345654722681388, 0.5794333259091891, 0.0],
             [0.6874547590605017, 0.4485030607848294,
                 0.9311645603299458, 0.2909345699171386, 0.0],
             [0.14731126972064335, 0.5958732224869299,
                 0.35560626710406473, 0.2934303097227393, 0.0],
             [0.26456921699558944, 0.02965112321940766, 0.9246860527852515, 0.5939271375758527, 0.0]]

PRM_array.append([0.28, 0.18, 0.34, 0.5, 0.0])


csv_directory = get_csv_folder()

csv_filepaths = get_csv_filepaths(csv_directory)


csv_DRL = load_csv_data(csv_filepaths[0])
csv_RRT = load_csv_data(csv_filepaths[1])
csv_PRM = load_csv_data(csv_filepaths[2])


plan_DRL, exec_DRL = planning_execution_average(csv_DRL, 1)
plan_RRT, exec_RRT = planning_execution_average(csv_RRT, 2)
plan_PRM, exec_PRM = planning_execution_average(csv_PRM, 2)

# Planning execution time

planning = [plan_DRL[0], plan_RRT[0], plan_PRM[0]]
execution = [exec_DRL[0], exec_RRT[0], exec_PRM[0]]

# Number of Steps
steps_DRL = count_number_of_episodes(csv_DRL)
steps_DRL.append(0.0)
steps_DRL[-1] = calc_average(steps_DRL)

steps_RRT = count_number_of_episodes(csv_RRT)
steps_RRT.append(0.0)
steps_RRT[-1] = calc_average(steps_RRT)

steps_PRM = count_number_of_episodes(csv_PRM)
steps_PRM.append(0.0)
steps_PRM[-1] = calc_average(steps_PRM)

# distance_to_obstacle
# distance_to_obstacle = [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]
distance_obst_DRL = distance_to_obstacles(csv_DRL)
distance_obst_RRT = distance_to_obstacles(csv_RRT)
distance_obst_PRM = distance_to_obstacles(csv_PRM)

smoothness = np.array([row.get("shaking_ur5_1", 0) for row in csv_DRL])
smoothness_avg = calc_average(smoothness)
DRL_array = [
    [0.3, 0.5, 0.2, 0.8, 0.3],
    [0.4, 0.6, 0.3, 0.9, 0.3],
    [0.5, 0.7, 0.4, 0.8, 0.3],
    [0.6, 0.7, 0.4, 0.7, 0.3],
    [0.7, 0.8, 0.3, 0.6, 0.3],
    [0.4, 0.5, 0.6, 0.9, 0.3],
    [0.8, 0.9, 0.2, 0.5, 0.3],
    [0.4, 0.6, 0.3, 0.9, 0.3],
    [0.4, 0.6, 0.3, 0.9, 0.3],
    [0.5, 0.7, 0.4, 0.8, 0.3],
    # average
    [0.005, 0.0048, 0.08, 0.011, smoothness_avg]
]

# ['computation Time', 'distance_to_obstacle',
#     'number of steps', 'execution time']

# smoothness
smoothness = np.array([row.get("shaking_ur5_1", 0) for row in csv_DRL])
smoothness_avg = calc_average(smoothness)