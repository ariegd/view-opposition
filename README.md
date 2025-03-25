# view-opposition
Vista del proyecto relacionado con los test de oposición. Utilizando bootswatch (basic) y web componentes. 

To make the `quizData` array dynamic and fetch its content from a RESTful API, you can use `fetch` or any HTTP client (e.g., `axios`) to retrieve the data from your backend. Here's how you can modify the `Quiz` component to load `quizData` dynamically:

### Steps:
1. Add a method to fetch data from the RESTful API.
2. Update the `connectedCallback` lifecycle method to call the fetch method and initialize the quiz once the data is loaded.
3. Ensure the backend API provides the data in the expected format.

### [Quiz.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js)

Modify the `Quiz` component to fetch `quizData` dynamically.

```javascript
class Quiz extends HTMLElement {
    quizData = [];
    currentQuestion = 0;
    score = 0;
    timer;
    timeLeft = 30;

    questionEl = "";
    optionsEl = "";
    nextBtn = "";
    timerEl = "";
    progressBar = "";
    quizContainer = "";

    async fetchQuizData() {
        try {
            const response = await fetch('/api/questions/materia/sql?limit=5&random=true'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
            }
            this.quizData = await response.json();
            this.loadQuestion();
        } catch (error) {
            console.error(error);
            this.quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
        }
    }

    loadQuestion() {
        const question = this.quizData[this.currentQuestion];
        this.questionEl.textContent = question.pregunta;
        this.optionsEl.innerHTML = '';
        question.opciones.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option');
            button.addEventListener('click', () => this.selectOption(button, index));
            this.optionsEl.appendChild(button);
        });
        this.nextBtn.style.display = 'none';
        this.timeLeft = 30;
        if (this.timer) clearInterval(this.timer);
        this.startTimer();
        this.updateProgress();
    }

    // ...existing methods...

    connectedCallback() {
        this.render();

        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.nextBtn = document.getElementById('next-btn');
        this.timerEl = document.getElementById('timer');
        this.progressBar = document.querySelector('.progress-bar');
        this.quizContainer = document.getElementById('quiz');

        this.nextBtn.addEventListener('click', () => {
            this.checkAnswer();
            this.currentQuestion++;
            if (this.currentQuestion < this.quizData.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        });

        // Fetch quiz data dynamically
        this.fetchQuizData();
    }

    render() {
        this.innerHTML = /*html*/ `
            <div class="container quiz">
                <div class="quiz-container" id="quiz">
                    <div class="quiz-header">
                        <h2>Interactive Quiz</h2>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0"
                                aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div id="question-container">
                        <p class="question" id="question"></p>
                        <div class="options" id="options"></div>
                    </div>
                    <div class="quiz-footer">
                        <div class="timer" id="timer">Time: 30s</div>
                        <button class="btn btn-primary" id="next-btn">Next</button>
                    </div>
                </div>
            </div> 
        `;
    }
}

customElements.define("tag-quiz", Quiz);
```

### Backend API Response Format
Ensure your backend API (e.g., `/api/questions/materia/sql?limit=5&random=true`) returns data in the following format:
```json
[
    {
        "pregunta": "What is the capital of France?",
        "opciones": ["London", "Berlin", "Paris", "Madrid"],
        "respuesta": 2
    },
    {
        "pregunta": "Which planet is known as the Red Planet?",
        "opciones": ["Venus", "Mars", "Jupiter", "Saturn"],
        "respuesta": 1
    }
]
```

This will allow the `Quiz` component to dynamically load and display the questions.

Made changes.

Similar code found with 1 license type
