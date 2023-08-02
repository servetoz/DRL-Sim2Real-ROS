#!/usr/bin/env python
import os,sys
import rospy
sys.path.append(os.path.dirname(__file__) + "/dashboard")
from dashboard.app import sim2real_dashboard


def main():
    # get DEV_MODE from launch file
    DEV_MODE = rospy.get_param("/sim2real_dashboard_app/dev_mode", False)
    TRAINING_CONFIG_FOLDER = rospy.get_param(
        "/sim2real_dashboard_app/training_config_folder", False)
    SIM2REAL_CONFIG_FOLDER = rospy.get_param(
        "/sim2real_dashboard_app/sim2real_config_folder", False)

    # rospy.init_node('dashboard_app', anonymous=True)
    rospy.loginfo("dashboard_app node started")

    print("DEV_MODE: {}".format(DEV_MODE))

    app = sim2real_dashboard(DEV_MODE=DEV_MODE, TRAINING_CONFIG_FOLDER=TRAINING_CONFIG_FOLDER, SIM2REAL_CONFIG_FOLDER=SIM2REAL_CONFIG_FOLDER)
    app.run_server(debug=True)
    # rospy.spin()

    return 0


if __name__ == '__main__':
    main()
