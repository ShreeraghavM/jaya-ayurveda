import json

def get_remedy(issue):
    with open("data/remedies.json") as f:
        remedies = json.load(f)
    return remedies.get(issue.lower(), "No remedy found. Please consult an Ayurvedic practitioner.")
