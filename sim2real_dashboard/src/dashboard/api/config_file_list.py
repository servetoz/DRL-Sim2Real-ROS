import dash
import os
from flask import request
import yaml
from sim2real_training.training import start_training
import multiprocessing as mp
import psutil

app = dash.get_app()


@app.server.route('/api/sim2real/config/list')
def config_file_list():
    training_files = sim2real_files = []
    try:
        training_files = [f for f in os.listdir(
            app.training_config_folder) if f.endswith('.yaml')]
        sim2real_files = [f for f in os.listdir(
            app.sim2real_config_folder) if f.endswith('.yaml')]
    except FileNotFoundError:
        pass

    return {
        'trainingFiles': training_files,
        'sim2realFiles': sim2real_files
    }


@app.server.route('/api/sim2real/config/<type>/<filename>')
def get_sim2real_config(type, filename):
    folder = app.sim2real_config_folder if type == 'sim2real' else app.training_config_folder
    file = os.path.join(folder, filename)

    if not file.endswith('.yaml'):
        return {
            'error': 'File must be a yaml file',
        }, 400

    if not os.path.exists(file):
        return {}
    with open(file) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    return data


@app.server.route('/api/sim2real/config/<type>/<filename>', methods=['POST'])
def save_sim2real_config(type, filename):
    folder = app.sim2real_config_folder if type == 'sim2real' else app.training_config_folder
    file = os.path.join(folder, filename)

    if not file.endswith('.yaml'):
        return {
            'error': 'File must be a yaml file',
        }, 400

    fileContent = request.json

    # write to file
    with open(file, 'w') as f:
        f.write(yaml.dump(fileContent))

    return fileContent, 200


@app.server.route('/api/sim2real/training/start/<filename>')
def api_start_training(filename):
    if filename is None:
        return {
            'error': 'No config file provided',
        }, 400

    folder = app.training_config_folder
    file = os.path.join(folder, filename)

    # create new process
    app.training_process = mp.Process(target=start_training, args=(file,))
    app.training_process.start()

    return {
        'status': 'started'
    }


@app.server.route('/api/sim2real/training/stop')
def api_stop_training():
    if app.training_process is not None:
        app.training_process.terminate()
        app.training_process = None

    return {
        'status': 'stopped'
    }


@app.server.route('/api/sim2real/training/pause')
def api_pause_training():
    if app.training_process is not None:
        process_id = app.training_process.pid
        proc = psutil.Process(process_id)
        proc.suspend()

    return {
        'status': 'paused'
    }
    
@app.server.route('/api/sim2real/training/resume')
def api_resume_training():
    if app.training_process is not None:
        process_id = app.training_process.pid
        proc = psutil.Process(process_id)
        proc.resume()

    return {
        'status': 'running'
    }

@app.server.route('/api/sim2real/training/status')
def api_training_status():
    if app.training_process is None:
        return {
            'status': 'not_started'
        }

    if app.training_process.is_alive():
        return {
            'status': 'running'
        }

    if app.training_process.exitcode != 0:
        return {
            'status': 'finished_with_error'
        }
    print("EXIT Code", app.training_process.exitcode)
    return {
        'status': 'finished'
    }
