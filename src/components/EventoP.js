class EventoP extends HTMLElement {
    handleEvent(event) {
        if(event.type === "click")
            this.sendMessage();
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
        this.text = this.querySelector(".text");
        this.button.addEventListener("click", this);
        this.text.addEventListener("mouseenter", () => {
            const event = new Event("click");
            this.button.dispatchEvent(event);
          });
    }
    render() {
        this.innerHTML = /*html*/ `
            <button>👀 Click me</button>
            <span class="text">Hover me</span>
        `;
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this);      
    }
}

customElements.define("eve-p", EventoP);