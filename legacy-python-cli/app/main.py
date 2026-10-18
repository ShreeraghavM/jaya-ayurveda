import typer
from rich.console import Console
from app import chatbot, dosha_quiz, remedies, diet_plans, yoga_pranayama, seasonal_tips

console = Console()
app = typer.Typer(help="🌿 Jaya Ayurveda - Your Ayurvedic Companion")

@app.command()
def start():
    console.print("🌿 Welcome to Jaya Ayurveda 🌿", style="bold green")
    console.print("Preserving the Health of the Healthy, Guiding Towards Liberation", style="italic yellow")
    chatbot.run()

@app.command()
def dosha():
    dosha_quiz.start_quiz()

@app.command()
def remedy(issue: str):
    console.print(remedies.get_remedy(issue))

@app.command()
def diet(dosha_type: str, bmi: float):
    console.print(diet_plans.get_plan(dosha_type, bmi))

@app.command()
def seasonal():
    console.print(seasonal_tips.get_tip())

if __name__ == "__main__":
    app()
