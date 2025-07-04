class Tables extends HTMLElement {
    constructor() {
        super();
        // Ejemplo de datos, puedes cargarlo dinámicamente si lo necesitas
        this.books = [
            {
                titulo: "Digital Design and Computer Architecture, ARM Edition",
                asignatura: "608899 - Arquitectura del nodo IoT",
                materia: "Tecnología",
                curso: "1º ( 1C )",
                rowClass: "table-active"
            },
            {
                titulo: "Computer Architecture- A Quantitative Approach",
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

    async connectedCallback() {
        await this.fetchBooks(); // ojo con el orden
        this.render();
        this.addEventListeners();
    }

    async fetchBooks() {
        try {
            const res = await fetch('http://localhost:3000/api/books');
            this.books = await res.json();
        } catch (err) {
            this.books = [];
            this.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los libros.</div>`;
        }
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
        const rowClasses = [
            "table-active", 
            "table-default", 
            "table-primary", 
            "table-secondary", 
            "table-success", 
            "table-danger", 
            "table-warning", 
            "table-info", 
            "table-light",
        ]; // Puedes añadir o quitar clases según Bootstrap

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
                    ${this.books.map((book, idx) => {
                        // Asigna la clase siguiendo la secuencia y repitiendo si es necesario
                        const classIndex = idx % rowClasses.length;
                        const rowClass = rowClasses[classIndex];
                        return `
                            <tr class="${rowClass}">
                                <th scope="row">
                                    <a href="#" class="book-link">${book.titulo}</a>
                                </th>
                                <td>${book.asignatura}</td>
                                <td>${book.materia}</td>
                                <td>${book.curso}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

}

customElements.define("tag-table", Tables);