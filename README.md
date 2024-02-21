# Repository structure:
Three main modules:
1. `ur5_moveit_config` -> configuration for UR5 robotic arm which is using ROS's MoveIt framework.
2. `sim2real_training` -> Module used to provide training activites for UR5 Arm. Uses `.yaml` files in order to configure parameters for sim2real learning process.
3. `sim2real_dashboard` -> ROS Web interface. Utilizes `foxglove` as subrepository. Launching Dashboard one automatically activates other resources.


# Installation:

1. ROS Noetic requires Ubuntu 20.04 version. In fact, the Python 3.8 is required

2. Install ROS Noetic (Variant: `ros-noetic-desktop-full`) following official [guide](http://wiki.ros.org/noetic/Installation/Ubuntu)

3. Install catkin tools according to [guide](https://catkin-tools.readthedocs.io/en/latest/installing.html).

4. Install ROS Bridge server and realted suite :
```
sudo apt-get install ros-noetic-rosbridge-server ros-noetic-rosbridge-suite ros-noetic-ur-description ros-noetic-moveit-ros-move-group ros-noetic-trac-ik-kinematics-plugin ros-noetic-moveit-planners-ompl ros-noetic-moveit-fake-controller-manager ros-noetic-moveit
```
5. Create new ROS workspace within your system and clone this repository:
```
mkdir -p ~/ros_ws/src
cd ~/ros_ws/src
git clone https://github.com/servetoz/DRL-Sim2Real-ROS.git
```

6. Build the ROS environment within your workspace:
```
cd ~/ros_ws/
source /opt/ros/noetic/setup.bash
catkin_make
```
Be aware of Python version, make sure it's 3.8 when building. This command ensures that `catkin_make -DPYTHON_EXECUTABLE=/usr/bin/python3.8`

7. Make sure that ROS environment is properly sourced with:
```
source ~/ros_ws/devel/setup.bash
```
In fact, sourcing must be done every time the shell is opened. Thus, edit `.bashrc`:
```
nano ~/.bashrc
```
Add two sourcing lines in the end of the file. Save it and run:
```
source ~/.bashrc
```

8. Create a symlink for `python3.8` to `python`:
```
sudo ln -s /usr/bin/python3.8 /usr/bin/python
```
9. Install python dependencies:
```
cd ~/ros_ws/src/DRL-Sim2Real-ROS/sim2real_dashboard/src/dashboard
pip install -r requirements.txt
```
10. Launch the ROS web environment:
```
cd ~/ros_ws/
roslaunch sim2real_dashboard app.launch
```
11. Open your web browser and navigate to `http://localhost:8050/` to see the dashboard.
12. If you don't see robot arm model add following URDF under 3D -> click Gear icon -> Custom Layers -> click three dots -> Add URDF -> click newly added URDF -> paste following link in the URL field:
```
http://localhost:8050/assets/urdf/ur5.urdf
```

Optional: Running ROS Server's websocket as separate process:
```
rosrun rosbridge_server rosbridge_websocket _port:=9090
```