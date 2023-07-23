export default class Card {
  #el;

  #styles;

  constructor(element) {
    this.#el = element;
    this.#styles = window.getComputedStyle(element);
  }

  set styles(text) {
    this.#el.style.cssText = text;
  }

  get styles() {
    return this.#styles;
  }

  get proection() {
    return (() => {
      const renderedCard = document.createElement('div');
      renderedCard.classList.add('proection');
      const { width, height } = this.styles;
      renderedCard.style = `width: ${width}; height: ${height}; margin: 10px 0;`;
      return renderedCard;
    })();
  }

  static create(content) {
    const node = document.createElement('div');
    node.classList.add('card');

    const cardText = document.createElement('div');
    cardText.classList.add('card__text');
    cardText.textContent = content;
    node.appendChild(cardText);

    const cardDelete = document.createElement('div');
    cardDelete.classList.add('card-delete');
    cardDelete.innerHTML = '&#10005;';
    node.appendChild(cardDelete);

    return new Card(node);
  }

  get element() {
    return this.#el;
  }
}
