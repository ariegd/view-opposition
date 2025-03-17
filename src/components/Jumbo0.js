class Jumbotron extends HTMLElement {
    constructor() {
        super();
        this.data = { detail: {from: "Manz", message: "Jumbotron Example"}};
        this.data.message = "Jumbotron Example";
    }

    handleEvent(event) {
        if(event.type === "user:data-message" || 
            event.type === "user:nav-message1" || 
            event.type === "user:nav-message2" ||
            event.type === "user:nav-message3"
        ){
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:data-message", this);
        document.addEventListener("user:nav-message1", this);
        document.addEventListener("user:nav-message2", this);
        document.addEventListener("user:nav-message3", this);
        this.render();
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
                            <p>Value: <output id="value"></output></p>
                        </fieldset>
                    </form>
                </div>
            </div> `;
    }

    render() {
        this.innerHTML = (this.data.from === "Ejercicios")? this.hasRange() : this.noRange();
    }
}

customElements.define("jumbo-tron", Jumbotron);