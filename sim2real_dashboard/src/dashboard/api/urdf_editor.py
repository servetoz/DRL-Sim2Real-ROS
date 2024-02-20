import json
import os
import random
import string
import dash
from flask import request
import xmlformatter
import xml.etree.ElementTree as ET

app = dash.get_app()

URDF_TEMPLATE = """<?xml version="1.0"?>
<robot name="{robot_name}">
    {urdf_content}
</robot>
"""


@app.server.route('/api/sim2real/urdf/save', methods=['POST'])
def save_urdf():
    filename = request.headers.get('filename')
    folder = app.assets_folder + "/urdf/"
    filename = filename.replace(".urdf", "")
    file = os.path.join(folder, filename + '.urdf')
    if not os.path.exists(folder):
        os.makedirs(folder)

    new_file = False
    if not os.path.exists(file):
        new_file = True

    formatter = xmlformatter.Formatter(
        indent="1", indent_char="\t", encoding_output="ISO-8859-1", preserve=["literal"])
    if new_file:
        # create new file
        random_name = ''.join(
            random.choice(string.ascii_lowercase) for i in range(10)
        )
        urdf_content = json_to_new_urdf(request.json)
        urdf_content = URDF_TEMPLATE.format(
            robot_name=random_name,
            urdf_content=urdf_content
        )
        with open(file, 'w') as f:
            f.write(formatter.format_string(urdf_content).decode("ISO-8859-1"))
        return {"status": "success"}, 200

    with open(file, 'r') as f:
        file_content = f.read()
        
    robot = ET.fromstring(file_content)
    for obj in request.json:
        if obj['frameId'] not in [link.get('name', "") for link in robot.findall('link')]:
            robot.append(ET.fromstring('<link sceneeditor="1" name="' + obj["frameId"] + '"></link>'))
    for obj in request.json:
        converted = convert_json_to_xml(obj)
        for cnv in converted:
            robot.find(f'link[@name="{obj["frameId"]}"]').append(ET.fromstring(cnv))
            
    links_in_request = [obj['frameId'] for obj in request.json]
    if len(links_in_request) == 0:
        robot = clear_all_scene_objects(robot)
        
    with open(file, 'w') as f:
        xml = formatter.format_string(ET.tostring(robot)).decode("ISO-8859-1")
        if "<?xml" not in xml:
            xml = '<?xml version="1.0" ?>\n' + xml
        f.write(xml)

    return {"status": "success"}, 200


def json_to_new_urdf(json_data):
    processed_links = []
    # create urdf
    for obj in json_data:
        if obj['frameId'] not in [link.get('frameId', "") for link in processed_links]:
            processed_links.append(
                {
                    "frameId": obj['frameId'],
                    "content": 
                        f'<link sceneeditor="1" name="' + obj["frameId"] + '">' + "".join(convert_json_to_xml(obj)) + "%place_holder%" + '</link>'
                }
            )
        else:
            ind = [link.get('frameId', "")
                   for link in processed_links].index(obj['frameId'])
            link_content = processed_links[ind]['content']
            link_content = link_content.replace(
                "%place_holder%",
                "".join(convert_json_to_xml(obj)) + "%place_holder%"
            )
            processed_links[ind]['content'] = link_content

    link_content = ""
    for link in processed_links:
        link_content += link['content'].replace("%place_holder%", "")
    return link_content


def convert_json_to_xml(obj):
    x, y, z = obj['position']['x'], obj['position']['y'], obj['position']['z']
    roll, pitch, yaw = obj['orientation']['roll'], obj['orientation']['pitch'], obj['orientation']['yaw']
    shape = obj['shape']
    if shape == "box":
        size = str(obj['scale']['x']) + " " + \
            str(obj['scale']['y']) + " " + str(obj['scale']['z'])
        scale_keyword = "size"
    elif shape == "sphere":
        size = str(obj['scale']['radius'])
        scale_keyword = "radius"
    elif shape == "cylinder":
        size = str(obj['scale']['length'])
        scale_keyword = f'radius="' + str(obj['scale']['radius']) + '" length'
    else:
        size = ""
        scale_keyword = "size"
    c_r, c_g, c_b, c_a = obj['colorRGBA']['r'], obj['colorRGBA']['g'], obj['colorRGBA']['b'], obj['colorRGBA']['a']

    return [f"""<visual sceneeditor="1">
                <origin xyz="{x} {y} {z}" rpy="{roll} {pitch} {yaw}"/>
                <geometry>
                    <{shape} {scale_keyword}="{size}"/>
                </geometry>
                <material>
                    <color rgba="{c_r} {c_g} {c_b} {c_a}"/>
                </material>
            </visual>""", f"""<collision sceneeditor="1">
                <origin xyz="{x} {y} {z}" rpy="{roll} {pitch} {yaw}"/>
                <geometry>
                    <{shape} {scale_keyword}="{size}"/>
                </geometry>
            </collision>"""]


def clear_all_scene_objects(robot):
    links = robot.findall('link')
    for link in links:
        if link.get('sceneeditor', "") == "1":
            robot.remove(link)
            continue
        visuals = link.findall('visual')
        for visual in visuals:
            if visual.get('sceneeditor', "") == "1":
                link.remove(visual)
        collisions = link.findall('collision')
        for collision in collisions:
            if collision.get('sceneeditor', "") == "1":
                link.remove(collision)
    return robot