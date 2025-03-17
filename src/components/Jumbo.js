class Jumbotron extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = "Jumbotron Example";
    }

    handleEvent(event) {
        if( event.type === "user:nav-ejercicios" || 
            event.type === "user:nav-cuestonarios" ||
            event.type === "user:nav-cpersonalizado") {
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
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:nav-cuestonarios", this);
        document.addEventListener("user:nav-cpersonalizado", this);
        this.render();
    }

    disconnectedCallback() {
        document.removeEventListener("user:nav-ejercicios", this);
        document.removeEventListener("user:nav-cuestonarios", this);
        document.removeEventListener("user:nav-cpersonalizado", this);
    }

    noRange() {
        return /* html */`
            <div class="container mt-3">
                <div class="mt-4 p-5 bg-info text-white rounded">
                    <h1>${this.data.message}</h1> 
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..</p> 
                </div>
            </div> `;
    }
    
    hasRange() {
        return /* html */`        
            <div class="container mt-3">
                <div class="mt-4 p-5 bg-info text-white rounded">
                    <h1>${this.data.message}</h1> 
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..</p> 

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
        this.innerHTML = (this.data.from === "Ejercicios")? this.hasRange() : this.noRange();
        if (this.data.from === "Ejercicios") {
            console.log("está!");

            this.output = document.querySelector("output");
            const range = document.querySelector("#pi_input");

            range.addEventListener("input", this);
        } else {
            console.log("No está!");
        }
    }

}

customElements.define("jumbo-tron", Jumbotron);