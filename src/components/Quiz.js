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

    async fetchQuizData(endpoint) {
        try {
            const response = await fetch('http://localhost:3000' + endpoint); // Use the endpoint passed as an attribute
            
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
            }
            this.quizData = await response.json();
            console.log('Quiz data:', this.quizData); // <-- Añade esto
            this.loadQuestion();
        } catch (error) {
            console.error(error);
            this.quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
        }
    }

    loadQuestion() {
        const question = this.quizData[this.currentQuestion];
        if (!question) {
            this.quizContainer.innerHTML = `<p class="error">No hay preguntas disponibles.</p>`;
            return;
        }

        this.questionEl.textContent = question.pregunta;
        this.optionsEl.innerHTML = '';

        // Mostrar imagen si existe
        const existingImg = this.quizContainer.querySelector('.question-img');
        if (existingImg) existingImg.remove();
        if (question.imagen) {
            const img = document.createElement('img');
            img.src = question.imagen;
            img.alt = "Imagen de la pregunta";
            img.className = "question-img mb-3";
            img.style.maxWidth = "100%";
            this.questionEl.parentNode.insertBefore(img, this.questionEl.nextSibling);
        }

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

    selectOption(selectedButton, optionIndex) {
        const buttons = this.optionsEl.getElementsByClassName('option');
        Array.from(buttons).forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected');
        this.nextBtn.style.display = 'block';

        // Guarda la respuesta del usuario
        if (!this.userAnswers) this.userAnswers = [];
        this.userAnswers[this.currentQuestion] = optionIndex;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = `Time: ${this.timeLeft}s`;
            if (this.timeLeft === 0) {
                clearInterval(this.timer);
                this.checkAnswer();
            }
        }, 1000);
    }

    checkAnswer() {
        const selectedOption = this.querySelector('.option.selected');
        if (!selectedOption) return;

        const selectedAnswer = Array.from(this.optionsEl.children).indexOf(selectedOption);
        const question = this.quizData[this.currentQuestion];

        if (selectedAnswer === question.respuesta) {
            this.score++;
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            this.optionsEl.children[question.respuesta].classList.add('correct');
        }

        Array.from(this.optionsEl.children).forEach(button => button.disabled = true);
        clearInterval(this.timer);
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.setAttribute('aria-valuenow', progress);
    }

    async saveScore() {
        try {
            const username = prompt('Enter your username:'); // Prompt user for their name
            const score = `${this.score}/${this.quizData.length}`;
            const response = await fetch('http://localhost:3000/api/users/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, score })
            });

            if (!response.ok) {
                throw new Error('Failed to save score');
            }

            console.log('Score saved successfully');
        } catch (error) {
            console.error(error);
        }
    }

    showResults() {
        // Guarda las respuestas del usuario durante el quiz
        if (!this.userAnswers) this.userAnswers = [];
        // Construye el resumen de resultados
        let summary = '<h4>Resumen de respuestas:</h4><ul class="list-group mb-3">';
        this.quizData.forEach((q, i) => {
            const userAnswer = this.userAnswers[i];
            const correctAnswer = q.opciones[q.respuesta];
            const userAnswerText = userAnswer !== undefined ? q.opciones[userAnswer] : '<em>No respondida</em>';
            const isCorrect = userAnswer === q.respuesta;
            summary += `
                <li class="list-group-item d-flex flex-column ${isCorrect ? 'list-group-item-success' : 'list-group-item-danger'}">
                    <strong>Pregunta ${i + 1}:</strong> ${q.pregunta}<br>
                    <span>Tu respuesta: ${userAnswerText}</span>
                    <span>Respuesta correcta: ${correctAnswer}</span>
                </li>
            `;
        });
        summary += '</ul>';

        this.quizContainer.innerHTML = `
            <div class="results">
                <div class="result-icon">
                    <i class="fas ${this.score > this.quizData.length / 2 ? 'fa-trophy text-success' : 'fa-times-circle text-danger'}"></i>
                </div>
                <div class="score">Your score: ${this.score}/${this.quizData.length}</div>
                <p>${this.score > this.quizData.length / 2 ? 'Great job!' : 'Better luck next time!'}</p>
                ${summary}
                <button class="btn btn-primary" id="save-score-btn">Save Score</button>
                <button class="btn btn-secondary" onclick="location.reload()">Restart Quiz</button>
            </div>
        `;

        document.getElementById('save-score-btn').addEventListener('click', () => this.saveScore());
    }

    constructor() {
        super();
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

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

        const endpoint = this.getAttribute('endpoint'); // Get the endpoint from the attribute
        this.fetchQuizData(endpoint); // Fetch quiz data from the specified endpoint
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