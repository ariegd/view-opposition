class Tables extends HTMLElement {
    constructor() {
        super();
        // Ejemplo de datos, puedes cargarlo dinámicamente si lo necesitas
        this.books = [
            {
                title: "Digital Design and Computer Architecture, ARM Edition",
                asignatura: "608899 - Arquitectura del nodo IoT",
                materia: "Tecnología",
                curso: "1º ( 1C )",
                rowClass: "table-active"
            },
            {
                title: "Computer Architecture- A Quantitative Approach",
                asignatura: "608899 - Arquitectura del nodo IoT",
                materia: "Tecnología",
                curso: "1º ( 1C )",
                rowClass: ""
            },
            // ...añade el resto de tus libros aquí...
        ];
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        // Añade el evento personalizado a cada enlace de libro
        const links = this.querySelectorAll('.book-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.textContent;
                // Lanza el CustomEvent con el título del libro
                this.dispatchEvent(new CustomEvent("tables:book-selected", {
                    detail: { from: "book-link", message: title },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    render() {
        this.innerHTML = /*html*/ `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Libro</th>
                        <th scope="col">Asignatura</th>
                        <th scope="col">Materia</th>
                        <th scope="col">Curso</th>
                    </tr>
                </thead>
                <tbody>
                     ${this.books.map(book => `
                        <tr class="${book.rowClass}">
                            <th scope="row">
                                <a href="#" class="book-link">${book.title}</a>
                            </th>
                            <td>${book.asignatura}</td>
                            <td>${book.materia}</td>
                            <td>${book.curso}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

}

customElements.define("tag-table", Tables);