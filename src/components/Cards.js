class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25'; // Default value for the limit*/
        
        // Array de oposiciones
        this.oppositions = [
            { title: "Organización del Estado", color: "primary", type: "programa", value: "ag" },
            { title: "Sistemas y Comunicaciones", color: "secondary", type: "programa", value: "sc" },
            { title: "Estructura de Datos", color: "light", type: "materia", value: "ED" },
            { title: "Tecnología básica", color: "danger", type: "programa", value: "tb" },
            { title: "CSS", color: "warning", type: "materia", value: "CSS" },
            { title: "JavaScript", color: "info", type: "materia", value: "JS" },
            { title: "Desarrollo de sistemas", color: "light", type: "programa", value: "ds" },
            { title: "Díagramas", color: "dark", type: "materia", value: "UML" },
            { title: "NET", color: "danger", type: "materia", value: "NET" },
            { title: "HTML", color: "danger", type: "materia", value: "HTML" },
            { title: "Patrones Diseño", color: "warning", type: "materia", value: "GoF" },
            { title: "Cálculo", color: "info", type: "materia", value: "Cálculo" },
            { title: "SQL", color: "light", type: "materia", value: "SQL" },
            { title: "Java", color: "dark", type: "materia", value: "JAVA" },
            { title: "Algoritmos de Ordenación", color: "danger", type: "materia", value: "Algoritmos de Ordenación" },
            { title: "PHP", color: "primary", type: "materia", value: "PHP" },
            { title: "Red", color: "secondary", type: "materia", value: "RED" },
            { title: "Hardware", color: "light", type: "materia", value: "HARDWARE" }
        ];
    }

    handleEvent(event) {
        if (event.type === "user:nav-ejercicios" || 
            event.type === "user:jumbo-input") {
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
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:jumbo-input", this); // Listen for updates from Jumbo.js
        this.data.from = this.getAttribute('title')
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:nav-ejercicios", this);
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
        console.log('limit', limit);

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
    
    hasOppositions() {
        // Agrupa las tarjetas en columnas de 3
        const columns = [[], [], [], [], [], []];
        this.oppositions.forEach((item, idx) => {
            columns[idx % 6].push(item);
        });

        return /* html */ `
        <div class="row">
            ${columns.map(col => `
                <div class="col-md-4">
                    ${col.map(card => `
                        <div class="card${card.color === 'light' ? '' : ' text-white'} bg-${card.color} mb-3" style="max-width: 20rem;">
                            <div class="card-header">Header</div>
                            <div class="card-body">
                                <h4 class="card-title">${card.title}</h4>
                                <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                                <button type="button" class="btn btn-success" data-${card.type}="${card.value}">Start Quiz</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
        `;
    }

    hasBooks(){
        return /* html */ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Chapter 1</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="ag">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Chapter 2</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="sc">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Chapter 3</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="ED">Start Quiz</button>
                    </div>
                </div>
            </div>
           
        </div>
        `;
    }

    render() {
        this.innerHTML = (this.data.from === "book-link")?this.hasBooks():this.hasOppositions();

    }
}

customElements.define("tag-card", Cards);