import AbstractView from '../../abstract-view';

export default class AnswerBtnsView extends AbstractView {
  getTemplate() {
    return `<label class="game__answer game__answer--photo">
          <input class="visually-hidden" name="${this.data}" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input class="visually-hidden" name="${this.data}" type="radio" value="paint">
          <span>Рисунок</span>
        </label>`;
  }
}
