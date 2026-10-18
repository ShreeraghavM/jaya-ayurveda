import json

def get_plan(dosha_type, bmi):
    with open("data/diet_plans.json") as f:
        plans = json.load(f)
    return plans.get(dosha_type.lower(), "No diet plan found.")
