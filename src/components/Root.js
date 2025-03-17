class Root extends HTMLElement {
    constructor() {
        super();
        this.data = null;
    }
 
    handleEvent(event) {
        if( event.type === "user:nav-ejercicios" || 
            event.type === "user:nav-cuestonarios" ||
            event.type === "user:nav-cpersonalizado" ){
            this.data = event.detail;
            this.render();
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

    noMessages() {
        return /* html */`<div class="container mt-3"><tag-table/></div>`;
    }
    
    hasMessages() {
        var result = "👀 👀 ";
        
        if (this.data.from === "Ejercicios") {
            result = /* html */`<div class="container mt-3">
                <tag-card/>    
            </div>`;           
        }
        else if (this.data.from === "Cuestonarios") {
            result = /* html */`<div class="container mt-3">
                    <tag-quiz/>
                </div>`; 
        }
        else if (this.data.from === "Cuestonarios-P") {
            result = /* html */`<div class="container mt-3">
                <tag-button/>
            </div>`; 
        }

        return result;
    }

    render() {
        this.innerHTML = this.data ? this.hasMessages() : this.noMessages();
    }
}

customElements.define("tag-root", Root);