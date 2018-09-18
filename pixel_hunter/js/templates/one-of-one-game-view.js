import AbstractView from '../abstract-view';
import AnswerButtonsView from './items/answer-buttons';
import {ImageType} from '../data/game-data';
import timer from './items/timer';
import {renderElement, resizeToProperSize} from '../utils';

export default class OneOfOneGameView extends AbstractView {
  get element() {
    if (this._element) {
      return this._element;
    }
    const wrapper = this.getTemplate();
    this._element = wrapper;
    this.bind();
    return this._element;
  }

  getTemplate() {
    const createOption = (item) => {
      const content = renderElement(``, `form`, `game__content game__content--wide`);
      const properImage = resizeToProperSize(item);
      properImage.alt = `Option 1`;
      const answersButtons = new AnswerButtonsView(`question1`).element;

      const soloOption = renderElement(``, `div`, `game__option`);
      soloOption.appendChild(properImage);
      soloOption.appendChild(answersButtons);

      content.appendChild(soloOption);

      return content;
    };

    return createOption(this.data.tasks[0]);
  }

  bind() {
    this.actionElements = this.element.querySelectorAll(`.game__answer`);
    super.bind();
  }

  static setGame(element, state, GameView) {
    element.preventDefault();
    timer.stop();
    const userAnswer = element.currentTarget.querySelector(`input`).value;
    const photoAnswer = `photo`;
    const paintAnswer = `paint`;
    let answer;
    if (userAnswer === photoAnswer) {
      answer = [ImageType.PHOTO];
    } else if (userAnswer === paintAnswer) {
      answer = [ImageType.PAINT];
    }
    state.setResult(answer, timer.getTime());
    GameView.goToNextScreen();
  }
}
