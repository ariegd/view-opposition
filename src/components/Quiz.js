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

    async fetchQuizData(materia) {
        try {
            const response = await fetch(`http://localhost:3000/api/questions/materia/${materia}?limit=5&random=true`);
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

    selectOption(selectedButton, optionIndex) {
        const buttons = this.optionsEl.getElementsByClassName('option');
        Array.from(buttons).forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected');
        this.nextBtn.style.display = 'block';
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

    showResults() {
        this.quizContainer.innerHTML = `
                    <div class="results">
                        <div class="result-icon">
                            <i class="fas ${this.score > this.quizData.length / 2 ? 'fa-trophy text-success' : 'fa-times-circle text-danger'}"></i>
                        </div>
                        <div class="score">Your score: ${this.score}/${this.quizData.length}</div>
                        <p>${this.score > this.quizData.length / 2 ? 'Great job!' : 'Better luck next time!'}</p>
                        <button class="btn btn-primary" onclick="location.reload()">Restart Quiz</button>
                    </div>
                `;
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

        const materia = this.getAttribute('materia'); // Get the materia from the attribute
        this.fetchQuizData(materia); // Fetch quiz data for the specified materia
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