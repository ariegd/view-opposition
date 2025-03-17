import "../components/Tables.js";

class SecondElement extends HTMLElement {
    constructor() {
        super();
        this.data = null;
    }
 
    handleEvent(event) {
        if(event.type === "user:data-message" || 
            event.type === "user:nav-message1" || 
            event.type === "user:nav-message2"
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
        this.render();
    }


    noMessages() {
        return /* html */`<div>No messages</div>`;
    }
    
    hasMessages() {
        return /* html */`<div class="container">
            From ${this.data.from}:
            <span style="color:red">${this.data.message}</span>
            <tag-table></tag-table>
        </div>`;
    }

    render() {
        this.innerHTML = this.data ? this.hasMessages() : this.noMessages();
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this);      
    }
}

customElements.define("second-element", SecondElement);