from rich.console import Console

console = Console()

def run():
    console.print("🧘 Welcome to the Jaya Ayurveda Chatbot!", style="bold cyan")
    console.print("Choose: [1] Dosha Quiz [2] Remedies [3] Diet Plan [4] Yoga/Pranayama [5] Seasonal Tips")

    choice = input("Enter choice: ")

    if choice == "1":
        from app import dosha_quiz
        dosha_quiz.start_quiz()
    elif choice == "2":
        issue = input("Enter your health issue: ")
        from app import remedies
        print(remedies.get_remedy(issue))
    elif choice == "3":
        dosha = input("Enter your Dosha (Vata/Pitta/Kapha): ")
        bmi = float(input("Enter your BMI: "))
        from app import diet_plans
        print(diet_plans.get_plan(dosha, bmi))
    elif choice == "4":
        from app import yoga_pranayama
        print(yoga_pranayama.get_routine())
    elif choice == "5":
        from app import seasonal_tips
        print(seasonal_tips.get_tip())
