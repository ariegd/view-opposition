class Navbars extends HTMLElement {

    constructor() {
        super();
    
    } 
  
    handleEvent(event) {
/*         if(event.type === "click")
            this.sendMessage(); */
    }

    sendCustomEvent1() {
        const messageEvent1 = new CustomEvent("user:nav-ejercicios", {
                detail: { from: "Ejercicios", message: "Hacer Test Cabrón!" },
                bubbles: true,
                composed: true
            });
        this.dispatchEvent(messageEvent1);
    }
    sendCustomEvent2() {
        const messageEvent2 = new CustomEvent("user:nav-cuestonarios", {
                detail: { from: "Cuestonarios", message: "Esto no sé pa que es!" },
                bubbles: true,
                composed: true
            });
        this.dispatchEvent(messageEvent2);
    }
    sendCustomEvent3() {
        const messageEvent3 = new CustomEvent("user:nav-cpersonalizado", {
                detail: { from: "Cuestonarios-P", message: "Personalizando para que es!" },
                bubbles: true,
                composed: true
            });
        this.dispatchEvent(messageEvent3);
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        this.render();
        this.ass = this.querySelectorAll("a.dropdown-item");
        this.ass[0].addEventListener("click", this.sendCustomEvent1);
        this.ass[1].addEventListener("click", this.sendCustomEvent2);
        this.ass[2].addEventListener("click", this.sendCustomEvent3);
    }

    render() {
        this.innerHTML = /*html*/ `
  
        <nav class="navbar navbar-expand-md bg-primary" data-bs-theme="dark">
            <div class="container-fluid">
            <a class="navbar-brand" href="#">Oposiciones</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="http://127.0.0.1:5500/14_Bootstrap/index.html">Home
                    <span class="visually-hidden">(current)</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">About</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Servicios</a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Ejercicios</a>
                        <a class="dropdown-item" href="#">Cuestonarios</a>
                        <a class="dropdown-item" href="#">Cuestonarios personalizados</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Separated link</a>
                    </div>
                </li>
                </ul>
                <form class="d-flex">
                <input class="form-control me-sm-2" type="search" placeholder="Search">
                <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
            </div>
        </nav>
        `;
    }

    disconnectedCallback() {
        this.ass[0].removeEventListener("click", this.sendCustomEvent1);
        this.ass[1].removeEventListener("click", this.sendCustomEvent2);
        this.ass[2].removeEventListener("click", this.sendCustomEvent3);
    }

}

customElements.define("nav-bars", Navbars);