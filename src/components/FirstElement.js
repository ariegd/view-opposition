class FirstElement extends HTMLElement {
    handleEvent(event) {
        if(event.type === "click"){
                const messageEvent = new CustomEvent("user:data-message", {
                detail: { from: "Manz", message: "Hello!" },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(messageEvent);
        }
    }
    sendMessage() {
        alert("¡Has pulsado el botón!");
    }
    sendMessage1() {
        alert("👀 👀 👀 👀");
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
            <button>👀 Send message!</button>
        `;
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this);      
    }
}

customElements.define("first-element", FirstElement);