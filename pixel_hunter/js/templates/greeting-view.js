import templatesData from '../data/templates-data';
import AbstractView from '../abstract-view';
import Application from '../application';

export default class GreetingView extends AbstractView {
  constructor() {
    super();
    this.callback = (element) => {
      element.preventDefault();
      Application.showRules();
    };
  }
  getTemplate() {
    const data = templatesData.greeting;
    return `<section class="greeting central--blur"><img class="greeting__logo" src="${data.logo.src}" width="201" height="89" alt="${data.logo.alt}">
    <div class="greeting__asterisk asterisk"><span class="visually-hidden">Я просто красивая звёздочка</span>*</div>
    <div class="greeting__challenge">
      <h3 class="greeting__challenge-title">${data.title}</h3>
      <p class="greeting__challenge-text">${data.text}</p>
      <ul class="greeting__challenge-list">
        ${data.list}
      </ul>
    </div>
    <button class="greeting__continue" type="button">
      <span class="visually-hidden">Продолжить</span>
      <svg class="icon" width="64" height="64" viewBox="0 0 64 64" fill="#000000">
        <use xlink:href="img/sprite.svg#arrow-right"></use>
      </svg>
    </button></section>`;
  }
  bind() {
    this.actionElements = this.element.querySelectorAll(`.greeting__continue`);
    super.bind();
  }
}
