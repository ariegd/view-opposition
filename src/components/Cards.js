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
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
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
                    <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Estructura de Datos</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-danger mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Tecnología básica</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-warning mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">CSS</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-info mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">JavaScript</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Desarrollo de sistemas</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-dark mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Díagramas</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-danger mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">NET</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>       
            </div>

            <div class="col-md-4">
                <div class="card text-white bg-danger mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">HTML</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-warning mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Patrones Diseño</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-info mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Cálculo</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">SQL</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-dark mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Java</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-danger mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Algoritmos de Ordenación</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>       
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">PHP</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                    <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Red</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Hardware</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success">Start Quiz</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);