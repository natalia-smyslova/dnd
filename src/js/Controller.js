import Card from './Card';

export default class Controller {
  constructor(container) {
    this.container = container;
    this.draggingElement = null;
    this.draggingProection = null;
  }

  init() {
    this.getSave();
    document.addEventListener('click', this.click.bind(this));
  }

  click(element) {
    const { target } = element;

    if (target.classList.contains('add-card')) {
      target.classList.add('invisible');
      target.closest('.column').querySelector('.add').classList.remove('invisible');
    } else if (target.classList.contains('close')) {
      target.closest('.add').classList.add('invisible');
      target.closest('.column').querySelector('.add-card').classList.remove('invisible');
    } else if (target.classList.contains('add-button')) {
      const input = target.closest('.add').querySelector('.add-input');
      if (input.value) {
        input.closest('.column').querySelector('.cards').append((Card.create(input.value).element));
        target.closest('.column').querySelector('.add').classList.add('invisible');
        target.closest('.column').querySelector('.add-card').classList.remove('invisible');
        this.save();
        input.value = '';
      }
    } else if (target.classList.contains('card-delete')) {
      const card = element.target.closest('.card');
      card.remove();
      this.save();
    }
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["save", "getSave"] }] */

  save() {
    const arr = [];
    const cardList = document.querySelectorAll('.cards');
    for (let i = 0; i < cardList.length; i += 1) {
      arr.push(cardList[i].innerHTML);
    }
    localStorage.setItem('cards', arr);
  }

  getSave() {
    const storage = localStorage.getItem('cards');

    if (storage) {
      const fromStorageArray = storage.split(',');
      const newArr = document.querySelectorAll('.cards');

      for (let i = 0; i < fromStorageArray.length; i += 1) {
        newArr[i].innerHTML = fromStorageArray[i];
      }
    }
  }

  setDraggingElement(node) {
    this.draggingElement = new Card(node);
    this.draggingElement.element.classList.add('dragging');
  }

  replaceDragging() {
    this.draggingProection.replaceWith(this.draggingElement.element);
    this.draggingElement.element.style = this.draggingElement.styles;
    this.draggingElement.element.classList.remove('dragging');
  }

  clear() {
    this.draggingElement = null;
    this.draggingProection = null;
  }

  onMouseDown = (event) => {
    const { target } = event;

    if (target.classList.contains('card')) {
      this.shiftX = event.offsetX;
      this.shiftY = event.offsetY;
      this.setDraggingElement(target);
      this.draggingElement.style = `
		 		left: ${event.pageX - this.shiftX}px;
		 		top: ${event.pageY - this.shiftY}px;
			`;
      this.proectionAct(event);
    }
  };

  onMouseUp = () => {
    if (this.draggingElement) {
      this.replaceDragging();
      this.clear();
    }
  };

  proectionAct(event) {
    const { target } = event;
    const element = this.draggingElement;
    const proection = this.draggingProection;
    if (target.classList.contains('cards')) {
      target.appendChild(proection);
    }
    if (target.classList.contains('card') && !target.classList.contains('proection')) {
      const { y, height } = target.getBoundingClientRect();
      const appendPosition = y + height / 2 > event.clientY
        ? 'beforebegin'
        : 'afterend';

      if (!proection) {
        this.draggingProection = element.proection;
      } else {
        proection.remove();
        target.insertAdjacentElement(appendPosition, proection);
      }
    }
  }

  onMouseMove = (event) => {
    if (this.draggingElement) {
      const { pageX, pageY } = event;
      const element = this.draggingElement;
      const { width, height } = this.draggingElement.styles;
      element.styles = `
				position: absolute;
		 		left: ${pageX - this.shiftX}px;
		 		top: ${pageY - this.shiftY}px;
		 		pointer-events: none;
				width: ${width};
				height: ${height};
			`;
      this.proectionAct(event);
    }
    this.save();
  };
}
