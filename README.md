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

## To make the Cards.js call the Quiz.js

To make the `<button type="button" class="btn btn-success">Start Quiz</button>` call the `Quiz.js` component, you can add an event listener to the button. When the button is clicked, it can dynamically load the `Quiz` component and pass the necessary data (e.g., `materia`) to it.

### Steps:
1. Add a `data-materia` attribute to each button to specify the `materia` for the quiz.
2. Add an event listener to the buttons to handle the click event.
3. Dynamically create and display the `Quiz` component when a button is clicked.

### [Cards.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js)

Modify the `Cards` component to handle the `Start Quiz` button click.

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the materia from the button
                this.startQuiz(materia);
            });
        });
    }

    startQuiz(materia) {
        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('materia', materia); // Pass the materia to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="Organización del Estado">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="Sistemas y Comunicaciones">Start Quiz</button>
                    </div>
                </div>
                <!-- Add more cards as needed -->
            </div>
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

### [Quiz.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js)

Update the `Quiz` component to accept the `materia` attribute and fetch questions dynamically based on it.

```javascript


Made changes.

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

    // ...existing methods...
}

customElements.define("tag-quiz", Quiz);
```

### Explanation:
1. **`data-materia` Attribute**: Each button has a `data-materia` attribute specifying the `materia` for the quiz.
2. **Event Listener**: When a button is clicked, the `startQuiz` method is called, which dynamically creates the `Quiz` component and passes the `materia` as an attribute.
3. **Dynamic Fetching**: The `Quiz` component fetches questions based on the `materia` value.

Made changes.

Similar code found with 1 license type

## Fetch question from data-materia and data-programa
To handle both `data-materia` and `data-programa` attributes and dynamically fetch questions from either `/api/questions/materia/${materia}?limit=5&random=true` or `/api/questions/programa/${programa}?limit=5&random=true`, you can modify the `startQuiz` method to determine which attribute is present and construct the appropriate API endpoint.

### Steps:
1. Update the `addEventListeners` method to handle both `data-materia` and `data-programa`.
2. Modify the `startQuiz` method to dynamically determine the API endpoint based on the attribute.
3. Pass the correct endpoint to the `Quiz` component.

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, pregunta) {
        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=5&random=true`
            : `/api/questions/programa/${programa}?limit=5&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="Organización del Estado">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="Sistemas y Comunicaciones">Start Quiz</button>
                    </div>
                </div>
                <!-- Add more cards as needed -->
            </div>
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js

Modify the `Quiz` component to accept the `endpoint` attribute and fetch questions dynamically based on it.

```javascript


Made changes.

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
            const response = await fetch(endpoint); // Use the endpoint passed as an attribute
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

    // ...existing methods...
}

customElements.define("tag-quiz", Quiz);
```

---

### Explanation:
1. **Dynamic Endpoint**:
   - The `startQuiz` method determines the API endpoint based on whether `data-materia` or `data-programa` is present.
   - The endpoint is passed to the `Quiz` component as an attribute.

2. **Quiz Component**:
   - The `Quiz` component fetches questions dynamically using the `endpoint` attribute.

3. **Flexibility**:
   - This approach allows the `Cards` component to handle both `data-materia` and `data-programa` seamlessly.


## To change value limit=5 by this.data.message
To dynamically set the `limit` parameter in the API endpoint using `this.data.message`, you can modify the `startQuiz` method in the `Cards` component. Here's how:

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25'; // Default value for the limit
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, programa) {
        // Use this.data.message as the limit
        const limit = this.data.message;

        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="ag">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="sc">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Estructura de Datos</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="ED">Start Quiz</button>
                    </div>
                </div>
            </div>
            <!-- Add more cards as needed -->
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Explanation:
1. **Dynamic Limit**:
   - The `limit` parameter in the API endpoint is dynamically set using `this.data.message`.

2. **API Endpoint**:
   - The `startQuiz` method constructs the endpoint with the dynamic `limit` value.

3. **Flexibility**:
   - This approach allows the `limit` to be adjusted dynamically based on the `this.data.message` value.


## Solution why when I change input type="range" not event click in button from Cards.js
The issue occurs because the `input` event from the `<input type="range">` element in `Jumbo.js` is not directly linked to the `click` event of the buttons in `Cards.js`. The `input` event updates the `this.data.message` value in `Jumbo.js`, but `Cards.js` does not automatically re-render or update its event listeners when `this.data.message` changes.

### Solution:
You need to ensure that `Cards.js` re-renders or updates its event listeners whenever the `input` event in `Jumbo.js` changes the value of `this.data.message`.

---

### Steps to Fix:
1. **Ensure `Cards.js` Listens for Updates**:
   - `Jumbo.js` already dispatches a `user:jumbo-input` event when the range input changes.
   - `Cards.js` listens for this event and updates its `this.data.message` value, but it does not re-render or update its event listeners after the change.

2. **Re-render `Cards.js` After Data Update**:
   - After updating `this.data.message` in `Cards.js`, call `this.render()` and re-attach the event listeners.

---

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25'; // Default value for the limit
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail; // Update data from the event
            this.render(); // Re-render the component
            this.addEventListeners(); // Re-attach event listeners
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this); // Listen for updates from Jumbo.js
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, programa) {
        // Use this.data.message as the limit
        const limit = this.data.message;

        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="ag">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="sc">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Estructura de Datos</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="ED">Start Quiz</button>
                    </div>
                </div>
            </div>
            <!-- Add more cards as needed -->
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Explanation:
1. **Re-rendering**:
   - When the `user:jumbo-input` event is received, `this.data.message` is updated, and `this.render()` is called to update the DOM.

2. **Re-attaching Event Listeners**:
   - After re-rendering, `this.addEventListeners()` is called to ensure the buttons have the correct event listeners attached.

3. **Dynamic Updates**:
   - Now, when the range input in `Jumbo.js` changes, the `Cards.js` component dynamically updates its buttons and ensures the `limit` value is reflected in the API endpoint.
