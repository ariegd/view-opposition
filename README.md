# view-opposition
Vista del proyecto relacionado con los test de oposición. Utilizando bootswatch (basic) y web componentes. 

   - [cuando el usuario lance el evento user:jumbo-input no cambie de hasBooks() a hasOppositions()](#pregunta-22)
   - [tables:book-selected cuando se lance este evento crear en el jumbo.js customRange3](#pregunta-21)
   - [ejecutar startQuiz por qbookid y capitulo](#pregunta-20)
   - [startQuiz para la hasBooks()](#pregunta-19)
   - [agrupar todas las preguntas de un mismo capitulo en un solo cards](#pregunta-18)
   - [detail: { from: "book-link", message: title } pasar el books_id](#pregunta-17)
   - [cargar dinamicamente las Cards que pertenece a una determinada qBookModel.js dependiendo del books_id](#pregunta-16)
   - [hasBooks() cargar las Cards de la base de datos MongoDB](#pregunta-15)
   - [Si existe un <tag-quiz> cuando se llame "Ejercicios" eliminarlo desde el Root.js](#pregunta-14)
   - [Eliminar si existe otro <tag-quiz> cuando se llame startQuiz()](#pregunta-13)
   - [Aleatorio no, seguir la secuencia del array y si se acaba comenzar por el valor inicial del array rowClasses](#pregunta-12)
   - [No se muestra nada](#pregunta-11)
   - [Reemplazar el this.books con acceso a MongoDB Cloud](#pregunta-10)
   - [Colocar un condicionar si card.color = light no colocar el text-white](#pregunta-9)
   - [Bucle que me genere dinamicamente los elementos de hasOppositions() en Cards.js](#pregunta-8)
   - [Un bucle que me cree dinamicamente todos los elementos del <tbody> junto con su CustomenEvent](#pregunta-7)
   - [Pasando un valor del componente Root.js a Cards.js](#pregunta-6)
   - [Cómo crear hiperlink a otro componente desde el componente tables?](#pregunta-5)
   - [To make the Cards.js call the Quiz.js](#pregunta-4)
   - [Fetch question from data-materia and data-programa](#pregunta-3)
   - [To change value limit=5 by this.data.message](#pregunta-2)
   - [Solution why when I change input type="range" not event click in button from Cards.js](#pregunta-1)

## Pregunta 22
**cuando el usuario lance el evento user:jumbo-input no cambie de hasBooks() a hasOppositions()**

Para que **cuando el usuario lance el evento `user:jumbo-input` no cambie de `hasBooks()` a `hasOppositions()`**, debes asegurarte de que el valor de `this.data.from` no se sobrescriba accidentalmente en el handler del evento, y que el método `render()` siga mostrando `hasBooks()` si el modo es `"book-link"`.

Actualmente, en tu método `handleEvent`, haces:

```javascript
this.data = event.detail; // Update data from the event
this.render(); // Re-render the component
this.addEventListeners(); // Re-attach event listeners
```

Esto puede sobrescribir `this.data.from` y perder el valor `"book-link"`.

### Solución

**Solo actualiza el campo que necesitas (por ejemplo, `message`) y no sobrescribas `from` si ya está en `"book-link"`:**

```javascript
handleEvent(event) {
    if (event.type === "user:nav-ejercicios" || event.type === "user:jumbo-input") {
        // Solo actualiza el mensaje, no sobrescribas 'from' si ya es 'book-link'
        if (this.data.from === "book-link") {
            this.data.message = event.detail.message;
        } else {
            this.data = event.detail;
        }
        this.render();
        this.addEventListeners();
    }
}
```

**Así, si el usuario está en modo `"book-link"`, el componente seguirá mostrando `hasBooks()` aunque cambie el valor del rango, y no volverá a `hasOppositions()`.**


## Pregunta 21
**tables:book-selected cuando se lance este evento crear en el jumbo.js customRange3**

Para que cuando se lance el evento `tables:book-selected` se cree el input de rango (`customRange3`) en Jumbo.js, solo tienes que modificar el método `render()` para que también muestre el rango cuando `this.data.from === "book-link"` (además de `"Ejercicios"`).

**Modifica la condición en `render()` así:**

```javascript
render() {
    // Mostrar el rango si es "Ejercicios" o "book-link"
    if (this.data.from === "Ejercicios" || this.data.from === "book-link") {
        this.innerHTML = this.hasRange();
        this.output = document.querySelector("output");
        const range = document.querySelector("#pi_input");
        range.addEventListener("input", this);
    } else {
        this.innerHTML = this.noRange();
    }
}
```

**Así, cuando se lance `tables:book-selected` y el evento lleve `{ from: "book-link", ... }`, el input de rango aparecerá en el jumbotron.**

## Pregunta 20
**ejecutar startQuiz por qbookid y capitulo**

Para ejecutar `startQuiz` por **qbookid** y **capítulo**, necesitas que el botón de cada card de capítulo pase ambos datos como atributos (por ejemplo, `data-qbookid` y `data-capitulo`), y luego los uses en tu función `startQuiz` para construir el endpoint adecuado.

Aquí tienes cómo hacerlo:

---

### 1. Modifica el botón en `hasBooks()` para incluir ambos atributos

```javascript
<button type="button" class="btn btn-success"
    data-qbookid="${qbooks[0].books_id}"
    data-capitulo="${capitulo}">
    Start Quiz
</button>
```

---

### 2. Modifica `addEventListeners()` para recoger ambos atributos

```javascript
addEventListeners() {
    const buttons = this.querySelectorAll('.btn-success');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const materia = event.target.getAttribute('data-materia');
            const programa = event.target.getAttribute('data-programa');
            const qbookid = event.target.getAttribute('data-qbookid');
            const capitulo = event.target.getAttribute('data-capitulo');
            this.startQuiz(materia, programa, qbookid, capitulo);
        });
    });
}
```

---

### 3. Modifica `startQuiz` para construir el endpoint usando ambos parámetros

```javascript
startQuiz(materia, programa, qbookid, capitulo) {
    const limit = this.data.message;
    let endpoint;

    if (qbookid && capitulo) {
        // Quiz para el capítulo específico de un libro
        endpoint = `/api/qbooks/id/${qbookid}/capitulo/${capitulo}?limit=${limit}&random=true`;
    } else if (qbookid) {
        endpoint = `/api/qbooks/id/${qbookid}?limit=${limit}&random=true`;
    } else {
        endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;
    }

    this.innerHTML = '';

    const existingQuiz = document.querySelector('tag-quiz');
    if (existingQuiz) {
        existingQuiz.remove();
    }

    const quiz = document.createElement('tag-quiz');
    quiz.setAttribute('endpoint', endpoint);
    document.body.appendChild(quiz);
}
```

---

**Con esto, al pulsar el botón de un capítulo, se ejecutará el quiz solo para ese `books_id` y `capitulo`.**





## Pregunta 19
**startQuiz para la hasBooks()**

Para que el botón **Start Quiz** de cada card en `hasBooks()` funcione correctamente y lance el quiz solo con las preguntas de ese capítulo, debes modificar el método `addEventListeners()` y el método `startQuiz` para aceptar el atributo `data-qbookid` (o el identificador de capítulo).

Aquí tienes cómo hacerlo:

```javascript
addEventListeners() {
    const buttons = this.querySelectorAll('.btn-success');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const materia = event.target.getAttribute('data-materia');
            const programa = event.target.getAttribute('data-programa');
            const qbookid = event.target.getAttribute('data-qbookid'); // Nuevo: para capítulos
            this.startQuiz(materia, programa, qbookid);
        });
    });
}

startQuiz(materia, programa, qbookid) {
    const limit = this.data.message;
    let endpoint;

    if (qbookid) {
        // Quiz solo para el capítulo (qbook)
        endpoint = `/api/questions/qbook/${qbookid}?limit=${limit}&random=true`;
    } else {
        // Quiz general por materia o programa
        endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;
    }

    this.innerHTML = '';

    const existingQuiz = document.querySelector('tag-quiz');
    if (existingQuiz) {
        existingQuiz.remove();
    }

    const quiz = document.createElement('tag-quiz');
    quiz.setAttribute('endpoint', endpoint);
    document.body.appendChild(quiz);
}
```

**Resumen:**  
- Si el botón tiene `data-qbookid`, el quiz será solo para ese capítulo.
- Si no, funcionará como antes (por materia o programa).
- Así, los quizzes por capítulo funcionarán correctamente desde las cards agrupadas.

## Pregunta 18
**agrupar todas las preguntas de un mismo capitulo en un solo cards**
Para agrupar todas las preguntas de un mismo capítulo en una sola card, primero necesitas agrupar los elementos de this.qbooks por el campo capitulo. Luego, para cada capítulo, renderizas una sola card que representa ese capítulo.

Aquí tienes cómo hacerlo:
```
    hasBooks() {
        if (!this.qbooks.length) {
            return /* html */ `
            <div class="alert alert-info">No hay capítulos para este libro.</div>
            `;
        }

        // Agrupa por capítulo
        const chapters = {};
        this.qbooks.forEach(qbook => {
            const cap = qbook.capitulo || "Sin capítulo";
            if (!chapters[cap]) chapters[cap] = [];
            chapters[cap].push(qbook);
        });

        // Renderiza una card por capítulo
        return /* html */ `
        <div class="row">
            ${Object.entries(chapters).map(([capitulo, qbooks]) => `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                        <div class="card-header">${qbooks[0].header || "Header"}</div>
                        <div class="card-body">
                            <h4 class="card-title">Capítulo ${capitulo}</h4>
                            <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                            <button type="button" class="btn btn-success" data-qbookid="${qbooks[0]._id}">Start Quiz</button>
                            <p class="small text-white-50">Preguntas en este capítulo: ${qbooks.length}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }
```
Explicación:

Se agrupa this.qbooks por el campo capitulo.
Se renderiza una sola card por cada capítulo, mostrando el número de preguntas agrupadas.
El botón puede usar el _id del primer qbook del capítulo, o puedes adaptar la lógica para lanzar el quiz de todo el capítulo.
Así, tendrás una card por capítulo, no una por pregunta!

## Pregunta 17
**detail: { from: "book-link", message: title } pasar el books_id**
Para pasar también el `books_id` en el evento personalizado, simplemente inclúyelo en el objeto `detail`.  
Supongamos que cada objeto `book` tiene una propiedad `id` o `_id` (como suele venir de MongoDB).  
Modifica el listener así:

```javascript
addEventListeners() {
    const links = this.querySelectorAll('.book-link');
    links.forEach((link, idx) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const title = link.textContent;
            const book = this.books[idx]; // Obtén el libro correspondiente por índice
            // Lanza el CustomEvent con el título y el books_id
            this.dispatchEvent(new CustomEvent("tables:book-selected", {
                detail: { from: "book-link", message: title, books_id: book._id || book.id },
                bubbles: true,
                composed: true
            }));
        });
    });
}
```

**Ahora el evento llevará también el `books_id` del libro seleccionado en `detail.books_id`.**

## Pregunta 16
**cargar dinamicamente las Cards que pertenece a una determinada qBookModel.js dependiendo del books_id**
Para cargar dinámicamente las Cards que pertenecen a una determinada colección `qBookModel.js` dependiendo del `books_id`, debes:

1. **Crear un endpoint en tu backend** que devuelva los "qbooks" filtrados por `books_id`.
2. **Hacer un fetch en el frontend** (en tu componente `Cards`) usando ese `books_id`.
3. **Renderizar las cards** usando los datos recibidos.

---

### 1. Backend: Endpoint para filtrar por `books_id`

Supón que tienes un modelo `qBookModel.js` y quieres obtener los qbooks de un libro:

```javascript
// src/routes/qBookRoutes.js
const express = require('express');
const router = express.Router();
const QBook = require('../models/qBookModel');

router.get('/qbooks/:bookId', async (req, res) => {
    try {
        const qbooks = await QBook.find({ books_id: req.params.bookId });
        res.json(qbooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
```

---

### 2. Frontend: Cards.js

Modifica tu componente para:
- Recibir el `books_id` como atributo o desde `this.data`.
- Hacer fetch a `/api/qbooks/${books_id}`.
- Renderizar las cards con los datos recibidos.

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
        this.qbooks = []; // Aquí se guardarán los qbooks filtrados
    }

    async connectedCallback() {
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:jumbo-input", this);
        this.data.from = this.getAttribute('title');
        // Si el modo es "book-link", carga los qbooks del libro seleccionado
        if (this.data.from === "book-link") {
            const books_id = this.getAttribute('books_id'); // O como lo recibas
            await this.fetchQBooks(books_id);
        }
        this.render();
        this.addEventListeners();
    }

    async fetchQBooks(books_id) {
        try {
            const res = await fetch(`http://localhost:3000/api/qbooks/${books_id}`);
            this.qbooks = await res.json();
        } catch (err) {
            this.qbooks = [];
        }
    }

    hasBooks() {
        if (!this.qbooks.length) {
            return `<div class="alert alert-info">No hay capítulos para este libro.</div>`;
        }
        return /* html */ `
        <div class="row">
            ${this.qbooks.map(qbook => `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                        <div class="card-header">${qbook.header || "Header"}</div>
                        <div class="card-body">
                            <h4 class="card-title">${qbook.titulo || qbook.chapter || "Capítulo"}</h4>
                            <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                            <button type="button" class="btn btn-success" data-qbookid="${qbook._id}">Start Quiz</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }

    render() {
        this.innerHTML = (this.data.from === "book-link") ? this.hasBooks() : this.hasOppositions();
    }

    // ...resto del código...
}

customElements.define("tag-card", Cards);
```

---

### 3. Cómo pasar el `books_id` al componente

Cuando crees `<tag-card>`, pásale el atributo `books_id`:

```javascript
<tag-card title="book-link" books_id="EL_ID_DEL_LIBRO"/>
```

---

**Resumen:**  
- El backend expone `/api/qbooks/:bookId` para filtrar capítulos por libro.
- El frontend usa ese endpoint y renderiza las cards dinámicamente según el libro seleccionado.
- Así, solo se muestran los capítulos/cards que pertenecen al libro (`books_id`) seleccionado.

## Pregunta 15
**hasBooks() cargar las Cards de la base de datos MongoDB**
Para que `hasBooks()` cargue las cards dinámicamente desde la base de datos MongoDB, debes:

1. **Obtener los libros desde tu API REST (que consulta MongoDB).**
2. **Guardar los libros en una propiedad del componente.**
3. **Renderizar las cards usando esos datos.**

Aquí tienes cómo hacerlo:

---

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
        this.books = []; // Aquí se guardarán los libros de la API
        // ...this.oppositions...
    }

    async connectedCallback() {
        document.addEventListener("user:nav-ejercicios", this);
        document.addEventListener("user:jumbo-input", this);
        this.data.from = this.getAttribute('title');
        if (this.data.from === "book-link") {
            await this.fetchBooks(); // Espera a cargar los libros antes de renderizar
        }
        this.render();
        this.addEventListeners();
    }

    async fetchBooks() {
        try {
            const res = await fetch('http://localhost:3000/api/books');
            this.books = await res.json();
        } catch (err) {
            this.books = [];
        }
    }

    hasBooks() {
        if (!this.books.length) {
            return `<div class="alert alert-info">Cargando libros...</div>`;
        }
        return /* html */ `
        <div class="row">
            ${this.books.map(book => `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                        <div class="card-header">Header</div>
                        <div class="card-body">
                            <h4 class="card-title">${book.titulo}</h4>
                            <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                            <button type="button" class="btn btn-success" data-programa="${book.programa || ''}" data-materia="${book.materia || ''}">Start Quiz</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }

    // ...resto del código (hasOppositions, addEventListeners, startQuiz, render, etc.)...
}
```

**Puntos clave:**
- `fetchBooks()` obtiene los libros de la API y los guarda en `this.books`.
- `hasBooks()` genera las cards dinámicamente usando los datos de `this.books`.
- En `connectedCallback()`, si el modo es `"book-link"`, primero espera a cargar los libros antes de renderizar.

**Así, las cards de libros se cargarán dinámicamente desde MongoDB!**



## Pregunta 14
**Si existe un <tag-quiz> cuando se llame "Ejercicios" eliminarlo desde el Root.js**
Para asegurarte de que **cuando se renderice `<tag-card>` en la condición `"Ejercicios"` se elimine cualquier `<tag-quiz>` existente**, puedes hacerlo justo antes de devolver el HTML en `hasMessages()`:

```javascript
if (this.data.from === "Ejercicios") {
    // Elimina cualquier tag-quiz existente en el documento
    const existingQuiz = document.querySelector('tag-quiz');
    if (existingQuiz) {
        existingQuiz.remove();
    }
    result = /* html */`<div class="container mt-3">
        <tag-card title="${this.data.from}"/>    
    </div>`;           
}
```

**Coloca este bloque dentro de tu método `hasMessages()`**.  
Así, cada vez que se muestre `<tag-card>` por la opción "Ejercicios", se eliminará cualquier `<tag-quiz>` que haya en el DOM.

## Pregunta 13
**Eliminar si existe otro <tag-quiz> cuando se llame startQuiz()**

Para asegurarte de que solo haya un <tag-quiz> en el documento, elimina cualquier otro existente antes de añadir uno nuevo. Puedes hacerlo así en tu método startQuiz:

```javascript
    // Elimina cualquier otro tag-quiz existente
    const existingQuiz = document.querySelector('tag-quiz');
    if (existingQuiz) {
        existingQuiz.remove();
    }
```

Así, siempre tendrás solo un <tag-quiz> en el DOM.


## Pregunta 12 
**aleatorio no, seguir la secuencia del array rowClasses**

Para asignar las clases de rowClasses siguiendo el orden y, si se acaban, volver a empezar desde el principio (circular), simplemente usa el índice del libro y el operador módulo (%) sobre la longitud del array de clases.

Modifica tu método render() así:

Así, la asignación de clases será secuencial y cíclica, nunca aleatoria.

## Pregunta 11
**No se muestra nada**

El problema es que en tu método `connectedCallback()` primero llamas a `this.render()` y `this.addEventListeners()`, y **después** haces `await this.fetchBooks()`.  
Esto provoca que la tabla se renderice con el array vacío (o con los datos estáticos si no has borrado el array), y cuando llegan los datos de la API, **no vuelves a renderizar** la tabla.

### Solución

Debes:
1. Llamar a `await this.fetchBooks()` primero.
2. Luego llamar a `this.render()` y `this.addEventListeners()`.

Así aseguras que la tabla se renderiza con los datos reales.

---

#### Cambia tu `connectedCallback` así:

```javascript
async connectedCallback() {
    await this.fetchBooks();
    this.render();
    this.addEventListeners();
}
```

---

**Opcional:**  
Si quieres mostrar un "Cargando..." mientras esperas los datos, puedes poner `this.innerHTML = "Cargando...";` antes del fetch.

---

**Resumen:**  
- Primero obtén los datos (`await this.fetchBooks()`).
- Luego renderiza la tabla (`this.render()`).
- Después añade los listeners (`this.addEventListeners()`).

Así se mostrará correctamente la tabla con los datos de MongoDB Cloud.

## Pregunta 10
**reemplazar el this.books con acceso a MongoDB Cloud**

Para reemplazar `this.books` con acceso dinámico a los datos desde MongoDB Cloud, necesitas:

1. Crear un endpoint REST en tu backend (Node.js/Express) que devuelva los libros desde MongoDB.
2. Hacer un `fetch` en el método `connectedCallback()` para obtener los datos y renderizarlos.

Aquí tienes cómo hacerlo:

---

### 1. Backend: Endpoint para obtener libros

Supón que tienes un modelo `Book` en tu backend. Agrega una ruta como:

```javascript
// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
```

Y en tu `app.js`:
```javascript
const bookRoutes = require('./src/routes/bookRoutes');
app.use('/api', bookRoutes);
```

---

### 2. Frontend: Obtener libros dinámicamente

Modifica tu componente `Tables` así:

```javascript
class Tables extends HTMLElement {
    constructor() {
        super();
        this.books = [];
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    async connectedCallback() {
        await this.fetchBooks();
        this.render();
        this.addEventListeners();
    }

    async fetchBooks() {
        try {
            const res = await fetch('https://TU_BACKEND_URL/api/books');
            this.books = await res.json();
        } catch (err) {
            this.books = [];
            this.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los libros.</div>`;
        }
    }

    addEventListeners() {
        const links = this.querySelectorAll('.book-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.textContent;
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
                        <tr class="${book.rowClass || ''}">
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
```

**No olvides reemplazar `https://TU_BACKEND_URL/api/books` por la URL real de tu backend.**

---

**Resumen:**  
- Elimina el array estático `this.books`.
- Usa `fetch` para obtener los libros desde tu API conectada a MongoDB Cloud.
- Renderiza la tabla con los datos recibidos dinámicamente.


## Pregunta 9
**Colocar un condicionar si card.color=light no colocar el text-white**

Para que la clase `text-white` **solo se aplique si** `card.color` **NO es** `"light"`, puedes usar un condicional en el template string:

```javascript
<div class="card${card.color === 'light' ? '' : ' text-white'} bg-${card.color} mb-3" style="max-width: 20rem;">
```

Así, si el color es `light`, **no** se añade `text-white`; para cualquier otro color, sí.

**Ejemplo en tu bucle:**
```javascript
<div class="card${card.color === 'light' ? '' : ' text-white'} bg-${card.color} mb-3" style="max-width: 20rem;">
    <div class="card-header">Header</div>
    <div class="card-body">
        <h4 class="card-title">${card.title}</h4>
        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
        <button type="button" class="btn btn-success" data-${card.type}="${card.value}">Start Quiz</button>
    </div>
</div>
```

Esto hará que las tarjetas con fondo claro tengan texto oscuro y las demás, texto blanco.

## Pregunta 8
**Bucle que me genere dinamicamente los elementos de hasOppositions() en Cards.js**

Aquí tienes cómo transformar el contenido de `hasOppositions()` en un **bucle dinámico** usando un array de objetos para las tarjetas. Así puedes añadir, quitar o modificar oposiciones fácilmente:

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';

        // Array de oposiciones
        this.oppositions = [
            { title: "Organización del Estado", color: "primary", type: "programa", value: "ag" },
            { title: "Sistemas y Comunicaciones", color: "secondary", type: "programa", value: "sc" },
            { title: "Estructura de Datos", color: "light", type: "materia", value: "ED" },
            { title: "Tecnología básica", color: "danger", type: "programa", value: "tb" },
            { title: "CSS", color: "warning", type: "materia", value: "CSS" },
            { title: "JavaScript", color: "info", type: "materia", value: "JS" },
            { title: "Desarrollo de sistemas", color: "light", type: "programa", value: "ds" },
            { title: "Díagramas", color: "dark", type: "materia", value: "UML" },
            { title: "NET", color: "danger", type: "materia", value: "NET" },
            { title: "HTML", color: "danger", type: "materia", value: "HTML" },
            { title: "Patrones Diseño", color: "warning", type: "materia", value: "GoF" },
            { title: "Cálculo", color: "info", type: "materia", value: "Cálculo" },
            { title: "SQL", color: "light", type: "materia", value: "SQL" },
            { title: "Java", color: "dark", type: "materia", value: "JAVA" },
            { title: "Algoritmos de Ordenación", color: "danger", type: "materia", value: "Algoritmos de Ordenación" },
            { title: "PHP", color: "primary", type: "materia", value: "PHP" },
            { title: "Red", color: "secondary", type: "materia", value: "RED" },
            { title: "Hardware", color: "light", type: "materia", value: "HARDWARE" }
        ];
    }

    // ...resto del código...

    hasOppositions() {
        // Agrupa las tarjetas en columnas de 3
        const columns = [[], [], [], [], [], []];
        this.oppositions.forEach((item, idx) => {
            columns[idx % 6].push(item);
        });

        return /* html */ `
        <div class="row">
            ${columns.map(col => `
                <div class="col-md-4">
                    ${col.map(card => `
                        <div class="card text-white bg-${card.color} mb-3" style="max-width: 20rem;">
                            <div class="card-header">Header</div>
                            <div class="card-body">
                                <h4 class="card-title">${card.title}</h4>
                                <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                                <button type="button" class="btn btn-success" data-${card.type}="${card.value}">Start Quiz</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
        `;
    }

    // ...resto del código...
}
```

**Ventajas:**
- Puedes modificar fácilmente las oposiciones en el array.
- El bucle genera dinámicamente todas las tarjetas y columnas.
- El botón se adapta automáticamente a `data-materia` o `data-programa` según corresponda.

Puedes ajustar el número de columnas cambiando el valor `6` en el array `columns` y en el módulo `% 6` según tu diseño.

## Pregunta 7
**Un bucle que me cree dinamicamente todos los elementos del <tbody> junto con su CustomenEvent**

Claro, aquí tienes un ejemplo de cómo generar dinámicamente todas las filas del `<tbody>` a partir de un array de datos y añadir el evento personalizado a cada enlace de libro:

```javascript
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
```

**¿Qué hace este código?**
- Genera dinámicamente todas las filas del `<tbody>` usando `Array.map`.
- Cada título de libro es un enlace con la clase `.book-link`.
- Después de renderizar, se añaden los listeners a cada enlace para lanzar un `CustomEvent` con el título del libro seleccionado.

Puedes escuchar el evento `tables:book-selected` en el componente padre o donde lo necesites para mostrar detalles, cambiar el jumbotron, etc.

## Pregunta 6
**Pasando un valor del componente Root.js a Cards.js**

Para pasar el valor `"book-link"` (o cualquier otro dato, como el título del libro) al componente `<tag-card/>`, simplemente añade un atributo personalizado en el HTML generado y usa el valor de `this.data`:

```javascript
else if (this.data.from === "book-link") {
    result = /* html */`<div class="container mt-3">
        <tag-card title="${this.data.message}"/>
    </div>`; 
}
```

Así, en tu componente `tag-card`, puedes acceder al atributo `title` usando `this.getAttribute('title')` en el constructor o en `connectedCallback`.

**Resumen:**  
- Usa `<tag-card title="${this.data.message}"/>` para pasar el valor.
- En el componente, accede con `this.getAttribute('title')`.

### [Tables.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Tables.js)

## Pregunta 5
**Cómo crear hiperlink a otro componente desde el componente tables?**

Para crear un hiperlink a otro componente desde el componente `Tables`, puedes envolver el contenido de la celda con un `<a>` y, al hacer clic, disparar una función que monte el componente deseado (por ejemplo, usando un evento o manipulando el DOM).

Aquí tienes un ejemplo básico que convierte el título del libro en un enlace que, al hacer clic, reemplaza la tabla por un componente `<tag-book-detail>` (debes tener este componente creado):

````javascript
class Tables extends HTMLElement {
    constructor() {
        super();
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
        // Ejemplo: para el primer libro
        const link = this.querySelector('.book-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Quita la tabla y monta el componente de detalle
                this.innerHTML = '';
                const detail = document.createElement('tag-book-detail');
                detail.setAttribute('title', link.textContent);
                document.body.appendChild(detail);
            });
        }
    }

    render() {
        this.innerHTML = /*html*/ `
            <table class="table table-hover">
                <thead>
                    <!-- ...existing code... -->
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
                    <!-- ...existing code... -->
                </tbody>
            </table>
        `;
    }
}

customElements.define("tag-table", Tables);
````

**Explicación:**  
- Se ha envuelto el título del libro en un `<a href="#" class="book-link">...</a>`.
- En `addEventListeners`, se añade un listener al enlace para que, al hacer clic, se reemplace la tabla por un componente de detalle (`<tag-book-detail>`).
- Puedes adaptar el nombre del componente y los atributos según tus necesidades.

Si quieres que el enlace navegue a otra ruta o cambie el contenido de una SPA, puedes usar eventos personalizados o manipular el router si tienes uno.


To make the `quizData` array dynamic and fetch its content from a RESTful API, you can use `fetch` or any HTTP client (e.g., `axios`) to retrieve the data from your backend. Here's how you can modify the `Quiz` component to load `quizData` dynamically:

### Steps:
1. Add a method to fetch data from the RESTful API.
2. Update the `connectedCallback` lifecycle method to call the fetch method and initialize the quiz once the data is loaded.
3. Ensure the backend API provides the data in the expected format.

### [Quiz.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js)

Modify the `Quiz` component to fetch `quizData` dynamically.

```javascript
class Quiz extends HTMLElement {
    quizData = [];
    currentQuestion = 0;
    score = 0;
    timer;
    timeLeft = 30;

    questionEl = "";
    optionsEl = "";
    nextBtn = "";
    timerEl = "";
    progressBar = "";
    quizContainer = "";

    async fetchQuizData() {
        try {
            const response = await fetch('/api/questions/materia/sql?limit=5&random=true'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
            }
            this.quizData = await response.json();
            this.loadQuestion();
        } catch (error) {
            console.error(error);
            this.quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
        }
    }

    loadQuestion() {
        const question = this.quizData[this.currentQuestion];
        this.questionEl.textContent = question.pregunta;
        this.optionsEl.innerHTML = '';
        question.opciones.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option');
            button.addEventListener('click', () => this.selectOption(button, index));
            this.optionsEl.appendChild(button);
        });
        this.nextBtn.style.display = 'none';
        this.timeLeft = 30;
        if (this.timer) clearInterval(this.timer);
        this.startTimer();
        this.updateProgress();
    }

    // ...existing methods...

    connectedCallback() {
        this.render();

        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.nextBtn = document.getElementById('next-btn');
        this.timerEl = document.getElementById('timer');
        this.progressBar = document.querySelector('.progress-bar');
        this.quizContainer = document.getElementById('quiz');

        this.nextBtn.addEventListener('click', () => {
            this.checkAnswer();
            this.currentQuestion++;
            if (this.currentQuestion < this.quizData.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        });

        // Fetch quiz data dynamically
        this.fetchQuizData();
    }

    render() {
        this.innerHTML = /*html*/ `
            <div class="container quiz">
                <div class="quiz-container" id="quiz">
                    <div class="quiz-header">
                        <h2>Interactive Quiz</h2>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0"
                                aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div id="question-container">
                        <p class="question" id="question"></p>
                        <div class="options" id="options"></div>
                    </div>
                    <div class="quiz-footer">
                        <div class="timer" id="timer">Time: 30s</div>
                        <button class="btn btn-primary" id="next-btn">Next</button>
                    </div>
                </div>
            </div> 
        `;
    }
}

customElements.define("tag-quiz", Quiz);
```

### Backend API Response Format
Ensure your backend API (e.g., `/api/questions/materia/sql?limit=5&random=true`) returns data in the following format:
```json
[
    {
        "pregunta": "What is the capital of France?",
        "opciones": ["London", "Berlin", "Paris", "Madrid"],
        "respuesta": 2
    },
    {
        "pregunta": "Which planet is known as the Red Planet?",
        "opciones": ["Venus", "Mars", "Jupiter", "Saturn"],
        "respuesta": 1
    }
]
```

This will allow the `Quiz` component to dynamically load and display the questions.

## Pregunta 4
**To make the Cards.js call the Quiz.js**

To make the `<button type="button" class="btn btn-success">Start Quiz</button>` call the `Quiz.js` component, you can add an event listener to the button. When the button is clicked, it can dynamically load the `Quiz` component and pass the necessary data (e.g., `materia`) to it.

### Steps:
1. Add a `data-materia` attribute to each button to specify the `materia` for the quiz.
2. Add an event listener to the buttons to handle the click event.
3. Dynamically create and display the `Quiz` component when a button is clicked.

### [Cards.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js)

Modify the `Cards` component to handle the `Start Quiz` button click.

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the materia from the button
                this.startQuiz(materia);
            });
        });
    }

    startQuiz(materia) {
        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('materia', materia); // Pass the materia to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="Organización del Estado">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="Sistemas y Comunicaciones">Start Quiz</button>
                    </div>
                </div>
                <!-- Add more cards as needed -->
            </div>
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

### [Quiz.js](file:///home/zodd/Documentos/%40Documentos/Master2024/curso%202024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js)

Update the `Quiz` component to accept the `materia` attribute and fetch questions dynamically based on it.

```javascript


Made changes.

class Quiz extends HTMLElement {
    quizData = [];
    currentQuestion = 0;
    score = 0;
    timer;
    timeLeft = 30;

    questionEl = "";
    optionsEl = "";
    nextBtn = "";
    timerEl = "";
    progressBar = "";
    quizContainer = "";

    async fetchQuizData(materia) {
        try {
            const response = await fetch(`http://localhost:3000/api/questions/materia/${materia}?limit=5&random=true`);
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
            }
            this.quizData = await response.json();
            this.loadQuestion();
        } catch (error) {
            console.error(error);
            this.quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
        }
    }

    connectedCallback() {
        this.render();

        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.nextBtn = document.getElementById('next-btn');
        this.timerEl = document.getElementById('timer');
        this.progressBar = document.querySelector('.progress-bar');
        this.quizContainer = document.getElementById('quiz');

        this.nextBtn.addEventListener('click', () => {
            this.checkAnswer();
            this.currentQuestion++;
            if (this.currentQuestion < this.quizData.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        });

        const materia = this.getAttribute('materia'); // Get the materia from the attribute
        this.fetchQuizData(materia); // Fetch quiz data for the specified materia
    }

    // ...existing methods...
}

customElements.define("tag-quiz", Quiz);
```

### Explanation:
1. **`data-materia` Attribute**: Each button has a `data-materia` attribute specifying the `materia` for the quiz.
2. **Event Listener**: When a button is clicked, the `startQuiz` method is called, which dynamically creates the `Quiz` component and passes the `materia` as an attribute.
3. **Dynamic Fetching**: The `Quiz` component fetches questions based on the `materia` value.

Made changes.

Similar code found with 1 license type

## Pregunta 3
**Fetch question from data-materia and data-programa**
To handle both `data-materia` and `data-programa` attributes and dynamically fetch questions from either `/api/questions/materia/${materia}?limit=5&random=true` or `/api/questions/programa/${programa}?limit=5&random=true`, you can modify the `startQuiz` method to determine which attribute is present and construct the appropriate API endpoint.

### Steps:
1. Update the `addEventListeners` method to handle both `data-materia` and `data-programa`.
2. Modify the `startQuiz` method to dynamically determine the API endpoint based on the attribute.
3. Pass the correct endpoint to the `Quiz` component.

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25';
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, pregunta) {
        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=5&random=true`
            : `/api/questions/programa/${programa}?limit=5&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="Organización del Estado">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="Sistemas y Comunicaciones">Start Quiz</button>
                    </div>
                </div>
                <!-- Add more cards as needed -->
            </div>
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Quiz.js

Modify the `Quiz` component to accept the `endpoint` attribute and fetch questions dynamically based on it.

```javascript


Made changes.

class Quiz extends HTMLElement {
    quizData = [];
    currentQuestion = 0;
    score = 0;
    timer;
    timeLeft = 30;

    questionEl = "";
    optionsEl = "";
    nextBtn = "";
    timerEl = "";
    progressBar = "";
    quizContainer = "";

    async fetchQuizData(endpoint) {
        try {
            const response = await fetch(endpoint); // Use the endpoint passed as an attribute
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
            }
            this.quizData = await response.json();
            this.loadQuestion();
        } catch (error) {
            console.error(error);
            this.quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
        }
    }

    connectedCallback() {
        this.render();

        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.nextBtn = document.getElementById('next-btn');
        this.timerEl = document.getElementById('timer');
        this.progressBar = document.querySelector('.progress-bar');
        this.quizContainer = document.getElementById('quiz');

        this.nextBtn.addEventListener('click', () => {
            this.checkAnswer();
            this.currentQuestion++;
            if (this.currentQuestion < this.quizData.length) {
                this.loadQuestion();
            } else {
                this.showResults();
            }
        });

        const endpoint = this.getAttribute('endpoint'); // Get the endpoint from the attribute
        this.fetchQuizData(endpoint); // Fetch quiz data from the specified endpoint
    }

    // ...existing methods...
}

customElements.define("tag-quiz", Quiz);
```

---

### Explanation:
1. **Dynamic Endpoint**:
   - The `startQuiz` method determines the API endpoint based on whether `data-materia` or `data-programa` is present.
   - The endpoint is passed to the `Quiz` component as an attribute.

2. **Quiz Component**:
   - The `Quiz` component fetches questions dynamically using the `endpoint` attribute.

3. **Flexibility**:
   - This approach allows the `Cards` component to handle both `data-materia` and `data-programa` seamlessly.


## Pregunta 2
**To change value limit=5 by this.data.message**
To dynamically set the `limit` parameter in the API endpoint using `this.data.message`, you can modify the `startQuiz` method in the `Cards` component. Here's how:

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25'; // Default value for the limit
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail;
            this.render();
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this);
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, programa) {
        // Use this.data.message as the limit
        const limit = this.data.message;

        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="ag">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="sc">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Estructura de Datos</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="ED">Start Quiz</button>
                    </div>
                </div>
            </div>
            <!-- Add more cards as needed -->
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Explanation:
1. **Dynamic Limit**:
   - The `limit` parameter in the API endpoint is dynamically set using `this.data.message`.

2. **API Endpoint**:
   - The `startQuiz` method constructs the endpoint with the dynamic `limit` value.

3. **Flexibility**:
   - This approach allows the `limit` to be adjusted dynamically based on the `this.data.message` value.


## Pregunta 1
**Solution why when I change input type="range" not event click in button from Cards.js**

The issue occurs because the `input` event from the `<input type="range">` element in `Jumbo.js` is not directly linked to the `click` event of the buttons in `Cards.js`. The `input` event updates the `this.data.message` value in `Jumbo.js`, but `Cards.js` does not automatically re-render or update its event listeners when `this.data.message` changes.

### Solution:
You need to ensure that `Cards.js` re-renders or updates its event listeners whenever the `input` event in `Jumbo.js` changes the value of `this.data.message`.

---

### Steps to Fix:
1. **Ensure `Cards.js` Listens for Updates**:
   - `Jumbo.js` already dispatches a `user:jumbo-input` event when the range input changes.
   - `Cards.js` listens for this event and updates its `this.data.message` value, but it does not re-render or update its event listeners after the change.

2. **Re-render `Cards.js` After Data Update**:
   - After updating `this.data.message` in `Cards.js`, call `this.render()` and re-attach the event listeners.

---

### Updated /home/zodd/Documentos/@Documentos/Master2024/curso 2024/2595_MEAN_ALUMNOS/MEAN/05_MEAN/04_Oposicion/view-opposition/src/components/Cards.js

```javascript
class Cards extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.data.message = '25'; // Default value for the limit
    }

    handleEvent(event) {
        if (event.type === "user:jumbo-input") {
            this.data = event.detail; // Update data from the event
            this.render(); // Re-render the component
            this.addEventListeners(); // Re-attach event listeners
        }
    }

    static get styles() {
        return /*css*/ `  
        `;
    }

    connectedCallback() {
        document.addEventListener("user:jumbo-input", this); // Listen for updates from Jumbo.js
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener("user:jumbo-input", this);
    }

    addEventListeners() {
        const buttons = this.querySelectorAll('.btn-success');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const materia = event.target.getAttribute('data-materia'); // Get the data-materia attribute
                const programa = event.target.getAttribute('data-programa'); // Get the data-programa attribute
                this.startQuiz(materia, programa); // Pass both attributes to startQuiz
            });
        });
    }

    startQuiz(materia, programa) {
        // Use this.data.message as the limit
        const limit = this.data.message;

        // Determine the API endpoint based on the attribute
        const endpoint = materia
            ? `/api/questions/materia/${materia}?limit=${limit}&random=true`
            : `/api/questions/programa/${programa}?limit=${limit}&random=true`;

        // Remove the current Cards component
        this.innerHTML = '';

        // Create and append the Quiz component
        const quiz = document.createElement('tag-quiz');
        quiz.setAttribute('endpoint', endpoint); // Pass the endpoint to the Quiz component
        document.body.appendChild(quiz);
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Organización del Estado</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="ag">Start Quiz</button>
                    </div>
                </div>
                <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Sistemas y Comunicaciones</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-programa="sc">Start Quiz</button>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h4 class="card-title">Estructura de Datos</h4>
                        <p class="card-text"><output>${this.data.message}</output> preguntas</p>
                        <button type="button" class="btn btn-success" data-materia="ED">Start Quiz</button>
                    </div>
                </div>
            </div>
            <!-- Add more cards as needed -->
        </div>
        `;
    }
}

customElements.define("tag-card", Cards);
```

---

### Explanation:
1. **Re-rendering**:
   - When the `user:jumbo-input` event is received, `this.data.message` is updated, and `this.render()` is called to update the DOM.

2. **Re-attaching Event Listeners**:
   - After re-rendering, `this.addEventListeners()` is called to ensure the buttons have the correct event listeners attached.

3. **Dynamic Updates**:
   - Now, when the range input in `Jumbo.js` changes, the `Cards.js` component dynamically updates its buttons and ensures the `limit` value is reflected in the API endpoint.
