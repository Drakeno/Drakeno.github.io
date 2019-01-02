import {renderElement} from './utils';

export default class AbstractView {
  constructor(data, callback) {
    this.data = data;
    this.callback = callback;
    this.actionElements = null;
  }

  get element() {
    if (this._element) {
      return this._element;
    }
    const wrapper = renderElement(this.getTemplate());
    this._element = document.createDocumentFragment();
    while (wrapper.childNodes.length) {
      this._element.appendChild(wrapper.childNodes[0]);
    }
    this.bind();
    return this._element;
  }

  getTemplate() {

  }

  bind() {
    if (this.actionElements) {
      this.actionElements.forEach((element) => {
        element.addEventListener(`click`, this.callback);
      });
    }
  }

  clear() {
    if (this.actionElements) {
      this.actionElements.forEach((element) => {
        element.removeEventListener(`click`, this.callback);
      });
    }
  }
}
