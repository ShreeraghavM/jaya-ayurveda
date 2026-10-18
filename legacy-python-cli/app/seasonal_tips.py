import json
import random

def get_tip():
    with open("data/seasonal_tips.json") as f:
        tips = json.load(f)
    return random.choice(tips)
