class EventosCW extends HTMLElement {
    handleEvent(event) {
        if(event.type === "click")
            this.sendMessage();
    }
    sendMessage() {
        alert("¡Has hecho click!");
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
        this.button = this.querySelector("button");
        this.button.addEventListener("click", this);
    }
    render() {
        this.innerHTML = /*html*/ `
            <button>👀 Press me!</button>
        `;
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this);      
    }
}

customElements.define("eve-cw", EventosCW);