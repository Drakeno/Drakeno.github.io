import templatesData from '../data/templates-data';
import AbstractView from '../abstract-view';
import Application from '../application';
import BackButtonView from './items/back-button';

export default class RulesView extends AbstractView {
  constructor() {
    super();
    this.callback = (element) => {
      element.preventDefault();
      Application.showGreeting();
    };
  }

  getTemplate() {
    const data = templatesData.rules;
    const backBtn = new BackButtonView();
    const header = `<header class="header">${backBtn.getTemplate()}</header>`;
    const rules = `<section class="rules"><h2 class="rules__title">${data.title}</h2>
    <ul class="rules__description">
      ${data.description}
    </ul>
    <p class="rules__ready">Готовы?</p>
    <form class="rules__form">
      <input class="rules__input" type="text" placeholder="Ваше Имя">
      <button class="rules__button  continue" type="submit" disabled>Go!</button>
    </form></section>`;

    return header + rules;
  }

  bind() {
    this.backBtn = this.element.querySelector(`button.back`);
    this.rulesForm = this.element.querySelector(`.rules__form`);
    this.rulesInput = this.rulesForm.querySelector(`.rules__input`);
    this.rulesSubmit = this.rulesForm.querySelector(`.rules__button`);

    this.inputCallback = () => {
      if (this.rulesInput.value) {
        this.rulesSubmit.removeAttribute(`disabled`);
      } else {
        this.rulesSubmit.setAttribute(`disabled`, `true`);
      }
    };

    this.submitCallback = (element) => {
      element.preventDefault();
      Application.showGame(this.rulesInput.value);
    };

    this.rulesInput.addEventListener(`input`, this.inputCallback);
    this.rulesForm.addEventListener(`submit`, this.submitCallback);
    this.backBtn.addEventListener(`click`, BackButtonView.callback);
  }

  clear() {
    this.rulesInput.removeEventListener(`input`, this.inputCallback);
    this.rulesForm.removeEventListener(`submit`, this.submitCallback);
    this.backBtn.removeEventListener(`click`, BackButtonView.callback);
  }
}
