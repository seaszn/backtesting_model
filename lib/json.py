import json 

def get_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)