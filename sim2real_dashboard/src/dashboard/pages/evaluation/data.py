# ignores last index of array as this is the one where the average is written down
import numpy as np
from functools import lru_cache

from utils.helper import count_number_of_episodes


def calc_average(array):
    if len(array) <= 1:
        return None

    sum_of_values = sum(array[:-1])
    count_of_values = len(array) - 1
    average = sum_of_values / count_of_values
    return average

def planning_execution_average(csv_data, mode):
    # Hole die row aus der jeweiligen csv data und berechne die Average time für jede episode
    # [26, 31, 21, 33, 22, 21, 33, 23, 21, 22]

    num_episodes = count_number_of_episodes(csv_data)

    sim_time = np.array([row["sim_time"]for row in csv_data])
    cpu_time_steps = np.array([row.get("cpu_time_steps", 0)
                              for row in csv_data])
    cpu_time_full = np.array([row.get("cpu_time_full", 0) for row in csv_data])

    lower_bound = [None for _ in range(len(num_episodes))]
    upper_bound = [None for _ in range(len(num_episodes))]
    lower_bound[0] = 0
    upper_bound[0] = num_episodes[0] - 1
    for i in range(1, len(num_episodes)):
        lower_bound[i] = upper_bound[i-1]
        upper_bound[i] = upper_bound[i-1] + num_episodes[i]

    computation_time_per_episode = [None for _ in range(len(num_episodes)+1)]
    exec_time_per_episode = [None for _ in range(len(num_episodes)+1)]
    # DRL
    if (mode == 1):
        # letzter Eintrag letzter eintrag cputime_steps
        computation_time_per_episode[0] = cpu_time_steps[upper_bound[0]]
        for i in range(len(num_episodes)):
            computation_time_per_episode[i] = cpu_time_steps[upper_bound[i]]
            exec_time_per_episode[i] = sim_time[upper_bound[i]]
    # RRT and PRM
    if (mode == 2):
        # Planner Time
        planner_time = np.array(
            [row.get("planner_time_ur5_1", 0) for row in csv_data])

        # planner_time = cpu_time_steps
        for i in range(len(num_episodes)):
            computation_time_per_episode[i] = planner_time[upper_bound[i]]
            exec_time_per_episode[i] = sim_time[upper_bound[i]]

    # averages berechnen
    computation_time_per_episode[-1] = calc_average(
        computation_time_per_episode)
    exec_time_per_episode[-1] = calc_average(exec_time_per_episode)

    return computation_time_per_episode, exec_time_per_episode


def set_bounds(csv_data):
    num_episodes = count_number_of_episodes(csv_data)
    lower_bound = [None for _ in range(len(num_episodes))]
    upper_bound = [None for _ in range(len(num_episodes))]
    lower_bound[0] = 0
    upper_bound[0] = num_episodes[0] - 1
    for i in range(1, len(num_episodes)):
        lower_bound[i] = upper_bound[i-1]
        upper_bound[i] = upper_bound[i-1] + num_episodes[i]

    return lower_bound, upper_bound


def distance_to_obstacles(csv_data):
    num_episodes = count_number_of_episodes(csv_data)
    lower_bound, upper_bound = set_bounds(csv_data)

    distance_row = np.array(
        [row["ur5_1_closestObstDistance_robot"]for row in csv_data])
    distance = [[] for _ in range(len(num_episodes))]

    for i in range(len(num_episodes)):
        for j in range(lower_bound[i], upper_bound[i]):
            distance[i].append(distance_row[j])

    # calculate average
    summe = [None for _ in range(10)]
    for i in range(10):
        summe[i] = calc_average(distance[i])

    distance.append(summe)

    return distance
