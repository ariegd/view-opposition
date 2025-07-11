class Jumbotron extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = "Máster Universitario en Internet de las Cosas";
    }

    handleEvent(event) {
        if( event.type === "user:nav-ejercicios" || 
            event.type === "user:nav-cuestonarios" ||
            event.type === "user:nav-cpersonalizado" ||
            event.type === "tables:book-selected") {
            this.data = event.detail;
            this.render();
        }
        else if (event.type === "input") {
            this.output.textContent = event.target.value;

            const messageEvent = new CustomEvent("user:jumbo-input", {
                detail: { from: "Jumbo", message: event.target.value },
                bubbles: true,
                composed: true
              });
            this.dispatchEvent(messageEvent);         
        }
        else if (event.type === 'quiz:finished') {
            // Desactiva el range
            const range = this.querySelector('#pi_input');
            if (range) range.disabled = true;
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:nav-cuestonarios", this);
        document.addEventListener("user:nav-cpersonalizado", this);
        document.addEventListener("tables:book-selected", this);
        window.addEventListener('quiz:finished', this);
        this.render();
    }

    disconnectedCallback() {
        document.removeEventListener("user:nav-ejercicios", this);
        document.removeEventListener("user:nav-cuestonarios", this);
        document.removeEventListener("user:nav-cpersonalizado", this);
        document.removeEventListener("tables:book-selected", this);
        window.removeEventListener('quiz:finished', this);
    }

    noRange() {
        return /* html */`
            <div class="container mt-3">
                <div class="mt-4 p-5 bg-info text-white rounded">
                    <h1>${this.data.message}</h1> 
                    <p>Coordinador: Francisco Igual Peña (figual@ucm.es),   <a href="https://informatica.ucm.es/master-en-internet-de-las-cosas" target="_blank" style="color: white;">Web oficial del máster</a>  </p> 

                </div>
            </div> `;
    }
    
    hasRange() {
        return /* html */`        
            <div class="container mt-3">
                <div class="mt-4 p-5 bg-info text-white rounded">
                    <h1>${this.data.message}</h1> 
                    <p>Referente a las oposiciones de 2024, Técnico Auxiliar de Informática. De los presentados aproximados 5K han aprobado para los puestos 1703. Felicidades</p> 

                    <form>
                        <fieldset>
                            <label for="customRange3" class="form-label">Example range</label>
                            <input type="range" class="form-range" min="5" max="40" step="5" id="pi_input">
                            <p>Value: <output id="value">25</output></p>
                        </fieldset>
                    </form>
                </div>
            </div> `;
    }

    render() {
        // Mostrar el rango si es "Ejercicios" o "book-link"
        if (this.data.from === "Ejercicios" || this.data.from === "book-link") {
            this.innerHTML = this.hasRange();
            this.output = document.querySelector("output");
            const range = document.querySelector("#pi_input");
            range.addEventListener("input", this);
        } else {
            this.innerHTML = this.noRange();
        }
    }

}

customElements.define("jumbo-tron", Jumbotron);