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

    async connectedCallback() {
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:jumbo-input", this); // Listen for updates from Jumbo.js
        this.data.from = this.getAttribute('title')
        // Si el modo es "book-link", carga los qbooks del libro seleccionado
        if (this.data.from === "book-link") {
            const books_id = this.getAttribute('books_id'); // O como lo recibas
            await this.fetchQBooks(books_id);
        }
        this.render();
        this.addEventListeners();
    }

    async fetchQBooks(books_id) {
        try {
            const res = await fetch(`http://localhost:3000/api/qbooks/id/${books_id}`);
            this.qbooks = await res.json();
        } catch (err) {
            this.qbooks = [];
        }
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
                const qbookid = event.target.getAttribute('data-qbookid'); // Nuevo: para capítulos
                const capitulo = event.target.getAttribute('data-capitulo');
                this.startQuiz(materia, programa, qbookid, capitulo);
            });
        });
    }

    startQuiz(materia, programa, qbookid, capitulo) {
        // Use this.data.message as the limit
        const limit = this.data.message;
        let endpoint;

    if (qbookid && capitulo) {
        // Quiz para el capítulo específico de un libro
        endpoint = `/api/qbooks/id/${qbookid}/capitulo/${capitulo}?limit=${limit}&random=true`;
    } else if (qbookid) {
        endpoint = `/api/qbooks/id/${qbookid}?limit=${limit}&random=true`;
    } else {
            // Quiz general por materia o programa
            endpoint = materia
                ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
                : `/api/questions/programa/${programa}?limit=${limit}&random=true`;
        }

        // Remove the current Cards component
        this.innerHTML = '';

        // Elimina cualquier otro tag-quiz existente
        const existingQuiz = document.querySelector('tag-quiz');
        if (existingQuiz) {
            existingQuiz.remove();
        }

        console.log(`Starting quiz with endpoint: ${endpoint}`);
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
        if (!this.qbooks.length) {
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

        // Agrupa por capítulo
        const chapters = {};
        this.qbooks.forEach(qbook => {
            const cap = qbook.capitulo || "Sin capítulo";
            if (!chapters[cap]) chapters[cap] = [];
            chapters[cap].push(qbook);
        });

        // Renderiza una card por capítulo
        return /* html */ `
        <div class="row">
            ${Object.entries(chapters).map(([capitulo, qbooks]) => `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                        <div class="card-header">${qbooks[0].header || "Header"}</div>
                        <div class="card-body">
                            <h4 class="card-title">Capítulo ${capitulo}</h4>
                            <p class="card-text"><output>${qbooks.length}</output> preguntas</p>
                            <button type="button" class="btn btn-success" 
                                data-qbookid="${qbooks[0].books_id}" 
                                data-capitulo="${capitulo}">
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }

    render() {
        this.innerHTML = (this.data.from === "book-link")?this.hasBooks():this.hasOppositions();

    }
}

customElements.define("tag-card", Cards);