class Reactive extends HTMLElement {
    static get observedAttributes() {
      return ["name"];
    }
  
    attributeChangedCallback(name, old, now) {
      this.innerHTML = `Nickname cambiado de <mark>${old}</mark> a <mark>${now}</mark>.`;
    }
  }
  
  customElements.define("tag-reactive", Reactive);