import AbstractView from '../abstract-view';

export default class ErrorModal extends AbstractView {

  constructor(error) {
    super();
    this.error = error;
  }

  getTemplate() {
    return `<section class="modal">
    <div class="modal__inner">
      <h2 class="modal__title">Произошла ошибка!</h2>
      <p class="modal__text modal__text--error">${this.error} :( Попробуйте перезагрузить страницу</p>
    </div>
  </section>`;
  }

}
