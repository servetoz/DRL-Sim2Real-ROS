# Terminology and concepts
- ROS -> (Robot Operating System).
- DRL -> Deep Reinforcement Learning
- sim2real -> Can be summarized as a set of methods used for the transfer of knowledge learned in simulation to a real-world environment. (source: https://ieeexplore.ieee.org/document/9874304). Isolative, software-based learning environment for acquiring real life learning parameters.

# Repository structure:
Three main modules:
1. `ur5_moveit_config` -> configuration for UR5 robotic arm which is using ROS's MoveIt framework.
2. `sim2real_training` -> Module used to provide training activites for UR5 Arm. Uses `.yaml` files in order to configure parameters for sim2real learning process.
3. `sim2real_dashboard` -> ROS Web interface. Utilizes `foxglove` as subrepository. Launching Dashboard one automatically activates other resources.


# Installation:

1. ROS Noetic requires Ubuntu 20.04 version. In fact, the Python 3.8 is required

2. Install ROS Noetic following offficial [guide](http://wiki.ros.org/noetic/Installation/Ubuntu), or use one line approach:

```
wget -c https://raw.githubusercontent.com/qboticslabs/ros_install_noetic/master/ros_install_noetic.sh && chmod +x ./ros_install_noetic.sh && ./ros_install_noetic.sh
```

3. Create new ROS workspace within your system and clone this repository:
```
mkdir -p ~/ros_workspace/src
cd ~/ros_ws/src
git clone https://github.com/servetoz/DRL-Sim2Real-ROS.git
cd ~/ros_workspace/
```

4. Install (first layer of) dependencies:
```
rosdep install --from-paths src --ignore-src -r -y
```

Eventually: `pip install empy`, `pip install catkin_pkg`,

5. Build the ROS environment within your workspace:
```
cd ~/ros_workspace/
catkin_make
```
Be aware of Python version, make sure it's 3.8 when building. This command ensures that `catkin_make -DPYTHON_EXECUTABLE=/usr/bin/python3.8`

6. Make sure that ROS environment is properly sourced with:
```
source /opt/ros/noetic/setup.bash
source ~/ros_workspace/devel/setup.bash
```
In fact, sourcing must be done every time the shell is opened. Thus, edit `bashrc`:
```
nano ~/.bashrc
```
Add two sourcing lines in the end of the file. Save it and run:
```
source ~/.bashrc
```

7. Install ROS Bridge server and realted suite :
```
sudo apt-get install ros-noetic-rosbridge-server ros-noetic-rosbridge-suite
```
8. Launch the ROS web environment:
```
roslaunch sim2real_dashboard app.launch
```

Optional: Running ROS Server's websocket as separate process:
```
rosrun rosbridge_server rosbridge_websocket _port:=9090
```