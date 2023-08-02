import random
import numpy as np


def generate_random_array():
    return [[random.random() for _ in range(4)] for _ in range(10)]


def count_number_of_episodes(csv_data):
    # Array erstellen, in dem für jede indexstelle die anzahl der jeweiligen Zahlen i+1 gespeichert wird
    episodes = np.array([row["episodes"]for row in csv_data])
    max_number = int(max(episodes))
    number_array = [0] * max_number

    for episode in episodes:
        number_array[int(episode) - 1] += 1

    return number_array

def count_episodes(csv_data):
    #define needed data in data_array
            episodes = np.array([row["episodes"]for row in csv_data])
            #print(episodes)
            return (episodes[-1])
    #Access last element of episodes row, to know how many episodes are there
    
    
def generate_obstacle():
    # define the dimensions
    width = 0.05
    height = 0.05
    depth = 0.05
    # Define the position
    position = np.array([0.1, 0.55, 0.3])

    # Generate the vertices of the cube
    vertices = np.array([
     position + np.array([0, 0, 0]),
        position + np.array([width, 0, 0]),
        position + np.array([width, height, 0]),
        position + np.array([0, height, 0]),
        position + np.array([0, 0, depth]),
        position + np.array([width, 0, depth]),
        position + np.array([width, height, depth]),
        position + np.array([0, height, depth])
    ])

    # Define the faces of the cube
    faces = [
        (0, 1, 2),
        (0, 2, 3),
        (0,1,4),
        (1,4,5), 
        (0,4,3),
        (4,3,7),
        (7,3,2),
        (2,6,7),
        (1,2,6),
        (1,5,6),
        (4,6,7),
        (4,5,6)
  
    ]

    return vertices, faces




def seconds2time(seconds):
    """
    Converts seconds to a time string
    """
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return "%02d:%02d:%02d" % (h, m, s)