import json
from rich.console import Console
console = Console()

def start_quiz():
    console.print("🌿 Dosha Quiz - Answer the following:", style="bold green")
    with open("data/dosha_questions.json") as f:
        questions = json.load(f)
    scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
    for q in questions:
        print(q["question"])
        ans = input("Your choice (a/b/c): ").lower()
        if ans in q["scores"]:
            for k,v in q["scores"][ans].items():
                scores[k]+=v
    dosha = max(scores, key=scores.get)
    console.print(f"Your dominant Dosha is: {dosha}", style="bold yellow")
