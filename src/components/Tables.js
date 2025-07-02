class Tables extends HTMLElement {
    constructor() {
        super();
    }

    static get styles() {
        return /*css*/ `  
        tag-table {
          display: block;
          min-height: 100vh;
        }
        `;
    }

    addEventListeners() {
        // Selecciona todos los enlaces de libros
        const links = this.querySelectorAll('.book-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Quita la tabla
                this.innerHTML = '';
                const container = document.createElement('div');
                container.className = 'd-flex justify-content-center align-items-center';
                container.style.minHeight = '60vh'; // Opcional: altura mínima para centrar verticalmente

                // Monta el componente de detalle (por ejemplo, tag-card)
                const detail = document.createElement('tag-card');
                detail.setAttribute('title', link.textContent);

                container.appendChild(detail);
                this.appendChild(container); // <-- Añade el contenedor al propio componente
            });
        });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
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
                    <tr class="table-active">
                        <th scope="row">
                            <a href="#" class="book-link">Digital Design and Computer Architecture, ARM Edition</a>
                        </th>
                        <td>608899 - Arquitectura del nodo IoT</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr>
                        <th scope="row">Computer Architecture- A Quantitative Approach</th>
                        <td>608899 - Arquitectura del nodo IoT</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-primary">
                        <th scope="row">IoT Fundamentals</th>
                        <td>608900 - Redes, protocolos e interfaces I</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-secondary">
                        <th scope="row">6LoWPAN demystified</th>
                        <td>608900 - Redes, protocolos e interfaces I</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-success">
                        <th scope="row">6LoWPAN: The Wireless Embedded Internet</th>
                        <td>608900 - Redes, protocolos e interfaces I</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-danger">
                        <th scope="row">Interconnecting Smart Objects with IP</th>
                        <td>608901 - Redes, protocolos e interfaces II</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-warning">
                        <th scope="row">Learning Internet of Things - explore and learn about -- Waher, Peter</th>
                        <td>608901 - Redes, protocolos e interfaces II</td>
                        <td>Tecnología</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-info">
                        <th scope="row">Big Data con Python</th>
                        <td>608902 - Tratamiento de datos masivos</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-light">
                        <th scope="row">The internet of things and data analytics handbook</th>
                        <td>608902 - Tratamiento de datos masivos</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                   <tr class="table-active">
                        <th scope="row">Las bases de big data y de la inteligencia artificial</th>
                        <td>608902 - Tratamiento de datos masivos</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr>
                        <th scope="row">Seven Databases in Seven Weeks - A Guide to Modern Databases</th>
                        <td>608902 - Tratamiento de datos masivos</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-primary">
                        <th scope="row">Tom White, “Hadoop The Definitive Guide”, 4th Edition</th>
                        <td>608902 - Tratamiento de datos masivos</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-success">
                        <th scope="row">Enterprise Application Integration - A Wiley Tech Brief </th>
                        <td>608903 - Diseño de infraestructura inteligente IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-danger">
                        <th scope="row">Blockchains_and_Smart_Contracts_for_the_Internet_of_Things</th>
                        <td>608903 - Diseño de infraestructura inteligente IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-warning">
                        <th scope="row">Learning Spring Boot 3.0- Simplify the development of </th>
                        <td>608903 - Diseño de infraestructura inteligente IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-secondary">
                        <th scope="row">Cloud Native Java - Designing Resilient Systems with Spring</th>
                        <td>608903 - Diseño de infraestructura inteligente IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 1C )</td>
                    </tr>
                    <tr class="table-info">
                        <th scope="row">The IoT Hackers Handbook - A Practical Guide to Hacking the</th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-light">
                        <th scope="row">IoT penetration testing cookbook - identify vulnerabilities</th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                   <tr class="table-active">
                        <th scope="row">Practical Internet of Things Security - Design a Security</th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr>
                        <th scope="row">Hands-On Cryptography with Python - Leverage the Power of </th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-primary">
                        <th scope="row">Designing Secure Software - A Guide for Developers </th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-secondary">
                        <th scope="row">Web Application Security - Exploitation and Countermeasures</th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-success">
                        <th scope="row">EU General Data Protection Regulation (GDPR) An</th>
                        <td>608904 - Seguridad y Legalidad</td>
                        <td>Seguridad</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-danger">
                        <th scope="row">Deep Learning (Adaptive Computation and Machine Learning</th>
                        <td>608905 - Inteligencia Artificial aplicada a IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-warning">
                        <th scope="row">Deep Learning with Python, Second Edition (MEAP V04)</th>
                        <td>608905 - Inteligencia Artificial aplicada a IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-info">
                        <th scope="row">Hands-On Machine Learning with Scikit-Learn and TensorFlow</th>
                        <td>608905 - Inteligencia Artificial aplicada a IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-light">
                        <th scope="row">The Elements of Statistical Learning, 2nd Ed. -- Trevor Hastie</th>
                        <td>608905 - Inteligencia Artificial aplicada a IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 2C )</td>
                    </tr>
                   <tr class="table-active">
                        <th scope="row">Machine Learning -- Tom Michael Mitchell</th>
                        <td>608905 - Inteligencia Artificial aplicada a IoT</td>
                        <td>Big Data Management</td>
                        <td>1º ( 2C )</td>
                    </tr>
                    <tr class="table-dark">
                        <th scope="row">Dark</th>
                        <td>Column content</td>
                        <td>Column content</td>
                        <td>Column content</td>
                    </tr>

                </tbody>
            </table>
        `;
    }

    disconnectedCallback() {
        this.ass[1].removeEventListener("click", this.sendCustomEvent1);
    }

}

customElements.define("tag-table", Tables);