import rospy
import time
import sys


def start_training(config_file):
    if config_file is None:
        print("No config file specified")
        sys.exit(1)

    print(
        "TRAINING STARTED with config file: {}".format(config_file))

    time.sleep(5)
    
    # for throwing an error use -> sys.exit(1)

    print(
        "TRAINING FINISHED")
    sys.exit(0)
